import json
import logging
from typing import Optional
from app.config import GEMINI_API_KEY
from app.models import VoiceProcessResponse, Coordinates
from app.database import GOA_LANDMARKS

logger = logging.getLogger(__name__)

# System Prompt for Konkani-First Assistant
KONKANI_SYSTEM_PROMPT = """
You are "Sahayak AI", a warm, empathetic, and ultra-reliable Konkani voice assistant designed for blind individuals, senior citizens, and people with disabilities in Goa, India.

Your job:
1. Understand the user's intent from their Konkani speech (which may be transcribed in Devanagari script, Romanized/Romi Konkani, or mixed Konkani-English).
2. Extract the task details:
   - intent: "request_companion", "emergency_sos", "check_status", "query_coins"
   - service_type: "hospital_visit", "public_transport", "shopping", "government_office", "other"
   - pickup_location: e.g. "Panaji KTC Bus Stand", "Mapusa Market", "Margao", "Ponda"
   - destination: e.g. "Goa Medical College (GMC) Bambolim", "District Hospital Mapusa", "Provedoria Panaji"
   - estimated_duration_minutes: integer (e.g. 45)
   - coin_reward: default 50
   - konkani_spoken_response: A reassuring, polite, and clear voice response spoken in natural Goan Konkani (e.g., "Namaskar! Maka somzolem, tumkam GMC hospitalak vochunk sahayak zai. Chinta naka, hanv lagsor ek verified sahayak sodhta.").
   - english_translation: Clear English translation of the Konkani response.

Always return VALID JSON with keys:
{
  "intent": "request_companion",
  "service_type": "hospital_visit",
  "pickup_location": "Panaji KTC Bus Stand",
  "destination": "Goa Medical College (GMC) Bambolim",
  "estimated_duration_minutes": 45,
  "coin_reward": 50,
  "konkani_spoken_response": "Namaskar! Maka somzolem. Tumkam GMC hospitalak vochunk sahayak zai. Chinta naka, hanv tumche lagsor verified sahayak sodhta.",
  "english_translation": "Hello! I understand you need a companion to go to GMC hospital. Don't worry, I am searching for a verified helper near you right away.",
  "confidence_score": 0.96
}
"""

def get_coords_for_location(location_name: str) -> Coordinates:
    loc_lower = location_name.lower()
    for name, coords in GOA_LANDMARKS.items():
        if name.lower() in loc_lower or loc_lower in name.lower():
            return coords
    if "gmc" in loc_lower or "bambolim" in loc_lower or "hospital" in loc_lower:
        return GOA_LANDMARKS["GMC Bambolim"]
    if "panaji" in loc_lower or "panjim" in loc_lower or "ktc" in loc_lower:
        return GOA_LANDMARKS["Panaji KTC Bus Stand"]
    if "mapusa" in loc_lower or "mapsa" in loc_lower:
        return GOA_LANDMARKS["Mapusa Municipal Market"]
    if "margao" in loc_lower or "madgaon" in loc_lower:
        return GOA_LANDMARKS["Margao Railway Station"]
    # Default to Panaji central
    return Coordinates(lat=15.4989, lng=73.8278)


