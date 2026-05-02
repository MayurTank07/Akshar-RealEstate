// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import LuxeEstate from "./pages/LuxeEstate";
import Housing from "./pages/Housing";
import Estate from "./pages/Estate";
import Westfield from "./pages/Westfield";
import Pricing from "./pages/Pricing";
import HomeWest from "./pages/HomeWest";
import { LucideAArrowDown } from "lucide-react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<HomeWest />} />
        <Route path="*" element={<LuxeEstate />} />
        <Route path ="h" element={<Housing />} />
        <Route path ="e" element={<Estate />} />
        <Route path ="we" element={<Westfield />} />
        <Route path ="p" element={<Pricing />} />
      </Routes>
    </Router>
  );
}

export default App;