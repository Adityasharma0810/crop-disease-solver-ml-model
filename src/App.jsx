import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import DiseaseDetection from "./pages/DiseaseDetection";
import CropInsights from "./pages/CropInsights";
import SmartMarketplace from "./pages/SmartMarketplace";
import SoilForm from "./pages/SoilForm";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="disease-detection" element={<DiseaseDetection />} />
          <Route path="crop-insights" element={<CropInsights />} />
          <Route path="smart-marketplace" element={<SmartMarketplace />} />
          <Route path="soil-form" element={<SoilForm />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;