import { usePlan } from "../context/PlanContext";

const riskColor = {
  HIGH: { bg: "#fef2f2", border: "#fca5a5", text: "#dc2626" },
  MEDIUM: { bg: "#fffbeb", border: "#fcd34d", text: "#d97706" },
  LOW: { bg: "#f0fdf4", border: "#86efac", text: "#16a34a" },
};

export default function Dashboard() {
  const { plan } = usePlan();

  if (!plan) {
    return (
      <div style={{ maxWidth: 600, margin: "4rem auto", textAlign: "center", padding: "2rem" }}>
        <div style={{ fontSize: 48 }}>🌱</div>
        <h2 style={{ color: "#1a5c28", marginTop: "1rem" }}>No crop plan yet</h2>
        <p style={{ color: "#666" }}>
          Go to Soil Analysis, fill in your soil data, and click Predict Crop to generate your personalised farming plan.
        </p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "2rem", fontFamily: "sans-serif" }}>

      {/* Header */}
      <div style={{ background: "linear-gradient(135deg, #1a5c28, #2d7a3a)", borderRadius: 16, padding: "2rem", color: "#fff", marginBottom: "2rem" }}>
        <div style={{ fontSize: 13, opacity: 0.8, textTransform: "uppercase", letterSpacing: 1 }}>Recommended Crop</div>
        <div style={{ fontSize: 42, fontWeight: 800, textTransform: "capitalize", margin: "0.25rem 0" }}>
          🌾 {plan.crop}
        </div>
        <div style={{ display: "flex", gap: "2rem", marginTop: "0.75rem", flexWrap: "wrap" }}>
          <span>📍 {plan.location}</span>
          <span>📅 Plan generated: {plan.plan_generated_on}</span>
        </div>
        <div style={{ marginTop: "1rem", background: "rgba(255,255,255,0.15)", borderRadius: 8, padding: "0.75rem 1rem", fontSize: 14 }}>
          {plan.overall_advice}
        </div>
      </div>

      {/* Weather Alerts */}
      {plan.weather_alerts?.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#dc2626", marginBottom: "1rem" }}>⚠️ Weather Alerts</h3>
          {plan.weather_alerts.map((alert, i) => (
            <div key={i} style={{ background: "#fef2f2", border: "1px solid #fca5a5", borderRadius: 10, padding: "1rem", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ color: "#dc2626" }}>{alert.type}</strong>
                <span style={{ fontSize: 12, background: "#dc2626", color: "#fff", padding: "2px 8px", borderRadius: 99 }}>{alert.severity}</span>
              </div>
              <div style={{ marginTop: 4, fontSize: 14, color: "#444" }}>{alert.message}</div>
              <div style={{ marginTop: 4, fontSize: 13, color: "#666" }}>👉 {alert.action}</div>
              <div style={{ marginTop: 4, fontSize: 12, color: "#999" }}>{alert.date}</div>
            </div>
          ))}
        </section>
      )}

      {/* Sowing Window */}
      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#1a5c28", marginBottom: "1rem" }}>🌱 Sowing Window</h3>
        <div style={{ background: "#f0faf2", border: "1px solid #b2dfbb", borderRadius: 10, padding: "1.25rem" }}>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <div><span style={{ fontSize: 12, color: "#666" }}>START</span><div style={{ fontWeight: 700, color: "#1a5c28" }}>{plan.sowing_window.recommended_start}</div></div>
            <div><span style={{ fontSize: 12, color: "#666" }}>END</span><div style={{ fontWeight: 700, color: "#1a5c28" }}>{plan.sowing_window.recommended_end}</div></div>
          </div>
          <div style={{ fontSize: 14, color: "#555" }}>{plan.sowing_window.reason}</div>
        </div>
      </section>

      {/* 5-Day Weather Forecast */}
      {plan.forecast_raw?.length > 0 && (
        <section style={{ marginBottom: "2rem" }}>
          <h3 style={{ color: "#1a5c28", marginBottom: "1rem" }}>🌤️ 5-Day Weather Forecast</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "0.75rem" }}>
            {plan.forecast_raw.map((day, i) => (
              <div key={i} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1rem", textAlign: "center" }}>
                <div style={{ fontSize: 12, color: "#666", marginBottom: 4 }}>{day.date}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: "#1a5c28" }}>{day.temp_min}° – {day.temp_max}°C</div>
                <div style={{ fontSize: 12, color: "#555", marginTop: 4 }}>💧 {day.humidity_avg}%</div>
                <div style={{ fontSize: 12, color: "#555" }}>🌧️ {day.rainfall_mm}mm</div>
                <div style={{ fontSize: 11, color: "#888", marginTop: 4 }}>{day.conditions.join(", ")}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Crop Timeline */}
      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#1a5c28", marginBottom: "1rem" }}>📅 Crop Timeline</h3>
        <div style={{ position: "relative", paddingLeft: "2rem" }}>
          {/* Vertical line */}
          <div style={{ position: "absolute", left: "0.6rem", top: 0, bottom: 0, width: 2, background: "#b2dfbb" }} />

          {plan.timeline.map((week, i) => (
            <div key={i} style={{ position: "relative", marginBottom: "1.5rem" }}>
              {/* Dot */}
              <div style={{ position: "absolute", left: "-1.55rem", top: "0.9rem", width: 12, height: 12, borderRadius: "50%", background: "#2d7a3a", border: "2px solid #fff", boxShadow: "0 0 0 2px #2d7a3a" }} />

              <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: 10, padding: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <span style={{ fontSize: 11, background: "#e8f5e9", color: "#1a5c28", padding: "2px 8px", borderRadius: 99, fontWeight: 600 }}>Week {week.week}</span>
                    <div style={{ fontWeight: 700, fontSize: 16, marginTop: 6, color: "#1a3320" }}>{week.stage}</div>
                  </div>
                  <div style={{ fontSize: 12, color: "#888" }}>{week.date_range}</div>
                </div>

                <ul style={{ margin: "0.75rem 0 0.5rem", paddingLeft: "1.25rem", color: "#444", fontSize: 14 }}>
                  {week.tasks.map((task, j) => <li key={j} style={{ marginBottom: 4 }}>{task}</li>)}
                </ul>

                {week.weather_note && (
                  <div style={{ fontSize: 13, color: "#2563eb", background: "#eff6ff", borderRadius: 6, padding: "0.5rem 0.75rem", marginTop: "0.5rem" }}>
                    🌤️ {week.weather_note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Irrigation Schedule */}
      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#1a5c28", marginBottom: "1rem" }}>💧 Irrigation Schedule</h3>
        {plan.irrigation_schedule.map((item, i) => (
          <div key={i} style={{ background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 10, padding: "1rem", marginBottom: "0.75rem" }}>
            <div style={{ fontWeight: 600, color: "#0369a1" }}>{item.stage}</div>
            <div style={{ fontSize: 14, color: "#444", marginTop: 4 }}>Every {item.frequency} — {item.amount_mm}</div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>⚠️ {item.weather_adjustment}</div>
          </div>
        ))}
      </section>

      {/* Fertilizer Schedule */}
      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#1a5c28", marginBottom: "1rem" }}>🧪 Fertilizer Schedule</h3>
        {plan.fertilizer_schedule.map((item, i) => (
          <div key={i} style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: 10, padding: "1rem", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
              <div style={{ fontWeight: 600, color: "#92400e" }}>{item.timing}</div>
              <span style={{ fontSize: 12, background: "#92400e", color: "#fff", padding: "2px 8px", borderRadius: 99 }}>{item.method}</span>
            </div>
            <div style={{ fontSize: 14, color: "#444", marginTop: 4 }}>{item.fertilizer}</div>
            <div style={{ fontSize: 13, color: "#666", marginTop: 4 }}>⚠️ {item.weather_note}</div>
          </div>
        ))}
      </section>

      {/* Pest Watch */}
      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#1a5c28", marginBottom: "1rem" }}>🐛 Pest & Disease Watch</h3>
        {plan.pest_watch.map((item, i) => {
          const colors = riskColor[item.risk_level] || riskColor.LOW;
          return (
            <div key={i} style={{ background: colors.bg, border: `1px solid ${colors.border}`, borderRadius: 10, padding: "1rem", marginBottom: "0.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
                <div style={{ fontWeight: 600, color: colors.text }}>{item.pest_or_disease}</div>
                <span style={{ fontSize: 12, background: colors.text, color: "#fff", padding: "2px 8px", borderRadius: 99 }}>{item.risk_level} RISK</span>
              </div>
              <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>Stage: {item.stage}</div>
              <div style={{ fontSize: 13, color: "#555" }}>Trigger: {item.weather_trigger}</div>
              <div style={{ fontSize: 13, color: "#444", marginTop: 4, fontWeight: 500 }}>👉 {item.action}</div>
            </div>
          );
        })}
      </section>

      {/* Harvest Window */}
      <section style={{ marginBottom: "2rem" }}>
        <h3 style={{ color: "#1a5c28", marginBottom: "1rem" }}>🌾 Harvest Window</h3>
        <div style={{ background: "#f0faf2", border: "1px solid #b2dfbb", borderRadius: 10, padding: "1.25rem" }}>
          <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
            <div><span style={{ fontSize: 12, color: "#666" }}>ESTIMATED DATE</span><div style={{ fontWeight: 700, color: "#1a5c28", fontSize: 18 }}>{plan.harvest_window.estimated_date}</div></div>
            <div><span style={{ fontSize: 12, color: "#666" }}>DURATION</span><div style={{ fontWeight: 700, color: "#1a5c28", fontSize: 18 }}>{plan.harvest_window.duration_days} days</div></div>
          </div>
          <div style={{ fontSize: 14, color: "#555" }}>⚠️ {plan.harvest_window.weather_note}</div>
        </div>
      </section>

    </div>
  );
}