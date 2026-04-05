from dotenv import load_dotenv
load_dotenv() 
import os
import io
import base64
import logging
import requests
import json
from typing import List, Optional
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- AYARLAR ---
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
openai_client = OpenAI(api_key=OPENAI_API_KEY)
app = FastAPI(title="Psycho-Sim Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]

class VakaModel(BaseModel):
    vaka_adi: str
    ozet: str
    kurallar: str

# YENİ: Güncelleme işlemi için özel model
class VakaGuncelleModel(BaseModel):
    eski_vaka_adi: str
    yeni_vaka_adi: str
    ozet: str
    kurallar: str

# --- VAKA GETİR ---
@app.get("/vakalar")
def get_vakalar():
    url = f"{SUPABASE_URL}/rest/v1/vakalar?select=*"
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    try:
        response = requests.get(url, headers=headers, timeout=10)
        return response.json() if response.status_code == 200 else []
    except Exception:
        return []

# --- VAKA EKLE ---
@app.post("/vaka-ekle")
def vaka_ekle(vaka: VakaModel):
    url = f"{SUPABASE_URL}/rest/v1/vakalar"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json",
        "Prefer": "return=minimal"
    }
    payload = {"vaka_adi": vaka.vaka_adi, "ozet": vaka.ozet, "kurallar": vaka.kurallar}
    try:
        requests.post(url, headers=headers, json=payload, timeout=10)
        return {"status": "ok"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- VAKA SİL ---
@app.delete("/vaka-sil/{vaka_adi}")
def vaka_sil(vaka_adi: str):
    url = f"{SUPABASE_URL}/rest/v1/vakalar?vaka_adi=eq.{vaka_adi}"
    headers = {"apikey": SUPABASE_KEY, "Authorization": f"Bearer {SUPABASE_KEY}"}
    try:
        requests.delete(url, headers=headers, timeout=10)
        return {"status": "ok"}
    except Exception:
        return {"status": "error"}

# --- VAKA GÜNCELLE (Hata Çözüldü: URL yerine JSON Paketi) ---
@app.put("/vaka-guncelle")
def vaka_guncelle(vaka: VakaGuncelleModel):
    url = f"{SUPABASE_URL}/rest/v1/vakalar"
    headers = {
        "apikey": SUPABASE_KEY,
        "Authorization": f"Bearer {SUPABASE_KEY}",
        "Content-Type": "application/json"
    }
    params = {"vaka_adi": f"eq.{vaka.eski_vaka_adi}"}
    payload = {"vaka_adi": vaka.yeni_vaka_adi, "ozet": vaka.ozet, "kurallar": vaka.kurallar}
    try:
        response = requests.patch(url, headers=headers, params=params, json=payload, timeout=10)
        if response.status_code not in (200, 201, 204):
            raise HTTPException(status_code=response.status_code, detail=f"Güncelleme Hatası: {response.text}")
        return {"status": "ok"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

# --- SES İŞLEME ---
@app.post("/ses-isleme")
async def ses_isleme(file: UploadFile = File(...)):
    try:
        content = await file.read()
        audio_bio = io.BytesIO(content)
        audio_bio.name = "audio.webm"
        transcript = openai_client.audio.transcriptions.create(model="whisper-1", file=audio_bio, language="tr")
        return {"text": transcript.text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- CHAT (5.4 NANO OPERASYONU) ---
@app.post("/chat")
def chat(req: ChatRequest):
    try:
        messages_payload = [{"role": m.role, "content": m.content} for m in req.messages]
        
        # MODEL: gpt-5.4-nano
        response = openai_client.chat.completions.create(
            model="gpt-5.4-nano", 
            messages=messages_payload,
            temperature=0.8
        )
        
        answer = response.choices[0].message.content
        if not answer:
            answer = "Seni duyamıyorum, biraz kafam karışık..."

        # Ses Üretimi
        tts_resp = openai_client.audio.speech.create(model="tts-1", voice="nova", input=answer)
        audio_b64 = base64.b64encode(tts_resp.content).decode("utf-8")
        
        return {"answer": answer, "audio_base64": f"data:audio/mp3;base64,{audio_b64}"}
    except Exception as e:
        logger.error(f"Chat Hatasi: {e}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)