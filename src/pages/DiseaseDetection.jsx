import { useState } from "react";
import { BACKEND2_BASE_URL } from "../services/api";

const DiseaseDetection = () => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
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

      console.log("Sending request to:", `${BACKEND2_BASE_URL}/predict`);

      const res = await fetch(`${BACKEND2_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", res.status);

      if (!res.ok) {
        throw new Error("Server error: " + res.status);
      }

      const data = await res.json();
      console.log("Response data:", data);

      if (data.error) {
        alert(data.error);
        return;
      }

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

      {/* Loading */}
      {loading && <p>⏳ Processing...</p>}

      {/* Result */}
      {result && !result.error && (
        <div style={{ marginTop: "30px" }}>
          <h2>Result</h2>
          
          <p><strong>Disease:</strong> {result.disease}</p>

        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;