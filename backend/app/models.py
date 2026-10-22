from typing import Optional, List
from pydantic import BaseModel, Field
from datetime import datetime


class Coordinates(BaseModel):
    lat: float
    lng: float


class VoiceProcessRequest(BaseModel):
    prompt: str = Field(..., description="Konkani speech transcript or user text")
    user_id: Optional[str] = "user_asha_01"
    audio_base64: Optional[str] = None


class VoiceProcessResponse(BaseModel):
    intent: str = Field(default="request_companion")
    service_type: str = Field(default="hospital_visit")
    pickup_location: str = Field(default="Panaji KTC Bus Stand")
    pickup_coords: Coordinates = Field(default_factory=lambda: Coordinates(lat=15.4989, lng=73.8278))
    destination: str = Field(default="Goa Medical College (GMC) Bambolim")
    dest_coords: Coordinates = Field(default_factory=lambda: Coordinates(lat=15.4616, lng=73.8567))
    estimated_duration_minutes: int = Field(default=45)
    coin_reward: int = Field(default=50)
    konkani_spoken_response: str = Field(..., description="Spoken Konkani reply to read back to user")
    english_translation: str = Field(..., description="English translation of spoken response")
    confidence_score: float = Field(default=0.95)


class TaskCreateRequest(BaseModel):
    user_id: str = "user_asha_01"
    service_type: str
    pickup_location: str
    pickup_coords: Coordinates
    destination: str
    dest_coords: Coordinates
    konkani_transcript: Optional[str] = ""
    coin_reward: int = 50


class Task(BaseModel):
    id: str
    user_id: str
    user_name: str
    user_phone: str
    service_type: str
    pickup_location: str
    pickup_coords: Coordinates
    destination: str
    dest_coords: Coordinates
    status: str = "requested"  # requested, matched, in_progress, arrived, completed, cancelled
    helper_id: Optional[str] = None
    helper_name: Optional[str] = None
    helper_phone: Optional[str] = None
    helper_rating: Optional[float] = None
    helper_coords: Optional[Coordinates] = None
    konkani_transcript: Optional[str] = ""
    coin_reward: int = 50
    created_at: str
    completed_at: Optional[str] = None


class Helper(BaseModel):
    id: str
    name: str
    phone: str
    rating: float = 4.9
    reviews_count: int = 24
    is_verified: bool = True
    verification_badge: str = "Goa Verified Helper (Aadhaar + Police Cleared)"
    is_available: bool = True
    current_coords: Coordinates
    coins_balance: int = 150
    completed_tasks_count: int = 12
    languages: List[str] = ["Konkani", "English", "Marathi"]


class CoinTransaction(BaseModel):
    id: str
    helper_id: str
    amount: int
    type: str  # earned, redeemed, bonus
    description: str
    timestamp: str


class SOSAlert(BaseModel):
    id: str
    user_id: str
    user_name: str
    location: str
    coords: Coordinates
    timestamp: str
    status: str = "active"
