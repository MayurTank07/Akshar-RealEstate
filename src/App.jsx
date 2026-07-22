import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { StaffAuthProvider } from "./contexts/StaffAuthContext";
import Home from "./pages/Home";
import ScrollToTop from "./components/ScrollToTop";
import SplashScreen from "./components/SplashScreen";
import FloatingWhatsAppButton from "./components/FloatingWhatsAppButton";
import ProtectedStaffRoute from "./components/staff/ProtectedStaffRoute";

const PropertyDetails = lazy(() => import("./pages/PropertyDetails"));
const Pricing = lazy(() => import("./pages/Pricing"));
const HomeWest = lazy(() => import("./pages/HomeWest"));
const Enquiry = lazy(() => import("./pages/Enquiry"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const About = lazy(() => import("./pages/About"));
const ServicesPage = lazy(() => import("./pages/ServicesPage"));
const Contact = lazy(() => import("./pages/Contact"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const PropertiesPage = lazy(() => import("./pages/Properties"));
const NewProjects = lazy(() => import("./pages/NewProjects"));
const SavedProperties = lazy(() => import("./pages/SavedProperties"));
const Profile = lazy(() => import("./pages/Profile"));
const LocationLanding = lazy(() => import("./pages/LocationLanding"));
const StaffLogin = lazy(() => import("./pages/StaffLogin"));
const AdminWorkspace = lazy(() => import("./pages/AdminWorkspace"));

function RouteFallback() {
  return <div className="min-h-screen bg-slate-50 pt-32 text-center text-sm font-bold text-slate-500">Loading...</div>;
}

function App() {
  return (
    <AuthProvider>
      <StaffAuthProvider>
        <Router>
          <SplashScreen />
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/property-detail" element={<Navigate to="/properties" replace />} />
              <Route path="/home" element={<HomeWest />} />
              <Route path="/properties" element={<PropertiesPage />} />
              <Route path="/new-projects" element={<NewProjects />} />
              <Route path="/saved" element={<SavedProperties />} />
              <Route path="/profile/*" element={<Profile />} />
              <Route path="/property/:id" element={<PropertyDetails />} />
              <Route path="/properties-for-sale/:region" element={<LocationLanding />} />
              <Route path="/properties-for-sale/:region/:locality" element={<LocationLanding />} />
              <Route path="/properties-for-sale/:region/:locality/:intent" element={<LocationLanding />} />
              <Route path="/plots-for-sale/:typeLocation" element={<LocationLanding typePrefix="plots-for-sale" />} />
              <Route path="/commercial-property/:typeLocation" element={<LocationLanding typePrefix="commercial-property" />} />
              <Route path="/industrial-property/:typeLocation" element={<LocationLanding typePrefix="industrial-property" />} />
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
          </Suspense>
          <FloatingWhatsAppButton />
        </Router>
      </StaffAuthProvider>
    </AuthProvider>
  );
}

export default App;
