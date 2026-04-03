import os
import requests
from dotenv import load_dotenv

load_dotenv()

OPENWEATHER_API_KEY = os.getenv("OPENWEATHER_API_KEY")


FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"
GEO_URL = "http://api.openweathermap.org/geo/1.0/direct"


def get_coordinates(city: str) -> tuple[float, float] | None:
    """Convert city name to lat/lon using OpenWeatherMap Geocoding API."""
    try:
        response = requests.get(GEO_URL, params={
            "q": city,
            "limit": 1,
            "appid": OPENWEATHER_API_KEY
        }, timeout=10)
        data = response.json()
        if not data:
            return None
        return data[0]["lat"], data[0]["lon"]
    except Exception as e:
        print(f"[WeatherAgent] Geocoding error: {e}")
        return None


def get_forecast(city: str) -> dict:
    """
    Fetch 5-day forecast for a city and return structured daily summaries.
    Also detects weather alerts/extreme conditions from forecast data.
    """
    coords = get_coordinates(city)
    if not coords:
        return {
            "success": False,
            "error": f"Could not find location: {city}",
            "city": city,
            "forecast": [],
            "alerts": [],
            "summary": ""
        }

    lat, lon = coords

    try:
        response = requests.get(FORECAST_URL, params={
            "lat": lat,
            "lon": lon,
            "appid": OPENWEATHER_API_KEY,
            "units": "metric",  
            "cnt": 40          
        }, timeout=10)

        raw = response.json()

        if raw.get("cod") != "200":
            return {
                "success": False,
                "error": raw.get("message", "Unknown API error"),
                "city": city,
                "forecast": [],
                "alerts": [],
                "summary": ""
            }

        
        daily = {}
        for item in raw["list"]:
            date = item["dt_txt"].split(" ")[0]  
            if date not in daily:
                daily[date] = {
                    "temps": [],
                    "humidity": [],
                    "rainfall_mm": 0.0,
                    "wind_kph": [],
                    "conditions": []
                }

            daily[date]["temps"].append(item["main"]["temp"])
            daily[date]["humidity"].append(item["main"]["humidity"])
            daily[date]["wind_kph"].append(item["wind"]["speed"] * 3.6)  
            daily[date]["conditions"].append(item["weather"][0]["main"])

            if "rain" in item:
                daily[date]["rainfall_mm"] += item["rain"].get("3h", 0.0)

   
        forecast_days = []
        for date, d in daily.items():
            conditions_set = list(set(d["conditions"]))
            forecast_days.append({
                "date": date,
                "temp_min": round(min(d["temps"]), 1),
                "temp_max": round(max(d["temps"]), 1),
                "humidity_avg": round(sum(d["humidity"]) / len(d["humidity"]), 1),
                "rainfall_mm": round(d["rainfall_mm"], 1),
                "wind_max_kph": round(max(d["wind_kph"]), 1),
                "conditions": conditions_set
            })

        alerts = _detect_alerts(forecast_days)

        summary = _build_summary(city, forecast_days, alerts)

        return {
            "success": True,
            "city": city,
            "lat": lat,
            "lon": lon,
            "forecast": forecast_days,
            "alerts": alerts,
            "summary": summary
        }

    except Exception as e:
        print(f"[WeatherAgent] Forecast error: {e}")
        return {
            "success": False,
            "error": str(e),
            "city": city,
            "forecast": [],
            "alerts": [],
            "summary": ""
        }


def _detect_alerts(forecast_days: list) -> list:
    """
    Scan forecast for extreme conditions and return alert objects.
    These thresholds are agriculture-specific, not generic weather alerts.
    """
    alerts = []

    for day in forecast_days:
        date = day["date"]

        if day["temp_max"] >= 40:
            alerts.append({
                "date": date,
                "type": "EXTREME_HEAT",
                "severity": "HIGH",
                "message": f"Extreme heat ({day['temp_max']}°C) on {date}. Risk of crop stress and moisture loss."
            })

        if day["temp_min"] <= 5:
            alerts.append({
                "date": date,
                "type": "FROST_RISK",
                "severity": "HIGH",
                "message": f"Near-frost conditions ({day['temp_min']}°C) on {date}. Risk of crop damage."
            })

        if day["rainfall_mm"] >= 50:
            alerts.append({
                "date": date,
                "type": "HEAVY_RAIN",
                "severity": "MEDIUM",
                "message": f"Heavy rainfall ({day['rainfall_mm']}mm) on {date}. Risk of waterlogging and fungal disease."
            })

        if day["wind_max_kph"] >= 60:
            alerts.append({
                "date": date,
                "type": "HIGH_WINDS",
                "severity": "MEDIUM",
                "message": f"High winds ({day['wind_max_kph']} kph) on {date}. Risk of lodging for tall crops."
            })

        if day["humidity_avg"] >= 90 and day["rainfall_mm"] > 5:
            alerts.append({
                "date": date,
                "type": "DISEASE_RISK",
                "severity": "MEDIUM",
                "message": f"High humidity ({day['humidity_avg']}%) with rain on {date}. High risk of fungal/bacterial disease outbreak."
            })

    return alerts


def _build_summary(city: str, forecast_days: list, alerts: list) -> str:
    """
    Build a plain-English weather summary string to inject into LLM prompt.
    """
    lines = [f"7-day weather forecast for {city}:\n"]

    for day in forecast_days:
        conditions = ", ".join(day["conditions"])
        lines.append(
            f"- {day['date']}: {day['temp_min']}–{day['temp_max']}°C, "
            f"Humidity {day['humidity_avg']}%, Rain {day['rainfall_mm']}mm, "
            f"Wind {day['wind_max_kph']}kph, Conditions: {conditions}"
        )

    if alerts:
        lines.append("\nActive weather alerts:")
        for alert in alerts:
            lines.append(f"- [{alert['severity']}] {alert['message']}")
    else:
        lines.append("\nNo extreme weather alerts for the coming week.")

    return "\n".join(lines)