// App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";

import Westfield from "./pages/Westfield";
import Pricing from "./pages/Pricing";
import HomeWest from "./pages/HomeWest";
import Enquiry from "./pages/Enquiry";
import Login from "./pages/Login";
import { LucideAArrowDown } from "lucide-react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="home" element={<HomeWest />} />
        <Route path ="we" element={<Westfield />} />
        <Route path ="p" element={<Pricing />} />
        <Route path="Enquiry" element={<Enquiry />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;