import uuid
from datetime import datetime
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.config import PORT, HOST
from app.models import (
    VoiceProcessRequest, VoiceProcessResponse,
    TaskCreateRequest, Task, Coordinates,
    CoinTransaction, SOSAlert
)
from app.database import db, GOA_LANDMARKS
from app.gemini_agent import process_konkani_voice_prompt
from app.simulator import advance_task_simulation, PANAJI_TO_GMC_WAYPOINTS

app = FastAPI(
    title="Sahayak AI API",
    description="Konkani-first voice assistant and verified human helper marketplace for Goa",
    version="1.0.0"
)

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "app": "Sahayak AI",
        "description": "Konkani-First Voice Assistant & Helper Platform for Goa",
        "status": "online",
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/voice/process", response_model=VoiceProcessResponse)
async def process_voice(req: VoiceProcessRequest):
    """Processes spoken or typed Konkani input and extracts structured task details with natural audio."""
    if not req.prompt or not req.prompt.strip():
        raise HTTPException(status_code=400, detail="Voice prompt cannot be empty")
    return await process_konkani_voice_prompt(req.prompt.strip())


class SynthesizeVoiceRequest(BaseModel):
    text: str


@app.post("/api/voice/synthesize")
def synthesize_voice(req: SynthesizeVoiceRequest):
    """Synthesizes human-sounding neural studio voice for any Konkani/English text."""
    from app.audio_service import synthesize_google_neural_audio
    audio_b64 = synthesize_google_neural_audio(req.text)
    return {"text": req.text, "audio_base64": audio_b64}



@app.post("/api/tasks", response_model=Task)
def create_task(req: TaskCreateRequest):
    """Creates a new assistance task in the system."""
    task_id = f"task_{uuid.uuid4().hex[:8]}"
    new_task = Task(
        id=task_id,
        user_id=req.user_id,
        user_name="Asha Naik (Senior Citizen)",
        user_phone="+91 98224 55123",
        service_type=req.service_type,
        pickup_location=req.pickup_location,
        pickup_coords=req.pickup_coords,
        destination=req.destination,
        dest_coords=req.dest_coords,
        status="requested",
        konkani_transcript=req.konkani_transcript,
        coin_reward=req.coin_reward,
        created_at=datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    )
    return db.create_task(new_task)


@app.get("/api/tasks")
def list_tasks():
    """Lists all active and past assistance tasks."""
    return db.get_all_tasks()


@app.get("/api/tasks/{task_id}", response_model=Task)
def get_task(task_id: str):
    task = db.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


class AcceptTaskRequest(BaseModel):
    helper_id: str


@app.post("/api/tasks/{task_id}/accept", response_model=Task)
def accept_task(task_id: str, req: AcceptTaskRequest):
    """Helper accepts an available assistance request."""
    task = db.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    updated = db.update_task_status(task_id, "matched", req.helper_id)
    return updated


@app.post("/api/tasks/{task_id}/start", response_model=Task)
def start_task(task_id: str):
    """Marks task as in-progress (helper is on their way or escorting)."""
    task = db.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db.update_task_status(task_id, "in_progress", task.helper_id)


@app.post("/api/tasks/{task_id}/complete", response_model=Task)
def complete_task(task_id: str):
    """User or Helper confirms completion, releasing coin reward."""
    task = db.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return db.update_task_status(task_id, "completed", task.helper_id)


class SimulateStepRequest(BaseModel):
    step_index: int


@app.post("/api/tasks/{task_id}/simulate-step", response_model=Task)
def simulate_task_step(task_id: str, req: SimulateStepRequest):
    """Advances task through demo simulation states (matched, moving, arrived, completed)."""
    task = db.get_task(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return advance_task_simulation(task, req.step_index)


@app.get("/api/helpers")
def list_helpers():
    """Lists all verified local helpers, ratings, and coin earnings."""
    return db.get_all_helpers()


class RedeemCoinsRequest(BaseModel):
    coins: int
    upi_id: str = "rahul@oksbi"


@app.post("/api/helpers/{helper_id}/redeem")
def redeem_coins(helper_id: str, req: RedeemCoinsRequest):
    """Redeems helper coins to bank payout in INR."""
    helper = db.get_helper(helper_id)
    if not helper:
        raise HTTPException(status_code=404, detail="Helper not found")
    if helper.coins_balance < req.coins:
        raise HTTPException(status_code=400, detail="Insufficient coin balance")

    helper.coins_balance -= req.coins
    db.record_transaction(
        CoinTransaction(
            id=f"tx_rdm_{int(datetime.now().timestamp())}",
            helper_id=helper_id,
            amount=-req.coins,
            type="redeemed",
            description=f"Redeemed {req.coins} coins to UPI ID: {req.upi_id} (₹{req.coins})",
            timestamp=datetime.now().strftime("%Y-%m-%d %H:%M")
        )
    )
    return {
        "status": "success",
        "redeemed_coins": req.coins,
        "inr_amount": req.coins,
        "remaining_balance": helper.coins_balance,
        "message": f"₹{req.coins} successfully transferred to {req.upi_id}"
    }


@app.get("/api/transactions")
def get_transactions():
    """Returns ledger of coin rewards and redemptions."""
    return db.transactions


class SOSRequest(BaseModel):
    user_id: str = "user_asha_01"
    user_name: str = "Asha Naik"
    location_desc: str = "Panaji KTC Bus Stand area"


@app.post("/api/emergency/sos", response_model=SOSAlert)
def trigger_sos(req: SOSRequest):
    """Triggers high-priority emergency alert with coordinates and SMS simulation."""
    alert = SOSAlert(
        id=f"sos_{uuid.uuid4().hex[:6]}",
        user_id=req.user_id,
        user_name=req.user_name,
        location=req.location_desc,
        coords=Coordinates(lat=15.4989, lng=73.8278),
        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
        status="active"
    )
    return db.create_sos_alert(alert)


@app.get("/api/emergency/alerts")
def list_sos_alerts():
    return db.sos_alerts


@app.get("/api/admin/metrics")
def get_admin_metrics():
    """Hackathon demo analytics and platform overview."""
    helpers = db.get_all_helpers()
    tasks = db.get_all_tasks()
    total_coins = sum(h.coins_balance for h in helpers)
    completed_tasks = len([t for t in tasks if t.status == "completed"])
    return {
        "total_verified_helpers": len(helpers),
        "active_registered_users": 142,
        "total_tasks_created": len(tasks),
        "tasks_completed": completed_tasks,
        "total_coins_circulating": total_coins,
        "inr_economy_value": f"₹{total_coins}",
        "avg_helper_rating": 4.93,
        "active_emergency_alerts": len([a for a in db.sos_alerts if a.status == "active"])
    }