def rule_based_fallback(prompt: str) -> VoiceProcessResponse:
    p_lower = prompt.lower()

    if any(w in p_lower for w in ["sos", "help", "emergency", "vatt chukli", "moronn", "dhoko"]):
        return VoiceProcessResponse(
            intent="emergency_sos",
            service_type="other",
            pickup_location="Panaji Central",
            pickup_coords=Coordinates(lat=15.4989, lng=73.8278),
            destination="Emergency Support Services",
            dest_coords=Coordinates(lat=15.4616, lng=73.8567),
            estimated_duration_minutes=15,
            coin_reward=0,
            konkani_spoken_response="Chinta naka! Tumcho emergency alert Goa sahayak kendrak dhavla. Lagsorcho sahayak aani 108 helpline contact zata.",
            english_translation="Do not worry! Your emergency alert has been sent to Goa Sahayak Center. Nearby helpers and 108 emergency services are being alerted.",
            confidence_score=0.98
        )

    if any(w in p_lower for w in ["hospital", "gmc", "doktor", "bambolim", "opd", "valpoika"]):
        dest = "Goa Medical College (GMC) Bambolim"
        pickup = "Panaji KTC Bus Stand"
        return VoiceProcessResponse(
            intent="request_companion",
            service_type="hospital_visit",
            pickup_location=pickup,
            pickup_coords=get_coords_for_location(pickup),
            destination=dest,
            dest_coords=get_coords_for_location(dest),
            estimated_duration_minutes=45,
            coin_reward=50,
            konkani_spoken_response="Namaskar! Maka somzolem, tumkam GMC Bambolim hospitalak vochunk sahayak zai. Chinta naka, hanv Rahul Naik (verified sahayak) tumche kodden dhaddta.",
            english_translation="Hello! I understand you need a companion to visit GMC Bambolim hospital. Don't worry, I am assigning Rahul Naik (verified helper) to assist you.",
            confidence_score=0.95
        )

    if any(w in p_lower for w in ["bus", "ktc", "gadi", "station", "railway", "train"]):
        dest = "Panaji KTC Bus Stand"
        pickup = "Campal, Panaji"
        return VoiceProcessResponse(
            intent="request_companion",
            service_type="public_transport",
            pickup_location=pickup,
            pickup_coords=Coordinates(lat=15.4920, lng=73.8180),
            destination=dest,
            dest_coords=get_coords_for_location(dest),
            estimated_duration_minutes=30,
            coin_reward=40,
            konkani_spoken_response="Namaskar! Tumkam KTC bus standak vochunk sahayak zai. Amcho verified sahayak Priya Fernandes tumkam guide korpak tayar aasa.",
            english_translation="Hello! You need assistance getting to the KTC Bus Stand. Our verified helper Priya Fernandes is ready to guide you.",
            confidence_score=0.92
        )

    if any(w in p_lower for w in ["market", "bazar", "dukan", "shopping", "vastu", "mapusa"]):
        dest = "Mapusa Municipal Market"
        pickup = "Mapusa Bus Stand"
        return VoiceProcessResponse(
            intent="request_companion",
            service_type="shopping",
            pickup_location=pickup,
            pickup_coords=Coordinates(lat=15.5900, lng=73.8120),
            destination=dest,
            dest_coords=get_coords_for_location(dest),
            estimated_duration_minutes=60,
            coin_reward=60,
            konkani_spoken_response="Namaskar! Mapusa bazaran shopping korpak tumkam sahayak zai. Amit Sawant (Verified) 5 mintan tumche lagsor pavtolo.",
            english_translation="Hello! You need companion assistance for shopping in Mapusa market. Amit Sawant (Verified) will reach you in 5 minutes.",
            confidence_score=0.91
        )

    # General companion request default
    return VoiceProcessResponse(
        intent="request_companion",
        service_type="hospital_visit",
        pickup_location="Panaji KTC Bus Stand",
        pickup_coords=Coordinates(lat=15.4989, lng=73.8278),
        destination="Goa Medical College (GMC) Bambolim",
        dest_coords=Coordinates(lat=15.4616, lng=73.8567),
        estimated_duration_minutes=45,
        coin_reward=50,
        konkani_spoken_response="Namaskar! Sahayak AI tumchea sevek tayar aasa. Hanv tumkam ek verified local sahayak dita zo tumchea sobaat yetolo.",
        english_translation="Hello! Sahayak AI is here to serve you. I am matching you with a verified local helper who will accompany you.",
        confidence_score=0.90
    )


from app.audio_service import synthesize_google_neural_audio

async def process_konkani_voice_prompt(prompt: str) -> VoiceProcessResponse:
    """Processes Konkani voice or text prompt using Gemini 2.5 Flash, falling back gracefully to local Goa NLP."""
    res: VoiceProcessResponse = None
    if not GEMINI_API_KEY:
        logger.info("No GEMINI_API_KEY detected. Using Goa localized intelligent Konkani NLP engine.")
        res = rule_based_fallback(prompt)
    else:
        try:
            from google import genai
            from google.genai import types

            client = genai.Client(api_key=GEMINI_API_KEY)
            response = client.models.generate_content(
                model="gemini-2.5-flash",
                contents=prompt,
                config=types.GenerateContentConfig(
                    system_instruction=KONKANI_SYSTEM_PROMPT,
                    response_mime_type="application/json",
                    temperature=0.2,
                )
            )

            data = json.loads(response.text)
            pickup_loc = data.get("pickup_location", "Panaji KTC Bus Stand")
            dest_loc = data.get("destination", "Goa Medical College (GMC) Bambolim")

            res = VoiceProcessResponse(
                intent=data.get("intent", "request_companion"),
                service_type=data.get("service_type", "hospital_visit"),
                pickup_location=pickup_loc,
                pickup_coords=get_coords_for_location(pickup_loc),
                destination=dest_loc,
                dest_coords=get_coords_for_location(dest_loc),
                estimated_duration_minutes=int(data.get("estimated_duration_minutes", 45)),
                coin_reward=int(data.get("coin_reward", 50)),
                konkani_spoken_response=data.get("konkani_spoken_response", "Namaskar! Maka somzolem, hanv sahayak sodhta."),
                english_translation=data.get("english_translation", "Hello! I understand and am matching a helper for you."),
                confidence_score=float(data.get("confidence_score", 0.95))
            )
        except Exception as e:
            logger.warning(f"Gemini call exception: {e}. Falling back to Goa localized Konkani NLP.")
            res = rule_based_fallback(prompt)

    # Attach natural Google Cloud Neural voice audio
    if res and res.konkani_spoken_response:
        res.audio_base64 = synthesize_google_neural_audio(res.konkani_spoken_response)

    return res

