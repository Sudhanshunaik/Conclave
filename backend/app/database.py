from typing import Dict, List, Optional
from datetime import datetime
from app.models import Helper, Coordinates, Task, CoinTransaction, SOSAlert

# Known Goa Landmarks Coordinates
GOA_LANDMARKS: Dict[str, Coordinates] = {
    "GMC Bambolim": Coordinates(lat=15.4616, lng=73.8567),
    "Goa Medical College (GMC) Bambolim": Coordinates(lat=15.4616, lng=73.8567),
    "Panaji KTC Bus Stand": Coordinates(lat=15.4989, lng=73.8278),
    "Mapusa Municipal Market": Coordinates(lat=15.5925, lng=73.8145),
    "Margao Railway Station": Coordinates(lat=15.2736, lng=73.9680),
    "Provedoria / Institute of Public Assistance, Panaji": Coordinates(lat=15.4920, lng=73.8220),
    "District Hospital, Mapusa": Coordinates(lat=15.5980, lng=73.8180),
    "Ponda Bus Stand": Coordinates(lat=15.4020, lng=74.0150)
}

# Pre-seeded Verified Helpers
INITIAL_HELPERS: List[Helper] = [
    Helper(
        id="helper_rahul_01",
        name="Rahul Naik",
        phone="+91 98221 45012",
        rating=4.95,
        reviews_count=32,
        is_verified=True,
        verification_badge="Goa Police Cleared • Aadhaar Verified",
        is_available=True,
        current_coords=Coordinates(lat=15.4950, lng=73.8250), # Near Panaji
        coins_balance=240,
        completed_tasks_count=18,
        languages=["Konkani", "English", "Hindi", "Marathi"]
    ),
    Helper(
        id="helper_priya_02",
        name="Priya Fernandes",
        phone="+91 98233 78901",
        rating=4.92,
        reviews_count=28,
        is_verified=True,
        verification_badge="Goa Police Cleared • Medical First Aid Certified",
        is_available=True,
        current_coords=Coordinates(lat=15.4680, lng=73.8510), # Near GMC Bambolim
        coins_balance=310,
        completed_tasks_count=23,
        languages=["Konkani", "English", "Portuguese"]
    ),
    Helper(
        id="helper_amit_03",
        name="Amit Sawant",
        phone="+91 94220 11234",
        rating=4.88,
        reviews_count=19,
        is_verified=True,
        verification_badge="Goa Police Cleared • Senior Mobility Trained",
        is_available=True,
        current_coords=Coordinates(lat=15.5900, lng=73.8120), # Near Mapusa
        coins_balance=165,
        completed_tasks_count=12,
        languages=["Konkani", "Marathi", "English"]
    ),
    Helper(
        id="helper_sneha_04",
        name="Sneha D'Souza",
        phone="+91 91588 66789",
        rating=4.96,
        reviews_count=41,
        is_verified=True,
        verification_badge="Goa Police Cleared • Sign Language & Mobility Certified",
        is_available=True,
        current_coords=Coordinates(lat=15.2750, lng=73.9650), # Near Margao
        coins_balance=420,
        completed_tasks_count=31,
        languages=["Konkani", "English", "Hindi"]
    )
]

class MemoryDB:
    def __init__(self):
        self.helpers: Dict[str, Helper] = {h.id: h for h in INITIAL_HELPERS}
        self.tasks: Dict[str, Task] = {}
        self.transactions: List[CoinTransaction] = [
            CoinTransaction(
                id="tx_init_1",
                helper_id="helper_rahul_01",
                amount=50,
                type="earned",
                description="Assisted elderly citizen with GMC OPD visit",
                timestamp="2026-10-22 14:30"
            ),
            CoinTransaction(
                id="tx_init_2",
                helper_id="helper_priya_02",
                amount=50,
                type="earned",
                description="Guided visually impaired student to Panaji Library",
                timestamp="2026-10-22 16:15"
            )
        ]
        self.sos_alerts: List[SOSAlert] = []

    def get_all_helpers(self) -> List[Helper]:
        return list(self.helpers.values())

    def get_helper(self, helper_id: str) -> Optional[Helper]:
        return self.helpers.get(helper_id)

    def create_task(self, task: Task) -> Task:
        self.tasks[task.id] = task
        return task

    def get_task(self, task_id: str) -> Optional[Task]:
        return self.tasks.get(task_id)

    def get_all_tasks(self) -> List[Task]:
        # Return newest first
        return sorted(list(self.tasks.values()), key=lambda t: t.created_at, reverse=True)

    def update_task_status(self, task_id: str, status: str, helper_id: Optional[str] = None) -> Optional[Task]:
        task = self.tasks.get(task_id)
        if not task:
            return None
        task.status = status
        if helper_id:
            helper = self.helpers.get(helper_id)
            if helper:
                task.helper_id = helper.id
                task.helper_name = helper.name
                task.helper_phone = helper.phone
                task.helper_rating = helper.rating
                task.helper_coords = helper.current_coords
        if status == "completed":
            task.completed_at = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            # Reward helper coins
            if task.helper_id and task.helper_id in self.helpers:
                helper = self.helpers[task.helper_id]
                helper.coins_balance += task.coin_reward
                helper.completed_tasks_count += 1
                self.transactions.insert(
                    0,
                    CoinTransaction(
                        id=f"tx_{int(datetime.now().timestamp())}",
                        helper_id=helper.id,
                        amount=task.coin_reward,
                        type="earned",
                        description=f"Completed {task.service_type} for {task.user_name}",
                        timestamp=datetime.now().strftime("%Y-%m-%d %H:%M")
                    )
                )
        return task

    def update_helper_coords(self, helper_id: str, coords: Coordinates):
        if helper_id in self.helpers:
            self.helpers[helper_id].current_coords = coords

    def record_transaction(self, tx: CoinTransaction):
        self.transactions.insert(0, tx)

    def create_sos_alert(self, alert: SOSAlert):
        self.sos_alerts.insert(0, alert)
        return alert

db = MemoryDB()
