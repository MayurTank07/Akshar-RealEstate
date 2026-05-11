import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import Pricing from "./pages/Pricing";
import HomeWest from "./pages/HomeWest";
import Enquiry from "./pages/Enquiry";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import PropertiesPage from "./pages/Properties";
import SavedProperties from "./pages/SavedProperties";
import ScrollToTop from "./components/ScrollToTop";
import AdminDashboard from "./pages/AdminDashboard";
import SupervisorDashboard from "./pages/SupervisorDashboard";
import SplashScreen from "./components/SplashScreen";

function App() {
  return (
    <AuthProvider>
      <Router>
        <SplashScreen />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/property-detail" element={<PropertyDetails />} />
          <Route path="/home" element={<HomeWest />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/saved" element={<SavedProperties />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/supervisor-dashboard" element={<SupervisorDashboard />} />
          <Route path="/property/:id" element={<PropertyDetails />} />
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
