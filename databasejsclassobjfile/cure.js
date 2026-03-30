const diseases = {
  "Apple Scab": {
    cureSteps: [
      "Remove and destroy infected leaves and fruits",
      "Ensure proper air circulation by pruning",
      "Avoid overhead watering"
    ],
    medicines: ["Captan", "Myclobutanil", "Mancozeb"],
    recoveryTime: "2–4 weeks with proper treatment"
  },

  "Black Rot": {
    cureSteps: [
      "Prune infected plant parts",
      "Remove fallen debris",
      "Maintain plant hygiene"
    ],
    medicines: ["Mancozeb", "Ziram"],
    recoveryTime: "3–5 weeks"
  },

  "Cedar Apple Rust": {
    cureSteps: [
      "Remove nearby alternate hosts (cedar/juniper)",
      "Apply preventive fungicides",
      "Monitor during wet seasons"
    ],
    medicines: ["Myclobutanil"],
    recoveryTime: "2–3 weeks"
  },

  "Powdery Mildew": {
    cureSteps: [
      "Remove infected leaves",
      "Improve airflow around plants",
      "Reduce humidity levels"
    ],
    medicines: ["Sulfur", "Potassium bicarbonate", "Neem oil"],
    recoveryTime: "1–3 weeks"
  },

  "Gray Leaf Spot": {
    cureSteps: [
      "Use resistant crop varieties",
      "Practice crop rotation",
      "Remove infected leaves"
    ],
    medicines: ["Azoxystrobin", "Pyraclostrobin"],
    recoveryTime: "2–4 weeks"
  },

  "Common Rust": {
    cureSteps: [
      "Monitor early infection",
      "Remove heavily infected leaves",
      "Apply fungicide if severe"
    ],
    medicines: ["Propiconazole"],
    recoveryTime: "2–3 weeks"
  },

  "Northern Leaf Blight": {
    cureSteps: [
      "Use resistant hybrids",
      "Rotate crops",
      "Apply fungicide when needed"
    ],
    medicines: ["Mancozeb", "Azoxystrobin"],
    recoveryTime: "2–4 weeks"
  },

  "Esca (Black Measles)": {
    cureSteps: [
      "Remove infected vines",
      "Improve vineyard sanitation",
      "Avoid pruning wounds during wet weather"
    ],
    medicines: ["No effective cure"],
    recoveryTime: "Varies / Often irreversible"
  },

  "Leaf Blight": {
    cureSteps: [
      "Remove infected leaves",
      "Improve plant spacing",
      "Avoid excessive moisture"
    ],
    medicines: ["Copper fungicide", "Mancozeb"],
    recoveryTime: "2–3 weeks"
  },

  "Citrus Greening": {
    cureSteps: [
      "Remove infected trees immediately",
      "Control insect vectors (psyllids)",
      "Use disease-free planting material"
    ],
    medicines: ["No cure available"],
    recoveryTime: "Not recoverable"
  },

  "Bacterial Spot": {
    cureSteps: [
      "Remove infected plant parts",
      "Avoid overhead irrigation",
      "Use resistant varieties"
    ],
    medicines: ["Copper-based bactericides"],
    recoveryTime: "2–4 weeks"
  },

  "Early Blight": {
    cureSteps: [
      "Remove infected leaves",
      "Use mulch to prevent soil splash",
      "Apply fungicide regularly"
    ],
    medicines: ["Chlorothalonil", "Mancozeb"],
    recoveryTime: "2–3 weeks"
  },

  "Late Blight": {
    cureSteps: [
      "Remove and destroy infected plants",
      "Avoid wet conditions",
      "Apply fungicide immediately"
    ],
    medicines: ["Metalaxyl", "Chlorothalonil"],
    recoveryTime: "1–2 weeks (early stage only)"
  },

  "Leaf Mold": {
    cureSteps: [
      "Improve ventilation",
      "Reduce humidity",
      "Remove infected leaves"
    ],
    medicines: ["Copper fungicide"],
    recoveryTime: "2–3 weeks"
  },

  "Septoria Leaf Spot": {
    cureSteps: [
      "Remove infected leaves",
      "Avoid overhead watering",
      "Rotate crops"
    ],
    medicines: ["Mancozeb", "Chlorothalonil"],
    recoveryTime: "2–4 weeks"
  },

  "Spider Mites": {
    cureSteps: [
      "Spray plants with water to remove mites",
      "Increase humidity",
      "Use biological controls if possible"
    ],
    medicines: ["Abamectin", "Neem oil"],
    recoveryTime: "1–2 weeks"
  },

  "Target Spot": {
    cureSteps: [
      "Remove infected leaves",
      "Maintain plant spacing",
      "Apply fungicide"
    ],
    medicines: ["Chlorothalonil"],
    recoveryTime: "2–3 weeks"
  },

  "Tomato Yellow Leaf Curl Virus": {
    cureSteps: [
      "Remove infected plants immediately",
      "Control whiteflies",
      "Use resistant varieties"
    ],
    medicines: ["No cure"],
    recoveryTime: "Not recoverable"
  },

  "Tomato Mosaic Virus": {
    cureSteps: [
      "Remove infected plants",
      "Disinfect tools regularly",
      "Avoid handling plants after tobacco use"
    ],
    medicines: ["No cure"],
    recoveryTime: "Not recoverable"
  },

  "Leaf Scorch": {
    cureSteps: [
      "Remove infected leaves",
      "Improve irrigation practices",
      "Ensure proper spacing"
    ],
    medicines: ["Fungicide spray"],
    recoveryTime: "2–3 weeks"
  },

  "Healthy": {
    cureSteps: [
      "No treatment required",
      "Maintain proper watering and nutrition"
    ],
    medicines: [],
    recoveryTime: "N/A"
  }
};

export default diseases;