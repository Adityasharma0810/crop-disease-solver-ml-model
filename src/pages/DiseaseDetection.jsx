import { useState } from "react";
import { BACKEND2_BASE_URL } from "../services/api";
import diseases from "../../databasejsclassobjfile/cure";

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

      const res = await fetch(`${BACKEND2_BASE_URL}/predict`, {
        method: "POST",
        body: formData,
      });

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

  
  const formatDiseaseName = (name) => {
    if (!name) return null;

    return name
      .trim()
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  
  const diseaseName = formatDiseaseName(result?.disease);
  const cropName = result?.crop;
  const diseaseInfo = diseaseName ? diseases[diseaseName] : null;

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

          
          <p><strong>🦠 Disease:</strong> {diseaseName}</p>

          {diseaseInfo ? (
            <div style={{ textAlign: "left", display: "inline-block", marginTop: "20px" }}>
              
              <h3>🛠 Cure Steps</h3>
              <ul>
                {diseaseInfo.cureSteps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ul>

              <h3>💊 Medicines</h3>
              <ul>
                {diseaseInfo.medicines.length > 0 ? (
                  diseaseInfo.medicines.map((med, index) => (
                    <li key={index}>{med}</li>
                  ))
                ) : (
                  <li>No medicines required</li>
                )}
              </ul>

              <h3>⏱ Recovery Time</h3>
              <p>{diseaseInfo.recoveryTime}</p>

            </div>
          ) : (
            <p>⚠️ No cure data available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DiseaseDetection;