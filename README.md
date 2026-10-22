# Sahayak AI (सहायक AI)
### *तुमचो आवाज, तुमचो साhayak — Your Voice, Your Companion*

> **A Konkani-first, AI-powered human assistance and employment platform designed for visually impaired individuals, senior citizens, and people with disabilities across Goa.**

---

## 🌟 The Problem & Vision

In Goa, thousands of visually impaired citizens and senior citizens struggle to travel independently to critical destinations such as **Goa Medical College (GMC) Bambolim**, district hospitals, bus terminals, and government welfare offices. Most existing assistive tech platforms are English-only and ignore regional languages like **Konkani**.

**Sahayak AI** bridges this gap through a voice-first system:
1. **Natural Konkani Voice Interaction**: A vulnerable citizen can simply speak in Konkani (*"Maka GMC hospitalak vochunk ek sahayak zai"*), and our Gemini-powered AI understands the destination, urgency, and mobility needs.
2. **Verified Local Companion Marketplace**: The platform instantly matches them with verified local Goan helpers (students, local volunteers, gig workers) who have completed **Goa Police Clearance & Aadhaar Verification**.
3. **Live GPS Escort & Safety**: Real-time Leaflet & OpenStreetMap tracking of the helper's approach, journey progression, and an instant **SOS Emergency Beacon**.
4. **Micro-Economy Coin Rewards**: Upon task completion, helpers earn redeemable coins (1 Coin = ₹1 INR) that can be paid out directly to UPI or bank accounts.

---

## 🏗️ Architecture & Tech Stack

```
                          [ Visually Impaired Citizen / Senior ]
                                          │
                            (Speaks Natural Konkani)
                                          ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │                          Frontend: React 18 + Vite                          │
   │  • High-Contrast Accessible UI (Tactile Audio Cues & Screen Reader Labels)  │
   │  • Web Speech & Web Audio Synthesizer (AudioContext feedback)               │
   │  • Leaflet.js + OpenStreetMap (100% Free Live Map & Route Simulation)      │
   │  • Multi-Role Switcher: Citizen (Asha) | Helper (Rahul) | Admin Dashboard   │
   └──────────────────────────────────────┬──────────────────────────────────────┘
                                          │ REST API
                                          ▼
   ┌─────────────────────────────────────────────────────────────────────────────┐
   │                          Backend: FastAPI (Python 3.14)                     │
   │  • /api/voice/process: Google Gemini 2.5 Flash Agent for Konkani NLP       │
   │  • /api/tasks: Task lifecycle & matching engine                             │
   │  • /api/tasks/{id}/simulate-step: Hybrid Demo GPS Route Progression         │
   │  • /api/helpers/{id}/redeem: Micro-economy Coin-to-UPI Bank Transfer        │
   │  • /api/emergency/sos: High-priority Goa 108 / Police 112 Beacon           │
   └──────────────────────────────────────┬──────────────────────────────────────┘
                                          │
                         ┌────────────────┴────────────────┐
                         ▼                                 ▼
              [ Google Gemini 2.5 Flash ]        [ Supabase / In-Memory DB ]
              (Konkani Language Model)           (Verified Helpers & Ledger)
```

| Layer | Technology | Rationale & Cost |
|---|---|---|
| **Frontend** | React 18 + Vite + Leaflet.js | Ultra-responsive, zero cost mapping (no Google Maps billing) |
| **Backend** | Python 3.14 + FastAPI + Pydantic | High-performance asynchronous API |
| **AI / NLP** | Google Gemini 2.5 Flash (`google-genai`) | Fluent Konkani reasoning and task extraction |
| **Audio & Speech** | Web Speech API + Web Audio Synthesizer | Tactile sound cues (C5/E5/G5 chimes) + Konkani speech playback |
| **Database & Auth** | Supabase (PostgreSQL) + In-Memory Fallback | Relational integrity, helper registry, verified audit logs |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Python 3.10+ (Python 3.14 recommended)
- Node.js 18+ (Node 24 recommended)
- Optional: Google Gemini API Key (`GEMINI_API_KEY`)

---

### 2. Run the Backend (FastAPI)

```bash
cd backend

# Create virtual environment and activate
python3 -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# (Optional) Set your Gemini API Key in .env
cp .env.example .env

# Start the server
./run.sh
# Server starts on http://localhost:8000
```

FastAPI interactive documentation will be live at:
👉 **http://localhost:8000/docs**

---

### 3. Run the Frontend (React + Vite)

```bash
cd frontend

# Install dependencies (already installed)
npm install

# Start Vite development server
npm run dev
# App will open at http://localhost:5173
```

---

## 🎯 Hackathon Demo Walkthrough (For Judges)

1. **Open the Web App**: Visit `http://localhost:5173`. Notice the clean dark mode with glowing accessible buttons.
2. **Accessible Mode**: Click **"👁️ High Contrast"** on top to showcase the high-contrast yellow/black palette designed for visually impaired users.
3. **Konkani Voice Interaction**:
   - Tap the giant **"Speak Konkani"** button, or click any of the preset scenario chips:
     - 🏥 *"Maka GMC Bambolim hospitalak vochunk ek verified sahayak zai"*
   - Listen as Sahayak AI responds back aloud in spoken Goan Konkani!
4. **Live Matching & GPS Simulation**:
   - Watch the interactive Leaflet map track **Rahul Naik (Verified Helper, ⭐ 4.95)** moving along NH66 from Panaji to GMC Bambolim.
5. **Switch Personas**:
   - Click **"🤝 Helper (Rahul)"** tab: See the incoming dispatch card, turn-by-turn route, and Rahul's earnings wallet (240 Coins = ₹240).
   - Click **"Redeem UPI / Bank"** to demonstrate instant simulated coin conversion into INR.
6. **Admin Oversight**:
   - Click **"🛡️ Admin"** tab: View real-time platform metrics, police clearance verification status, and active emergency logs.
7. **Emergency SOS**:
   - Click the red **"SOS / आपातकाल"** button anytime to trigger an audible emergency siren and simulate alerting Goa 108 Ambulance and nearby helpers.
