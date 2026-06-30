import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { StaffAuthProvider } from "./contexts/StaffAuthContext";
import Home from "./pages/Home";
import PropertyDetails from "./pages/PropertyDetails";
import Pricing from "./pages/Pricing";
import HomeWest from "./pages/HomeWest";
import Enquiry from "./pages/Enquiry";
import Login from "./pages/Login";
import Register from "./pages/Register";
import About from "./pages/About";
import ServicesPage from "./pages/ServicesPage";
import Contact from "./pages/Contact";
import LegalPage from "./pages/LegalPage";
import PropertiesPage from "./pages/Properties";
import NewProjects from "./pages/NewProjects";
import SavedProperties from "./pages/SavedProperties";
import Profile from "./pages/Profile";
import ScrollToTop from "./components/ScrollToTop";
import SplashScreen from "./components/SplashScreen";
import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";
import StaffLogin from "./pages/StaffLogin";
import AdminWorkspace from "./pages/AdminWorkspace";
import ProtectedStaffRoute from "./components/staff/ProtectedStaffRoute";

function App() {
  return (
    <AuthProvider>
      <StaffAuthProvider>
        <Router>
          <SplashScreen />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/property-detail" element={<PropertyDetails />} />
            <Route path="/home" element={<HomeWest />} />
            <Route path="/properties" element={<PropertiesPage />} />
            <Route path="/new-projects" element={<NewProjects />} />
            <Route path="/saved" element={<SavedProperties />} />
            <Route path="/profile/*" element={<Profile />} />
            <Route path="/property/:id" element={<PropertyDetails />} />
            <Route path="/purchase/:category/:slug" element={<Pricing />} />
            <Route path="/enquiry" element={<Enquiry />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/stafflogin" element={<StaffLogin />} />
            <Route element={<ProtectedStaffRoute roles={["admin"]} />}>
              <Route path="/admin/*" element={<AdminWorkspace scope="admin" />} />
            </Route>
            <Route element={<ProtectedStaffRoute roles={["admin", "supervisor"]} />}>
              <Route path="/supervisor/*" element={<AdminWorkspace scope="supervisor" />} />
            </Route>
            <Route path="/admin-dashboard" element={<StaffLogin />} />
            <Route path="/supervisor-dashboard" element={<StaffLogin />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy-policy" element={<LegalPage type="privacy" />} />
            <Route path="/terms-of-service" element={<LegalPage type="terms" />} />
          </Routes>
          <FloatingWhatsAppButton />
        </Router>
      </StaffAuthProvider>
    </AuthProvider>
  );
}

export default App;
