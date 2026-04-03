import { useState } from "react";

const fields = [
  { key: "N", label: "Nitrogen (N)", unit: "mg/kg", min: 0, max: 140, step: 1, placeholder: "e.g. 90" },
  { key: "P", label: "Phosphorus (P)", unit: "mg/kg", min: 5, max: 145, step: 1, placeholder: "e.g. 42" },
  { key: "K", label: "Potassium (K)", unit: "mg/kg", min: 5, max: 205, step: 1, placeholder: "e.g. 43" },
  { key: "temperature", label: "Temperature", unit: "°C", min: 8, max: 44, step: 0.1, placeholder: "e.g. 25.5" },
  { key: "humidity", label: "Humidity", unit: "%", min: 14, max: 100, step: 0.1, placeholder: "e.g. 82.0" },
  { key: "ph", label: "Soil pH", unit: "", min: 3.5, max: 10, step: 0.01, placeholder: "e.g. 6.5" },
  { key: "rainfall", label: "Rainfall", unit: "mm", min: 20, max: 299, step: 0.1, placeholder: "e.g. 200.0" },
];

const numericFields = fields.map(f => f.key);

export default function SoilForm() {
  const [formData, setFormData] = useState({
    N: "", P: "", K: "", temperature: "", humidity: "", ph: "", rainfall: "", location: ""
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const payload = {};
      for (const [k, v] of Object.entries(formData)) {
        payload[k] = numericFields.includes(k) ? parseFloat(v) : v;
      }

      const response = await fetch("https://crop-disease-solver-ml-model.onrender.com/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) throw new Error("Prediction failed");
      const data = await response.json();
      setResult(data);
    } catch {
      setError("Could not connect to backend. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  const allFilled = Object.values(formData).every((v) => v !== "");

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: "2rem" }}>
      <h2>Soil Analysis</h2>
      <p style={{ color: "#666" }}>Enter your soil and environment values below.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginTop: "1.5rem" }}>
        {fields.map(({ key, label, unit, min, max, step, placeholder }) => (
          <div key={key}>
            <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
              {label} {unit && <span style={{ color: "#999", fontWeight: 400 }}>({unit})</span>}
            </label>
            <input
              type="number"
              name={key}
              value={formData[key]}
              onChange={handleChange}
              min={min}
              max={max}
              step={step}
              placeholder={placeholder}
              style={{
                width: "100%", padding: "0.5rem 0.75rem",
                border: "1px solid #ddd", borderRadius: 8,
                fontSize: 15, boxSizing: "border-box"
              }}
            />
          </div>
        ))}

        {/* Location field — full width, spans both columns */}
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={{ display: "block", fontWeight: 500, marginBottom: 4 }}>
            Location <span style={{ color: "#999", fontWeight: 400 }}>(city name)</span>
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Pune, Mumbai, Delhi"
            style={{
              width: "100%", padding: "0.5rem 0.75rem",
              border: "1px solid #ddd", borderRadius: 8,
              fontSize: 15, boxSizing: "border-box"
            }}
          />
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={!allFilled || loading}
        style={{
          marginTop: "1.5rem", width: "100%", padding: "0.75rem",
          background: allFilled ? "#2d7a3a" : "#ccc",
          color: "#fff", border: "none", borderRadius: 8,
          fontSize: 16, fontWeight: 600, cursor: allFilled ? "pointer" : "not-allowed"
        }}
      >
        {loading ? "Analysing..." : "Predict Crop"}
      </button>

      {error && (
        <div style={{ marginTop: "1rem", padding: "1rem", background: "#fee", borderRadius: 8, color: "#c00" }}>
          {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: "1.5rem", padding: "1.5rem", background: "#f0faf2", borderRadius: 12, border: "1px solid #b2dfbb" }}>
          <div style={{ fontSize: 13, color: "#666", textTransform: "uppercase", letterSpacing: 1 }}>Recommended Crop</div>
          <div style={{ fontSize: 36, fontWeight: 700, color: "#1a5c28", textTransform: "capitalize", margin: "0.25rem 0" }}>
            {result.crop}
          </div>
          <div style={{ fontSize: 14, color: "#555" }}>
            Confidence: <strong>{result.confidence}%</strong>
          </div>
          {result.location && (
            <div style={{ fontSize: 13, color: "#777", marginTop: 4 }}>
              📍 {result.location}
            </div>
          )}
          <div style={{ marginTop: "0.75rem", fontSize: 14, color: "#444" }}>
            {result.message}
          </div>
        </div>
          )}
    </div>
  );
}