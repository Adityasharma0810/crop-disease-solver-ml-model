
import { useState } from "react";
import { BACKEND2_BASE_URL } from "../services/api";

const DiseaseDetection = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    setFile(e.target.files[0]);
    setResult(null); 
  };

  const handlePredict = async () => {
    if (!file) {
      alert("Please select an image");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);

      const res = await fetch(`${BACKEND2_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setResult(data);
    } catch (error) {
      console.error(error);
      alert("Error connecting to backend");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>🌿 Plant Disease Detection</h1>

      {/* Upload */}
      <input type="file" accept="image/*" onChange={handleUpload} />

      <br /><br />

      {/* Preview */}
      {file && (
        <div>
          <img
            src={URL.createObjectURL(file)}
            alt="preview"
            width="250"
            style={{ borderRadius: "10px" }}
          />
        </div>
      )}

      <br />

      {/* Button */}
      <button onClick={handlePredict} disabled={loading}>
        {loading ? "Detecting..." : "🔍 Detect Disease"}
      </button>

      {/* Result */}
      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>Result</h2>
          <p><strong>Crop:</strong> {result.crop}</p>
          <p><strong>Disease:</strong> {result.disease}</p>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;