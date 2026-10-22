import os
import logging
import base64
from typing import Optional
import httpx
import google.auth
from google.auth.transport.requests import Request
from app.config import GEMINI_API_KEY

logger = logging.getLogger(__name__)

# In-memory audio cache to provide instant 0ms audio playback for repeated phrases
AUDIO_CACHE = {}

def get_google_auth_token():
    try:
        credentials, _ = google.auth.default(quota_project_id="elated-channel-466305-j2")
        credentials.refresh(Request())
        return credentials.token
    except Exception as e:
        logger.warning(f"Could not refresh Google ADC token: {e}")
        return None


def synthesize_google_neural_audio(text: str) -> Optional[str]:
    """
    Synthesizes natural, human-sounding studio voice in Konkani/Indian dialect
    using Google Cloud Chirp3-HD / Wavenet Neural Text-to-Speech API.
    Returns base64 encoded MP3 string.
    """
    if text in AUDIO_CACHE:
        return AUDIO_CACHE[text]

    token = get_google_auth_token()
    if not token:
        return None

    try:
        url = "https://texttospeech.googleapis.com/v1/text:synthesize"
        headers = {
            "Authorization": f"Bearer {token}",
            "x-goog-user-project": "elated-channel-466305-j2"
        }

        # Try Chirp3-HD first (Google's highest fidelity voice model)
        payload = {
            "input": {"text": text},
            "voice": {
                "languageCode": "mr-IN",
                "name": "mr-IN-Chirp3-HD-Aoede"
            },
            "audioConfig": {
                "audioEncoding": "MP3",
                "speakingRate": 0.96, # Gentle pace for senior/blind clarity
                "pitch": 0.0
            }
        }

        resp = httpx.post(url, headers=headers, json=payload, timeout=8.0)
        if resp.status_code == 200:
            audio_content = resp.json().get("audioContent", "")
            if audio_content:
                AUDIO_CACHE[text] = audio_content
                return audio_content

        # Fallback to Wavenet-A if Chirp3 is unavailable
        payload["voice"]["name"] = "mr-IN-Wavenet-A"
        resp = httpx.post(url, headers=headers, json=payload, timeout=8.0)
        if resp.status_code == 200:
            audio_content = resp.json().get("audioContent", "")
            if audio_content:
                AUDIO_CACHE[text] = audio_content
                return audio_content

        logger.warning(f"Google TTS response error: {resp.text}")
    except Exception as e:
        logger.warning(f"Google Neural TTS exception: {e}")

    return None
