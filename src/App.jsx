import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Westfield from "./pages/Westfield";
import Pricing from "./pages/Pricing";
import HomeWest from "./pages/HomeWest";
import Enquiry from "./pages/Enquiry";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<HomeWest />} />
        <Route path="/property/:id"element={<Westfield />} />
        <Route path="/purchase/:category/:slug" element={<Pricing />} />
        <Route path="/enquiry" element={<Enquiry />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;