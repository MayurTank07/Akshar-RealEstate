import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import Westfield from "./pages/Westfield";
import Pricing from "./pages/Pricing";
import HomeWest from "./pages/HomeWest";
import Enquiry from "./pages/Enquiry";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import PropertiesPage from "./pages/Properties";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/westfield" element={<Westfield />} />
          <Route path="/home" element={<HomeWest />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/property/:id" element={<Westfield />} />
          <Route path="/purchase/:category/:slug" element={<Pricing />} />
          <Route path="/enquiry" element={<Enquiry />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;