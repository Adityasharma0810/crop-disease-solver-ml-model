from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np

from agents.orchestrator import run_orchestrator
from database.db import init_db

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = joblib.load("soil_model.pkl")
scaler = joblib.load("scaler.pkl")
label_encoder = joblib.load("label_encoder.pkl")


@app.on_event("startup")
def startup():
    print("[Startup] Initialising database...")
    init_db()
    print("[Startup] Database ready.")


class SoilInput(BaseModel):
    N: float
    P: float
    K: float
    temperature: float
    humidity: float
    ph: float
    rainfall: float
    location: str        


@app.get("/")
def root():
    return {"status": "AgriAI backend running"}


@app.post("/predict")
def predict_crop(data: SoilInput):

  
    total_npk = data.N + data.P + data.K
    n_p_ratio = data.N / data.P if data.P != 0 else 0
    n_k_ratio = data.N / data.K if data.K != 0 else 0

    features = np.array([[
        data.N, data.P, data.K,
        data.temperature, data.humidity, data.ph, data.rainfall,
        total_npk, n_p_ratio, n_k_ratio
    ]])


    features_scaled = scaler.transform(features)
    prediction_encoded = model.predict(features_scaled)[0]
    crop_name = label_encoder.inverse_transform([prediction_encoded])[0]
    confidence = round(float(model.predict_proba(features_scaled).max()) * 100, 1)


    soil_data = {
        "N": data.N, "P": data.P, "K": data.K,
        "temperature": data.temperature, "humidity": data.humidity,
        "ph": data.ph, "rainfall": data.rainfall
    }

    orchestrator_result = run_orchestrator(
        crop_name=crop_name,
        city=data.location,
        soil_data=soil_data
    )

  
    response = {
        "crop": crop_name,
        "confidence": confidence,
        "location": data.location,
        "message": f"Based on your soil data, {crop_name} is recommended with {confidence}% confidence."
    }

    if orchestrator_result["success"]:
        response["plan"] = orchestrator_result["plan"]
    else:
    
        response["plan"] = None
        response["advisory_fallback"] = orchestrator_result.get("fallback_advisory", "")
        response["error"] = orchestrator_result.get("error", "")

    return response