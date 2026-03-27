import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <h2>🌿 Eco-Lingo</h2>

      <Link to="/">Dashboard</Link>
      <Link to="/disease-detection">Disease Detection</Link>
      <Link to="/crop-insights">Crop Insights</Link>
      <Link to="/smart-marketplace">Smart Marketplace</Link>
      <Link to="/soil-form">Soil Form</Link>
    </div>
  );
};

export default Sidebar;