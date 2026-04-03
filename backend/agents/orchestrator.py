import os
import json
from datetime import date
from langchain_groq import ChatGroq
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

from agents.weather_agent import get_forecast
from agents.crop_advisory import get_crop_advisory

load_dotenv()


def run_orchestrator(crop_name: str, city: str, soil_data: dict) -> dict:
    """
    Main orchestrator function.
    Called by /predict endpoint after ML model returns crop name.
    Returns a structured dict ready for frontend dashboard consumption.
    """

    today = date.today().isoformat()

    
    print(f"[Orchestrator] Fetching weather for {city}...")
    weather_data = get_forecast(city)

    print(f"[Orchestrator] Fetching crop advisory for {crop_name}...")
    crop_knowledge = get_crop_advisory(
        crop_name=crop_name,
        question=(
            f"What are the ideal growing conditions, sowing window, irrigation needs, "
            f"fertilizer schedule, pest watch periods, and harvest time for {crop_name}? "
            f"Be specific with temperature ranges, rainfall requirements, and months."
        )
    )

  
    weather_context = weather_data["summary"] if weather_data["success"] else (
        f"Weather data unavailable for {city}. "
        f"Provide general advice based on crop requirements."
    )

    prompt = f"""
You are an expert agricultural planning assistant for Indian farmers.
Today's date is {today}.
The farmer is located in {city}.
The recommended crop based on soil analysis is: {crop_name.upper()}

--- CROP KNOWLEDGE ---
{crop_knowledge}

--- CURRENT WEATHER FORECAST ---
{weather_context}

--- SOIL DATA ---
Nitrogen: {soil_data['N']} mg/kg
Phosphorus: {soil_data['P']} mg/kg
Potassium: {soil_data['K']} mg/kg
Temperature: {soil_data['temperature']}°C
Humidity: {soil_data['humidity']}%
Soil pH: {soil_data['ph']}
Rainfall: {soil_data['rainfall']} mm

--- YOUR TASK ---
Based on the crop knowledge, soil data, and the actual weather forecast above,
produce a complete, weather-aware farming plan. You MUST respond in the following
JSON format and nothing else — no preamble, no markdown fences:

{{
  "crop": "{crop_name}",
  "location": "{city}",
  "plan_generated_on": "{today}",
  "sowing_window": {{
    "recommended_start": "YYYY-MM-DD",
    "recommended_end": "YYYY-MM-DD",
    "reason": "explanation considering current weather"
  }},
  "timeline": [
    {{
      "week": 1,
      "date_range": "YYYY-MM-DD to YYYY-MM-DD",
      "stage": "stage name e.g. Land Preparation",
      "tasks": ["task 1", "task 2"],
      "weather_note": "specific note based on forecast for this period"
    }}
  ],
  "irrigation_schedule": [
    {{
      "stage": "stage name",
      "frequency": "e.g. every 3 days",
      "amount_mm": "e.g. 40mm",
      "weather_adjustment": "reduce if rain expected on date X"
    }}
  ],
  "fertilizer_schedule": [
    {{
      "timing": "e.g. Week 2 / Basal application",
      "fertilizer": "e.g. DAP 50kg/acre",
      "method": "broadcasting / foliar",
      "weather_note": "avoid application if rain expected"
    }}
  ],
  "pest_watch": [
    {{
      "stage": "stage name",
      "pest_or_disease": "name",
      "risk_level": "LOW / MEDIUM / HIGH",
      "weather_trigger": "condition that increases risk",
      "action": "what to do"
    }}
  ],
  "harvest_window": {{
    "estimated_date": "YYYY-MM-DD",
    "duration_days": 10,
    "weather_note": "harvest before X date if rain forecast"
  }},
  "weather_alerts": [
    {{
      "date": "YYYY-MM-DD",
      "type": "alert type",
      "severity": "HIGH / MEDIUM / LOW",
      "message": "what this means for the farmer",
      "action": "what farmer should do"
    }}
  ],
  "overall_advice": "2-3 sentence summary for the farmer in simple language"
}}

If there are no weather alerts, return an empty array for weather_alerts.
Fill the timeline with enough weeks to cover the full crop cycle.
All dates must be real calendar dates starting from today ({today}).
"""


    print(f"[Orchestrator] Calling Groq for full farming plan...")
    try:
        llm = ChatGroq(
            model="llama-3.1-8b-instant",
            api_key=os.getenv("GROQ_API_KEY"),
            temperature=0.2,
            max_tokens=3000
        )

        response = llm.invoke([HumanMessage(content=prompt)])
        raw_response = response.content.strip()

   
        if raw_response.startswith("```"):
            raw_response = raw_response.split("```")[1]
            if raw_response.startswith("json"):
                raw_response = raw_response[4:]
            raw_response = raw_response.strip()

        plan = json.loads(raw_response)

        
        plan["forecast_raw"] = weather_data.get("forecast", [])
        plan["weather_success"] = weather_data["success"]

        return {
            "success": True,
            "plan": plan
        }

    except Exception as e:
        print(f"[Orchestrator] Error: {e}")
        return {
            "success": False,
            "error": str(e),
            "fallback_advisory": crop_knowledge
        }