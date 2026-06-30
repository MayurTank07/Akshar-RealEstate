import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  Award,
  BarChart3,
  Bell,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  ChevronUp,
  ClipboardList,
  Copy,
  Download,
  Edit3,
  Eye,
  EyeOff,
  FileText,
  Filter,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  MapPin,
  Plus,
  Save,
  Search,
  Settings,
  Shield,
  Sparkles,
  Trash2,
  Upload,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useStaffAuth } from "../contexts/useStaffAuth";
import { publicApi, staffApi, toQueryString } from "../services/api";
import { formatINR, moneyInputValue, parseINRAmount } from "../utils/currency";
import { defaultAboutContent, defaultContactContent, defaultNavbarAreas, defaultTopLists, enabledSorted, normalizeAreaName } from "../config/navigationContent";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3, roles: ["admin", "supervisor"], permission: "dashboard:access" },
  { key: "properties", label: "Property Management", icon: Building2, roles: ["admin", "supervisor"], permission: "assigned:view" },
  { key: "supervisors", label: "Supervisor Management", icon: Users, roles: ["admin"] },
  { key: "owners", label: "Owner Management", icon: UserCheck, roles: ["admin", "supervisor"], permission: "owner_management" },
  { key: "enquiries", label: "Enquiries", icon: MessageSquare, roles: ["admin", "supervisor"], permission: "enquiries:view" },
  { key: "sold-rented", label: "Sold & Rented Reports", icon: FileText, roles: ["admin", "supervisor"], permission: "analytics:access" },
  { key: "analytics", label: "Analytics", icon: BarChart3, roles: ["admin", "supervisor"], permission: "analytics:access" },
  { key: "reports", label: "Reports & Export", icon: FileText, roles: ["supervisor"], permission: "reports:export" },
  { key: "users", label: "User Management", icon: User, roles: ["admin"] },
  { key: "page-edits", label: "Page Edits", icon: Edit3, roles: ["admin"] },
  { key: "certifications", label: "Certifications", icon: Award, roles: ["admin"] },
  { key: "settings", label: "Settings", icon: Settings, roles: ["admin"] },
];

const permissionOptions = [
  ["dashboard:access", "Can Access Dashboard"],
  ["enquiries:view", "Can View Enquiries"],
  ["properties:add", "Can Add Property"],
  ["properties:edit", "Can Edit Property"],
  ["properties:delete", "Can Delete Property"],
  ["leads:manage", "Can Manage Leads"],
  ["properties:status", "Can Update Property Status"],
  ["analytics:access", "Can Access Analytics"],
  ["reports:export", "Can Export Reports"],
  ["saved:manage", "Can Manage Saved Properties"],
  ["clients:manage", "Can Manage Clients"],
  ["assigned:view", "Can View Assigned Data"],
  ["owner_management", "Can Manage Owner Submissions"],
];

const defaultSupervisorPermissions = [
  "dashboard:access",
  "enquiries:view",
  "properties:add",
  "properties:edit",
  "leads:manage",
  "properties:status",
  "analytics:access",
  "reports:export",
  "assigned:view",
];

const propertyOptionGroups = {
  amenities: ["Parking", "Lift", "Security", "Garden", "Swimming Pool", "Gym", "CCTV", "Power Backup", "Club House", "WiFi", "Air Conditioning", "Water Supply", "Balcony", "Furnished", "Semi Furnished", "Modular Kitchen", "Visitor Parking", "Kids Play Area", "Fire Safety", "Pet Friendly"],
  features: ["Corner Property", "Wide Road Access", "Road Facing", "Vaastu Compliant", "Gated Community", "Prime Location", "High Footfall", "Main Road Touch", "Near Metro", "Near School", "Near Hospital", "Near Market", "New Construction", "Ready Possession", "High ROI"],
  facilities: ["24/7 Water", "Generator Backup", "Society Office", "Waste Management", "Intercom", "Maintenance Staff", "Rainwater Harvesting", "EV Charging", "Service Lift", "Conference Room", "Pantry", "Reception Area"],
  highlights: ["Premium Location", "Verified Listing", "Negotiable Price", "Immediate Possession", "Clear Title", "Loan Approved", "Investor Friendly", "Owner Listed", "Exclusive Mandate"],
  propertyTags: ["ROI", "Pre Leased", "Barter", "Commercial", "Residential", "Office", "Showroom", "Warehouse", "Apartment", "Villa", "Plot", "New Launch", "New Projects", "Hot Deal", "Featured"],
  furnishing: ["Unfurnished", "Semi Furnished", "Fully Furnished", "Bare Shell", "Warm Shell"],
  facing: ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West", "Road Facing", "Garden Facing"],
  propertyStatus: ["Ready", "Under Construction", "New Launch", "Resale", "Sold", "Rented"],
  category: ["Residential", "Commercial", "Industrial", "Land/Plot", "Pre-Leased", "Investment", "Retail", "Office", "New Projects"],
  availability: ["Immediate", "Within 15 Days", "Within 30 Days", "Within 3 Months", "After 3 Months", "Under Construction"],
  cities: ["Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Mumbai"],
  propertyTypes: ["Apartments", "Villa", "Bungalow", "Plot", "Office", "Showroom", "Shop", "Warehouse", "Farm House", "Penthouse"],
  locations: [],
  developers: ["Vaibhavlaxmi Developers", "Lodha Builders", "Reliable India and Corporation", "Haware Properties", "Agastya Infra"],
  projects: ["Gurukrupa Ananatam", "Trump Towers", "Ashapura Skies", "Clinton Heights", "Nathani Heights"],
  dealTypes: ["Sale", "Rent", "Pre-Leased", "Lease", "Resale", "New Launch", "Investment", "ROI"],
  listingStatuses: ["active", "pending", "inactive", "sold", "rented"],
  displayTags: ["Featured", "New", "New Project", "Hot", "Standard"],
  bhk: ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  measurementUnits: ["sqft", "vigha", "acre", "sq-yard", "sq-meter", "guntha", "hectare"],
  ownership: ["Freehold", "Leasehold", "Co-operative Society", "Power of Attorney", "Joint Ownership", "Other"],
  floors: ["Ground", "Lower Ground", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "15", "20", "25", "30+"],
  parking: ["No Parking", "Open Parking", "Covered Parking", "1 Car", "2 Cars", "3 Cars", "Visitor Parking", "Basement Parking"],
  constructionStatus: ["Ready to Move", "Under Construction", "New Launch", "OC Received", "Renovated", "Resale"],
  possessionStatus: ["Immediate", "Within 15 Days", "Within 30 Days", "Within 3 Months", "Within 6 Months", "By Agreement"],
  brokerageType: ["Fixed", "Percentage", "One Month Rent", "Half Month Rent", "No Brokerage", "Negotiable"],
  priceUnits: ["Thousand", "Lakh", "Crore", "Per Month", "Per Sqft", "Per Sqyd"],
};

function hasStaffPermission(user, permission) {
  if (!permission || user.role === "admin") return true;
  return (user.permissions || []).includes(permission);
}

const emptyProperty = {
  title: "",
  location: "",
  city: "",
  type: "",
  dealType: "",
  developerName: "",
  topProject: "",
  topDeveloper: "",
  price: "",
  priceUnit: "",
  beds: "",
  baths: 0,
  sqft: 0,
  measurement: { value: 0, unit: "" },
  area: "",
  tag: "",
  badge: "",
  badgeColor: "bg-blue-600",
  status: "",
  propertyStatus: "",
  category: "",
  availability: "",
  constructionStatus: "",
  possessionStatus: "",
  brokerageType: "",
  facing: "",
  ownership: "",
  visibility: "",
  featured: false,
  ownerName: "",
  image: "",
  gallery: [],
  description: "",
  videoUrl: "",
  amenities: [],
  features: [],
  facilities: [],
  highlights: [],
  parking: "",
  floorNumber: "",
  totalFloors: "",
  furnishing: "",
  propertyTags: [],
  isNewProject: false,
  isPreLeased: false,
  isBarter: false,
  roi: "",
  finalPrice: "",
  commission: "",
  paymentDetails: "",
  statusRemarks: "",
  dealSource: "",
  dealEnquiryId: "",
  dealCustomerName: "",
  dealCustomerPhone: "",
  dealCustomerEmail: "",
  dealCustomerAddress: "",
  dealDate: "",
  contact: { name: "", phone: "", email: "" },
  map: { address: "", area: "", city: "", state: "", pincode: "", latitude: null, longitude: null, placeId: "", embedUrl: "" },
  seo: { metaTitle: "", metaDescription: "", slug: "" },
  yearBuilt: null,
  propertyCode: "",
  assignedTo: "",
  source: "",
};

function generatePropertyDescription(property) {
  const title = property.title?.trim() || "This premium property";
  const type = property.type?.trim() || "property";
  const category = property.category?.trim();
  const location = property.location?.trim();
  const city = property.city?.trim();
  const address = [location, city && city !== location ? city : ""].filter(Boolean).join(", ");
  const dealType = property.dealType?.trim();
  const dealPhrase = dealType === "ROI" ? "positioned as an attractive ROI opportunity" : dealType ? `available for ${dealType.toLowerCase()}` : "";
  const price = formatINR(property.priceAmount || property.price);
  const measurementValue = property.measurement?.value || property.sqft;
  const measurementUnit = property.measurement?.unit;
  const amenityText = (property.amenities || []).slice(0, 5).join(", ");
  const featureText = (property.features || []).slice(0, 3).join(", ");
  const furnishing = property.furnishing?.trim();
  const developer = property.developerName?.trim() || property.topDeveloper?.trim();
  const project = property.topProject?.trim();
  const ownership = property.ownership?.trim();
  const facing = property.facing?.trim();
  const beds = Number(property.beds || 0);

  const overview = `${title} is a thoughtfully presented ${category ? `${category.toLowerCase()} ` : ""}${type.toLowerCase()}${address ? ` in ${address}` : " in Ahmedabad"}${dealPhrase ? `, ${dealPhrase}` : ""}.`;
  const details = [
    beds ? `${beds} BHK configuration` : "",
    measurementValue ? `${measurementValue} ${measurementUnit || "sqft"} of well-planned space` : "",
    furnishing ? `${furnishing.toLowerCase()} interiors` : "",
    ownership ? `${ownership.toLowerCase()} ownership` : "",
    facing ? `${facing.toLowerCase()} orientation` : "",
  ].filter(Boolean);
  const projectDetails = [project ? `part of ${project}` : "", developer ? `developed by ${developer}` : ""].filter(Boolean);
  const commercial = price && price !== "₹0" ? ` The property is offered at ${price}, with details available for serious enquiries.` : "";
  const features = amenityText ? ` Key lifestyle and utility highlights include ${amenityText}.` : "";
  const additionalFeatures = featureText ? ` The listing also stands out for ${featureText}.` : "";
  const close = " Connect with Akshar Estate The Property HUB for verified Ahmedabad market guidance, broker-assisted pricing support, and a private site visit.";
  return `${overview}${projectDetails.length ? ` It is ${projectDetails.join(" and ")}.` : ""}${details.length ? ` It offers ${details.join(", ")}.` : ""}${features}${additionalFeatures}${commercial} ${close}`;
}

function statusClass(status) {
  const normalized = String(status).toLowerCase();
  if (normalized === "active" || normalized === "closed" || normalized === "approved" || normalized === "sold") return "bg-emerald-100 text-emerald-700";
  if (normalized === "rented") return "bg-cyan-100 text-cyan-700";
  if (normalized === "no-conversion") return "bg-slate-100 text-slate-700";
  if (normalized === "pending" || normalized === "in-progress") return "bg-yellow-100 text-yellow-700";
  if (normalized === "new") return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-700";
}

function formatDate(value) {
  if (!value) return "Today";
  return new Intl.DateTimeFormat("en-CA").format(new Date(value));
}

function labelize(value) {
  return String(value || "")
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function uniqueOptions(items, accessor) {
  return [...new Set(items.map(accessor).filter(Boolean))].sort((a, b) => String(a).localeCompare(String(b)));
}

function buildQuery(params) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      searchParams.set(key, value);
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

export default function AdminWorkspace({ scope = "admin" }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { staffUser, staffToken, logoutStaff, saveStaffUser } = useStaffAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState({ unreadCount: 0, notifications: [] });
  const section = location.pathname.split("/")[2] || "dashboard";
  const allowedItems = navItems.filter((item) => item.roles.includes(staffUser.role) && hasStaffPermission(staffUser, item.permission));
  const activeSection = allowedItems.some((item) => item.key === section) ? section : allowedItems[0]?.key || "dashboard";
  const canDeleteProperty = hasStaffPermission(staffUser, "properties:delete");
  const canCreateProperty = hasStaffPermission(staffUser, "properties:add");
  const canManageLeads = hasStaffPermission(staffUser, "leads:manage");

  useEffect(() => {
    if (activeSection !== section) {
      navigate(`/${scope}/${activeSection}`, { replace: true });
    }
  }, [activeSection, navigate, scope, section]);

  const loadNotifications = async () => {
    const response = await staffApi.notifications();
    setNotifications(response.data);
  };

  useEffect(() => {
    let active = true;
    staffApi
      .notifications()
      .then((response) => {
        if (active) setNotifications(response.data);
      })
      .catch(() => {});
    const timer = window.setInterval(() => {
      staffApi.notifications().then((response) => active && setNotifications(response.data)).catch(() => {});
    }, 45000);
    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, []);

  if (scope === "admin" && staffUser.role !== "admin") {
    return <Navigate to="/supervisor/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${
          sidebarOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setSidebarOpen(false)}
        aria-hidden={!sidebarOpen}
      />
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-blue-600 text-white shadow-2xl transition-transform duration-300 ease-out lg:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarContent
          staffUser={staffUser}
          allowedItems={allowedItems}
          activeSection={activeSection}
          scope={scope}
          onNavigate={() => setSidebarOpen(false)}
          showClose
        />
      </aside>

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col bg-blue-600 text-white lg:flex">
        <SidebarContent staffUser={staffUser} allowedItems={allowedItems} activeSection={activeSection} scope={scope} />
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex h-[76px] items-center justify-between border-b border-slate-200 bg-white/95 px-4 backdrop-blur sm:h-[88px] md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 hover:bg-slate-100 lg:hidden"
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <AdminSearchBar scope={scope} />
          </div>
          <div className="flex flex-1 items-center justify-end gap-3">
            <Link to="/" className="wf-btn wf-btn-secondary hidden sm:inline-flex lg:hidden">
              <Home size={16} />
              Site
            </Link>
            <button
              type="button"
              onClick={() => {
                setNotificationsOpen((current) => !current);
                setProfileOpen(false);
              }}
              className="relative grid h-10 w-10 place-items-center rounded-full text-slate-600 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell size={20} />
              {notifications.unreadCount > 0 && (
                <span className="absolute right-0 top-0 grid h-5 min-w-5 place-items-center rounded-full bg-red-500 px-1 text-[11px] font-bold text-white">
                  {notifications.unreadCount}
                </span>
              )}
            </button>
            {notificationsOpen && <NotificationsPanel data={notifications} scope={scope} onClose={() => setNotificationsOpen(false)} onReload={loadNotifications} />}
            <button
              type="button"
              onClick={() => {
                setProfileOpen((current) => !current);
                setNotificationsOpen(false);
              }}
              className="grid h-10 w-10 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white"
              aria-label="Profile"
            >
              {staffUser.avatar ? <img src={staffUser.avatar} alt={staffUser.name} className="h-full w-full object-cover" /> : <User size={19} />}
            </button>
            {profileOpen && <ProfilePanel user={staffUser} onClose={() => setProfileOpen(false)} onSaved={saveStaffUser} onLogout={logoutStaff} />}
            <button onClick={logoutStaff} className="grid h-10 w-10 place-items-center rounded-full text-slate-500 hover:bg-slate-100" aria-label="Logout">
              <LogOut size={19} />
            </button>
          </div>
        </header>

        <main className="px-3 py-5 sm:px-5 sm:py-7 md:px-8 md:py-8">
          {activeSection === "dashboard" && <DashboardSection scope={scope} />}
          {activeSection === "properties" && <PropertiesSection canDelete={canDeleteProperty} canCreate={canCreateProperty} />}
          {activeSection === "supervisors" && <SupervisorsSection />}
          {activeSection === "owners" && <OwnersSection />}
          {activeSection === "enquiries" && <EnquiriesSection canDelete={staffUser.role === "admin"} canManage={canManageLeads} />}
          {activeSection === "sold-rented" && <SoldRentedReportsSection role={staffUser.role} token={staffToken} />}
          {activeSection === "analytics" && <AnalyticsSection />}
          {activeSection === "reports" && <ReportsSection token={staffToken} role={staffUser.role} />}
          {activeSection === "users" && <UsersSection />}
          {activeSection === "page-edits" && <PageEditsSection />}
          {activeSection === "certifications" && <CertificationsAdminSection />}
          {activeSection === "settings" && <SettingsSection />}
        </main>
      </div>
    </div>
  );
}

function PageTitle({ title, subtitle, action }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-extrabold tracking-tight text-slate-950 sm:text-2xl lg:text-3xl">{title}</h2>
        <p className="mt-1 text-xs text-slate-500 sm:mt-1.5 sm:text-sm">{subtitle}</p>
      </div>
      {action && <div className="w-full sm:w-auto">{action}</div>}
    </div>
  );
}

function InlineAlert({ message, tone = "red" }) {
  if (!message) return null;
  const tones = {
    red: "border-red-100 bg-red-50 text-red-700",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    blue: "border-blue-100 bg-blue-50 text-blue-700",
  };
  return <div className={`mb-5 rounded-xl border px-4 py-3 text-sm font-bold ${tones[tone]}`}>{message}</div>;
}

function EmptyState({ title, description, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center">
      <p className="text-sm font-extrabold text-slate-800">{title}</p>
      {description && <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

function LoadingState({ label = "Loading data..." }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white px-4 py-8 text-center shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
      <p className="text-sm font-bold text-slate-500">{label}</p>
    </div>
  );
}

function SidebarContent({ staffUser, allowedItems, activeSection, scope, onNavigate, showClose = false }) {
  return (
    <>
      <div className="flex h-[88px] items-center justify-between gap-3 border-b border-blue-500/60 px-6">
        <div className="flex min-w-0 items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-blue-500 to-teal-500 text-lg font-bold">A</div>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-extrabold">Akshar Estate</h1>
            <p className="text-xs text-blue-100">{staffUser.role === "admin" ? "Admin Panel" : "Supervisor Panel"}</p>
          </div>
        </div>
        {showClose && (
          <button
            type="button"
            onClick={onNavigate}
            className="grid h-9 w-9 place-items-center rounded-lg text-white/80 hover:bg-white/10"
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto px-3 py-6">
        {allowedItems.map(({ key, label, icon: Icon }) => (
          <Link
            key={key}
            to={`/${scope}/${key}`}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
              activeSection === key ? "bg-white/20 shadow-lg shadow-blue-950/20 scale-[1.02]" : "text-blue-50 hover:bg-white/10 active:scale-[0.98]"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <div className="border-t border-blue-500/70 p-6">
        <div className="rounded-xl bg-white/15 p-4">
          <p className="text-xs">Need Help?</p>
          <p className="mt-2 text-sm font-bold">View Documentation</p>
        </div>
      </div>
    </>
  );
}

function AdminSearchBar({ scope }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const term = query.trim();
    if (term.length < 2) {
      const resetTimer = window.setTimeout(() => {
        setSuggestions([]);
        setLoading(false);
      }, 0);
      return () => window.clearTimeout(resetTimer);
    }
    let active = true;
    const timer = window.setTimeout(() => {
      setLoading(true);
      staffApi
        .properties(buildQuery({ search: term }))
        .then((response) => {
          if (!active) return;
          setSuggestions((response.data || []).slice(0, 6));
          setOpen(true);
        })
        .catch(() => {
          if (active) setSuggestions([]);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    }, 280);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [query]);

  const submit = () => {
    const term = query.trim();
    if (!term) return;
    setOpen(false);
    navigate(`/${scope}/properties?search=${encodeURIComponent(term)}`);
  };

  const clear = () => {
    setQuery("");
    setSuggestions([]);
    setOpen(false);
  };

  return (
    <div className="relative hidden w-full max-w-[460px] sm:block">
      <div className="flex h-12 items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 shadow-sm transition focus-within:border-blue-300 focus-within:shadow-[0_0_0_4px_rgba(37,99,235,0.10)]">
        <Search className="h-5 w-5 shrink-0 text-slate-400" />
        <input
          className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
          placeholder="Search by property name, ID, city, area, developer, status..."
          value={query}
          onChange={(event) => {
            setQuery(event.target.value);
            setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") submit();
            if (event.key === "Escape") clear();
          }}
        />
        {loading && <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600" />}
        {query && (
          <button type="button" onClick={clear} className="grid h-7 w-7 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700" aria-label="Clear search">
            <X size={15} />
          </button>
        )}
      </div>
      {open && query.trim().length >= 2 && (
        <div className="absolute left-0 right-0 top-full z-[90] mt-2 overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl">
          {suggestions.length ? (
            suggestions.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate(`/${scope}/properties?propertyId=${item._id}&open=edit`);
                }}
                className="flex w-full items-center gap-3 border-b border-slate-50 px-4 py-3 text-left transition hover:bg-blue-50"
              >
                <img src={item.image || item.gallery?.[0] || "https://placehold.co/80x80?text=AETP"} alt="" className="h-10 w-10 rounded-xl object-cover" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-extrabold text-slate-950">{item.title}</span>
                  <span className="block truncate text-xs font-semibold text-slate-500">{item.propertyCode || item.city || item.location} · {item.status}</span>
                </span>
              </button>
            ))
          ) : (
            <div className="px-4 py-5 text-center text-sm font-bold text-slate-500">{loading ? "Searching..." : "No results found"}</div>
          )}
          <button type="button" onClick={submit} className="block w-full bg-slate-50 px-4 py-3 text-left text-xs font-extrabold uppercase tracking-wide text-blue-600 hover:bg-blue-50">
            Search all results for "{query.trim()}"
          </button>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon: Icon, label, value, trend, color = "blue" }) {
  const colors = {
    blue: "from-blue-500 to-blue-700",
    purple: "from-purple-500 to-fuchsia-600",
    green: "from-emerald-500 to-green-600",
    teal: "from-teal-500 to-cyan-600",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] transition-shadow duration-200 hover:shadow-[0_10px_28px_rgba(15,23,42,0.14)] sm:p-5">
      <div className="flex items-start justify-between">
        <div className={`grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br ${colors[color]} text-white sm:h-12 sm:w-12`}>
          <Icon size={20} className="sm:hidden" />
          <Icon size={23} className="hidden sm:block" />
        </div>
        {trend && <span className="text-xs font-semibold text-emerald-600 sm:text-sm">{trend}</span>}
      </div>
      <p className="mt-3 text-xs text-slate-500 sm:mt-4 sm:text-sm">{label}</p>
      <p className="mt-0.5 text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{value}</p>
    </div>
  );
}

function notificationRoute(item, scope) {
  const category = String(item.category || item.type || "").toLowerCase();
  const referenceType = String(item.referenceType || item.type || "").toLowerCase();
  const referenceId = item.referenceId || item.metadata?.propertyId || item.metadata?.enquiryId;
  if ((category === "sold" || category === "rented" || category.includes("commission") || category.includes("payment")) && referenceId) {
    return `/${scope}/sold-rented?dealId=${referenceId}`;
  }
  if (referenceType === "property" && referenceId) return `/${scope}/properties?propertyId=${referenceId}&open=edit`;
  if (referenceType === "enquiry" && referenceId) return `/${scope}/enquiries?enquiryId=${referenceId}`;
  if (category.includes("analytics") || category.includes("commission") || category.includes("payment")) return `/${scope}/analytics`;
  return "";
}

function notificationVisual(item) {
  const category = String(item.category || item.type || "general").toLowerCase();
  if (category === "sold") return { icon: Check, color: "bg-emerald-100 text-emerald-700", label: "Sold" };
  if (category === "rented") return { icon: Home, color: "bg-cyan-100 text-cyan-700", label: "Rented" };
  if (category.includes("enquiry")) return { icon: MessageSquare, color: "bg-blue-100 text-blue-700", label: "Enquiry" };
  if (category.includes("property")) return { icon: Building2, color: "bg-purple-100 text-purple-700", label: "Property" };
  return { icon: Bell, color: "bg-slate-100 text-slate-700", label: labelize(category) || "Update" };
}

function NotificationsPanel({ data, scope, onClose, onReload }) {
  const navigate = useNavigate();
  const [fallbackItem, setFallbackItem] = useState(null);
  const markOne = async (item) => {
    await staffApi.markNotificationRead(item._id);
    await onReload();
    const route = notificationRoute(item, scope);
    if (route) {
      onClose();
      navigate(route);
      return;
    }
    setFallbackItem(item);
  };
  const markAll = async () => {
    await staffApi.markAllNotificationsRead();
    onReload();
  };

  return (
    <div className="fixed left-4 right-4 top-20 z-50 w-[min(94vw,470px)] overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_24px_70px_rgba(15,23,42,0.22)] sm:left-auto sm:right-6">
      <div className="border-b border-slate-100 bg-gradient-to-br from-white to-blue-50/70 px-5 py-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-base font-extrabold text-slate-950">Notifications</p>
            <p className="mt-0.5 text-xs font-semibold text-slate-500">{data.unreadCount || 0} unread updates</p>
          </div>
          <button type="button" onClick={markAll} className="rounded-full bg-white px-3 py-1.5 text-xs font-extrabold text-blue-600 shadow-sm ring-1 ring-blue-100 transition hover:bg-blue-50">
            Mark all read
          </button>
        </div>
      </div>
      <div className="max-h-[72vh] space-y-2 overflow-y-auto bg-slate-50/70 p-3 sm:max-h-[520px]">
        {data.notifications?.length ? (
          data.notifications.map((item) => <NotificationCard key={item._id} item={item} onClick={() => markOne(item)} />)
        ) : (
          <EmptyState title="No notifications yet" description="Important property, enquiry, and deal updates will appear here." />
        )}
      </div>
      {fallbackItem && <NotificationFallbackModal item={fallbackItem} onClose={() => setFallbackItem(null)} />}
    </div>
  );
}

function NotificationCard({ item, onClick }) {
  const visual = notificationVisual(item);
  const Icon = visual.icon;
  const related = item.metadata?.propertyName || item.metadata?.customerName || item.description;
  return (
    <button
      type="button"
      onClick={onClick}
      className={`group w-full rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:border-blue-200 hover:bg-white hover:shadow-md ${item.read ? "border-slate-100 bg-white" : "border-blue-100 bg-white shadow-sm"}`}
    >
      <div className="flex gap-3">
        <span className={`grid h-11 w-11 shrink-0 place-items-center rounded-2xl ${visual.color}`}>
          <Icon size={19} />
        </span>
        <span className="min-w-0 flex-1">
          <span className="flex items-start justify-between gap-3">
            <span className="min-w-0">
              <span className="block truncate text-sm font-extrabold text-slate-950">{item.title}</span>
              <span className="mt-1 block line-clamp-2 text-sm leading-5 text-slate-600">{item.description || "New activity update"}</span>
            </span>
            {!item.read && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-blue-600 shadow-[0_0_0_4px_rgba(37,99,235,0.12)]" />}
          </span>
          <span className="mt-3 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-1 text-[11px] font-extrabold ${visual.color}`}>{visual.label}</span>
            {item.priority === "high" && <span className="rounded-full bg-rose-50 px-2.5 py-1 text-[11px] font-extrabold text-rose-600">High Priority</span>}
            <span className="text-[11px] font-bold text-slate-400">{formatDate(item.createdAt)}</span>
          </span>
          {related && <span className="mt-2 block truncate text-xs font-semibold text-slate-500">{related} · {item.actorName || "System"}</span>}
        </span>
      </div>
    </button>
  );
}

function NotificationFallbackModal({ item, onClose }) {
  return (
    <div className="fixed inset-0 z-[700] grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-950">{item.title}</h3>
            <p className="mt-1 text-sm text-slate-500">No linked route was found for this update.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="mt-5 rounded-2xl bg-slate-50 p-4">
          <OwnerCell label="Description" value={item.description || "Activity update"} />
          <div className="mt-4 grid grid-cols-2 gap-4">
            <OwnerCell label="Type" value={labelize(item.category || item.type)} />
            <OwnerCell label="Actor" value={item.actorName || "System"} />
            <OwnerCell label="Status" value={item.status ? labelize(item.status) : item.read ? "Read" : "Unread"} />
            <OwnerCell label="Date" value={formatDate(item.createdAt)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePanel({ user, onClose, onSaved, onLogout }) {
  const [form, setForm] = useState({ name: user.name || "", email: user.email || "", phone: user.phone || "", designation: user.designation || "", avatar: user.avatar || "", coverImage: user.coverImage || "" });
  const [passwords, setPasswords] = useState({ currentPassword: "", newPassword: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const updatePassword = (event) => setPasswords((current) => ({ ...current, [event.target.name]: event.target.value }));
  const uploadAvatar = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setSaving(true);
    try {
      const response = await staffApi.uploadAvatar(file);
      setForm((current) => ({ ...current, avatar: response.data.url }));
      onSaved({ ...user, ...form, avatar: response.data.url });
      setMessage("Profile image updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };
  const uploadCover = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setError("");
    setSaving(true);
    try {
      const response = await staffApi.uploadCover(file);
      setForm((current) => ({ ...current, coverImage: response.data.url }));
      onSaved({ ...user, ...form, coverImage: response.data.url });
      setMessage("Cover image updated.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };
  const removeCover = async () => {
    setError("");
    setSaving(true);
    try {
      await staffApi.removeCover();
      setForm((current) => ({ ...current, coverImage: "" }));
      onSaved({ ...user, ...form, coverImage: "" });
      setMessage("Cover image removed.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const saveProfile = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const response = await staffApi.updateProfile(form);
      onSaved(response.user);
      setMessage("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const changePassword = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      await staffApi.changePassword(passwords);
      await onLogout();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed left-4 right-4 top-20 z-50 w-[min(94vw,430px)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl sm:left-auto sm:right-6">
      <div className="relative h-24 bg-gradient-to-r from-blue-700 to-cyan-500">
        {form.coverImage && <img src={form.coverImage} alt="" className="h-full w-full object-cover" />}
        <button type="button" onClick={onClose} className="absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-lg bg-white/90 text-slate-700 hover:bg-white"><X size={17} /></button>
      </div>
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="-mt-10 grid h-16 w-16 place-items-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-blue-600 to-purple-600 text-white shadow-lg">
            {form.avatar ? <img src={form.avatar} alt={form.name} className="h-full w-full object-cover" /> : <User size={20} />}
          </span>
          <div>
            <p className="font-extrabold text-slate-950">{user.name}</p>
            <p className="text-xs capitalize text-slate-500">{user.role}</p>
          </div>
        </div>
      </div>
      <div className="max-h-[75vh] overflow-y-auto p-5 sm:max-h-[72vh]">
        {message && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</p>}
        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}
        <form onSubmit={saveProfile} className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200">
              <Upload size={17} /> Profile photo
              <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-50 px-4 py-3 text-sm font-bold text-blue-700 hover:bg-blue-100">
              <Upload size={17} /> Cover photo
              <input type="file" accept="image/*" className="hidden" onChange={uploadCover} />
            </label>
            {form.coverImage && <button type="button" onClick={removeCover} className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-bold text-rose-600 hover:bg-rose-100">Remove cover</button>}
          </div>
          <Field label="Name" name="name" value={form.name} onChange={update} required />
          <Field label="Email" name="email" type="email" value={form.email} onChange={update} required />
          <Field label="Contact Number" name="phone" value={form.phone} onChange={update} />
          <Field label="Designation" name="designation" value={form.designation} onChange={update} />
          <button disabled={saving} className="wf-btn wf-btn-primary w-full">{saving ? "Saving..." : "Save Profile"}</button>
        </form>
        <form onSubmit={changePassword} className="mt-6 space-y-4 border-t border-slate-100 pt-5">
          <h4 className="font-extrabold text-slate-950">Change Password</h4>
          <Field label="Current Password" name="currentPassword" type="password" value={passwords.currentPassword} onChange={updatePassword} required />
          <Field label="New Password" name="newPassword" type="password" value={passwords.newPassword} onChange={updatePassword} required />
          <button disabled={saving} className="wf-btn wf-btn-secondary w-full">Update Password</button>
        </form>
      </div>
    </div>
  );
}

function DashboardSection({ scope }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    staffApi.dashboard()
      .then((response) => {
        if (!active) return;
        setData(response.data);
        setError("");
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message || "Unable to load dashboard data.");
        setData(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const metrics = data?.metrics || {};
  const quick = data?.quickStats || {};
  const supervisorMode = Boolean(data?.supervisorMode);

  return (
    <>
      <PageTitle
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening today."
        action={<Link to={`/${scope}/analytics`} className="wf-btn wf-btn-primary w-full sm:w-auto">View Analytics</Link>}
      />
      <InlineAlert message={error} />
      {loading && <LoadingState label="Loading dashboard data..." />}

      {!loading && !error && <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={Building2} color="purple" label={supervisorMode ? "My Properties" : "Total Properties"} value={metrics.totalProperties ?? 0} />
        <StatCard icon={MessageSquare} label={supervisorMode ? "My Enquiries" : "Total Enquiries"} value={metrics.totalEnquiries ?? 0} />
        <StatCard icon={Users} color="green" label="Conversion Rate" value={`${metrics.conversionRate ?? 0}%`} />
        <StatCard icon={Home} color="teal" label="Active Listings" value={metrics.activeListings ?? 0} />
        <StatCard icon={Check} color="green" label="Sold / Rented" value={`${metrics.soldCount ?? 0} / ${metrics.rentedCount ?? 0}`} />
      </div>}

      {!loading && !error && <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-6">
          <h3 className="text-lg font-bold sm:text-xl">Recent Activity</h3>
          <div className="mt-5 space-y-4 sm:mt-6 sm:space-y-5">
            {(data?.recentActivity || []).length === 0 && <p className="py-6 text-center text-sm text-slate-500">No recent activity.</p>}
            {(data?.recentActivity || []).map((item) => (
              <div key={item._id} className="flex gap-3">
                <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-blue-50 sm:h-9 sm:w-9">
                  <span className="h-2.5 w-2.5 rounded-full bg-blue-600" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-semibold text-blue-600">{item.title}</p>
                    <p className="shrink-0 text-[11px] text-slate-400">{formatDate(item.createdAt)}</p>
                  </div>
                  <p className="mt-0.5 text-sm text-slate-700">{item.description}</p>
                  <p className="mt-0.5 text-xs text-slate-500">{item.actorName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-blue-800 p-5 text-white shadow-[0_10px_28px_rgba(15,23,42,0.22)] sm:p-6">
          <h3 className="text-lg font-bold sm:text-xl">Quick Stats</h3>
          <div className="mt-5 space-y-5 sm:mt-6 sm:space-y-6">
            <QuickStat label={supervisorMode ? "Assigned Properties" : "Pending Approvals"} value={quick.pendingApprovals ?? 0} />
            <QuickStat label={supervisorMode ? "Active My Listings" : "Active Supervisors"} value={supervisorMode ? quick.activeSupervisors ?? 0 : quick.activeSupervisors ?? 0} />
            <QuickStat label="New Enquiries Today" value={quick.newEnquiriesToday ?? 0} />
          </div>
          <Link to="/admin/analytics" className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/25 active:scale-[0.98]">View All Details</Link>
        </div>
      </div>}

      {!loading && !error && <div className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
        <DashboardList title="Recent Leads" items={(data?.recentLeads || []).map((item) => ({
          id: item._id,
          title: item.name,
          subtitle: item.propertyTitle || item.preferredLocation || "General enquiry",
          meta: item.status,
        }))} />
        <DashboardList title="Recent Properties" items={(data?.recentProperties || []).map((item) => ({
          id: item._id,
          title: item.title,
          subtitle: item.location,
          meta: item.status,
        }))} />
        <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
          <h3 className="text-xl font-bold">Property Type Stats</h3>
          <div className="mt-6 space-y-4">
            {(data?.propertyTypeStats || []).map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-600">{item.label}</span>
                  <span className="text-slate-500">{item.value}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${Math.min(100, item.value * 20)}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>}

      {!loading && !error && (data?.supervisorPerformance || []).length > 0 && (
        <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-6 shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
          <h3 className="text-xl font-bold">Supervisor Performance</h3>
          {/* Desktop Table */}
          <div className="mt-6 hidden md:block">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-slate-500">
                <tr><th className="py-3">Supervisor</th><th className="px-3 py-3">Properties</th><th className="px-3 py-3">Leads</th><th className="px-3 py-3">Conversions</th><th className="px-3 py-3">Status</th></tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.supervisorPerformance.map((item) => (
                  <tr key={item._id} className="transition-colors hover:bg-slate-50/60">
                    <td className="py-4"><p className="font-bold text-slate-950">{item.name}</p><p className="text-xs text-slate-500">{item.email}</p></td>
                    <td className="px-3 py-4 font-semibold text-blue-600">{item.propertiesAdded}</td>
                    <td className="px-3 py-4">{item.leadsHandled}</td>
                    <td className="px-3 py-4">{item.convertedLeads}</td>
                    <td className="px-3 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Card View */}
          <div className="mt-5 space-y-3 md:hidden">
            {data.supervisorPerformance.map((item) => (
              <div key={item._id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-bold text-slate-950">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.email}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 rounded-lg bg-white p-3 text-center">
                  <div><p className="text-lg font-semibold text-blue-600">{item.propertiesAdded}</p><p className="text-[11px] text-slate-500">Properties</p></div>
                  <div><p className="text-lg font-semibold text-slate-800">{item.leadsHandled}</p><p className="text-[11px] text-slate-500">Leads</p></div>
                  <div><p className="text-lg font-semibold text-emerald-600">{item.convertedLeads}</p><p className="text-[11px] text-slate-500">Converted</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

function QuickStat({ label, value }) {
  return (
    <div>
      <p className="text-xs text-blue-200 sm:text-sm">{label}</p>
      <p className="mt-0.5 text-2xl font-semibold sm:text-3xl">{value}</p>
    </div>
  );
}

function DashboardList({ title, items }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-6">
      <h3 className="text-lg font-bold sm:text-xl">{title}</h3>
      <div className="mt-5 space-y-3">
        {items.length ? items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 rounded-xl bg-slate-50 p-3.5 transition-colors hover:bg-slate-100/70 sm:p-4">
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-950">{item.title}</p>
              <p className="mt-0.5 truncate text-xs text-slate-500">{item.subtitle}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[11px] font-semibold capitalize ${statusClass(item.meta)}`}>{item.meta}</span>
          </div>
        )) : <p className="py-4 text-center text-sm text-slate-500">No data yet.</p>}
      </div>
    </div>
  );
}

function PropertiesSection({ canDelete, canCreate }) {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const focusedPropertyId = searchParams.get("propertyId");
  const initialSearch = searchParams.get("search") || "";
  const [properties, setProperties] = useState([]);
  const [filters, setFilters] = useState({ search: initialSearch, propertyCode: "", city: "all", type: "all", newProject: "all", minPrice: "", maxPrice: "", status: "all", availability: "all" });
  const [filterOptions, setFilterOptions] = useState({ cities: [], types: [] });
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const load = async (nextFilters = filters) => {
    setLoading(true);
    try {
      setError("");
      const response = await staffApi.properties(buildQuery(nextFilters));
      setProperties(response.data);
      setFilterOptions((current) => ({
        cities: uniqueOptions([...response.data, ...current.cities.map((city) => ({ city }))], (item) => item.city),
        types: uniqueOptions([...response.data, ...current.types.map((type) => ({ type }))], (item) => item.type),
      }));
    } catch (err) {
      setError(err.message || "Unable to load properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    staffApi
      .properties(buildQuery({ search: initialSearch }))
      .then((response) => {
        if (!active) return;
        setProperties(response.data);
        setFilterOptions({
          cities: uniqueOptions(response.data, (item) => item.city),
          types: uniqueOptions(response.data, (item) => item.type),
        });
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load properties.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [initialSearch]);

  useEffect(() => {
    const timer = window.setTimeout(() => setFilters((current) => ({ ...current, search: initialSearch })), 0);
    return () => window.clearTimeout(timer);
  }, [initialSearch]);

  useEffect(() => {
    if (!focusedPropertyId || editing || !properties.length) return;
    const match = properties.find((item) => item._id === focusedPropertyId);
    if (!match) return;
    const timer = window.setTimeout(() => setEditing(match), 0);
    return () => window.clearTimeout(timer);
  }, [editing, focusedPropertyId, properties]);

  const closeEditing = () => {
    setEditing(null);
    if (focusedPropertyId) navigate(location.pathname, { replace: true });
  };

  const remove = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    try {
      setError("");
      await staffApi.deleteProperty(id);
      load();
    } catch (err) {
      setError(err.message || "Unable to delete property.");
    }
  };

  const updateFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value }));
  const clearFilters = () => {
    const next = { search: "", propertyCode: "", city: "all", type: "all", newProject: "all", minPrice: "", maxPrice: "", status: "all", availability: "all" };
    setFilters(next);
    load(next);
  };

  return (
    <>
      <PageTitle
        title="Property Management"
        subtitle="Manage all properties and listings"
        action={canCreate ? <button onClick={() => setEditing(emptyProperty)} className="wf-btn wf-btn-primary w-full sm:w-auto"><Plus size={18} /> Add Property</button> : null}
      />
      <InlineAlert message={error} />
      <InlineAlert message={notice} tone="green" />
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_0.85fr_0.8fr_0.8fr_0.9fr_0.7fr_0.7fr_0.8fr_0.9fr_auto_auto]">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <input className="wf-input pl-10" value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Search name/location..." />
          </div>
          <input className="wf-input uppercase" value={filters.propertyCode} onChange={(event) => updateFilter("propertyCode", event.target.value.toUpperCase())} placeholder="Property ID" />
          <select className="wf-input" value={filters.city} onChange={(event) => updateFilter("city", event.target.value)}>
            <option value="all">All Cities</option>
            {filterOptions.cities.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
          <select className="wf-input" value={filters.type} onChange={(event) => updateFilter("type", event.target.value)}>
            <option value="all">All Types</option>
            {filterOptions.types.map((type) => <option key={type} value={type}>{type}</option>)}
          </select>
          <select className="wf-input" value={filters.newProject} onChange={(event) => updateFilter("newProject", event.target.value)}>
            <option value="all">All Listings</option>
            <option value="true">New Projects Only</option>
            <option value="false">Standard Listings</option>
          </select>
          <input className="wf-input" type="number" min="0" step="0.01" value={filters.minPrice} onChange={(event) => updateFilter("minPrice", event.target.value)} placeholder="Min Cr" />
          <input className="wf-input" type="number" min="0" step="0.01" value={filters.maxPrice} onChange={(event) => updateFilter("maxPrice", event.target.value)} placeholder="Max Cr" />
          <select className="wf-input" value={filters.status} onChange={(event) => updateFilter("status", event.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
          <select className="wf-input" value={filters.availability} onChange={(event) => updateFilter("availability", event.target.value)}>
            <option value="all">Availability</option>
            <option value="available">Available</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
          <button onClick={() => load()} className="wf-btn wf-btn-secondary w-full"><Filter size={17} /> Filter</button>
          <button onClick={clearFilters} className="wf-btn wf-btn-secondary w-full"><X size={17} /> Clear</button>
        </div>
      </div>

      {/* Desktop Table - hidden on mobile/tablet */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-600">
            <tr>
              <th className="px-6 py-4">Property</th>
              <th className="px-4 py-4">Location</th>
              <th className="px-4 py-4">Price</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4">Owner</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {properties.map((property) => (
              <tr key={property._id} className="align-middle transition-colors hover:bg-slate-50/60">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <img src={property.image || property.gallery?.[0] || "https://placehold.co/120x120?text=Property"} alt={property.title} className="h-14 w-14 rounded-xl object-cover ring-1 ring-slate-100" />
                    <div>
                      <p className="font-semibold text-slate-950">{property.title}</p>
                      <div className="mt-1 flex flex-wrap items-center gap-1.5">
                        <p className="text-xs text-slate-400">ID: {property.propertyCode || property._id.slice(-6).toUpperCase()}</p>
                        {property.isNewProject && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-blue-700">New Project</span>}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{property.location}</td>
                <td className="px-4 py-4 font-semibold text-blue-600">{formatINR(property.priceAmount || property.price)}</td>
                <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(property.status)}`}>{property.status}</span></td>
                <td className="px-4 py-4 text-sm text-slate-700">{property.ownerName}</td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => setEditing(property)} className="grid h-9 w-9 place-items-center rounded-lg text-blue-600 transition hover:bg-blue-50" aria-label="Edit property"><Edit3 size={17} /></button>
                    {canDelete && <button onClick={() => remove(property._id)} className="grid h-9 w-9 place-items-center rounded-lg text-red-500 transition hover:bg-red-50" aria-label="Delete property"><Trash2 size={17} /></button>}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && !properties.length && (
              <tr><td colSpan="6" className="px-6 py-10"><EmptyState title="No properties found" description="Create a listing or adjust your filters to see matching results." /></td></tr>
            )}
          </tbody>
        </table>
        {loading && <p className="p-6 text-sm font-bold text-slate-500">Loading properties...</p>}
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-4">
        {loading && <p className="p-6 text-center text-sm font-bold text-slate-500">Loading properties...</p>}
        {properties.map((property) => (
          <div key={property._id} className="group rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
            <div className="flex gap-4">
              <img src={property.image || property.gallery?.[0] || "https://placehold.co/120x120?text=Property"} alt={property.title} className="h-20 w-20 shrink-0 rounded-xl object-cover ring-1 ring-slate-100 sm:h-24 sm:w-24" />
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h4 className="truncate text-base font-bold text-slate-950">{property.title}</h4>
                    <div className="mt-1 flex flex-wrap items-center gap-1.5">
                      <p className="text-xs text-slate-400">ID: {property.propertyCode || property._id.slice(-6).toUpperCase()}</p>
                      {property.isNewProject && <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wide text-blue-700">New Project</span>}
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(property.status)}`}>{property.status}</span>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                  <span className="flex items-center gap-1.5 text-slate-600"><Building2 size={14} className="text-slate-400" />{property.location || "—"}</span>
                  <span className="font-semibold text-blue-600">{formatINR(property.priceAmount || property.price)}</span>
                </div>
                {property.ownerName && <p className="mt-1.5 text-xs text-slate-500">Owner: {property.ownerName}</p>}
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 border-t border-slate-100 pt-3">
              <button onClick={() => setEditing(property)} className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-blue-50 px-4 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"><Edit3 size={15} /> Edit</button>
              {canDelete && <button onClick={() => remove(property._id)} className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"><Trash2 size={15} /> Delete</button>}
            </div>
          </div>
        ))}
        {!loading && !properties.length && <EmptyState title="No properties found" description="Create a listing or adjust your filters to see matching results." />}
      </div>

      {editing && <PropertyModal property={editing} onClose={closeEditing} onSaved={() => { setNotice(editing._id ? "Property updated successfully." : "Property created successfully."); closeEditing(); load(); }} />}
    </>
  );
}

function PropertyModal({ property, onClose, onSaved }) {
  const { staffUser } = useStaffAuth();
  const [supervisors, setSupervisors] = useState([]);
  const [cmsOptions, setCmsOptions] = useState({ navbarAreas: defaultNavbarAreas, navbarTopLists: defaultTopLists });
  const [masterOptions, setMasterOptions] = useState(propertyOptionGroups);
  const [form, setForm] = useState(() => ({
    ...emptyProperty,
    ...property,
    measurement: { ...emptyProperty.measurement, ...(property.measurement || {}) },
    contact: { ...emptyProperty.contact, ...(property.contact || {}) },
    map: { ...emptyProperty.map, ...(property.map || {}) },
    seo: { ...emptyProperty.seo, ...(property.seo || {}) },
    amenities: property.amenities || [],
    features: property.features || [],
    facilities: property.facilities || [],
    highlights: property.highlights || [],
    propertyTags: property.propertyTags || [],
    gallery: property.gallery || [],
  }));
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [propertyCodeTouched, setPropertyCodeTouched] = useState(Boolean(property.propertyCode));
  const [propertyCodeLoading, setPropertyCodeLoading] = useState(false);
  const maxImageSizeMb = 15;

  useEffect(() => {
    let active = true;
    staffApi.propertyOptions()
      .then((response) => {
        if (!active) return;
        setMasterOptions((current) => Object.fromEntries(Object.entries({ ...current, ...response.data }).map(([group, options]) => [
          group,
          options.map((item) => typeof item === "object" ? item.value : item),
        ])));
      })
      .catch(() => setError("Unable to load saved dropdown options. Existing choices are still available."));
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (staffUser.role !== "admin") return;
    let active = true;
    staffApi.staff().then((response) => {
      if (active) setSupervisors(response.data.filter((item) => item.role === "supervisor"));
    }).catch(() => {});
    return () => {
      active = false;
    };
  }, [staffUser.role]);

  useEffect(() => {
    let active = true;
    publicApi.content()
      .then((response) => {
        if (!active) return;
        const mapped = response.data.reduce((acc, item) => ({ ...acc, [item.key]: item.value }), {});
        setCmsOptions({
          navbarAreas: Array.isArray(mapped.navbarAreas) ? mapped.navbarAreas : defaultNavbarAreas,
          navbarTopLists: Array.isArray(mapped.navbarTopLists) ? mapped.navbarTopLists : defaultTopLists,
        });
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const areaOptions = useMemo(() => [...new Set([...(masterOptions.locations || []), ...cmsOptions.navbarAreas.map(normalizeAreaName).filter(Boolean)])], [cmsOptions.navbarAreas, masterOptions.locations]);
  const topProjectOptions = useMemo(() => enabledSorted(cmsOptions.navbarTopLists, "project").map((item) => item.title).filter(Boolean), [cmsOptions.navbarTopLists]);
  const topDeveloperOptions = useMemo(() => enabledSorted(cmsOptions.navbarTopLists, "developer").map((item) => item.title).filter(Boolean), [cmsOptions.navbarTopLists]);
  const developerOptions = useMemo(() => [...new Set([...(masterOptions.developers || []), ...topDeveloperOptions])], [masterOptions.developers, topDeveloperOptions]);
  const projectOptions = useMemo(() => [...new Set([...(masterOptions.projects || []), ...topProjectOptions])], [masterOptions.projects, topProjectOptions]);
  const cityOptions = useMemo(() => [...new Set([...(masterOptions.cities || []), ...cmsOptions.navbarAreas.map((item) => (typeof item === "object" ? item.city : "Ahmedabad")).filter(Boolean)])], [cmsOptions.navbarAreas, masterOptions.cities]);

  const addMasterOption = async (group, value) => {
    const nextValue = String(value || "").trim().replace(/\s+/g, " ");
    if (!nextValue) return "";
    const response = await staffApi.createPropertyOption({ group, value: nextValue });
    const saved = response.data.value;
    setMasterOptions((current) => ({
      ...current,
      [group]: [...new Set([...(current[group] || []), saved])].sort((a, b) => a.localeCompare(b)),
    }));
    setNotice(`${saved} added to ${labelize(group)}.`);
    return saved;
  };

  useEffect(() => {
    if (form._id || propertyCodeTouched) return undefined;
    let active = true;
    const timer = window.setTimeout(() => {
      setPropertyCodeLoading(true);
      staffApi
        .nextPropertyCode({ city: form.city || form.map?.city || "Ahmedabad", location: form.location })
        .then((response) => {
          if (!active) return;
          setForm((current) => current._id || propertyCodeTouched ? current : { ...current, propertyCode: response.data?.propertyCode || current.propertyCode });
        })
        .catch(() => {})
        .finally(() => {
          if (active) setPropertyCodeLoading(false);
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [form._id, form.city, form.location, form.map?.city, propertyCodeTouched]);

  const updatePath = (path, value) => {
    const keys = path.split(".");
    setForm((current) => {
      const next = { ...current };
      let cursor = next;
      keys.slice(0, -1).forEach((key) => {
        cursor[key] = { ...(cursor[key] || {}) };
        cursor = cursor[key];
      });
      cursor[keys.at(-1)] = value;
      return next;
    });
  };

  const update = (event) => {
    const { name, value, type, checked } = event.target;
    setFieldErrors((current) => {
      if (!current[name]) return current;
      const next = { ...current };
      delete next[name];
      return next;
    });
    if (name === "propertyCode") setPropertyCodeTouched(true);
    const numberFields = ["beds", "baths", "sqft", "yearBuilt", "measurement.value", "map.latitude", "map.longitude"];
    const rawValue = name === "propertyCode" ? value.toUpperCase() : value;
    const nextValue = type === "checkbox" ? checked : numberFields.includes(name) ? (rawValue === "" ? null : Number(rawValue)) : rawValue;
    updatePath(name, nextValue);
    if (name === "category" && String(value).trim().toLowerCase() === "new projects") {
      updatePath("isNewProject", true);
    }
    if (["price", "finalPrice", "commission"].includes(name)) {
      updatePath(`${name}Amount`, parseINRAmount(value));
    }
    if (name === "status" && ["sold", "rented"].includes(value)) {
      setDealModalOpen(true);
    }
  };

  const addGalleryUrl = () => {
    setForm((current) => ({ ...current, gallery: [...current.gallery, ""] }));
  };

  const updateGallery = (index, value) => {
    setForm((current) => {
      const gallery = [...current.gallery];
      gallery[index] = value;
      return { ...current, gallery, image: current.image || value };
    });
  };

  const removeGallery = (index) => {
    setForm((current) => {
      const gallery = current.gallery.filter((_, itemIndex) => itemIndex !== index);
      return { ...current, gallery, image: current.image === current.gallery[index] ? gallery[0] || "" : current.image };
    });
  };

  const moveGallery = (index, direction) => {
    setForm((current) => {
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= current.gallery.length) return current;
      const gallery = [...current.gallery];
      [gallery[index], gallery[nextIndex]] = [gallery[nextIndex], gallery[index]];
      return { ...current, gallery };
    });
  };

  const handleFiles = (event) => {
    const files = Array.from(event.target.files || []);
    const valid = [];
    const rejected = [];
    files.forEach((file) => {
      if (!file.type.startsWith("image/")) rejected.push(`${file.name} is not an image`);
      else if (file.size > maxImageSizeMb * 1024 * 1024) rejected.push(`${file.name} is larger than ${maxImageSizeMb}MB`);
      else valid.push({ file, preview: URL.createObjectURL(file), id: `${file.name}-${file.lastModified}-${Math.random()}` });
    });
    if (rejected.length) setError(rejected.join(". "));
    if (valid.length) setPendingFiles((current) => [...current, ...valid].slice(0, 12));
    event.target.value = "";
  };

  const removePendingFile = (id) => {
    setPendingFiles((current) => {
      const match = current.find((item) => item.id === id);
      if (match) URL.revokeObjectURL(match.preview);
      return current.filter((item) => item.id !== id);
    });
  };

  const saveProperty = async (nextForm = form) => {
    setError("");
    setNotice("");
    const requiredFields = [
      ["title", "Property title"],
      ["location", "Area / location"],
      ["city", "City"],
      ["type", "Property type"],
      ["category", "Property category"],
      ["dealType", "Deal type"],
      ["price", "Price"],
    ];
    const missingFields = Object.fromEntries(requiredFields.filter(([name]) => !String(nextForm[name] || "").trim()).map(([name, label]) => [name, `${label} is required.`]));
    if (Object.keys(missingFields).length) {
      setFieldErrors(missingFields);
      setError("Please complete the highlighted required fields before saving.");
      return;
    }
    const requiresDeal = ["sold", "rented"].includes(nextForm.status);
    const missingDeal = requiresDeal && [
      ["finalPrice", "Final sold/rented price"],
      ["commission", "Commission amount"],
      ["dealCustomerName", "Customer name"],
      ["dealCustomerPhone", "Customer phone"],
      ["dealDate", "Deal date"],
    ].filter(([key]) => !String(nextForm[key] || "").trim()).map(([, label]) => label);
    if (missingDeal?.length) {
      setError(`${missingDeal.join(", ")} ${missingDeal.length === 1 ? "is" : "are"} required for ${labelize(nextForm.status)} properties.`);
      setDealModalOpen(true);
      return;
    }
    setUploading(true);
    try {
      const propertyCode = String(nextForm.propertyCode || "").trim().toUpperCase();
      if (propertyCode) {
        const availability = await staffApi.checkPropertyCode(propertyCode, nextForm._id ? { excludeId: nextForm._id } : {});
        if (!availability.data?.available) {
          throw new Error("Property ID already exists. Please use a unique Property ID.");
        }
      }
      let uploadedUrls = [];
      if (pendingFiles.length) {
        const response = await staffApi.uploadPropertyImages(pendingFiles.map((item) => item.file));
        uploadedUrls = response.data.urls;
      }
      const gallery = [...nextForm.gallery.map((item) => item.trim()).filter(Boolean), ...uploadedUrls];
      if (!nextForm.image && !gallery[0]) {
        throw new Error("Please add at least one property image.");
      }
      const measurementValue = nextForm.measurement?.value || nextForm.sqft || 0;
      const measurementUnit = nextForm.measurement?.unit || "sqft";
      const payload = {
        ...nextForm,
        status: nextForm.status || "active",
        visibility: nextForm.visibility || "public",
        source: nextForm.source || "pricing",
        tag: nextForm.tag || "Standard",
        isNewProject: Boolean(nextForm.isNewProject || String(nextForm.category || "").trim().toLowerCase() === "new projects"),
        propertyCode,
        image: nextForm.image || gallery[0],
        gallery,
        assignedTo: typeof nextForm.assignedTo === "object" ? nextForm.assignedTo?._id || null : nextForm.assignedTo || null,
        dealEnquiryId: nextForm.dealSource === "enquiry" ? nextForm.dealEnquiryId || null : null,
        measurement: { ...nextForm.measurement, unit: nextForm.measurement?.unit || "sqft", value: measurementValue },
        sqft: nextForm.sqft || (measurementUnit === "sqft" ? measurementValue : 0),
        area: nextForm.area || `${measurementValue} ${measurementUnit}`,
        badge: nextForm.badge || nextForm.tag,
      };
      if (nextForm._id) await staffApi.updateProperty(nextForm._id, payload);
      else await staffApi.createProperty(payload);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  const save = async (event) => {
    event.preventDefault();
    await saveProperty(form);
  };

  const submitDeal = async (dealData) => {
    const nextForm = { ...form, ...dealData };
    setForm(nextForm);
    setDealModalOpen(false);
    await saveProperty(nextForm);
  };

  const descriptionSuggestions = [
    "Verified listing with transparent details and guided site visits.",
    "Well connected to daily conveniences, business hubs, and key roads.",
    "A strong option for end users and long-term investors alike.",
  ];

  const appendDescriptionSuggestion = (suggestion) => {
    setForm((current) => ({ ...current, description: `${current.description.trim()}${current.description.trim() ? " " : ""}${suggestion}` }));
  };

  return (
    <div className="fixed inset-0 z-[500] grid place-items-center bg-slate-950/50 p-4">
      <form onSubmit={save} noValidate className="flex max-h-[94vh] w-full max-w-7xl flex-col overflow-hidden rounded-[1.75rem] bg-slate-50 shadow-2xl">
        <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-slate-200 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">Property CRM</p>
            <h3 className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">{form._id ? "Edit Property" : "Create New Property"}</h3>
            <p className="mt-1 text-sm text-slate-500">Build a complete, reusable listing with guided fields and smart content tools.</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="wf-smooth-scroll flex-1 overflow-y-auto p-4 pb-28 sm:p-6">
        {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p>}
        {notice && <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{notice}</p>}
        {uploading && <p className="mb-4 rounded-xl bg-blue-50 p-3 text-sm font-bold text-blue-700">Uploading images and saving property...</p>}

        <div className="space-y-6">
          <FormSection title="Basic Details" subtitle="Start with the essential listing identity. Required fields are marked and validated before save.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Property Title" name="title" value={form.title} onChange={update} required error={fieldErrors.title} placeholder="e.g. Premium 3 BHK Apartment in Thaltej" helperText="Use a clear, client-friendly listing title." />
              <ComboField label="Property Type" name="type" value={form.type} options={masterOptions.propertyTypes} onChange={update} required error={fieldErrors.type} placeholder="Select Property Type" masterGroup="propertyTypes" onAddOption={addMasterOption} />
              <OptionSelect label="Property Category" name="category" value={form.category} options={masterOptions.category} onChange={update} required error={fieldErrors.category} masterGroup="category" onAddOption={addMasterOption} />
              <ToggleField label="New Projects" name="isNewProject" checked={form.isNewProject} onChange={update} />
              <Field label="Owner / Seller" name="ownerName" value={form.ownerName} onChange={update} placeholder="Owner or seller name" />
	              <ComboField label="Developer / Builder" name="developerName" value={form.developerName} options={developerOptions} onChange={update} placeholder="Select or type developer" masterGroup="developers" onAddOption={addMasterOption} />
	              <ComboField label="Top Project" name="topProject" value={form.topProject} options={projectOptions} onChange={update} placeholder="Select linked project" masterGroup="projects" onAddOption={addMasterOption} />
            </div>
          </FormSection>

          <FormSection title="Pricing & Deal" subtitle="Capture the commercial positioning and current deal stage. ROI is available as a reusable deal type.">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <MoneyField label="Price" name="price" value={form.priceAmount || form.price} onChange={update} required error={fieldErrors.price} helperText="Enter the numeric INR amount." />
              <OptionSelect label="Price Unit" name="priceUnit" value={form.priceUnit} options={masterOptions.priceUnits} onChange={update} masterGroup="priceUnits" onAddOption={addMasterOption} />
              <ComboField label="Deal Type" name="dealType" value={form.dealType} options={masterOptions.dealTypes} onChange={update} required error={fieldErrors.dealType} placeholder="Select Deal Type" masterGroup="dealTypes" onAddOption={addMasterOption} />
              <Field label="ROI" name="roi" value={form.roi} onChange={update} placeholder="e.g. 8.5% yearly" helperText="Useful for pre-leased and investment properties." />
	              <SearchableDropdown label="Listing Status" name="status" value={form.status} onChange={update} placeholder="Select Listing Status" options={(masterOptions.listingStatuses || []).map((value) => ({ label: labelize(value), value }))} masterGroup="listingStatuses" onAddOption={addMasterOption} />
              <OptionSelect label="Availability" name="availability" value={form.availability} options={masterOptions.availability} onChange={update} masterGroup="availability" onAddOption={addMasterOption} />
              <OptionSelect label="Brokerage / Commission Type" name="brokerageType" value={form.brokerageType} options={masterOptions.brokerageType} onChange={update} masterGroup="brokerageType" onAddOption={addMasterOption} />
              <Field label="Payment / Costing Details" name="paymentDetails" value={form.paymentDetails} onChange={update} placeholder="Token, loan, pending dues" />
              <Field label="Property ID" name="propertyCode" value={form.propertyCode} onChange={update} placeholder={propertyCodeLoading ? "Generating next Property ID..." : "Auto: AETP-AHMD-0001"} />
            </div>
          </FormSection>

          <FormSection title="Location" subtitle="Choose an existing area or add one once and reuse it for future listings.">
            <div className="grid gap-4 md:grid-cols-2">
              <LocationAutocompleteField
                label="Area / Location"
                name="location"
                value={form.location}
                options={areaOptions}
                onChange={update}
                required
                error={fieldErrors.location}
                placeholder="Search or select property location"
                masterGroup="locations"
                onAddOption={addMasterOption}
                onPlaceSelect={(place) => {
                  updatePath("location", place.area || place.address || "");
                  updatePath("city", place.city || form.city || "");
                  updatePath("map.address", place.address || "");
                  updatePath("map.area", place.area || "");
                  updatePath("map.city", place.city || "");
                  updatePath("map.state", place.state || "");
                  updatePath("map.pincode", place.pincode || "");
                  updatePath("map.latitude", place.lat ?? null);
                  updatePath("map.longitude", place.lng ?? null);
                  updatePath("map.placeId", place.placeId || "");
                }}
              />
              <ComboField label="City" name="city" value={form.city} options={cityOptions} onChange={update} required error={fieldErrors.city} placeholder="Select City" masterGroup="cities" onAddOption={addMasterOption} />
              <Field label="Map Address" name="map.address" value={form.map.address} onChange={update} placeholder="Full address for map and site visits" />
              <Field label="Pincode" name="map.pincode" value={form.map.pincode} onChange={update} />
              <Field label="State" name="map.state" value={form.map.state} onChange={update} />
              <Field label="Map Embed URL" name="map.embedUrl" value={form.map.embedUrl} onChange={update} />
            </div>
          </FormSection>

	          <FormSection title="SEO / Visibility" subtitle="Publishing controls stay simple. Ahmedabad-focused search metadata is generated automatically on each public property page.">
	            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
	              <ComboField label="Top Developer" name="topDeveloper" value={form.topDeveloper} options={developerOptions} onChange={update} placeholder="Select linked developer" masterGroup="developers" onAddOption={addMasterOption} />
	              <SearchableDropdown label="Visibility" name="visibility" value={form.visibility} onChange={update} placeholder="Select Visibility" options={[{ label: "Public website", value: "public" }, { label: "Admin only", value: "private" }]} />
	              <SearchableDropdown label="Client-side Source" name="source" value={form.source} onChange={update} placeholder="Select Source" options={[{ label: "Pricing/Listings", value: "pricing" }, { label: "Home Featured", value: "home" }]} />
	              <SearchableDropdown label="Display Tag" name="tag" value={form.tag} onChange={update} placeholder="Select Display Tag" options={masterOptions.displayTags} masterGroup="displayTags" onAddOption={addMasterOption} />
	              <ToggleField label="Featured Property" name="featured" checked={form.featured} onChange={update} />
              {staffUser.role === "admin" && (
                <div className="md:col-span-2 lg:col-span-3">
                  <SearchableDropdown
                    label="Assign Supervisor"
                    name="assignedTo"
                    value={form.assignedTo?._id || form.assignedTo || ""}
                    onChange={update}
                    placeholder="Unassigned / Admin owned"
                    options={[{ label: "Unassigned / Admin owned", value: "" }, ...supervisors.map((item) => ({ label: `${item.name} (${item.status})`, value: item._id }))]}
                  />
                </div>
              )}
	              <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4 md:col-span-2 lg:col-span-3">
	                <p className="text-sm font-extrabold text-blue-900">Automatic property SEO</p>
	                <p className="mt-1 text-xs font-semibold leading-5 text-blue-700">Meta title, meta description, Ahmedabad-focused keywords, Open Graph tags, canonical URL, and property structured data are generated from the saved listing automatically.</p>
	              </div>
            </div>
          </FormSection>

          <FormSection title="Media Gallery" subtitle="Upload/select multiple images, preview them, and reorder the public gallery.">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <div>
                <Field label="Primary Image URL" name="image" value={form.image} onChange={update} placeholder="Optional if selecting image files" />
                <div className="mt-4">
                  <Field label="Video URL" name="videoUrl" value={form.videoUrl} onChange={update} placeholder="YouTube, Instagram, or hosted walkthrough URL" helperText="Optional. Add a property walkthrough without leaving the gallery workflow." />
                </div>
                <div className="mt-4 rounded-2xl border border-dashed border-slate-200 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                    <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200">
                      <Upload size={17} />
                      Select Images
                      <input type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />
                    </label>
                    <button type="button" onClick={addGalleryUrl} className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50">
                      <Plus size={17} />
                      Add URL
                    </button>
                  </div>
                  <p className="mt-3 text-xs font-semibold text-slate-500">Up to 12 images, 15MB each. Files are uploaded separately, so property save will not hit JSON payload limits.</p>
                  {pendingFiles.length > 0 && (
                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      {pendingFiles.map((item) => (
                        <div key={item.id} className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-3">
                          <img src={item.preview} alt="" className="h-16 w-16 rounded-lg object-cover" />
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-bold text-slate-800">{item.file.name}</p>
                            <p className="text-xs text-slate-500">{(item.file.size / 1024 / 1024).toFixed(2)} MB pending upload</p>
                          </div>
                          <button type="button" onClick={() => removePendingFile(item.id)} className="rounded-lg border border-red-100 bg-white px-3 py-2 text-xs font-bold text-red-600">Remove</button>
                        </div>
                      ))}
                    </div>
                  )}
                  <div className="mt-4 space-y-3">
                    {form.gallery.map((item, index) => (
                      <div key={`${item}-${index}`} className="grid gap-3 rounded-xl border border-slate-100 bg-slate-50 p-3 md:grid-cols-[88px_1fr_auto] md:items-center">
                        <img src={item || form.image || "https://placehold.co/160x120?text=Image"} alt="" className="h-20 w-20 rounded-xl object-cover" />
                        <input className="wf-input bg-white" value={item} onChange={(event) => updateGallery(index, event.target.value)} placeholder="Image URL or uploaded file preview" />
                        <div className="flex gap-2">
                          <button type="button" onClick={() => moveGallery(index, -1)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold">Up</button>
                          <button type="button" onClick={() => moveGallery(index, 1)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-bold">Down</button>
                          <button type="button" onClick={() => removeGallery(index)} className="rounded-lg border border-red-100 px-3 py-2 text-sm font-bold text-red-600">Remove</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                <img src={form.image || form.gallery[0] || "https://placehold.co/500x420?text=Preview"} alt="Preview" className="h-40 w-full object-cover sm:h-48" />
                <div className="p-4">
                  <p className="font-bold text-slate-950">{form.title || "Property preview"}</p>
                  <p className="mt-1 text-sm text-slate-500">{form.location || "Location"}</p>
                </div>
              </div>
            </div>
          </FormSection>

	          <FormSection title="Property Specifications" subtitle="Structured measurements and attributes used across cards and detail pages.">
            <div className="grid gap-4 md:grid-cols-3">
              <ComboField label="BHK / Bedrooms" name="beds" value={String(form.beds ?? "")} options={masterOptions.bhk} onChange={update} placeholder="Select BHK" masterGroup="bhk" onAddOption={addMasterOption} />
              <Field label="Bathrooms" name="baths" type="number" value={form.baths} onChange={update} />
              <Field label="Legacy Sqft" name="sqft" type="number" value={form.sqft} onChange={update} />
              <Field label="Measurement Value" name="measurement.value" type="number" value={form.measurement.value ?? ""} onChange={update} />
	              <SearchableDropdown label="Measurement Unit" name="measurement.unit" value={form.measurement.unit} onChange={update} placeholder="Select Measurement Unit" options={(masterOptions.measurementUnits || []).map((value) => ({ label: labelize(value), value }))} masterGroup="measurementUnits" onAddOption={addMasterOption} />
              <OptionSelect label="Property Status" name="propertyStatus" value={form.propertyStatus} options={masterOptions.propertyStatus} onChange={update} masterGroup="propertyStatus" onAddOption={addMasterOption} />
              <OptionSelect label="Construction Status" name="constructionStatus" value={form.constructionStatus} options={masterOptions.constructionStatus} onChange={update} masterGroup="constructionStatus" onAddOption={addMasterOption} />
              <OptionSelect label="Possession Status" name="possessionStatus" value={form.possessionStatus} options={masterOptions.possessionStatus} onChange={update} masterGroup="possessionStatus" onAddOption={addMasterOption} />
	              <OptionSelect label="Facing" name="facing" value={form.facing} options={masterOptions.facing} onChange={update} masterGroup="facing" onAddOption={addMasterOption} />
	              <OptionSelect label="Ownership" name="ownership" value={form.ownership} options={masterOptions.ownership} onChange={update} masterGroup="ownership" onAddOption={addMasterOption} />
              <ComboField label="Floor Number" name="floorNumber" value={form.floorNumber} options={masterOptions.floors} onChange={update} masterGroup="floors" onAddOption={addMasterOption} />
              <ComboField label="Total Floors" name="totalFloors" value={form.totalFloors} options={masterOptions.floors} onChange={update} masterGroup="floors" onAddOption={addMasterOption} />
              <ComboField label="Parking" name="parking" value={form.parking} options={masterOptions.parking} onChange={update} placeholder="Select Parking" masterGroup="parking" onAddOption={addMasterOption} />
              <OptionSelect label="Furnishing" name="furnishing" value={form.furnishing} options={masterOptions.furnishing} onChange={update} masterGroup="furnishing" onAddOption={addMasterOption} />
              <Field label="Year Built" name="yearBuilt" type="number" value={form.yearBuilt ?? ""} onChange={update} />
            </div>
          </FormSection>

          <FormSection title="Features & Amenities" subtitle="Select reusable options or add a new master item once for future listings.">
            <div className="space-y-6">
              <SelectableTagGroup label="Amenities" value={form.amenities} options={masterOptions.amenities} masterGroup="amenities" onAddOption={addMasterOption} onChange={(items) => setForm((current) => ({ ...current, amenities: items }))} />
              <SelectableTagGroup label="Property Features" value={form.features} options={masterOptions.features} masterGroup="features" onAddOption={addMasterOption} onChange={(items) => setForm((current) => ({ ...current, features: items }))} />
              <SelectableTagGroup label="Facilities" value={form.facilities} options={masterOptions.facilities} masterGroup="facilities" onAddOption={addMasterOption} onChange={(items) => setForm((current) => ({ ...current, facilities: items }))} />
              <SelectableTagGroup label="Highlights" value={form.highlights} options={masterOptions.highlights} masterGroup="highlights" onAddOption={addMasterOption} onChange={(items) => setForm((current) => ({ ...current, highlights: items }))} />
              <SelectableTagGroup label="Property Tags" value={form.propertyTags} options={masterOptions.propertyTags} masterGroup="propertyTags" onAddOption={addMasterOption} onChange={(items) => setForm((current) => ({ ...current, propertyTags: items }))} />
            </div>
          </FormSection>

	          <FormSection title="Contact & Internal Notes" subtitle="Optional CRM-only deal, contact, and mapping fields for the sales team.">
            <div className="grid gap-4 md:grid-cols-3">
              <ToggleField label="Pre-Leased" name="isPreLeased" checked={form.isPreLeased} onChange={update} />
              <ToggleField label="Barter Available" name="isBarter" checked={form.isBarter} onChange={update} />
              <MoneyField label="Final Sale/Rent Price" name="finalPrice" value={form.finalPriceAmount || form.finalPrice} onChange={update} />
              <MoneyField label="Commission / Brokerage" name="commission" value={form.commissionAmount || form.commission} onChange={update} />
              <Field label="Contact Name" name="contact.name" value={form.contact.name} onChange={update} />
              <Field label="Contact Phone" name="contact.phone" value={form.contact.phone} onChange={update} />
              <Field label="Contact Email" name="contact.email" type="email" value={form.contact.email} onChange={update} />
              <Field label="Map Area" name="map.area" value={form.map.area} onChange={update} />
              <Field label="Map City" name="map.city" value={form.map.city} onChange={update} />
              <Field label="Latitude" name="map.latitude" type="number" value={form.map.latitude ?? ""} onChange={update} />
              <Field label="Longitude" name="map.longitude" type="number" value={form.map.longitude ?? ""} onChange={update} />
              <Field label="Google Place ID" name="map.placeId" value={form.map.placeId} onChange={update} />
              <label className="md:col-span-3">
                <span className="wf-label">Status / Closing Notes</span>
                <textarea className="wf-input min-h-24" name="statusRemarks" value={form.statusRemarks} onChange={update} placeholder="Closing remarks, payment notes, or status context" />
              </label>
            </div>
	          </FormSection>

	          <FormSection title="Description" subtitle="Generate the final client-ready narrative after the listing details, media, and amenities are complete.">
	            <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-4 sm:p-5">
	              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
	                <div>
	                  <p className="text-sm font-extrabold text-slate-900">Ahmedabad-focused professional listing copy</p>
	                  <p className="mt-1 text-xs font-semibold text-slate-500">Uses property identity, deal, project, builder, location, price, measurement, ownership, furnishing, amenities, and features.</p>
	                </div>
	                <button type="button" onClick={() => setForm((current) => ({ ...current, description: generatePropertyDescription(current) }))} className="wf-btn wf-btn-primary shrink-0">
	                  <Sparkles size={16} /> Auto Generate Description
	                </button>
	              </div>
	              <textarea className="wf-input mt-4 min-h-40 bg-white leading-6" name="description" value={form.description} onChange={update} placeholder="Write a natural, premium property description or generate a complete starting point above." />
	              <div className="mt-3 flex flex-wrap gap-2">
	                {descriptionSuggestions.map((suggestion) => (
	                  <button key={suggestion} type="button" onClick={() => appendDescriptionSuggestion(suggestion)} className="rounded-full border border-blue-100 bg-white px-3 py-1.5 text-left text-xs font-bold text-blue-700 hover:bg-blue-50">
	                    + {suggestion}
	                  </button>
	                ))}
	              </div>
	            </div>
	          </FormSection>
        </div>
        </div>
        <FormFooterActions
          onCancel={onClose}
          disabled={uploading}
          submitLabel={uploading ? "Saving..." : form._id ? "Update Property" : "Save Property"}
        />
      </form>
      {dealModalOpen && (
        <PropertyDealModal
          property={form}
          onClose={() => setDealModalOpen(false)}
          onSubmit={submitDeal}
          saving={uploading}
        />
      )}
    </div>
  );
}

function PropertyDealModal({ property, onClose, onSubmit, saving }) {
  const dealStatus = property.status === "rented" ? "rented" : "sold";
  const [enquiries, setEnquiries] = useState([]);
  const [form, setForm] = useState({
    status: dealStatus,
    dealSource: property.dealSource || "manual",
    dealEnquiryId: property.dealEnquiryId?._id || property.dealEnquiryId || "",
    finalPrice: property.finalPrice || property.price || "",
    finalPriceAmount: property.finalPriceAmount || parseINRAmount(property.finalPrice || property.price),
    commission: property.commission || "",
    commissionAmount: property.commissionAmount || parseINRAmount(property.commission),
    dealCustomerName: property.dealCustomerName || "",
    dealCustomerPhone: property.dealCustomerPhone || "",
    dealCustomerEmail: property.dealCustomerEmail || "",
    dealCustomerAddress: property.dealCustomerAddress || "",
    dealDate: property.dealDate ? formatDate(property.dealDate) : formatDate(new Date()),
    paymentDetails: property.paymentDetails || "",
    statusRemarks: property.statusRemarks || "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!property._id) return;
    let active = true;
    staffApi.enquiries(buildQuery({ propertyId: property._id }))
      .then((response) => {
        if (active) setEnquiries(response.data || []);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, [property._id]);

  const applyEnquiry = (enquiryId) => {
    const enquiry = enquiries.find((item) => item._id === enquiryId);
    setForm((current) => ({
      ...current,
      dealSource: "enquiry",
      dealEnquiryId: enquiryId,
      dealCustomerName: enquiry?.name || current.dealCustomerName,
      dealCustomerPhone: enquiry?.phone || current.dealCustomerPhone,
      dealCustomerEmail: enquiry?.email || current.dealCustomerEmail,
      finalPrice: current.finalPrice || property.price || "",
      finalPriceAmount: current.finalPriceAmount || parseINRAmount(property.price),
    }));
  };

  const update = (event) => {
    const { name, value } = event.target;
    if (name === "dealSource") {
      setForm((current) => ({ ...current, dealSource: value, dealEnquiryId: value === "manual" ? "" : current.dealEnquiryId }));
      return;
    }
    if (name === "dealEnquiryId") {
      applyEnquiry(value);
      return;
    }
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "finalPrice" ? { finalPriceAmount: parseINRAmount(value) } : {}),
      ...(name === "commission" ? { commissionAmount: parseINRAmount(value) } : {}),
    }));
  };

  const submit = (event) => {
    event.preventDefault();
    setError("");
    const required = [
      ["finalPrice", "Final sold/rented price"],
      ["commission", "Commission amount"],
      ["dealCustomerName", "Customer name"],
      ["dealCustomerPhone", "Customer phone"],
      ["dealDate", "Deal date"],
    ];
    const missing = required.filter(([key]) => !String(form[key] || "").trim()).map(([, label]) => label);
    if (form.dealSource === "enquiry" && !form.dealEnquiryId) missing.push("Linked enquiry");
    if (missing.length) {
      setError(`${missing.join(", ")} ${missing.length === 1 ? "is" : "are"} required.`);
      return;
    }
    onSubmit({
      ...form,
      dealEnquiryId: form.dealSource === "enquiry" ? form.dealEnquiryId : "",
    });
  };

  return (
    <div className="fixed inset-0 z-[650] grid place-items-center bg-slate-950/60 p-4">
      <form onSubmit={submit} className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-950">Complete {labelize(form.status)} Details</h3>
            <p className="mt-1 text-sm text-slate-500">{property.title} · {property.city || property.location || "Property Management"}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="wf-smooth-scroll flex-1 overflow-y-auto p-5 pb-28 sm:p-6">
        <InlineAlert message={error} />

        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Property Details</p>
                <h4 className="mt-1 text-lg font-extrabold text-slate-950">{property.title}</h4>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(property.status || "")}`}>{labelize(property.status)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <OwnerCell label="City / Location" value={[property.city, property.location].filter(Boolean).join(", ") || "Not specified"} />
              <OwnerCell label="Property ID" value={property.propertyCode || "Will be generated"} />
              <OwnerCell label="Property Type" value={property.type || property.category || "Not specified"} />
              <OwnerCell label="Category" value={property.category || "Not specified"} />
              <OwnerCell label="Listed Price" value={formatINR(property.priceAmount || property.price)} />
            </div>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Deal Source</p>
            <div className="mt-4 grid gap-3">
              <SearchableDropdown label="Source" name="dealSource" value={form.dealSource} onChange={update} options={[{ label: "Manual / Face-to-face Deal", value: "manual" }, { label: "Enquiry-based Deal", value: "enquiry" }]} />
              {form.dealSource === "enquiry" && (
                <SearchableDropdown
                  label="Linked Enquiry"
                  name="dealEnquiryId"
                  value={form.dealEnquiryId}
                  onChange={update}
                  placeholder="Select enquiry"
                  options={[{ label: "Select enquiry", value: "" }, ...enquiries.map((item) => ({ label: `${item.name} · ${item.phone || item.email || item.status}`, value: item._id }))]}
                />
              )}
              {form.dealSource === "enquiry" && !enquiries.length && (
                <p className="rounded-xl bg-white/80 p-3 text-sm font-semibold text-slate-500">No linked enquiries found for this property. Switch to manual if the deal happened offline.</p>
              )}
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <SearchableDropdown label="Deal Status" name="status" value={form.status} onChange={update} required options={[{ label: "Sold", value: "sold" }, { label: "Rented", value: "rented" }]} />
          <MoneyField label="Final Sold/Rented Price" name="finalPrice" value={form.finalPriceAmount || form.finalPrice} onChange={update} required />
          <MoneyField label="Commission Amount" name="commission" value={form.commissionAmount || form.commission} onChange={update} required />
          <Field label="Deal Date" name="dealDate" type="date" value={form.dealDate} onChange={update} required />
          <Field label="Customer / Buyer / Tenant Name" name="dealCustomerName" value={form.dealCustomerName} onChange={update} required />
          <Field label="Customer Phone" name="dealCustomerPhone" value={form.dealCustomerPhone} onChange={update} required />
          <Field label="Customer Email" name="dealCustomerEmail" type="email" value={form.dealCustomerEmail} onChange={update} />
          <label>
            <span className="wf-label">Customer Address</span>
            <input className="wf-input" name="dealCustomerAddress" value={form.dealCustomerAddress} onChange={update} placeholder="Buyer/tenant address" />
          </label>
          <label className="md:col-span-2">
            <span className="wf-label">Payment / Booking Remarks</span>
            <textarea className="wf-input min-h-24" name="paymentDetails" value={form.paymentDetails} onChange={update} placeholder="Token, payment schedule, booking terms..." />
          </label>
          <label className="md:col-span-2">
            <span className="wf-label">Extra Remarks / Notes</span>
            <textarea className="wf-input min-h-24" name="statusRemarks" value={form.statusRemarks} onChange={update} placeholder="Internal notes, pending documents, handover details..." />
          </label>
        </div>

        </div>
        <FormFooterActions
          onCancel={onClose}
          disabled={saving}
          submitLabel={saving ? "Saving..." : `Save ${labelize(form.status)} Deal`}
        />
      </form>
    </div>
  );
}

function FormSection({ title, subtitle, children }) {
  return (
    <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-5">
        <h4 className="text-base font-extrabold text-slate-950 sm:text-lg">{title}</h4>
        {subtitle && <p className="mt-1 text-xs text-slate-500 sm:text-sm">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function FormFooterActions({ onCancel, disabled, cancelLabel = "Cancel", submitLabel = "Save", resetLabel, onReset }) {
  return (
    <div className="sticky bottom-0 z-10 border-t border-slate-100 bg-white/95 px-4 py-3 shadow-[0_-12px_30px_rgba(15,23,42,0.08)] backdrop-blur sm:px-6">
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-end">
        {resetLabel && (
          <button type="button" onClick={onReset} className="wf-btn wf-btn-secondary w-full sm:w-auto" disabled={disabled}>
            {resetLabel}
          </button>
        )}
        <button type="button" onClick={onCancel} className="wf-btn wf-btn-secondary w-full sm:w-auto" disabled={disabled}>
          {cancelLabel}
        </button>
        <button type="submit" className="wf-btn wf-btn-primary w-full sm:w-auto" disabled={disabled}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = "text", required = false, placeholder = "", helperText = "", error = "" }) {
  return (
    <label>
      <span className="wf-label">{label}{required && <span className="ml-1 text-red-500">*</span>}</span>
      <input className={`wf-input ${error ? "border-red-300 bg-red-50/30" : ""}`} name={name} type={type} value={value ?? ""} onChange={onChange} required={required} placeholder={placeholder} aria-invalid={Boolean(error)} />
      {(error || helperText) && <span className={`mt-1.5 block text-xs font-semibold ${error ? "text-red-600" : "text-slate-400"}`}>{error || helperText}</span>}
    </label>
  );
}

function ComboField({ label, name, value, onChange, options = [], required = false, placeholder = "", helperText = "", error = "", masterGroup, onAddOption }) {
  return (
    <SearchableDropdown
      label={label}
      name={name}
      value={value}
      options={options}
      onChange={onChange}
      required={required}
      placeholder={placeholder || `Select or type ${label.toLowerCase()}`}
      allowCustom
      helperText={helperText}
      error={error}
      masterGroup={masterGroup}
      onAddOption={onAddOption}
    />
  );
}

function MoneyField({ label, name, value, onChange, required = false, placeholder = "0", helperText = "", error = "" }) {
  const handleChange = (event) => {
    onChange({
      target: {
        name,
        value: event.target.value,
        type: "text",
      },
    });
  };
  return (
    <label>
      <span className="wf-label">{label}{required && <span className="ml-1 text-red-500">*</span>}</span>
      <div className={`flex overflow-hidden rounded-xl border bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100 ${error ? "border-red-300" : "border-slate-200"}`}>
        <span className="grid w-12 place-items-center border-r border-slate-200 bg-slate-50 text-sm font-extrabold text-slate-700">₹</span>
        <input
          className="h-12 min-w-0 flex-1 bg-transparent px-3 text-sm font-medium text-slate-900 outline-none"
          name={name}
          type="number"
          min="0"
          step="1"
          value={moneyInputValue(value)}
          onChange={handleChange}
          required={required}
          placeholder={placeholder}
        />
      </div>
      {(error || helperText) && <span className={`mt-1.5 block text-xs font-semibold ${error ? "text-red-600" : "text-slate-400"}`}>{error || helperText}</span>}
    </label>
  );
}

function OptionSelect({ label, name, value, options, onChange, required = false, helperText = "", error = "", masterGroup, onAddOption }) {
  const normalizedOptions = options.map((option) => ({ label: option, value: option }));
  return (
    <SearchableDropdown
      label={label}
      name={name}
      value={value || ""}
      options={normalizedOptions}
      onChange={onChange}
      placeholder={`Select ${label}`}
      required={required}
      helperText={helperText}
      error={error}
      masterGroup={masterGroup}
      onAddOption={onAddOption}
    />
  );
}

function SearchableDropdown({ label, name, value, options = [], onChange, required = false, placeholder = "Select option", allowCustom = false, helperText = "", error = "", masterGroup = "", onAddOption }) {
  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const [position, setPosition] = useState(null);
  const [adding, setAdding] = useState(false);
  const [addValue, setAddValue] = useState("");
  const [addError, setAddError] = useState("");
  const [savingOption, setSavingOption] = useState(false);
  const normalized = useMemo(() => {
    return [...new Map(options.filter(Boolean).map((option) => {
      const item = typeof option === "object" ? option : { label: String(option), value: String(option) };
      return [String(item.value ?? item.label), { label: String(item.label ?? item.value), value: String(item.value ?? item.label), description: item.description || "" }];
    })).values()];
  }, [options]);
  const selected = normalized.find((item) => item.value === String(value ?? "")) || (value ? { label: String(value), value: String(value) } : null);
  const filtered = normalized.filter((item) => `${item.label} ${item.description}`.toLowerCase().includes(query.toLowerCase()));
  const customOption = allowCustom && !masterGroup && query.trim() && !normalized.some((item) => item.label.toLowerCase() === query.trim().toLowerCase() || item.value.toLowerCase() === query.trim().toLowerCase())
    ? [{ label: `Use "${query.trim()}"`, value: query.trim(), description: "Custom value" }]
    : [];
  const visibleOptions = [...filtered, ...customOption];
  const inputValue = open ? query : selected?.label || "";

  useEffect(() => {
    if (!open) return undefined;
    const updatePosition = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = Math.min(rect.width, window.innerWidth - 24);
      const left = Math.min(Math.max(12, rect.left), window.innerWidth - width - 12);
      const availableBelow = window.innerHeight - rect.bottom - 24;
      const availableAbove = rect.top - 24;
      const openAbove = availableBelow < 180 && availableAbove > availableBelow;
      setPosition({
        left,
        top: openAbove ? undefined : rect.bottom + 8,
        bottom: openAbove ? window.innerHeight - rect.top + 8 : undefined,
        width,
        maxHeight: Math.max(180, Math.min(320, openAbove ? availableAbove : availableBelow)),
      });
    };
    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    const timer = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      window.clearTimeout(timer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const close = (event) => {
      if (containerRef.current?.contains(event.target)) return;
      if (event.target.closest?.("[data-dropdown-portal='true']")) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  const emitChange = (nextValue) => {
    onChange({ target: { name, value: nextValue, type: "text" } });
    setOpen(false);
    setQuery("");
  };

  const saveNewOption = async () => {
    const nextValue = addValue.trim();
    if (!nextValue || !masterGroup || !onAddOption) return;
    setSavingOption(true);
    setAddError("");
    try {
      const saved = await onAddOption(masterGroup, nextValue);
      setAdding(false);
      setAddValue("");
      emitChange(saved);
    } catch (err) {
      setAddError(err.message || "Unable to save this option.");
    } finally {
      setSavingOption(false);
    }
  };

  const openDropdown = () => {
    setQuery("");
    setActiveIndex(0);
    setOpen(true);
  };

  const handleKeyDown = (event) => {
    if (!open && ["ArrowDown", "Enter", " "].includes(event.key)) {
      event.preventDefault();
      openDropdown();
      return;
    }
    if (!open) return;
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) => Math.min(index + 1, Math.max(visibleOptions.length - 1, 0)));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === "Enter") {
      event.preventDefault();
      const item = visibleOptions[activeIndex];
      if (item) emitChange(item.value);
      else if (allowCustom && query.trim()) emitChange(query.trim());
    }
  };

  return (
    <div ref={containerRef} className="relative" onKeyDown={handleKeyDown}>
      <span className="wf-label">{label}{required && <span className="ml-1 text-red-500">*</span>}</span>
      <div
        className={`flex h-12 w-full items-center gap-2 rounded-xl border bg-white px-3 text-left text-sm font-semibold text-slate-900 shadow-sm outline-none transition ${
          error ? "border-red-300 bg-red-50/30" : open ? "border-blue-500 ring-4 ring-blue-100" : "border-slate-200 hover:border-slate-300"
        }`}
      >
        <Search size={16} className="shrink-0 text-slate-400" />
        <input
          ref={inputRef}
          value={inputValue}
          onFocus={openDropdown}
          onClick={openDropdown}
          onChange={(event) => {
            const nextQuery = event.target.value;
            setQuery(nextQuery);
            setActiveIndex(0);
            setOpen(true);
            if (allowCustom && !masterGroup) onChange({ target: { name, value: nextQuery, type: "text" } });
          }}
          placeholder={placeholder}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? `${name}-dropdown-listbox` : undefined}
          autoComplete="off"
          aria-invalid={Boolean(error)}
        />
        {(query || value) && (
          <button
            type="button"
            className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            onClick={(event) => {
              event.stopPropagation();
              emitChange("");
            }}
            aria-label={`Clear ${label}`}
          >
            <X size={14} />
          </button>
        )}
        <button
          type="button"
          className="grid h-7 w-7 shrink-0 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700"
          onClick={(event) => {
            event.stopPropagation();
            if (open) setOpen(false);
            else openDropdown();
          }}
          aria-label={`Open ${label} options`}
        >
          <ChevronDown size={17} className={`transition ${open ? "rotate-180" : ""}`} />
        </button>
      </div>
      {(error || helperText) && <span className={`mt-1.5 block text-xs font-semibold ${error ? "text-red-600" : "text-slate-400"}`}>{error || helperText}</span>}
      {required && <input tabIndex={-1} className="pointer-events-none absolute h-px w-px opacity-0" value={value || ""} onChange={() => {}} required />}
      {open && position && createPortal(
        <div
          data-dropdown-portal="true"
          className="fixed z-[2000] flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_24px_60px_rgba(15,23,42,0.22)]"
          style={{ left: position.left, top: position.top, bottom: position.bottom, width: position.width, maxHeight: position.maxHeight }}
        >
          <div className="border-b border-slate-100 px-3 py-2">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-slate-400">{query ? `${visibleOptions.length} matching options` : "Start typing to search"}</p>
          </div>
          <div id={`${name}-dropdown-listbox`} role="listbox" className="wf-smooth-scroll min-h-0 flex-1 overflow-y-auto p-2">
            {visibleOptions.map((item, index) => {
              const isSelected = item.value === String(value ?? "");
              return (
                <button
                  key={`${item.value}-${index}`}
                  type="button"
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => emitChange(item.value)}
                  className={`flex w-full items-start justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    isSelected ? "bg-blue-50 text-blue-700" : index === activeIndex ? "bg-slate-100 text-slate-950" : "text-slate-700 hover:bg-slate-50"
                  }`}
                  role="option"
                  aria-selected={isSelected}
                >
                  <span>
                    <span className="block text-sm font-extrabold">{item.label}</span>
                    {item.description && <span className="mt-0.5 block text-xs font-semibold text-slate-500">{item.description}</span>}
                  </span>
                  {isSelected && <Check size={16} className="mt-0.5 shrink-0" />}
                </button>
              );
            })}
            {!visibleOptions.length && (
              <div className="rounded-xl bg-slate-50 px-3 py-4 text-center text-sm font-semibold text-slate-500">
                No matching options
              </div>
            )}
          </div>
          {masterGroup && onAddOption && (
            <div className="border-t border-slate-100 bg-slate-50/70 p-2">
              {adding ? (
                <div className="space-y-2">
                  <input
                    autoFocus
                    className="wf-input h-10 min-h-10 bg-white text-sm"
                    value={addValue}
                    onChange={(event) => setAddValue(event.target.value)}
                    onKeyDown={(event) => {
                      event.stopPropagation();
                      if (event.key === "Enter") {
                        event.preventDefault();
                        saveNewOption();
                      }
                    }}
                    placeholder={`New ${label.toLowerCase()}`}
                  />
                  {addError && <p className="text-xs font-bold text-red-600">{addError}</p>}
                  <div className="flex gap-2">
                    <button type="button" onClick={saveNewOption} disabled={savingOption || !addValue.trim()} className="flex-1 rounded-lg bg-blue-600 px-3 py-2 text-xs font-extrabold text-white disabled:opacity-50">{savingOption ? "Saving..." : "Save new item"}</button>
                    <button type="button" onClick={() => { setAdding(false); setAddValue(""); setAddError(""); }} className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-extrabold text-slate-600">Cancel</button>
                  </div>
                </div>
              ) : (
                <button type="button" onClick={() => { setAddValue(query.trim()); setAdding(true); }} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-extrabold text-blue-700 hover:bg-blue-50">
                  <Plus size={16} /> Add new {label.toLowerCase()}
                </button>
              )}
            </div>
          )}
        </div>,
        document.body
      )}
    </div>
  );
}

function parseGooglePlace(place) {
  const components = place.address_components || [];
  const byType = (type) => components.find((item) => item.types?.includes(type))?.long_name || "";
  const area = byType("sublocality_level_1") || byType("sublocality") || byType("neighborhood") || byType("route") || byType("locality");
  const city = byType("locality") || byType("administrative_area_level_3") || byType("administrative_area_level_2");
  const state = byType("administrative_area_level_1");
  const pincode = byType("postal_code");
  const lat = place.geometry?.location?.lat?.();
  const lng = place.geometry?.location?.lng?.();
  return {
    address: place.formatted_address || place.name || "",
    area,
    city,
    state,
    pincode,
    lat: Number.isFinite(lat) ? lat : null,
    lng: Number.isFinite(lng) ? lng : null,
    placeId: place.place_id || "",
  };
}

function loadGoogleMapsPlaces() {
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  if (!apiKey) return Promise.reject(new Error("Google Maps API key is not configured"));
  if (window.google?.maps?.places) return Promise.resolve(window.google);
  if (window.__aksharGoogleMapsPromise) return window.__aksharGoogleMapsPromise;
  window.__aksharGoogleMapsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector("script[data-akshar-google-maps='true']");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.google));
      existing.addEventListener("error", reject);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(apiKey)}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.aksharGoogleMaps = "true";
    script.onload = () => resolve(window.google);
    script.onerror = reject;
    document.head.appendChild(script);
  });
  return window.__aksharGoogleMapsPromise;
}

function LocationAutocompleteField({ label, name, value, options = [], onChange, onPlaceSelect, required = false, placeholder = "Search location", helperText = "", error = "", masterGroup, onAddOption }) {
  const inputRef = useRef(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
  const [mapsReady, setMapsReady] = useState(false);
  const [mapsError, setMapsError] = useState(() => (apiKey ? "" : "Manual mode: add VITE_GOOGLE_MAPS_API_KEY to enable Google suggestions."));

  useEffect(() => {
    if (!apiKey) {
      return undefined;
    }
    let active = true;
    loadGoogleMapsPlaces()
      .then(() => {
        if (active) setMapsReady(true);
      })
      .catch(() => {
        if (active) setMapsError("Manual mode: Google location suggestions are unavailable.");
      });
    return () => {
      active = false;
    };
  }, [apiKey]);

  useEffect(() => {
    if (!mapsReady || !inputRef.current || !window.google?.maps?.places) return undefined;
    const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
      componentRestrictions: { country: "in" },
      fields: ["address_components", "formatted_address", "geometry", "name", "place_id"],
      types: ["geocode", "establishment"],
    });
    const listener = autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      const parsed = parseGooglePlace(place);
      onChange({ target: { name, value: parsed.area || parsed.address, type: "text" } });
      onPlaceSelect?.(parsed);
    });
    return () => listener?.remove?.();
  }, [mapsReady, name, onChange, onPlaceSelect]);

  if (!apiKey || mapsError) {
    return (
      <div>
        <SearchableDropdown label={label} name={name} value={value} options={options} onChange={onChange} required={required} placeholder={placeholder} helperText={helperText} error={error} masterGroup={masterGroup} onAddOption={onAddOption} allowCustom />
        {mapsError && <p className="mt-1 text-xs font-semibold text-slate-400">{mapsError}</p>}
      </div>
    );
  }

  return (
    <label>
      <span className="wf-label">{label}{required && <span className="ml-1 text-red-500">*</span>}</span>
      <div className={`flex h-12 items-center gap-2 rounded-xl border bg-white px-3 shadow-sm transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-100 ${error ? "border-red-300" : "border-slate-200"}`}>
        <MapPin size={17} className="shrink-0 text-slate-400" />
        <input
          ref={inputRef}
          className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-slate-900 outline-none placeholder:text-slate-400"
          name={name}
          value={value || ""}
          onChange={onChange}
          required={required}
          placeholder={mapsReady ? placeholder : "Loading Google location search..."}
          aria-invalid={Boolean(error)}
        />
      </div>
      {(error || helperText) && <span className={`mt-1.5 block text-xs font-semibold ${error ? "text-red-600" : "text-slate-400"}`}>{error || helperText}</span>}
    </label>
  );
}

function SelectableTagGroup({ label, value = [], options, onChange, masterGroup, onAddOption }) {
  const [custom, setCustom] = useState("");
  const selected = new Set(value);
  const toggle = (option) => {
    onChange(selected.has(option) ? value.filter((item) => item !== option) : [...value, option]);
  };
  const addCustom = async () => {
    const next = custom.trim();
    if (!next) return;
    const saved = masterGroup && onAddOption ? await onAddOption(masterGroup, next) : next;
    if (!selected.has(saved)) onChange([...value, saved]);
    setCustom("");
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-extrabold text-slate-800">{label}</p>
          <p className="mt-1 text-xs text-slate-500">{value.length} selected</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <input className="wf-input h-10 min-w-0 sm:w-56" value={custom} onChange={(event) => setCustom(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addCustom(); } }} placeholder={`Add custom ${label.toLowerCase()}`} />
          <button type="button" onClick={addCustom} className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white sm:w-auto">Add</button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {options.map((option) => (
          <label key={option} className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-sm font-bold transition ${selected.has(option) ? "border-blue-200 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200"}`}>
            <input type="checkbox" checked={selected.has(option)} onChange={() => toggle(option)} className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
            {option}
          </label>
        ))}
      </div>
      {value.some((item) => !options.includes(item)) && (
        <div className="mt-4 flex flex-wrap gap-2">
          {value.filter((item) => !options.includes(item)).map((item) => (
            <button key={item} type="button" onClick={() => toggle(item)} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">
              {item} <X size={12} className="ml-1 inline" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ToggleField({ label, name, checked, onChange }) {
  return (
    <label className="flex flex-col gap-2 rounded-xl border border-slate-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-sm font-bold text-slate-700">{label}</span>
      <input name={name} type="checkbox" checked={Boolean(checked)} onChange={onChange} className="h-5 w-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
    </label>
  );
}

function SupervisorsSection() {
  const [staff, setStaff] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState(null);
  const [viewing, setViewing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const supervisors = staff.filter((item) => item.role === "supervisor");
  const activeCount = supervisors.filter((item) => item.status === "active").length;
  const visibleSupervisors = supervisors.filter((item) => {
    const search = query.trim().toLowerCase();
    const matchesQuery = !search || [item.name, item.email, item.phone, item.designation].some((value) => String(value || "").toLowerCase().includes(search));
    const matchesStatus = status === "all" || item.status === status;
    return matchesQuery && matchesStatus;
  });
  const totals = supervisors.reduce(
    (acc, item) => ({
      properties: acc.properties + (item.performance?.propertiesAdded || 0),
      leads: acc.leads + (item.performance?.leadsHandled || 0),
      conversions: acc.conversions + (item.performance?.convertedLeads || 0),
      activity: acc.activity + (item.performance?.activityCount || 0),
    }),
    { properties: 0, leads: 0, conversions: 0, activity: 0 }
  );

  const load = async () => {
    setLoading(true);
    try {
      setError("");
      const response = await staffApi.staff();
      setStaff(response.data);
    } catch (err) {
      setError(err.message || "Unable to load supervisors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    staffApi.staff()
      .then((response) => {
        if (!active) return;
        setStaff(response.data);
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load supervisors.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const toggleStatus = async (item) => {
    try {
      setError("");
      await staffApi.updateStaff(item._id, { status: item.status === "active" ? "disabled" : "active" });
      load();
    } catch (err) {
      setError(err.message || "Unable to update supervisor status.");
    }
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.name}? This cannot be undone.`)) return;
    try {
      setError("");
      await staffApi.deleteStaff(item._id);
      load();
    } catch (err) {
      setError(err.message || "Unable to delete supervisor.");
    }
  };

  return (
    <>
      <PageTitle
        title="Supervisor Management"
        subtitle="Create, permission, monitor, and manage property supervisors"
        action={<button onClick={() => setEditing({ role: "supervisor", status: "active", permissions: defaultSupervisorPermissions })} className="wf-btn wf-btn-primary w-full sm:w-auto"><Plus size={18} /> Create Supervisor</button>}
      />
      <InlineAlert message={error} />

      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        <StatCard icon={Shield} label="Total Supervisors" value={supervisors.length} />
        <StatCard icon={UserCheck} color="green" label="Active Supervisors" value={activeCount} />
        <StatCard icon={Building2} color="purple" label="Properties Added" value={totals.properties} />
        <StatCard icon={MessageSquare} color="teal" label="Leads Handled" value={totals.leads} />
      </div>

      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <input className="wf-input pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search supervisors..." />
          </div>
          <select className="wf-input w-full sm:w-40" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        {visibleSupervisors.map((item) => (
          <div key={item._id} className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
            <div className="h-24 bg-gradient-to-r from-blue-700 to-cyan-500">
              {item.coverImage && <img src={item.coverImage} alt="" className="h-full w-full object-cover" />}
            </div>
            <div className="p-4 sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="-mt-12 grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-purple-600 to-teal-600 text-white shadow-lg">
                  {item.avatar ? <img src={item.avatar} alt={item.name} className="h-full w-full object-cover" /> : <Shield size={28} />}
                </span>
                <div className="min-w-0">
                  <h3 className="truncate text-base font-bold sm:text-lg">{item.name}</h3>
                  <p className="mt-0.5 truncate text-xs text-slate-500 sm:text-sm">{item.email}</p>
                  {item.designation && <p className="mt-0.5 text-xs font-semibold text-blue-600">{item.designation}</p>}
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl bg-slate-50 p-3 sm:grid-cols-4 sm:p-4">
              <MiniMetric label="Properties" value={item.performance?.propertiesAdded || 0} />
              <MiniMetric label="Leads" value={item.performance?.leadsHandled || 0} />
              <MiniMetric label="Closed" value={item.performance?.convertedLeads || 0} />
              <MiniMetric label="Conversion" value={`${item.performance?.conversionRate || 0}%`} />
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {(item.permissions || []).slice(0, 3).map((permission) => (
                <span key={permission} className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-semibold text-blue-700">{permissionLabel(permission)}</span>
              ))}
              {(item.permissions || []).length > 3 && <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-500">+{item.permissions.length - 3} more</span>}
            </div>
            <div className="mt-4">
              <PasswordReveal value={item.passwordPlain} />
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-4">
              <button onClick={() => setViewing(item)} className="flex items-center justify-center gap-1.5 rounded-xl bg-slate-100 px-3 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-200 sm:text-sm"><Eye size={15} /> View</button>
              <button onClick={() => setEditing(item)} className="flex items-center justify-center gap-1.5 rounded-xl bg-blue-600 px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 sm:text-sm"><Edit3 size={15} /> Edit</button>
              <button onClick={() => toggleStatus(item)} className={`flex items-center justify-center gap-1.5 rounded-xl px-3 py-2.5 text-xs font-semibold transition sm:text-sm ${item.status === "active" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>{item.status === "active" ? "Disable" : "Activate"}</button>
              <button onClick={() => remove(item)} className="flex items-center justify-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100 sm:text-sm"><Trash2 size={15} /></button>
            </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <p className="mt-6 text-sm font-bold text-slate-500">Loading supervisors...</p>}
      {!loading && !visibleSupervisors.length && <EmptyState title="No supervisors found" description="Create a supervisor or adjust your filters to see matching accounts." />}
      {editing && <SupervisorModal supervisor={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
      {viewing && <SupervisorDetails supervisor={viewing} onClose={() => setViewing(null)} />}
    </>
  );
}

function MiniMetric({ label, value }) {
  return <div className="text-center sm:text-left"><p className="text-[11px] font-semibold text-slate-500 sm:text-xs">{label}</p><p className="mt-0.5 text-lg font-semibold text-blue-600 sm:text-xl">{value}</p></div>;
}

function permissionLabel(permission) {
  return permissionOptions.find(([key]) => key === permission)?.[1]?.replace(/^Can /, "") || permission;
}

function PasswordReveal({ value, label = "Supervisor Password" }) {
  const [visible, setVisible] = useState(false);
  const password = value || "Not stored yet";
  const copy = async () => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</p>
        <div className="flex gap-2">
          <button type="button" onClick={() => setVisible((current) => !current)} className="rounded-lg bg-white px-2 py-1 text-slate-600 ring-1 ring-slate-200" aria-label={visible ? "Hide password" : "Show password"}>
            {visible ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
          <button type="button" onClick={copy} disabled={!value} className="rounded-lg bg-white px-2 py-1 text-slate-600 ring-1 ring-slate-200 disabled:opacity-40" aria-label="Copy password">
            <Copy size={15} />
          </button>
        </div>
      </div>
      <p className={`font-mono text-sm font-bold ${value ? "text-slate-900" : "text-red-500"}`}>{visible ? password : value ? "**********" : password}</p>
    </div>
  );
}

function SupervisorModal({ supervisor, onClose, onSaved }) {
  const isEdit = Boolean(supervisor?._id);
  const [form, setForm] = useState({
    name: supervisor?.name || "",
    email: supervisor?.email || "",
    password: isEdit ? "" : "Supervisor@12345",
    phone: supervisor?.phone || "",
    designation: supervisor?.designation || "Property Supervisor",
    coverImage: supervisor?.coverImage || "",
    role: "supervisor",
    status: supervisor?.status || "active",
    permissions: supervisor?.permissions?.length ? supervisor.permissions : defaultSupervisorPermissions,
    propertiesManaged: supervisor?.propertiesManaged || 0,
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const uploadCover = async (event) => {
    const file = event.target.files?.[0];
    if (!file || !isEdit) return;
    setSaving(true);
    setError("");
    try {
      const response = await staffApi.uploadStaffCover(supervisor._id, file);
      setForm((current) => ({ ...current, coverImage: response.data.url }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
      event.target.value = "";
    }
  };
  const removeCover = async () => {
    if (!isEdit) return;
    setSaving(true);
    setError("");
    try {
      await staffApi.removeStaffCover(supervisor._id);
      setForm((current) => ({ ...current, coverImage: "" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  const togglePermission = (permission) => {
    setForm((current) => ({
      ...current,
      permissions: current.permissions.includes(permission)
        ? current.permissions.filter((item) => item !== permission)
        : [...current.permissions, permission],
    }));
  };
  const save = async (event) => {
    event.preventDefault();
    setError("");
    setSaving(true);
    try {
      const payload = { ...form };
      if (isEdit && !payload.password) delete payload.password;
      if (isEdit) await staffApi.updateStaff(supervisor._id, payload);
      else await staffApi.createStaff({ ...payload, password: payload.password || "Supervisor@12345" });
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <div className="fixed inset-0 z-[500] grid place-items-center bg-slate-950/50 p-4">
      <form onSubmit={save} className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-slate-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <h3 className="text-2xl font-extrabold">{isEdit ? "Edit Supervisor" : "Create Supervisor"}</h3>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="wf-smooth-scroll flex-1 overflow-y-auto p-4 pb-28 sm:p-6">
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p>}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <FormSection title="Profile" subtitle="Supervisor account and login details.">
            <div className="grid gap-4">
              <div className="overflow-hidden rounded-2xl border border-slate-200">
                <div className="h-28 bg-gradient-to-r from-blue-700 to-cyan-500">
                  {form.coverImage && <img src={form.coverImage} alt="" className="h-full w-full object-cover" />}
                </div>
                <div className="flex flex-wrap gap-2 p-3">
                  {isEdit ? (
                    <>
                      <label className="wf-btn wf-btn-secondary cursor-pointer text-sm"><Upload size={15} /> Change cover<input type="file" accept="image/*" className="hidden" onChange={uploadCover} /></label>
                      {form.coverImage && <button type="button" onClick={removeCover} className="wf-btn bg-rose-50 text-sm text-rose-600">Remove</button>}
                    </>
                  ) : (
                    <p className="text-xs font-semibold text-slate-500">Save the supervisor first, then upload a cover picture.</p>
                  )}
                </div>
              </div>
              <Field label="Name" name="name" value={form.name} onChange={update} required />
              <Field label="Email" name="email" type="email" value={form.email} onChange={update} required />
              <Field label="Phone" name="phone" value={form.phone} onChange={update} />
              <Field label="Designation" name="designation" value={form.designation} onChange={update} />
              <SearchableDropdown
                label="Status"
                name="status"
                value={form.status}
                onChange={update}
                options={[{ label: "Active", value: "active" }, { label: "Disabled", value: "disabled" }]}
              />
              {isEdit && <PasswordReveal value={supervisor.passwordPlain} label="Current Password" />}
              <Field label={isEdit ? "New Password (optional)" : "Password"} name="password" value={form.password} onChange={update} required={!isEdit} placeholder={isEdit ? "Leave blank to keep current password" : "Minimum 8 characters"} />
            </div>
          </FormSection>

          <FormSection title="Role-Based Permissions" subtitle="Only selected permissions are available in supervisor routes and APIs.">
            <div className="grid gap-3 sm:grid-cols-2">
              {permissionOptions.map(([permission, label]) => (
                <label key={permission} className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${form.permissions.includes(permission) ? "border-blue-200 bg-blue-50" : "border-slate-200 hover:bg-slate-50"}`}>
                  <input type="checkbox" checked={form.permissions.includes(permission)} onChange={() => togglePermission(permission)} className="mt-1 h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                  <span>
                    <span className="block text-sm font-bold text-slate-800">{label}</span>
                    <span className="mt-1 block text-xs text-slate-500">{permission}</span>
                  </span>
                </label>
              ))}
            </div>
          </FormSection>
        </div>
        </div>
        <FormFooterActions
          onCancel={onClose}
          disabled={saving}
          submitLabel={saving ? "Saving..." : isEdit ? "Save Supervisor" : "Create Supervisor"}
        />
      </form>
    </div>
  );
}

function SupervisorDetails({ supervisor, onClose }) {
  const performance = supervisor.performance || {};
  return (
    <div className="fixed inset-0 z-[500] grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="h-36 bg-gradient-to-r from-blue-700 to-cyan-500">
          {supervisor.coverImage && <img src={supervisor.coverImage} alt="" className="h-full w-full object-cover" />}
        </div>
        <div className="p-4 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="-mt-14 grid h-20 w-20 place-items-center overflow-hidden rounded-full border-4 border-white bg-gradient-to-br from-purple-600 to-teal-600 text-white shadow-lg">{supervisor.avatar ? <img src={supervisor.avatar} alt={supervisor.name} className="h-full w-full object-cover" /> : <Shield size={30} />}</span>
            <div>
              <h3 className="text-2xl font-extrabold">{supervisor.name}</h3>
              <p className="text-sm text-slate-500">{supervisor.email}</p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-4">
          <MiniMetric label="Properties Added" value={performance.propertiesAdded || 0} />
          <MiniMetric label="Leads Handled" value={performance.leadsHandled || 0} />
          <MiniMetric label="Converted" value={performance.convertedLeads || 0} />
          <MiniMetric label="Activity" value={performance.activityCount || 0} />
        </div>
        <div className="mt-6">
          <PasswordReveal value={supervisor.passwordPlain} />
        </div>
        <div className="mt-6 rounded-2xl bg-slate-50 p-5">
          <h4 className="font-bold text-slate-950">Permissions</h4>
          <div className="mt-4 flex flex-wrap gap-2">
            {(supervisor.permissions || []).map((permission) => (
              <span key={permission} className="rounded-full bg-white px-3 py-1 text-xs font-bold text-slate-700 ring-1 ring-slate-200">{permissionLabel(permission)}</span>
            ))}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

function OwnersSection() {
  const [owners, setOwners] = useState([]);
  const [tab, setTab] = useState("pending");
  const [filters, setFilters] = useState({ search: "", city: "", type: "" });
  const [selected, setSelected] = useState(null);
  const [editingContent, setEditingContent] = useState(null);
  const [remarks, setRemarks] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState("");
  const [error, setError] = useState("");
  const ownerTabs = useMemo(() => [
    { key: "pending", label: "Pending", query: { status: "pending" } },
    { key: "approved", label: "Approved", query: { status: "approved" } },
    { key: "needs_changes", label: "Needs Changes", query: { status: "needs_changes" } },
    { key: "rejected", label: "Rejected", query: { status: "rejected" } },
    { key: "delete_requests", label: "Delete Requests", query: { status: "all", deleteStatus: "pending" } },
  ], []);
  const tabQuery = useMemo(() => (key) => ownerTabs.find((item) => item.key === key)?.query || { status: key }, [ownerTabs]);
  const load = async (nextTab = tab, nextFilters = filters) => {
    setLoading(true);
    try {
      setError("");
      setOwners((await staffApi.owners({ ...tabQuery(nextTab), ...nextFilters })).data);
    } catch (err) {
      setError(err.message || "Unable to load owner property requests.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let active = true;
    staffApi.owners(tabQuery(tab))
      .then((response) => {
        if (!active) return;
        setOwners(response.data);
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load owner property requests.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [tab, tabQuery]);
  const updateStatus = async (id, nextStatus) => {
    try {
      if (["rejected", "needs_changes"].includes(nextStatus) && !remarks.trim()) {
        setError("Remarks are required for rejection or needs changes.");
        return;
      }
      setSaving(nextStatus);
      setError("");
      await staffApi.updateOwnerStatus(id, { status: nextStatus, remarks });
      setRemarks("");
      setSelected(null);
      load(tab, filters);
    } catch (err) {
      setError(err.message || "Unable to update owner request.");
    } finally {
      setSaving("");
    }
  };
  const reviewDelete = async (id, deleteStatus) => {
    try {
      if (deleteStatus === "rejected" && !remarks.trim()) {
        setError("Remarks are required when rejecting a delete request.");
        return;
      }
      setSaving(`delete-${deleteStatus}`);
      setError("");
      await staffApi.reviewOwnerDelete(id, { deleteStatus, remarks });
      setRemarks("");
      setSelected(null);
      load(tab, filters);
    } catch (err) {
      setError(err.message || "Unable to review delete request.");
    } finally {
      setSaving("");
    }
  };
  const saveContent = async (id, payload) => {
    try {
      setSaving("content");
      setError("");
      const response = await staffApi.updateOwnerContent(id, payload);
      setEditingContent(null);
      setSelected(response.data);
      load(tab, filters);
    } catch (err) {
      setError(err.message || "Unable to update submitted content.");
      throw err;
    } finally {
      setSaving("");
    }
  };
  const counts = ownerTabs.reduce((acc, item) => {
    if (item.key === "delete_requests") return { ...acc, [item.key]: owners.filter((owner) => owner.deleteStatus === "pending").length };
    return { ...acc, [item.key]: owners.filter((owner) => owner.status === item.key).length };
  }, {});
  return (
    <>
      <PageTitle title="Owner Management" subtitle="Review seller/owner property submissions before they go live" />
      <InlineAlert message={error} />
      <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
        <div className="grid grid-cols-2 border-b border-slate-200 md:grid-cols-5">
          {ownerTabs.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)} className={`relative px-2 py-3.5 text-sm font-semibold transition-colors sm:px-4 sm:py-4 ${tab === item.key ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}>
              {item.label} <span className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${tab === item.key ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>{counts[item.key] || 0}</span>
              {tab === item.key && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-blue-600" />}
            </button>
          ))}
        </div>
        <div className="grid gap-3 border-b border-slate-100 p-4 md:grid-cols-[1fr_180px_180px_auto]">
          <input value={filters.search} onChange={(event) => setFilters({ ...filters, search: event.target.value })} placeholder="Search owner, phone, city, property..." className="wf-input" />
          <input value={filters.city} onChange={(event) => setFilters({ ...filters, city: event.target.value })} placeholder="City" className="wf-input" />
          <input value={filters.type} onChange={(event) => setFilters({ ...filters, type: event.target.value })} placeholder="Property type" className="wf-input" />
          <button type="button" onClick={() => load(tab, filters)} className="wf-btn wf-btn-primary"><Filter size={16} /> Filter</button>
        </div>
        <div className="space-y-3 p-4 sm:p-6">
          {loading && <p className="py-8 text-center text-sm font-bold text-slate-500">Loading owner requests...</p>}
          {!loading && owners.length === 0 && <EmptyState title={`No ${tab.replace("_", " ")} requests`} description="Owner property submissions will appear here when their status matches this tab." />}
          {owners.map((owner) => (
            <div key={owner._id} className="rounded-xl border border-slate-100 p-4 transition-shadow hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] sm:p-5">
              <div className="grid gap-4 xl:grid-cols-[1.2fr_1fr_1fr_auto] xl:items-center">
                <OwnerCell label="Property" value={owner.propertyDetails?.title || "Untitled"} sub={`${owner.propertyDetails?.area || ""}, ${owner.propertyDetails?.city || ""}`} />
                <OwnerCell label="Owner" value={owner.name} sub={`${owner.phone} · ${owner.email}`} />
                <OwnerCell label="Expected" value={formatINR(owner.propertyDetails?.expectedPrice || 0)} sub={owner.propertyDetails?.type || "-"} />
                <div className="flex flex-wrap gap-2 xl:justify-end">
                  <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusClass(owner.status)}`}>{owner.status?.replace("_", " ")}</span>
                  {owner.deleteStatus === "pending" && <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-black text-amber-700 ring-1 ring-amber-200">Delete requested</span>}
                  <button type="button" onClick={() => { setSelected(owner); setRemarks(owner.deleteStatus === "pending" ? owner.deleteReviewRemarks || "" : owner.reviewRemarks || ""); }} className="wf-btn wf-btn-secondary text-sm"><Eye size={15} /> View</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      {selected && (
        <OwnerRequestDetailModal
          request={selected}
          remarks={remarks}
          setRemarks={setRemarks}
          saving={saving}
          onClose={() => setSelected(null)}
          onUpdate={updateStatus}
          onReviewDelete={reviewDelete}
          onEdit={() => { setEditingContent(selected); setSelected(null); }}
        />
      )}
      {editingContent && <OwnerContentEditModal request={editingContent} saving={saving === "content"} onClose={() => setEditingContent(null)} onSave={saveContent} />}
    </>
  );
}

function OwnerCell({ label, value, sub }) {
  return <div><p className="text-xs text-slate-500 sm:text-sm">{label}</p><p className="mt-1 font-bold text-slate-900">{value}</p>{sub && <p className="mt-0.5 text-xs font-semibold text-slate-500">{sub}</p>}</div>;
}

function OwnerRequestDetailModal({ request, remarks, setRemarks, saving, onClose, onUpdate, onReviewDelete, onEdit }) {
  const details = request.propertyDetails || {};
  const media = request.media || {};
  const map = details.map || {};
  const declaration = request.declaration || {};
  const detailRows = [
    ["Title", details.title || "-"],
    ["Property type", details.type || "-"],
    ["Purpose", details.purpose || "-"],
    ["City", details.city || "-"],
    ["Area/location", details.area || "-"],
    ["Full address", details.address || "-"],
    ["BHK / rooms", details.bhk || details.rooms || "-"],
    ["Built-up area", `${details.builtUpArea || details.carpetArea || 0} ${details.areaUnit || "sqft"}`],
    ["Floor", [details.floorNumber, details.totalFloors].filter(Boolean).join(" / ") || "-"],
    ["Furnishing", details.furnishing || "-"],
    ["Parking", details.parking || "-"],
    ["Facing", details.facing || "-"],
    ["Property age", details.ageOfProperty || "-"],
    ["Construction year", details.constructionYear || "-"],
    ["Availability", details.availability || "-"],
    ["Maintenance", details.maintenanceCharges ? formatINR(details.maintenanceCharges) : "-"],
    ["Negotiable", details.negotiable ? "Yes" : "No"],
  ];
  const submittedAt = request.createdAt ? new Date(request.createdAt).toLocaleString() : "-";
  const reviewedAt = request.reviewedAt ? new Date(request.reviewedAt).toLocaleString() : "-";
  const deleteRequestedAt = request.deleteRequestedAt ? new Date(request.deleteRequestedAt).toLocaleString() : "-";
  const deleteReviewedAt = request.deleteReviewedAt ? new Date(request.deleteReviewedAt).toLocaleString() : "-";
  const linkedPropertySold = request.approvedPropertyId?.status === "sold";
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <div className="max-h-[92vh] w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-2xl font-black text-slate-950">{details.title || "Untitled property"}</h3>
              <span className={`rounded-full px-3 py-1 text-xs font-black capitalize ${statusClass(request.status)}`}>{request.status?.replace("_", " ") || "pending"}</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-slate-500">{request.name || "-"} · {details.area || "-"}, {details.city || "-"}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="max-h-[calc(92vh-170px)] overflow-y-auto p-5">
          <div className="grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl bg-slate-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Owner</p>
              <h4 className="mt-2 text-xl font-black text-slate-950">{request.name}</h4>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <OwnerCell label="Phone" value={request.phone} />
                <OwnerCell label="Email" value={request.email} />
                <OwnerCell label="Alternate" value={request.alternatePhone || "-"} />
                <OwnerCell label="Ownership" value={request.ownershipType || "-"} />
                <OwnerCell label="Linked account" value={request.ownerUserId?.email || "-"} />
                <OwnerCell label="Submitted" value={submittedAt} />
              </div>
            </div>
            <div className="rounded-3xl bg-blue-50 p-5">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-600">Pricing & Status</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <OwnerCell label="Price/Rent" value={formatINR(details.expectedPrice || 0)} />
                <OwnerCell label="Status" value={request.status?.replace("_", " ") || "-"} />
                <OwnerCell label="Reviewed by" value={request.reviewedBy?.name || "-"} />
                <OwnerCell label="Reviewed at" value={reviewedAt} />
                <OwnerCell label="Approved listing" value={request.approvedPropertyId?.propertyCode || request.approvedPropertyId?.title || "-"} />
                <OwnerCell label="Source" value={request.source || "-"} />
                <OwnerCell label="Delete status" value={request.deleteStatus?.replace("_", " ") || "none"} />
                <OwnerCell label="Live listing status" value={request.approvedPropertyId?.status || "-"} />
              </div>
            </div>
          </div>
          {request.deleteStatus !== "none" && (
            <div className={`mt-5 rounded-3xl border p-5 ${request.deleteStatus === "pending" ? "border-amber-100 bg-amber-50" : request.deleteStatus === "approved" ? "border-emerald-100 bg-emerald-50" : "border-rose-100 bg-rose-50"}`}>
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500">Owner Delete Request</p>
                  <h4 className="mt-2 text-xl font-black capitalize text-slate-950">{request.deleteStatus?.replace("_", " ")}</h4>
                  <p className="mt-2 text-sm font-semibold leading-6 text-slate-600">{request.deleteReason || "No reason provided."}</p>
                </div>
                {linkedPropertySold && <span className="rounded-full bg-rose-600 px-3 py-1 text-xs font-black text-white">Sold - cannot delete</span>}
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                <OwnerCell label="Requested at" value={deleteRequestedAt} />
                <OwnerCell label="Reviewed by" value={request.deleteReviewedBy?.name || "-"} />
                <OwnerCell label="Reviewed at" value={deleteReviewedAt} />
              </div>
              {request.deleteReviewRemarks && <p className="mt-4 rounded-2xl bg-white/70 p-3 text-sm font-semibold text-slate-600">{request.deleteReviewRemarks}</p>}
            </div>
          )}
          <div className="mt-5 rounded-3xl border border-slate-100 p-5">
            <p className="text-sm font-black text-slate-950">Property Info</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {detailRows.map(([label, value]) => <OwnerCell key={label} label={label} value={value} />)}
            </div>
          </div>
          <div className="mt-5 rounded-3xl border border-slate-100 p-5">
            <p className="text-sm font-black text-slate-950">Description</p>
            <p className="mt-2 whitespace-pre-line text-sm leading-6 text-slate-600">{details.description || "No description submitted."}</p>
            {details.nearbyLandmarks && <p className="mt-3 text-sm font-semibold text-slate-500">Landmarks: {details.nearbyLandmarks}</p>}
          </div>
          <div className="mt-5 rounded-3xl border border-slate-100 p-5">
            <p className="text-sm font-black text-slate-950">Amenities</p>
            {details.amenities?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {details.amenities.map((amenity) => <span key={amenity} className="rounded-full bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 ring-1 ring-blue-100">{amenity}</span>)}
              </div>
            ) : (
              <p className="mt-2 text-sm font-semibold text-slate-500">No amenities submitted.</p>
            )}
          </div>
          <div className="mt-5 rounded-3xl border border-slate-100 p-5">
            <p className="text-sm font-black text-slate-950">Media</p>
            {media.photos?.length ? (
              <div className="mt-4 grid gap-4 md:grid-cols-3">
                {media.photos.map((photo) => <a key={photo} href={photo} target="_blank" rel="noreferrer"><img src={photo} alt={details.title || "Owner property"} className="h-44 w-full rounded-2xl object-cover ring-1 ring-slate-100" /></a>)}
              </div>
            ) : (
              <p className="mt-2 text-sm font-semibold text-slate-500">No photos submitted.</p>
            )}
            {media.videos?.length ? (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {media.videos.map((video) => <video key={video} src={video} controls className="h-56 w-full rounded-2xl bg-slate-950 object-cover" />)}
              </div>
            ) : null}
          </div>
          <div className="mt-5 rounded-3xl border border-slate-100 p-5">
            <p className="text-sm font-black text-slate-950">Documents</p>
            {media.documents?.length ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {media.documents.map((document) => <a key={document} href={document} target="_blank" rel="noreferrer" className="wf-btn wf-btn-secondary text-sm"><FileText size={15} /> Document</a>)}
              </div>
            ) : (
              <p className="mt-2 text-sm font-semibold text-slate-500">No documents submitted.</p>
            )}
          </div>
          <div className="mt-5 rounded-3xl border border-blue-100 bg-blue-50/50 p-5">
            <p className="text-sm font-black text-slate-950">Private Owner Proofs</p>
            <p className="mt-1 text-xs font-semibold text-slate-500">Internal verification documents. Never exposed through public property APIs.</p>
            {media.ownerProofs?.length ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {media.ownerProofs.map((proof, index) => (
                  <a key={`${proof.url}-${index}`} href={proof.url} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-2xl bg-white p-4 text-sm ring-1 ring-blue-100 hover:ring-blue-300">
                    <FileText size={18} className="shrink-0 text-blue-600" />
                    <span className="min-w-0">
                      <span className="block truncate font-black text-slate-900">{proof.originalName}</span>
                      <span className="mt-1 block text-xs font-semibold text-slate-500">{proof.documentType} · {proof.status || "uploaded"}</span>
                    </span>
                    <Download size={16} className="ml-auto shrink-0 text-slate-400" />
                  </a>
                ))}
              </div>
            ) : (
              <p className="mt-3 text-sm font-semibold text-rose-600">No owner proof submitted.</p>
            )}
          </div>
          <div className="mt-5 grid gap-5 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-100 p-5">
              <p className="text-sm font-black text-slate-950">Declaration</p>
              <div className="mt-3 space-y-2 text-sm font-semibold text-slate-600">
                {[
                  ["Owner/authorized", declaration.ownerOrAuthorized],
                  ["Accurate details", declaration.accurateDetails],
                  ["Media belongs to property", declaration.mediaBelongsToProperty],
                  ["Understands removal", declaration.understandsRemoval],
                  ["Agrees contact", declaration.agreesContact],
                ].map(([label, accepted]) => <p key={label} className="flex items-center justify-between gap-4"><span>{label}</span><span className={accepted ? "text-emerald-600" : "text-rose-600"}>{accepted ? "Accepted" : "Missing"}</span></p>)}
              </div>
              <p className="mt-3 text-xs font-semibold text-slate-500">Accepted at: {request.declarationAcceptedAt ? new Date(request.declarationAcceptedAt).toLocaleString() : "-"}</p>
            </div>
            <div className="rounded-3xl border border-slate-100 p-5">
              <p className="text-sm font-black text-slate-950">Location</p>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <OwnerCell label="Map address" value={map.address || details.address || "-"} />
                <OwnerCell label="Map area" value={map.area || details.area || "-"} />
                <OwnerCell label="Map city" value={map.city || details.city || "-"} />
                <OwnerCell label="State / Pincode" value={[map.state, map.pincode].filter(Boolean).join(" - ") || "-"} />
                <OwnerCell label="Latitude" value={map.latitude ?? "-"} />
                <OwnerCell label="Longitude" value={map.longitude ?? "-"} />
              </div>
            </div>
          </div>
          {!!request.statusHistory?.length && (
            <div className="mt-5 rounded-3xl border border-slate-100 p-5">
              <p className="text-sm font-black text-slate-950">Status History</p>
              <div className="mt-3 space-y-3">
                {request.statusHistory.map((item) => (
                  <div key={`${item.status}-${item.changedAt}`} className="rounded-2xl bg-slate-50 p-3 text-sm">
                    <p className="font-black capitalize text-slate-900">{item.status?.replace("_", " ")}</p>
                    <p className="mt-1 font-semibold text-slate-500">{item.remarks || "-"}</p>
                    <p className="mt-1 text-xs font-semibold text-slate-400">{item.changedByName || "-"} · {item.changedAt ? new Date(item.changedAt).toLocaleString() : "-"}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div className="mt-5 rounded-3xl border border-slate-100 p-5">
            <label className="wf-label">{request.deleteStatus === "pending" ? "Delete review remarks" : "Review remarks"}</label>
            <textarea value={remarks} onChange={(event) => setRemarks(event.target.value)} rows={3} className="wf-input min-h-24" placeholder={request.deleteStatus === "pending" ? "Required when rejecting delete. Optional when approving." : "Required for rejection or needs changes. Optional for approval."} />
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-slate-100 p-4 sm:flex-row sm:justify-end">
          <button type="button" onClick={onEdit} className="wf-btn wf-btn-secondary"><Edit3 size={16} /> Edit Submitted Content</button>
          <button type="button" onClick={onClose} className="wf-btn wf-btn-secondary">Cancel</button>
          {request.deleteStatus === "pending" ? (
            <>
              <button type="button" disabled={!!saving} onClick={() => onReviewDelete(request._id, "rejected")} className="wf-btn bg-rose-600 text-white disabled:opacity-70">Reject Delete</button>
              <button type="button" disabled={!!saving || linkedPropertySold} onClick={() => onReviewDelete(request._id, "approved")} className="wf-btn bg-emerald-600 text-white disabled:opacity-70"><Check size={16} /> Approve Delete</button>
            </>
          ) : (
            <>
              <button type="button" disabled={!!saving} onClick={() => onUpdate(request._id, "needs_changes")} className="wf-btn bg-blue-600 text-white disabled:opacity-70">Needs Changes</button>
              <button type="button" disabled={!!saving} onClick={() => onUpdate(request._id, "rejected")} className="wf-btn bg-rose-600 text-white disabled:opacity-70">Reject</button>
              <button type="button" disabled={!!saving} onClick={() => onUpdate(request._id, "approved")} className="wf-btn bg-emerald-600 text-white disabled:opacity-70"><Check size={16} /> Approve & List</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function OwnerContentEditModal({ request, saving, onClose, onSave }) {
  const initialDetails = request.propertyDetails || {};
  const [form, setForm] = useState({
    ownerDetails: {
      name: request.name || "",
      email: request.email || "",
      phone: request.phone || "",
      alternatePhone: request.alternatePhone || "",
      ownershipType: request.ownershipType || "Owner",
    },
    propertyDetails: {
      title: initialDetails.title || "",
      type: initialDetails.type || "",
      purpose: initialDetails.purpose || "sale",
      city: initialDetails.city || "",
      area: initialDetails.area || "",
      address: initialDetails.address || "",
      bhk: initialDetails.bhk || "",
      builtUpArea: initialDetails.builtUpArea || "",
      areaUnit: initialDetails.areaUnit || "sqft",
      expectedPrice: initialDetails.expectedPrice || "",
      constructionYear: initialDetails.constructionYear || "",
      availability: initialDetails.availability || "",
      furnishing: initialDetails.furnishing || "",
      parking: initialDetails.parking || "",
      facing: initialDetails.facing || "",
      description: initialDetails.description || "",
      nearbyLandmarks: initialDetails.nearbyLandmarks || "",
    },
    photos: request.media?.photos || [],
    videos: (request.media?.videos || []).join("\n"),
    documents: (request.media?.documents || []).join("\n"),
  });
  const [error, setError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);
  const updateOwner = (key, value) => setForm((current) => ({ ...current, ownerDetails: { ...current.ownerDetails, [key]: value } }));
  const updateDetails = (key, value) => setForm((current) => ({ ...current, propertyDetails: { ...current.propertyDetails, [key]: value } }));
  const urlLines = (value) => String(value || "").split("\n").map((item) => item.trim()).filter(Boolean);
  const uploadImages = async (files) => {
    const selected = Array.from(files || []);
    if (!selected.length) return;
    setUploadingImages(true);
    setError("");
    try {
      const response = await staffApi.uploadPropertyImages(selected);
      setForm((current) => ({ ...current, photos: [...current.photos, ...(response.data.urls || [])] }));
    } catch (err) {
      setError(err.message || "Unable to upload images.");
    } finally {
      setUploadingImages(false);
    }
  };
  const movePhoto = (index, direction) => {
    setForm((current) => {
      const photos = [...current.photos];
      const nextIndex = index + direction;
      if (nextIndex < 0 || nextIndex >= photos.length) return current;
      [photos[index], photos[nextIndex]] = [photos[nextIndex], photos[index]];
      return { ...current, photos };
    });
  };
  const save = async (event) => {
    event.preventDefault();
    const year = Number(form.propertyDetails.constructionYear);
    if (year && (year < 1900 || year > new Date().getFullYear())) {
      setError(`Construction year must be between 1900 and ${new Date().getFullYear()}.`);
      return;
    }
    try {
      setError("");
      await onSave(request._id, {
        ownerDetails: form.ownerDetails,
        propertyDetails: {
          ...form.propertyDetails,
          expectedPrice: Number(form.propertyDetails.expectedPrice || 0),
          builtUpArea: Number(form.propertyDetails.builtUpArea || 0),
          constructionYear: year || null,
        },
        media: { photos: form.photos, videos: urlLines(form.videos), documents: urlLines(form.documents) },
      });
    } catch (err) {
      setError(err.message || "Unable to save changes.");
    }
  };
  return (
    <div className="fixed inset-0 z-[550] grid place-items-center bg-slate-950/55 p-4">
      <form onSubmit={save} className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-slate-100 p-5">
          <div><h3 className="text-2xl font-black text-slate-950">Edit Submitted Content</h3><p className="mt-1 text-sm font-semibold text-slate-500">Changes to approved submissions update the live property while keeping owner proofs private.</p></div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="overflow-y-auto p-5">
          {error && <InlineAlert message={error} />}
          <div className="grid gap-5 lg:grid-cols-2">
            <FormSection title="Internal Owner Details" subtitle="Visible only to authorized staff.">
              <div className="grid gap-3">
                {["name", "email", "phone", "alternatePhone", "ownershipType"].map((key) => <Field key={key} label={labelize(key)} name={key} value={form.ownerDetails[key]} onChange={(event) => updateOwner(key, event.target.value)} />)}
              </div>
            </FormSection>
            <FormSection title="Public Property Content" subtitle="Edit listing text and key details.">
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Title" name="title" value={form.propertyDetails.title} onChange={(event) => updateDetails("title", event.target.value)} />
                <label className="block">
                  <span className="wf-label">Property Type</span>
                  <select className="wf-input" value={form.propertyDetails.type} onChange={(event) => updateDetails("type", event.target.value)}>
                    {["Apartment","Villa","Bungalow","Plot","Office","Shop","Showroom","Warehouse","Land"].map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="wf-label">Purpose</span>
                  <select className="wf-input" value={form.propertyDetails.purpose} onChange={(event) => updateDetails("purpose", event.target.value)}>
                    {["sale","rent","pre-leased","other"].map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </label>
                <Field label="City" name="city" value={form.propertyDetails.city} onChange={(event) => updateDetails("city", event.target.value)} />
                <Field label="Area / Location" name="area" value={form.propertyDetails.area} onChange={(event) => updateDetails("area", event.target.value)} />
                <Field label="Full Address" name="address" value={form.propertyDetails.address} onChange={(event) => updateDetails("address", event.target.value)} />
                <label className="block">
                  <span className="wf-label">BHK / Rooms</span>
                  <select className="wf-input" value={form.propertyDetails.bhk} onChange={(event) => updateDetails("bhk", event.target.value)}>
                    <option value="">Select BHK</option>
                    {["Studio","1","1.5","2","2.5","3","3.5","4","4.5","5","6+"].map((opt) => <option key={opt} value={opt}>{opt === "Studio" ? "Studio" : `${opt} BHK`}</option>)}
                  </select>
                </label>
                <Field label="Built-up Area" name="builtUpArea" type="number" value={form.propertyDetails.builtUpArea} onChange={(event) => updateDetails("builtUpArea", event.target.value)} />
                <label className="block">
                  <span className="wf-label">Area Unit</span>
                  <select className="wf-input" value={form.propertyDetails.areaUnit} onChange={(event) => updateDetails("areaUnit", event.target.value)}>
                    {["sqft","sq-yard","sq-meter","vigha","acre"].map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="wf-label">Expected Price / Rent</span>
                  <div className="flex overflow-hidden rounded-xl border border-slate-200 bg-white focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                    <span className="grid min-w-12 place-items-center border-r border-slate-200 bg-slate-50 text-xs font-black text-slate-500">Rs.</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      className="min-h-10 flex-1 border-0 px-3 text-sm font-semibold text-slate-900 outline-none"
                      value={form.propertyDetails.expectedPrice ? new Intl.NumberFormat("en-IN").format(Number(form.propertyDetails.expectedPrice) || 0) : ""}
                      onChange={(event) => updateDetails("expectedPrice", event.target.value.replace(/[^\d]/g, ""))}
                      placeholder="e.g. 12,00,000"
                    />
                  </div>
                  {form.propertyDetails.expectedPrice && Number(form.propertyDetails.expectedPrice) > 0 && (
                    <span className="mt-1 block text-xs font-semibold text-slate-400">{formatINR(Number(form.propertyDetails.expectedPrice))}</span>
                  )}
                </label>
                <Field label="Construction Year" name="constructionYear" type="number" value={form.propertyDetails.constructionYear} onChange={(event) => updateDetails("constructionYear", event.target.value)} />
                <label className="block">
                  <span className="wf-label">Availability</span>
                  <select className="wf-input" value={form.propertyDetails.availability} onChange={(event) => updateDetails("availability", event.target.value)}>
                    {["Available","Immediate","Within 30 days","Under Construction","Occupied"].map((opt) => <option key={opt} value={opt}>{opt}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="wf-label">Furnishing</span>
                  <select className="wf-input" value={form.propertyDetails.furnishing || ""} onChange={(event) => updateDetails("furnishing", event.target.value)}>
                    {["","Unfurnished","Semi Furnished","Fully Furnished"].map((opt) => <option key={opt} value={opt}>{opt || "Select"}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="wf-label">Parking</span>
                  <select className="wf-input" value={form.propertyDetails.parking || ""} onChange={(event) => updateDetails("parking", event.target.value)}>
                    {["","No Parking","1 Car","2 Cars","Open Parking","Reserved Parking"].map((opt) => <option key={opt} value={opt}>{opt || "Select"}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="wf-label">Facing</span>
                  <select className="wf-input" value={form.propertyDetails.facing || ""} onChange={(event) => updateDetails("facing", event.target.value)}>
                    {["","East","West","North","South","North-East","Road Facing","Garden Facing"].map((opt) => <option key={opt} value={opt}>{opt || "Select"}</option>)}
                  </select>
                </label>
              </div>
              <label className="mt-3 block"><span className="wf-label">Description</span><textarea className="wf-input min-h-28" value={form.propertyDetails.description} onChange={(event) => updateDetails("description", event.target.value)} /></label>
              <label className="mt-3 block"><span className="wf-label">Nearby landmarks</span><textarea className="wf-input min-h-20" value={form.propertyDetails.nearbyLandmarks} onChange={(event) => updateDetails("nearbyLandmarks", event.target.value)} /></label>
            </FormSection>
          </div>
          <FormSection title="Images & Documents" subtitle="Upload, remove, and reorder public listing images. Owner proofs are managed separately and cannot be exposed here.">
            <label className="wf-btn wf-btn-secondary mb-4 cursor-pointer text-sm"><Upload size={15} /> {uploadingImages ? "Uploading..." : "Add property images"}<input type="file" multiple accept="image/*" className="hidden" disabled={uploadingImages} onChange={(event) => { uploadImages(event.target.files); event.target.value = ""; }} /></label>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {form.photos.map((photo, index) => (
                <div key={`${photo}-${index}`} className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
                  <img src={photo} alt="" className="h-28 w-full object-cover" />
                  <div className="grid grid-cols-3 gap-1 p-2">
                    <button type="button" disabled={index === 0} onClick={() => movePhoto(index, -1)} className="rounded-lg bg-slate-100 px-2 py-2 text-xs font-bold disabled:opacity-40">Up</button>
                    <button type="button" disabled={index === form.photos.length - 1} onClick={() => movePhoto(index, 1)} className="rounded-lg bg-slate-100 px-2 py-2 text-xs font-bold disabled:opacity-40">Down</button>
                    <button type="button" onClick={() => setForm((current) => ({ ...current, photos: current.photos.filter((_, photoIndex) => photoIndex !== index) }))} className="rounded-lg bg-rose-50 px-2 py-2 text-xs font-bold text-rose-600">Remove</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {[["videos", "Video URLs"], ["documents", "General document URLs"]].map(([key, label]) => <label key={key}><span className="wf-label">{label}</span><textarea className="wf-input min-h-32 font-mono text-xs" value={form[key]} onChange={(event) => setForm((current) => ({ ...current, [key]: event.target.value }))} /></label>)}
            </div>
          </FormSection>
        </div>
        <div className="flex justify-end gap-3 border-t border-slate-100 p-4">
          <button type="button" onClick={onClose} className="wf-btn wf-btn-secondary">Cancel</button>
          <button disabled={saving} className="wf-btn wf-btn-primary"><Save size={16} /> {saving ? "Saving..." : "Save Changes"}</button>
        </div>
      </form>
    </div>
  );
}

function EnquiriesSection({ canDelete, canManage }) {
  const location = useLocation();
  const { staffToken } = useStaffAuth();
  const focusedEnquiryId = new URLSearchParams(location.search).get("enquiryId");
  const [enquiries, setEnquiries] = useState([]);
  const [filters, setFilters] = useState({ search: "", status: "all", conversionType: "all", source: "all", city: "all", propertyId: "all", supervisorId: "all", dateFrom: "", dateTo: "" });
  const [filterOptions, setFilterOptions] = useState({ cities: [], properties: [], supervisors: [] });
  const [closing, setClosing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showExportPanel, setShowExportPanel] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");
  const [exportRange, setExportRange] = useState("all-time");
  const [exportDateFrom, setExportDateFrom] = useState("");
  const [exportDateTo, setExportDateTo] = useState("");
  const [exporting, setExporting] = useState(false);
  const load = async (nextFilters = filters) => {
    setLoading(true);
    try {
      setError("");
      const response = await staffApi.enquiries(buildQuery(nextFilters));
      setEnquiries(response.data);
      setFilterOptions((current) => ({
        cities: [...new Set([...current.cities, ...uniqueOptions(response.data, (item) => item.propertyId?.city || item.preferredLocation)])].sort(),
        properties: [...new Set([...current.properties, ...uniqueOptions(response.data, (item) => item.propertyId?._id ? `${item.propertyId._id}|${item.propertyId.title || item.propertyTitle}` : item.propertyTitle ? `title:${item.propertyTitle}|${item.propertyTitle}` : "")])].sort(),
        supervisors: [...new Set([...current.supervisors, ...uniqueOptions(response.data, (item) => item.assignedTo?._id ? `${item.assignedTo._id}|${item.assignedTo.name}` : "")])].sort(),
      }));
    } catch (err) {
      setError(err.message || "Unable to load enquiries.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    let active = true;
    staffApi.enquiries()
      .then((response) => {
        if (!active) return;
        setEnquiries(response.data);
        setFilterOptions({
          cities: uniqueOptions(response.data, (item) => item.propertyId?.city || item.preferredLocation),
          properties: uniqueOptions(response.data, (item) => item.propertyId?._id ? `${item.propertyId._id}|${item.propertyId.title || item.propertyTitle}` : item.propertyTitle ? `title:${item.propertyTitle}|${item.propertyTitle}` : ""),
          supervisors: uniqueOptions(response.data, (item) => item.assignedTo?._id ? `${item.assignedTo._id}|${item.assignedTo.name}` : ""),
        });
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load enquiries.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  const updateStatus = async (id, nextStatus) => {
    if (nextStatus === "closed") {
      const enquiry = enquiries.find((item) => item._id === id);
      setClosing(enquiry);
      return;
    }
    try {
      setError("");
      await staffApi.updateEnquiry(id, { status: nextStatus });
      load();
    } catch (err) {
      setError(err.message || "Unable to update enquiry.");
    }
  };
  const remove = async (id) => {
    try {
      setError("");
      await staffApi.deleteEnquiry(id);
      load();
    } catch (err) {
      setError(err.message || "Unable to delete enquiry.");
    }
  };
  const updateFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value }));
  const clearFilters = () => {
    const next = { search: "", status: "all", conversionType: "all", source: "all", city: "all", propertyId: "all", supervisorId: "all", dateFrom: "", dateTo: "" };
    setFilters(next);
    load(next);
  };
  const exportEnquiries = async (format = exportFormat) => {
    if (!staffToken) return;
    setError("");
    setExporting(true);
    try {
      const exportParams = { ...filters };
      if (exportRange === "all-time") {
        delete exportParams.range;
        delete exportParams.dateFrom;
        delete exportParams.dateTo;
      } else if (exportRange === "custom") {
        exportParams.dateFrom = exportDateFrom;
        exportParams.dateTo = exportDateTo;
        exportParams.range = "custom";
      } else {
        exportParams.range = exportRange;
        delete exportParams.dateFrom;
        delete exportParams.dateTo;
      }
      const response = await fetch(staffApi.reportUrl("enquiries", exportRange, format, exportParams), { headers: { Authorization: `Bearer ${staffToken}` } });
      if (!response.ok) throw new Error("Unable to export enquiries.");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `enquiries-report.${format === "pdf" ? "pdf" : "xls"}`;
      link.click();
      URL.revokeObjectURL(url);
      setShowExportPanel(false);
    } catch (err) {
      setError(err.message || "Unable to export enquiries.");
    } finally {
      setExporting(false);
    }
  };
  const optionPair = (value) => {
    const [id, label] = String(value).split("|");
    return { value: id.startsWith("title:") ? "all" : id, label };
  };
  const counts = { new: enquiries.filter((item) => item.status === "new").length, "in-progress": enquiries.filter((item) => item.status === "in-progress").length, closed: enquiries.filter((item) => item.status === "closed").length };
  return (
    <>
      <PageTitle
        title="Enquiry Overview"
        subtitle="Manage and track all property enquiries"
        action={(
          <div className="flex flex-wrap gap-3">
            <button onClick={() => { setExportFormat("pdf"); setShowExportPanel((prev) => !prev); }} className="wf-btn wf-btn-primary"><Download size={17} /> PDF</button>
            <button onClick={() => { setExportFormat("excel"); setShowExportPanel((prev) => !prev); }} className="wf-btn wf-btn-secondary"><Download size={17} /> Excel</button>
            <BadgeCount label="New" value={counts.new} />
            <BadgeCount label="In Progress" value={counts["in-progress"]} tone="yellow" />
            <BadgeCount label="Closed" value={counts.closed} tone="green" />
          </div>
        )}
      />
      <InlineAlert message={error} />

      {showExportPanel && (
        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-blue-700">Export Settings</p>
              <p className="mt-0.5 text-sm font-semibold text-slate-600">Choose date range for {exportFormat.toUpperCase()} export</p>
            </div>
            <button onClick={() => setShowExportPanel(false)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-blue-100"><X size={16} /></button>
          </div>
          <div className="mt-4">
            <p className="mb-2 text-xs font-bold text-slate-500">Quick Range</p>
            <div className="flex flex-wrap gap-2">
              {[["all-time", "All Time"], ["today", "Today"], ["this-week", "Last 7 Days"], ["last-30", "Last 30 Days"], ["this-month", "This Month"], ["last-month", "Last Month"], ["custom", "Custom Range"]].map(([value, label]) => (
                <button key={value} type="button" onClick={() => setExportRange(value)}
                  className={`rounded-full px-3 py-1.5 text-xs font-black ring-1 transition ${exportRange === value ? "bg-blue-600 text-white ring-blue-600" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {exportRange === "custom" && (
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <label className="block"><span className="wf-label">From Date</span><input type="date" className="wf-input" value={exportDateFrom} onChange={(e) => setExportDateFrom(e.target.value)} /></label>
              <label className="block"><span className="wf-label">To Date</span><input type="date" className="wf-input" value={exportDateTo} onChange={(e) => setExportDateTo(e.target.value)} /></label>
            </div>
          )}
          <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:justify-end">
            <button onClick={() => setShowExportPanel(false)} className="wf-btn wf-btn-secondary">Cancel</button>
            <button onClick={() => exportEnquiries("pdf")} disabled={exporting} className="wf-btn wf-btn-primary disabled:opacity-70">
              <Download size={16} /> {exporting && exportFormat === "pdf" ? "Generating PDF..." : "Export PDF"}
            </button>
            <button onClick={() => exportEnquiries("excel")} disabled={exporting} className="wf-btn wf-btn-secondary disabled:opacity-70">
              <Download size={16} /> {exporting && exportFormat === "excel" ? "Generating Excel..." : "Export Excel"}
            </button>
          </div>
        </div>
      )}

      <div className="mb-6 rounded-2xl border border-slate-100 bg-white shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
        <div className="flex items-center justify-between px-4 py-3 sm:px-5">
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-slate-400" />
            <span className="text-sm font-bold text-slate-700">Filters</span>
            {Object.entries(filters).some(([, v]) => v && v !== "all" && v !== "") && (
              <span className="rounded-full bg-blue-600 px-2 py-0.5 text-xs font-black text-white">Active</span>
            )}
          </div>
          <button onClick={() => setShowFilters((prev) => !prev)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
            {showFilters ? <><ChevronUp size={14} /> Hide Filters</> : <><ChevronDown size={14} /> Show Filters</>}
          </button>
        </div>
        {showFilters && (
          <div className="border-t border-slate-100 p-4 sm:p-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              <div className="relative"><Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" /><input className="wf-input pl-10" value={filters.search} onChange={(e) => updateFilter("search", e.target.value)} placeholder="Customer/mobile search..." /></div>
              <select className="wf-input" value={filters.status} onChange={(e) => updateFilter("status", e.target.value)}><option value="all">All Status</option><option value="new">New</option><option value="in-progress">In Process</option><option value="closed">Closed</option></select>
              <select className="wf-input" value={filters.conversionType} onChange={(e) => updateFilter("conversionType", e.target.value)}><option value="all">Conversion</option><option value="sold">Sold</option><option value="rented">Rented</option><option value="no-conversion">No Conversion</option></select>
              <select className="wf-input" value={filters.source} onChange={(e) => updateFilter("source", e.target.value)}><option value="all">All Lead Sources</option><option value="website">Website</option><option value="property-detail">Property Detail</option><option value="guest">Guest</option><option value="admin">Admin</option></select>
              <select className="wf-input" value={filters.city} onChange={(e) => updateFilter("city", e.target.value)}><option value="all">All Cities</option>{filterOptions.cities.map((city) => <option key={city} value={city}>{city}</option>)}</select>
              <select className="wf-input" value={filters.propertyId} onChange={(e) => updateFilter("propertyId", e.target.value)}><option value="all">All Properties</option>{filterOptions.properties.map((item) => { const option = optionPair(item); return <option key={item} value={option.value}>{option.label}</option>; })}</select>
              <select className="wf-input" value={filters.supervisorId} onChange={(e) => updateFilter("supervisorId", e.target.value)}><option value="all">Supervisors</option>{filterOptions.supervisors.map((item) => { const option = optionPair(item); return <option key={item} value={option.value}>{option.label}</option>; })}</select>
              <input className="wf-input" type="date" value={filters.dateFrom} onChange={(e) => updateFilter("dateFrom", e.target.value)} />
              <input className="wf-input" type="date" value={filters.dateTo} onChange={(e) => updateFilter("dateTo", e.target.value)} />
              <button onClick={() => load()} className="wf-btn wf-btn-secondary w-full"><Filter size={17} /> Apply</button>
              <button onClick={clearFilters} className="wf-btn wf-btn-secondary w-full"><X size={17} /> Clear</button>
            </div>
          </div>
        )}
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="px-6 py-4">User</th><th className="px-4 py-4">Property</th><th className="px-4 py-4">Date</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Conversion</th><th className="px-4 py-4">Message</th><th className="px-6 py-4 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {enquiries.map((item) => (
              <tr key={item._id} className={`transition-colors hover:bg-slate-50/60 ${focusedEnquiryId === item._id ? "bg-blue-50/70 ring-1 ring-inset ring-blue-100" : ""}`}>
                <td className="px-6 py-4"><p className="font-semibold text-slate-950">{item.name}</p><p className="text-xs text-slate-500">{item.email}</p></td>
                <td className="px-4 py-4 text-sm text-slate-700">{item.propertyTitle || item.preferredLocation || item.propertyType || "General enquiry"}</td>
                <td className="px-4 py-4 text-sm text-slate-600"><Calendar size={14} className="mr-1.5 inline text-slate-400" />{formatDate(item.createdAt)}</td>
                <td className="px-4 py-4">{canManage ? <select value={item.status} onChange={(event) => updateStatus(item._id, event.target.value)} className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}><option value="new">New</option><option value="in-progress">In Progress</option><option value="closed">Closed</option></select> : <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span>}</td>
                <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.conversionType || (item.status === "closed" ? "no-conversion" : ""))}`}>{item.conversionType ? labelize(item.conversionType) : item.status === "closed" ? "No Conversion" : "Open"}</span></td>
                <td className="max-w-xs truncate px-4 py-4 text-sm text-slate-600">{item.message || "No message"}</td>
                <td className="px-6 py-4 text-right">{canDelete && <button onClick={() => remove(item._id)} className="grid h-9 w-9 place-items-center rounded-lg text-red-500 transition hover:bg-red-50"><Trash2 size={17} /></button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-6 text-sm font-bold text-slate-500">Loading enquiries...</p>}
        {!loading && !enquiries.length && <div className="p-6"><EmptyState title="No enquiries found" description="New website and property enquiries will appear here." /></div>}
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-3">
        {enquiries.map((item) => (
          <div key={item._id} className={`rounded-2xl border p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)] ${focusedEnquiryId === item._id ? "border-blue-200 bg-blue-50/70" : "border-slate-100 bg-white"}`}>
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-slate-950">{item.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.email}</p>
              </div>
              {canManage ? (
                <select value={item.status} onChange={(event) => updateStatus(item._id, event.target.value)} className={`shrink-0 rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${statusClass(item.status)}`}><option value="new">New</option><option value="in-progress">In Progress</option><option value="closed">Closed</option></select>
              ) : (
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span>
              )}
            </div>
            <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-xs font-semibold text-slate-500">Property</p>
              <p className="mt-0.5 text-sm text-slate-800">{item.propertyTitle || item.preferredLocation || item.propertyType || "General enquiry"}</p>
              <p className="mt-1 text-xs font-semibold text-slate-500">Conversion: {item.conversionType ? labelize(item.conversionType) : item.status === "closed" ? "No Conversion" : "Open"}</p>
            </div>
            {item.message && (
              <p className="mt-3 line-clamp-2 text-sm text-slate-600">{item.message}</p>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-500"><Calendar size={13} className="text-slate-400" />{formatDate(item.createdAt)}</span>
              {canDelete && <button onClick={() => remove(item._id)} className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"><Trash2 size={13} /> Remove</button>}
            </div>
          </div>
        ))}
        {loading && <p className="p-6 text-center text-sm font-bold text-slate-500">Loading enquiries...</p>}
        {!loading && !enquiries.length && <EmptyState title="No enquiries found" description="New website and property enquiries will appear here." />}
      </div>
      {closing && <ConversionModal enquiry={closing} onClose={() => setClosing(null)} onSaved={() => { setClosing(null); load(); }} />}
    </>
  );
}

function BadgeCount({ label, value, tone = "blue" }) {
  const tones = { blue: "border-blue-200 bg-blue-50 text-blue-600", yellow: "border-yellow-200 bg-yellow-50 text-yellow-700", green: "border-emerald-200 bg-emerald-50 text-emerald-700" };
  return <div className={`flex-1 rounded-xl border px-3 py-2 text-center sm:flex-none sm:px-5 sm:py-2.5 ${tones[tone]}`}><p className="text-lg font-semibold sm:text-xl">{value}</p><p className="text-[10px] font-medium sm:text-xs">{label}</p></div>;
}

function ConversionModal({ enquiry, onClose, onSaved }) {
  const property = enquiry.propertyId || {};
  const propertyName = property.title || enquiry.propertyTitle || "General enquiry";
  const propertyLocation = [property.city, property.location].filter(Boolean).join(", ") || enquiry.preferredLocation || "Not specified";
  const propertyType = property.type || enquiry.propertyType || "Not specified";
  const listedPrice = property.priceAmount || property.price || enquiry.budgetAmount || enquiry.budgetLabel || enquiry.budget || "";
  const propertyStatus = property.status || "Not linked";
  const [form, setForm] = useState({
    conversionType: enquiry.conversionType || "sold",
    finalPrice: enquiry.finalPrice || property.finalPrice || property.price || "",
    finalPriceAmount: enquiry.finalPriceAmount || parseINRAmount(enquiry.finalPrice || property.finalPrice || property.price),
    commission: enquiry.commission || "",
    commissionAmount: enquiry.commissionAmount || parseINRAmount(enquiry.commission),
    paymentDetails: enquiry.paymentDetails || "",
    closingDate: enquiry.closingDate ? formatDate(enquiry.closingDate) : formatDate(new Date()),
    remarks: enquiry.remarks || "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (event) => setForm((current) => ({
    ...current,
    [event.target.name]: event.target.value,
    ...(event.target.name === "finalPrice" ? { finalPriceAmount: parseINRAmount(event.target.value) } : {}),
    ...(event.target.name === "commission" ? { commissionAmount: parseINRAmount(event.target.value) } : {}),
  }));
  const save = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      if ((form.conversionType === "sold" || form.conversionType === "rented") && !form.finalPrice.trim()) {
        throw new Error("Final deal price is required for sold or rented closures.");
      }
      await staffApi.updateEnquiry(enquiry._id, {
        status: "closed",
        ...form,
      });
      onSaved();
    } catch (err) {
      setError(err.message || "Unable to close enquiry.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] grid place-items-center bg-slate-950/50 p-4">
      <form onSubmit={save} className="flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-950">Close Enquiry</h3>
            <p className="mt-1 text-sm text-slate-500">{enquiry.name} · {propertyName}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="wf-smooth-scroll flex-1 overflow-y-auto p-5 pb-28 sm:p-6">
        <InlineAlert message={error} />
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Property Details</p>
                <h4 className="mt-1 text-lg font-extrabold text-slate-950">{propertyName}</h4>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(property.status || "")}`}>{labelize(propertyStatus)}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <OwnerCell label="City / Location" value={propertyLocation} />
              <OwnerCell label="Property Type" value={propertyType} />
              <OwnerCell label="Listed Price" value={formatINR(listedPrice)} />
              <OwnerCell label="Current Status" value={labelize(propertyStatus)} />
            </div>
          </div>
          <div className="rounded-2xl border border-blue-100 bg-blue-50/70 p-4">
            <p className="text-xs font-bold uppercase tracking-wide text-blue-700">Customer / Enquiry</p>
            <h4 className="mt-1 text-lg font-extrabold text-slate-950">{enquiry.name}</h4>
            <div className="mt-4 grid grid-cols-2 gap-3">
              <OwnerCell label="Mobile" value={enquiry.phone || "Not available"} />
              <OwnerCell label="Email" value={enquiry.email || "Not available"} />
              <OwnerCell label="Budget" value={enquiry.budgetLabel || enquiry.budget || "Not specified"} />
              <OwnerCell label="Source" value={labelize(enquiry.source || "website")} />
            </div>
            {enquiry.message && <p className="mt-4 rounded-xl bg-white/80 p-3 text-sm text-slate-600">{enquiry.message}</p>}
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div className="md:col-span-2">
            <SearchableDropdown
              label="Close Result"
              name="conversionType"
              value={form.conversionType}
              onChange={update}
              required
              options={[
                { label: "Closed as Sold", value: "sold" },
                { label: "Closed as Rented", value: "rented" },
                { label: "Closed without Conversion", value: "no-conversion" },
              ]}
            />
          </div>
          <MoneyField label="Final Deal Price" name="finalPrice" value={form.finalPriceAmount || form.finalPrice} onChange={update} required={form.conversionType === "sold" || form.conversionType === "rented"} />
          <MoneyField label="Commission / Brokerage" name="commission" value={form.commissionAmount || form.commission} onChange={update} />
          <Field label="Closing Date" name="closingDate" type="date" value={form.closingDate} onChange={update} required />
          <Field label="Payment / Costing Details" name="paymentDetails" value={form.paymentDetails} onChange={update} />
          <label className="md:col-span-2">
            <span className="wf-label">Remarks / Notes</span>
            <textarea className="wf-input min-h-24" name="remarks" value={form.remarks} onChange={update} placeholder="Closing context, payment terms, pending documents..." />
          </label>
        </div>
        </div>
        <FormFooterActions onCancel={onClose} disabled={saving} submitLabel={saving ? "Saving..." : "Save Closing"} />
      </form>
    </div>
  );
}

function SoldRentedReportsSection({ role, token }) {
  const location = useLocation();
  const navigate = useNavigate();
  const focusedDealId = new URLSearchParams(location.search).get("dealId");
  const [data, setData] = useState({ rows: [], totals: {} });
  const [filters, setFilters] = useState({ range: "this-month", conversionType: "all", supervisorId: "all", city: "all", dateFrom: "", dateTo: "", search: "" });
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDeal, setSelectedDeal] = useState(null);
  const rows = useMemo(() => data.rows || [], [data.rows]);
  const cityOptions = uniqueOptions(rows, (item) => item.cityLocation);

  const load = async (nextFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const response = await staffApi.soldRentedReport(nextFilters);
      setData(response.data);
    } catch (err) {
      setError(err.message || "Unable to load sold/rented reports.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    staffApi.soldRentedReport({ range: "this-month", conversionType: "all", supervisorId: "all", city: "all", dateFrom: "", dateTo: "", search: "" })
      .then((response) => {
        if (active) setData(response.data);
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load sold/rented reports.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    if (role === "admin") {
      staffApi.staff().then((response) => active && setSupervisors(response.data.filter((item) => item.role === "supervisor"))).catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [role]);

  useEffect(() => {
    if (!focusedDealId || selectedDeal || !rows.length) return;
    const match = rows.find((item) => item.id === focusedDealId || item.propertyId === focusedDealId);
    if (!match) return;
    const timer = window.setTimeout(() => setSelectedDeal(match), 0);
    return () => window.clearTimeout(timer);
  }, [focusedDealId, rows, selectedDeal]);

  const closeSelectedDeal = () => {
    setSelectedDeal(null);
    if (focusedDealId) navigate(location.pathname, { replace: true });
  };

  const updateFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value }));
  const clearFilters = () => {
    const next = { range: "this-month", conversionType: "all", supervisorId: "all", city: "all", dateFrom: "", dateTo: "", search: "" };
    setFilters(next);
    load(next);
  };
  const exportReport = async (format) => {
    if (!token) {
      window.dispatchEvent(new CustomEvent("staff-auth:unauthorized"));
      return;
    }
    const response = await fetch(staffApi.reportUrl("sold-rented", filters.range, format, filters), { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) return;
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `sold-rented-report.${format === "pdf" ? "pdf" : "xls"}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <PageTitle
        title="Sold & Rented Reports"
        subtitle="Track finalized property conversions, closing prices, brokerage, and payment notes"
        action={<div className="flex flex-wrap gap-3"><button onClick={() => exportReport("pdf")} className="wf-btn wf-btn-primary w-full sm:w-auto"><Download size={17} /> PDF</button><button onClick={() => exportReport("excel")} className="wf-btn wf-btn-secondary w-full sm:w-auto"><Download size={17} /> Excel</button></div>}
      />
      <InlineAlert message={error} />
      <div className="mb-6 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        <StatCard icon={Check} color="green" label="Sold" value={data.totals?.sold ?? 0} />
        <StatCard icon={Home} color="teal" label="Rented" value={data.totals?.rented ?? 0} />
        <StatCard icon={FileText} color="purple" label="Final Price" value={data.totals?.revenueLabel ?? "₹0"} />
        <StatCard icon={ClipboardList} label="Commission" value={data.totals?.commissionLabel ?? "₹0"} />
      </div>
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[0.8fr_0.8fr_0.9fr_0.9fr_0.85fr_0.85fr_1fr_auto_auto]">
          <select className="wf-input" value={filters.range} onChange={(event) => updateFilter("range", event.target.value)}>
            <option value="this-month">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="six-months">6 Months</option>
            <option value="yearly">Yearly</option>
            <option value="this-week">This Week</option>
          </select>
          <select className="wf-input" value={filters.conversionType} onChange={(event) => updateFilter("conversionType", event.target.value)}>
            <option value="all">Sold & Rented</option>
            <option value="sold">Sold Only</option>
            <option value="rented">Rented Only</option>
          </select>
          {role === "admin" && (
            <select className="wf-input" value={filters.supervisorId} onChange={(event) => updateFilter("supervisorId", event.target.value)}>
              <option value="all">All Supervisors</option>
              {supervisors.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
          )}
          <select className="wf-input" value={filters.city} onChange={(event) => updateFilter("city", event.target.value)}>
            <option value="all">All Cities</option>
            {cityOptions.map((city) => <option key={city} value={city}>{city}</option>)}
          </select>
          <input className="wf-input" type="date" value={filters.dateFrom} onChange={(event) => updateFilter("dateFrom", event.target.value)} />
          <input className="wf-input" type="date" value={filters.dateTo} onChange={(event) => updateFilter("dateTo", event.target.value)} />
          <input className="wf-input" value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Search property/customer..." />
          <button onClick={() => load()} className="wf-btn wf-btn-secondary w-full"><Filter size={17} /> Filter</button>
          <button onClick={clearFilters} className="wf-btn wf-btn-secondary w-full"><X size={17} /> Clear</button>
        </div>
      </div>
      <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.14)] lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="px-5 py-4">Property</th><th className="px-4 py-4">Property ID</th><th className="px-4 py-4">Customer</th><th className="px-4 py-4">Supervisor</th><th className="px-4 py-4">Type</th><th className="px-4 py-4">Original</th><th className="px-4 py-4">Final</th><th className="px-4 py-4">Commission</th><th className="px-4 py-4">Closing</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {rows.map((item, index) => (
              <tr key={`${item.property}-${item.customer}-${index}`} onClick={() => setSelectedDeal(item)} className="cursor-pointer hover:bg-slate-50/60">
                <td className="px-5 py-4"><p className="font-bold text-slate-950">{item.property}</p><p className="text-xs text-slate-500">{item.cityLocation}</p></td>
                <td className="px-4 py-4 text-xs font-bold text-slate-600">{item.propertyCode || "—"}</td>
                <td className="px-4 py-4"><p className="font-semibold">{item.customer}</p><p className="text-xs text-slate-500">{item.phone}</p></td>
                <td className="px-4 py-4">{item.supervisor || "Unassigned"}</td>
                <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.conversionType.toLowerCase())}`}>{item.conversionType}</span></td>
                <td className="px-4 py-4">{item.originalPrice || "—"}</td>
                <td className="px-4 py-4 font-bold text-blue-600">{item.finalPrice || "—"}</td>
                <td className="px-4 py-4">{item.commission || "—"}</td>
                <td className="px-4 py-4">{item.closingDate || "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {loading && <p className="p-6 text-sm font-bold text-slate-500">Loading report...</p>}
        {!loading && !rows.length && <div className="p-6"><EmptyState title="No sold or rented records" description="Close enquiries as sold or rented to populate this report." /></div>}
      </div>
      <div className="space-y-3 lg:hidden">
        {loading && <LoadingState label="Loading report..." />}
        {rows.map((item, index) => (
          <button key={`${item.property}-${item.customer}-${index}`} onClick={() => setSelectedDeal(item)} className="w-full rounded-2xl border border-slate-100 bg-white p-4 text-left shadow-[0_4px_16px_rgba(15,23,42,0.08)]">
            <div className="flex items-start justify-between gap-3">
              <div><p className="font-bold text-slate-950">{item.property}</p><p className="text-xs text-slate-500">{item.cityLocation}</p></div>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(item.conversionType.toLowerCase())}`}>{item.conversionType}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <OwnerCell label="Customer" value={item.customer} />
              <OwnerCell label="Property ID" value={item.propertyCode || "—"} />
              <OwnerCell label="Supervisor" value={item.supervisor || "Unassigned"} />
              <OwnerCell label="Final Price" value={item.finalPrice || "—"} />
              <OwnerCell label="Closing" value={item.closingDate || "—"} />
            </div>
          </button>
        ))}
        {!loading && !rows.length && <EmptyState title="No sold or rented records" description="Close enquiries as sold or rented to populate this report." />}
      </div>
      {selectedDeal && <SoldRentedDetailModal deal={selectedDeal} onClose={closeSelectedDeal} />}
    </>
  );
}

function SoldRentedDetailModal({ deal, onClose }) {
  const images = [deal.image, ...(deal.gallery || [])].filter(Boolean);
  return (
    <div className="fixed inset-0 z-[600] grid place-items-center bg-slate-950/60 p-4">
      <div className="wf-smooth-scroll max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-2xl font-extrabold text-slate-950">{deal.property}</h3>
            <p className="mt-1 text-sm text-slate-500">{deal.cityLocation || "Location not available"} · {deal.conversionType}</p>
          </div>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"><X size={20} /></button>
        </div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-4">
            <div className="overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
              <img src={images[0] || "https://placehold.co/900x620?text=Property"} alt={deal.property} className="h-64 w-full object-cover" />
            </div>
            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {images.slice(1, 5).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="h-20 rounded-xl object-cover" />)}
              </div>
            )}
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4 md:col-span-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Property Details</p>
                  <h4 className="mt-1 text-xl font-extrabold text-slate-950">{deal.property}</h4>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-bold ${statusClass(String(deal.conversionType).toLowerCase())}`}>{deal.conversionType}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <OwnerCell label="Type" value={deal.propertyType || "Not specified"} />
                <OwnerCell label="Property ID" value={deal.propertyCode || "—"} />
                <OwnerCell label="Category" value={deal.category || "Not specified"} />
                <OwnerCell label="Location" value={deal.cityLocation || "Not specified"} />
                <OwnerCell label="Deal Source" value={deal.dealSource || "Not specified"} />
              </div>
            </div>
            <OwnerCell label="Listed Price / Rent" value={deal.originalPrice || "—"} />
            <OwnerCell label="Final Sold/Rented Price" value={deal.finalPrice || "—"} />
            <OwnerCell label="Commission" value={deal.commission || "—"} />
            <OwnerCell label="Deal Date" value={deal.closingDate || "—"} />
            <OwnerCell label="Customer / Buyer / Tenant" value={deal.customer || "—"} />
            <OwnerCell label="Customer Phone" value={deal.phone || "—"} />
            <OwnerCell label="Customer Email" value={deal.email || "—"} />
            <OwnerCell label="Customer Address" value={deal.customerAddress || "—"} />
            <OwnerCell label="Supervisor" value={deal.supervisor || "Unassigned"} />
            <OwnerCell label="Enquiry Reference" value={deal.sourceType === "enquiry" ? deal.id : "Manual deal"} />
            <div className="md:col-span-2 rounded-2xl border border-slate-100 bg-white p-4">
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Payment / Remarks</p>
              <p className="mt-2 text-sm text-slate-700">{deal.paymentDetails || deal.remarks || "No notes added."}</p>
              {deal.paymentDetails && deal.remarks && <p className="mt-2 text-sm text-slate-500">{deal.remarks}</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AnalyticsSection() {
  const { staffToken, staffUser } = useStaffAuth();
  const [data, setData] = useState(null);
  const [exporting, setExporting] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [supervisors, setSupervisors] = useState([]);
  const [filters, setFilters] = useState({ range: "this-month", supervisorId: "all", city: "all", propertyType: "all", source: "all", conversionType: "all" });
  useEffect(() => {
    let active = true;
    staffApi.analytics({ range: "this-month", supervisorId: "all", city: "all", propertyType: "all", source: "all", conversionType: "all" })
      .then((response) => {
        if (!active) return;
        setData(response.data);
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load analytics.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    if (staffUser.role === "admin") {
      staffApi.staff().then((response) => active && setSupervisors(response.data.filter((item) => item.role === "supervisor"))).catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [staffUser.role]);
  const cards = data?.cards || {};
  const updateFilter = (name, value) => setFilters((current) => ({ ...current, [name]: value }));
  const load = async (nextFilters = filters) => {
    setLoading(true);
    setError("");
    try {
      const response = await staffApi.analytics(nextFilters);
      setData(response.data);
    } catch (err) {
      setError(err.message || "Unable to load analytics.");
    } finally {
      setLoading(false);
    }
  };
  const clearFilters = () => {
    const next = { range: "this-month", supervisorId: "all", city: "all", propertyType: "all", source: "all", conversionType: "all" };
    setFilters(next);
    load(next);
  };
  const exportAnalytics = async (format) => {
    if (!staffToken) {
      window.dispatchEvent(new CustomEvent("staff-auth:unauthorized"));
      return;
    }
    setExporting(format);
    try {
      const response = await fetch(staffApi.reportUrl("analytics", filters.range, format, filters), { headers: { Authorization: `Bearer ${staffToken}` } });
      if (!response.ok) {
        if (response.status === 401) window.dispatchEvent(new CustomEvent("staff-auth:unauthorized"));
        return;
      }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `analytics-report.${format === "pdf" ? "pdf" : "xls"}`;
      link.click();
      URL.revokeObjectURL(url);
    } finally {
      setExporting("");
    }
  };
  return (
    <>
      <PageTitle
        title="Lead Analytics"
        subtitle="Track performance and conversion metrics"
        action={<div className="flex flex-wrap gap-3"><button onClick={() => exportAnalytics("pdf")} className="wf-btn wf-btn-primary w-full sm:w-auto" disabled={Boolean(exporting)}><Download size={17} /> PDF</button><button onClick={() => exportAnalytics("excel")} className="wf-btn wf-btn-secondary w-full sm:w-auto" disabled={Boolean(exporting)}><Download size={17} /> Excel</button></div>}
      />
      <InlineAlert message={error} />
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-5">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[0.9fr_1fr_0.8fr_0.8fr_0.8fr_0.9fr_auto_auto]">
          <select className="wf-input" value={filters.range} onChange={(event) => updateFilter("range", event.target.value)}>
            <option value="this-month">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="six-months">6 Months</option>
            <option value="yearly">Yearly</option>
            <option value="this-week">This Week</option>
          </select>
          {staffUser.role === "admin" && (
            <select className="wf-input" value={filters.supervisorId} onChange={(event) => updateFilter("supervisorId", event.target.value)}>
              <option value="all">All Supervisors</option>
              {supervisors.map((item) => <option key={item._id} value={item._id}>{item.name}</option>)}
            </select>
          )}
          <input className="wf-input" value={filters.city === "all" ? "" : filters.city} onChange={(event) => updateFilter("city", event.target.value || "all")} placeholder="City" />
          <select className="wf-input" value={filters.propertyType} onChange={(event) => updateFilter("propertyType", event.target.value)}>
            <option value="all">All Types</option>
            {propertyOptionGroups.category.map((item) => <option key={item} value={item}>{item}</option>)}
            <option value="Apartments">Apartments</option>
            <option value="Villa">Villa</option>
            <option value="Villas">Villas</option>
          </select>
          <select className="wf-input" value={filters.source} onChange={(event) => updateFilter("source", event.target.value)}>
            <option value="all">All Sources</option>
            <option value="website">Website</option>
            <option value="property-detail">Property Detail</option>
            <option value="guest">Guest Form</option>
            <option value="admin">Admin</option>
          </select>
          <select className="wf-input" value={filters.conversionType} onChange={(event) => updateFilter("conversionType", event.target.value)}>
            <option value="all">All Conversions</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
            <option value="no-conversion">No Conversion</option>
          </select>
          <button onClick={() => load()} className="wf-btn wf-btn-secondary w-full"><Filter size={17} /> Apply</button>
          <button onClick={clearFilters} className="wf-btn wf-btn-secondary w-full"><X size={17} /> Clear</button>
        </div>
      </div>
      {loading && <LoadingState label="Loading analytics..." />}
      {!loading && !error && (
        <>
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4 xl:grid-cols-6">
        <StatCard icon={Users} color="purple" label="Total Leads" value={cards.totalLeads ?? 0} />
        <StatCard icon={ClipboardList} color="teal" label="Conversion Rate" value={`${cards.conversionRate ?? 0}%`} />
        <StatCard icon={FileText} color="green" label="Revenue Generated" value={cards.revenueGenerated ?? "₹0"} />
        <StatCard icon={BarChart3} label="Avg Response Time" value={cards.avgResponseTime ?? "0 hrs"} />
        <StatCard icon={Check} color="green" label="Sold / Rented" value={`${cards.soldCount ?? 0} / ${cards.rentedCount ?? 0}`} />
        <StatCard icon={MessageSquare} label="Pending Enquiries" value={cards.pendingEnquiries ?? 0} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <LineChartCard title="Weekly Enquiries & Conversions" points={data?.weekly || []} />
        <LineChartCard title="Monthly Enquiries & Conversions" points={data?.monthly || []} />
        <BarChartCard title="Lead Sources" points={data?.sources || []} />
        <BarChartCard title="Sold vs Rented" points={data?.conversionTypes || []} />
        <BarChartCard title="City-wise Enquiries" points={data?.cityStats || []} />
        <BarChartCard title="Property-wise Enquiries" points={data?.propertyStats || []} />
      </div>
      {(data?.supervisorPerformance || []).length > 0 && (
        <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-6">
          <h3 className="text-lg font-bold sm:text-xl">Top Performing Supervisors</h3>
          <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {data.supervisorPerformance.map((item) => (
              <div key={item._id || item.name} className="rounded-xl bg-slate-50 p-4">
                <p className="font-bold text-slate-950">{item.name || "Unassigned"}</p>
                <p className="mt-1 text-xs text-slate-500">{item.email}</p>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <MiniMetric label="Leads" value={item.leads || 0} />
                  <MiniMetric label="Sold" value={item.sold || 0} />
                  <MiniMetric label="Rented" value={item.rented || 0} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-6">
        <h3 className="text-lg font-bold sm:text-xl">Conversion Funnel</h3>
        <div className="mt-5 space-y-4 sm:mt-6">{(data?.funnel || []).map((item) => <div key={item.label} className="space-y-1.5 sm:grid sm:grid-cols-[130px_1fr_80px] sm:items-center sm:gap-3 sm:space-y-0"><span className="block text-sm font-medium text-slate-600">{item.label}</span><div className="h-9 overflow-hidden rounded-lg bg-slate-100 sm:h-10"><div className="h-full rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-500" style={{ width: `${Math.max(item.percent, 4)}%` }} /></div><span className="block text-right text-sm font-bold text-slate-800">{item.value}</span></div>)}</div>
      </div>
        </>
      )}
    </>
  );
}

function LineChartCard({ title, points }) {
  const max = Math.max(...points.map((point) => Math.max(point.enquiries || 0, point.conversions || 0)), 1);
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-lg font-bold sm:text-xl">{title}</h3>
        <div className="flex gap-3 text-xs font-bold text-slate-500"><span className="text-blue-600">Enquiries</span><span className="text-emerald-600">Conversions</span></div>
      </div>
      <div className="mt-5 flex h-56 items-end gap-2 sm:gap-3">
        {points.length ? points.map((point) => (
          <div key={point.date || point.label || point.day} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-44 w-full items-end justify-center gap-1 rounded-xl bg-slate-50 px-1 py-2">
              <span className="w-2.5 rounded-t-md bg-blue-600" style={{ height: `${Math.max(4, ((point.enquiries || 0) / max) * 100)}%` }} />
              <span className="w-2.5 rounded-t-md bg-emerald-500" style={{ height: `${Math.max(4, ((point.conversions || 0) / max) * 100)}%` }} />
            </div>
            <span className="text-[10px] font-semibold text-slate-500 sm:text-xs">{point.day || point.label}</span>
          </div>
        )) : <EmptyState title="No chart data" description="Data appears after enquiries are created in this period." />}
      </div>
    </div>
  );
}

function BarChartCard({ title, points }) {
  const max = Math.max(...points.map((point) => point.value || 1), 1);
  const total = points.reduce((sum, point) => sum + Number(point.value || 0), 0);
  const topPoint = [...points].sort((a, b) => (b.value || 0) - (a.value || 0))[0];
  const colors = ["from-blue-600 to-cyan-500", "from-emerald-500 to-teal-500", "from-purple-500 to-fuchsia-500", "from-amber-500 to-orange-500", "from-rose-500 to-pink-500"];
  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-[0_10px_30px_rgba(15,23,42,0.10)] transition hover:shadow-[0_18px_46px_rgba(15,23,42,0.14)]">
      <div className="border-b border-slate-100 bg-gradient-to-br from-white to-slate-50 px-5 py-4 sm:px-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-950 sm:text-xl">{title}</h3>
            <p className="mt-1 text-xs font-semibold text-slate-500">
              {total ? `${total} records${topPoint?.label ? ` · Top: ${topPoint.label}` : ""}` : "No records for the selected filters"}
            </p>
          </div>
          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-extrabold text-blue-600">{total}</span>
        </div>
      </div>
      <div className="p-5 sm:p-6">
        {points.length ? (
          <div className="space-y-4">
            <div className="grid min-h-48 grid-cols-2 items-end gap-3 rounded-2xl bg-slate-50 p-4 sm:grid-cols-3 lg:grid-cols-4">
              {points.slice(0, 8).map((point, index) => (
                <div key={point.label} className="flex min-w-0 flex-col items-center gap-2">
                  <div className="flex h-32 w-full items-end justify-center rounded-xl bg-white px-2 py-2 shadow-inner">
                    <div
                      className={`w-full max-w-12 rounded-t-xl bg-gradient-to-t ${colors[index % colors.length]} shadow-sm transition-all duration-500`}
                      style={{ height: `${Math.max(8, (point.value / max) * 100)}%` }}
                    />
                  </div>
                  <span className="max-w-full truncate text-xs font-bold text-slate-600" title={point.label}>{point.label}</span>
                  <span className="rounded-full bg-white px-2.5 py-1 text-xs font-extrabold text-slate-900 shadow-sm">{point.value}</span>
                </div>
              ))}
            </div>
            <div className="space-y-3">
              {points.slice(0, 6).map((point, index) => (
                <div key={`${point.label}-legend`} className="grid grid-cols-[minmax(90px,150px)_1fr_auto] items-center gap-3 text-sm">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className={`h-2.5 w-2.5 shrink-0 rounded-full bg-gradient-to-r ${colors[index % colors.length]}`} />
                    <span className="truncate font-semibold text-slate-600" title={point.label}>{point.label}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className={`h-full rounded-full bg-gradient-to-r ${colors[index % colors.length]}`} style={{ width: `${Math.max(4, (point.value / max) * 100)}%` }} />
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{point.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <EmptyState title="No chart data" description="No matching records for the selected filters." />
        )}
      </div>
    </div>
  );
}

function ReportsSection({ token, role }) {
  const [type, setType] = useState("enquiries");
  const [range, setRange] = useState("this-month");
  const reportTypes = role === "admin" ? ["enquiries", "sold-rented", "leads", "properties", "owners"] : ["enquiries", "sold-rented", "leads", "properties"];
  const exportCsv = async () => {
    if (!token) {
      window.dispatchEvent(new CustomEvent("staff-auth:unauthorized"));
      return;
    }
    const response = await fetch(staffApi.reportUrl(type, range), { headers: { Authorization: `Bearer ${token}` } });
    if (!response.ok) {
      if (response.status === 401) window.dispatchEvent(new CustomEvent("staff-auth:unauthorized"));
      return;
    }
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${type}-report.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };
  return (
    <>
      <PageTitle title="Reports & Export" subtitle="Generate and download platform reports" action={<button onClick={exportCsv} className="wf-btn wf-btn-primary w-full sm:w-auto"><Download size={17} /> Export CSV</button>} />
      <div className="mx-auto max-w-4xl rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-6 lg:p-8">
        <h3 className="text-base font-bold sm:text-lg">Select Data Type</h3>
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">{reportTypes.map((item) => <button key={item} onClick={() => setType(item)} className={`rounded-xl border p-4 text-center text-sm font-bold capitalize transition-all sm:p-6 ${type === item ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}><FileText size={20} className="mx-auto mb-2 sm:mb-3" />{item}</button>)}</div>
        <h3 className="mt-6 text-base font-bold sm:mt-8 sm:text-lg">Select Date Range</h3>
        <div className="mt-4 space-y-2 sm:space-y-3">{["today", "this-week", "this-month", "last-month", "this-year"].map((item) => <button key={item} onClick={() => setRange(item)} className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left text-sm font-semibold capitalize transition-all sm:p-4 ${range === item ? "border-blue-500 bg-blue-50 text-blue-600 shadow-sm" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}><Calendar size={16} className="shrink-0 sm:h-[18px] sm:w-[18px]" />{item.replace("-", " ")}</button>)}</div>
      </div>
    </>
  );
}

function PageEditsSection() {
  const [content, setContent] = useState([]);
  const [activeTab, setActiveTab] = useState("home");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    publicApi.content()
      .then((response) => {
        if (!active) return;
        setContent(response.data);
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load settings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const itemByKey = (key) => content.find((item) => item.key === key);
  const updateContentKey = (key, value) => setContent((items) => items.map((item) => (item.key === key ? { ...item, value } : item)));
  const updateLocal = (id, value) => setContent((items) => items.map((item) => (item._id === id ? { ...item, value } : item)));
  const navbarAreas = Array.isArray(itemByKey("navbarAreas")?.value) ? itemByKey("navbarAreas").value : defaultNavbarAreas;
  const topLists = Array.isArray(itemByKey("navbarTopLists")?.value) ? itemByKey("navbarTopLists").value : defaultTopLists;
  const aboutContent = itemByKey("aboutContent")?.value && typeof itemByKey("aboutContent").value === "object" ? { ...defaultAboutContent, ...itemByKey("aboutContent").value } : defaultAboutContent;
  const contactContent = itemByKey("contactContent")?.value && typeof itemByKey("contactContent").value === "object" ? { ...defaultContactContent, ...itemByKey("contactContent").value } : defaultContactContent;
  const updateAbout = (patch) => updateContentKey("aboutContent", { ...aboutContent, ...patch });
  const updateContact = (patch) => updateContentKey("contactContent", { ...contactContent, ...patch });
  const uploadAboutImage = async (field, file) => {
    if (!file) return;
    setSaving(true);
    setError("");
    try {
      const response = await staffApi.uploadPropertyImages([file]);
      updateAbout({ [field]: response.data.urls?.[0] || "" });
    } catch (err) {
      setError(err.message || "Unable to upload image.");
    } finally {
      setSaving(false);
    }
  };
  const uploadContentImage = async (key, file) => {
    if (!file) return;
    setSaving(true);
    setError("");
    try {
      const response = await staffApi.uploadPropertyImages([file]);
      updateContentKey(key, response.data.urls?.[0] || "");
    } catch (err) {
      setError(err.message || "Unable to upload image.");
    } finally {
      setSaving(false);
    }
  };
  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      for (const item of content) {
        await staffApi.updateContent(item._id, item.value);
      }
      setMessage("Changes saved");
    } catch (err) {
      setError(err.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };
  const tabs = [
    ["home", "Home"],
    ["about", "About Us"],
    ["contact", "Contact Us"],
    ["navbar", "Navbar"],
  ];

  return (
    <>
      <PageTitle title="Page Edits" subtitle="Manage website pages and navbar content from one admin-only workspace" action={<button onClick={save} className="wf-btn wf-btn-primary w-full sm:w-auto" disabled={saving || loading}><Save size={17} /> {saving ? "Saving..." : "Save Page Edits"}</button>} />
      <InlineAlert message={error} />
      <InlineAlert message={message} tone="green" />
      {loading && <LoadingState label="Loading page content..." />}
      {!loading && (
        <>
          <div className="mb-6 overflow-x-auto rounded-2xl border border-slate-100 bg-white p-2 shadow-sm">
            <div className="flex min-w-max gap-2">
              {tabs.map(([key, label]) => (
                <button key={key} type="button" onClick={() => setActiveTab(key)} className={`rounded-xl px-4 py-2.5 text-sm font-extrabold transition ${activeTab === key ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20" : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"}`}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          {activeTab === "home" && <HomeCMSForm content={content} updateLocal={updateLocal} uploadImage={uploadContentImage} disabled={saving} />}
          {activeTab === "about" && <AboutCMSForm value={aboutContent} onChange={updateAbout} onUpload={uploadAboutImage} disabled={saving} />}
          {activeTab === "contact" && <ContactCMSForm value={contactContent} onChange={updateContact} disabled={saving} />}
          {activeTab === "navbar" && <NavbarManagement value={{ navbarAreas, topLists }} onChange={updateContentKey} />}
        </>
      )}
    </>
  );
}

function SettingsSection() {
  const [content, setContent] = useState([]);
  const [siteName, setSiteName] = useState("Akshar Estate The Property HUB");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [brokeragePercent, setBrokeragePercent] = useState(2);
  const [brokerageNotes, setBrokerageNotes] = useState("");
  const [savingBrokerage, setSavingBrokerage] = useState(false);
  const [brokerageMessage, setBrokerageMessage] = useState("");

  useEffect(() => {
    let active = true;
    publicApi.content()
      .then((response) => {
        if (!active) return;
        setContent(response.data);
        const site = response.data.find((item) => item.key === "siteName");
        if (site) setSiteName(site.value);
        const brokerage = response.data.find((item) => item.key === "brokerageSettings");
        if (brokerage?.value) {
          if (brokerage.value.percentage != null) setBrokeragePercent(Number(brokerage.value.percentage));
          if (brokerage.value.notes) setBrokerageNotes(brokerage.value.notes);
        }
        setError("");
      })
      .catch((err) => {
        if (active) setError(err.message || "Unable to load settings.");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const updateLocal = (id, value) => setContent((items) => items.map((item) => (item._id === id ? { ...item, value } : item)));
  const save = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    try {
      for (const item of content) {
        if (item.key === "siteName") await staffApi.updateContent(item._id, siteName);
        else if (!["Home Hero", "Navigation", "About Us", "Contact Us"].includes(item.section) && item.type !== "json") await staffApi.updateContent(item._id, item.value);
      }
      setMessage("Changes saved");
    } catch (err) {
      setError(err.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  };

  const saveBrokerage = async () => {
    const pct = Number(brokeragePercent);
    if (isNaN(pct) || pct < 0 || pct > 100) {
      setBrokerageMessage("Percentage must be between 0 and 100.");
      return;
    }
    const brokerageItem = content.find((item) => item.key === "brokerageSettings");
    if (!brokerageItem) {
      setBrokerageMessage("Brokerage settings not found. Please refresh.");
      return;
    }
    setSavingBrokerage(true);
    setBrokerageMessage("");
    try {
      await staffApi.updateContent(brokerageItem._id, { percentage: pct, notes: brokerageNotes });
      setBrokerageMessage(`Saved — brokerage set to ${pct}%`);
    } catch (err) {
      setBrokerageMessage(err.message || "Failed to save brokerage settings.");
    } finally {
      setSavingBrokerage(false);
    }
  };

  const editableSettings = content.filter((item) => item.key !== "siteName" && item.key !== "brokerageSettings" && !["Home Hero", "Navigation", "About Us", "Contact Us", "Business Settings"].includes(item.section) && item.type !== "json");

  return (
    <>
      <PageTitle title="Platform Settings" subtitle="Configure platform branding and operational settings" action={<button onClick={save} className="wf-btn wf-btn-primary w-full sm:w-auto" disabled={saving || loading}><Save size={17} /> {saving ? "Saving..." : "Save Changes"}</button>} />
      <InlineAlert message={error} />
      <InlineAlert message={message} tone="green" />
      {loading && <LoadingState label="Loading settings..." />}
      {!loading && (
        <>
          <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.14)] sm:p-6">
            <h3 className="text-xl font-bold">Branding</h3>
            <label className="mt-6 block"><span className="wf-label">Site Name</span><input className="wf-input" value={siteName} onChange={(event) => setSiteName(event.target.value)} /></label>
            <div className="mt-6"><p className="wf-label">Platform Logo</p><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"><span className="grid h-20 w-20 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 text-3xl text-white">A</span></div></div>
            <div className="mt-6"><p className="wf-label">Brand Colors</p><div className="flex flex-wrap gap-3"><span className="h-12 w-12 rounded-lg bg-blue-600 ring-1 ring-slate-200" /><span className="h-12 w-12 rounded-lg bg-teal-600 ring-1 ring-slate-200" /></div></div>
          </div>

          <div className="mt-8 rounded-2xl border border-blue-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.14)] sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h3 className="text-xl font-bold">Brokerage &amp; Commission</h3>
                <p className="mt-1 text-sm text-slate-500">This percentage is displayed in the seller Terms &amp; Conditions modal that owners must accept before submitting a property.</p>
              </div>
              <button onClick={saveBrokerage} disabled={savingBrokerage} className="wf-btn wf-btn-primary shrink-0">
                <Save size={16} /> {savingBrokerage ? "Saving..." : "Save Brokerage"}
              </button>
            </div>
            {brokerageMessage && (
              <div className={`mt-4 rounded-xl px-4 py-2 text-sm font-bold ${brokerageMessage.startsWith("Saved") ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                {brokerageMessage}
              </div>
            )}
            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <label className="block">
                <span className="wf-label">Brokerage Percentage (%)</span>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.5}
                    value={brokeragePercent}
                    onChange={(event) => setBrokeragePercent(event.target.value)}
                    className="wf-input max-w-40"
                  />
                  <span className="text-2xl font-black text-blue-600">{brokeragePercent}%</span>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-500">Quick presets:</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {[1, 1.5, 2, 2.5, 3, 5].map((pct) => (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => setBrokeragePercent(pct)}
                      className={`rounded-full px-3 py-1.5 text-xs font-black ring-1 transition ${Number(brokeragePercent) === pct ? "bg-blue-600 text-white ring-blue-600" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50"}`}
                    >
                      {pct}%
                    </button>
                  ))}
                </div>
              </label>
              <label className="block">
                <span className="wf-label">Admin Notes (internal)</span>
                <textarea
                  value={brokerageNotes}
                  onChange={(event) => setBrokerageNotes(event.target.value)}
                  rows={4}
                  className="wf-input min-h-28"
                  placeholder="e.g. Standard rate as per management decision dated Jan 2025"
                />
              </label>
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.14)] sm:p-6">
            <h3 className="text-xl font-bold">Website Content & Email Templates</h3>
            {editableSettings.length ? (
              <div className="mt-6 space-y-5">{editableSettings.map((item) => <label key={item._id} className="block"><span className="wf-label">{item.label}</span>{item.type === "textarea" ? <textarea className="wf-input min-h-28" value={item.value} onChange={(event) => updateLocal(item._id, event.target.value)} /> : <input className="wf-input" value={item.value} onChange={(event) => updateLocal(item._id, event.target.value)} />}</label>)}</div>
            ) : (
              <EmptyState title="No operational settings" description="Page and navbar editing has moved to the Page Edits menu." />
            )}
          </div>
        </>
      )}
    </>
  );
}

function HomeCMSForm({ content, updateLocal, uploadImage, disabled }) {
  const item = (key) => content.find((entry) => entry.key === key);
  const field = (key) => item(key) || { _id: key, value: "" };
  const update = (key, value) => {
    const target = item(key);
    if (target) updateLocal(target._id, value);
  };
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.14)] sm:p-6">
      <h3 className="text-xl font-bold">Home Page</h3>
      <p className="mt-1 text-sm text-slate-500">Edit the hero content shown on the client-side home page.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <label className="md:col-span-2">
          <span className="wf-label">Hero Title</span>
          <textarea className="wf-input min-h-28" value={field("heroTitle").value || ""} onChange={(event) => update("heroTitle", event.target.value)} />
        </label>
        <label className="md:col-span-2">
          <span className="wf-label">Hero Subtitle</span>
          <textarea className="wf-input min-h-24" value={field("heroSubtitle").value || ""} onChange={(event) => update("heroSubtitle", event.target.value)} />
        </label>
        <ImageUrlField label="Hero Background Image" value={field("heroImage").value || ""} onChange={(value) => update("heroImage", value)} onUpload={(file) => uploadImage("heroImage", file)} disabled={disabled} />
        <Field label="CTA Button Text" name="heroCtaText" value={field("heroCtaText").value || ""} onChange={(event) => update("heroCtaText", event.target.value)} />
      </div>
    </div>
  );
}

function NavbarManagement({ value, onChange }) {
  const [query, setQuery] = useState("");
  const { navbarAreas, topLists } = value;
  const areaObjects = navbarAreas.map((area, index) => {
    if (typeof area === "object") return { title: area.title || area.name || normalizeAreaName(area), city: "Ahmedabad", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: index + 1, slug: "", description: "", ...area };
    return { title: normalizeAreaName(area), city: "Ahmedabad", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: index + 1, slug: "", description: "" };
  });
  const allItems = [
    ...areaObjects.map((item, index) => ({ ...item, menuType: "area", source: "area", sourceIndex: index })),
    ...topLists.map((item, index) => ({ ...item, menuType: item.type || "custom-link", source: "topList", sourceIndex: index })),
  ];
  const visibleItems = allItems
    .filter((item) => `${item.title} ${item.menuType} ${item.slug} ${item.city}`.toLowerCase().includes(query.toLowerCase()))
    .sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0) || String(a.title || "").localeCompare(String(b.title || "")));
  const previewItems = allItems.filter((item) => item.enabled !== false && item.showInNavbar !== false).sort((a, b) => Number(a.sortOrder || 0) - Number(b.sortOrder || 0)).slice(0, 10);

  const addMenuItem = () => onChange("navbarTopLists", [
    ...topLists,
    { title: "", type: "custom-link", enabled: true, featured: true, showInNavbar: true, showInFooter: false, sortOrder: allItems.length + 1, city: "", slug: "/properties", description: "" },
  ]);
  const updateMenuItem = (item, patch) => {
    if (item.source === "area") {
      onChange("navbarAreas", areaObjects.map((entry, index) => (index === item.sourceIndex ? { ...entry, ...patch } : entry)));
      return;
    }
    const nextPatch = patch.menuType ? { ...patch, type: patch.menuType } : patch;
    delete nextPatch.menuType;
    onChange("navbarTopLists", topLists.map((entry, index) => (index === item.sourceIndex ? { ...entry, ...nextPatch } : entry)));
  };
  const removeMenuItem = (item) => {
    if (!window.confirm("Delete this menu item?")) return;
    if (item.source === "area") onChange("navbarAreas", areaObjects.filter((_, index) => index !== item.sourceIndex));
    else onChange("navbarTopLists", topLists.filter((_, index) => index !== item.sourceIndex));
  };
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.14)] sm:p-6">
      <div className="flex flex-col gap-4 xl:flex-row xl:items-start xl:justify-between">
        <div>
          <h3 className="text-xl font-bold">Website Navbar Manager</h3>
          <p className="mt-1 max-w-2xl text-sm text-slate-500">Add the menu name, choose where it should lead, set the order, and keep only useful items active. The preview below shows what visitors will see before you save.</p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row xl:w-auto">
          <button type="button" onClick={addMenuItem} className="wf-btn wf-btn-primary justify-center"><Plus size={16} /> Add Menu Item</button>
          <div className="relative w-full xl:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input className="wf-input pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search navbar items..." />
          </div>
        </div>
      </div>
      <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-4">
        <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-blue-600">Navbar Preview</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-bold text-white">View All Properties</span>
          {previewItems.map((item) => <span key={`${item.source}-${item.sourceIndex}`} className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-slate-700 shadow-sm">{item.title || "Untitled menu"}</span>)}
        </div>
      </div>
      <div className="mt-6">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h4 className="font-extrabold text-slate-950">Menu Items</h4>
          <p className="text-sm font-semibold text-slate-500">{visibleItems.length} items</p>
        </div>
        <div className="grid gap-4">
          {visibleItems.map((item) => (
            <NavbarItemCard key={`${item.source}-${item.sourceIndex}`} item={item} onChange={(patch) => updateMenuItem(item, patch)} onDelete={() => removeMenuItem(item)} />
          ))}
          {!visibleItems.length && <EmptyState title="No navbar items" description="Add a menu item or adjust your search." />}
        </div>
      </div>
    </div>
  );
}

function NavbarItemCard({ item, onChange, onDelete }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-end">
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1.2fr_0.8fr_1.2fr_110px_140px]">
          <label>
            <span className="wf-label">Menu Name</span>
            <input className="wf-input bg-white" value={item.title || ""} onChange={(event) => onChange({ title: event.target.value })} placeholder="Example: Buy" />
          </label>
          <label>
            <span className="wf-label">Menu Type</span>
            <select className="wf-input bg-white" value={item.menuType || item.type || "custom-link"} onChange={(event) => onChange({ menuType: event.target.value })} disabled={item.source === "area"}>
              <option value="area">Area Wise</option>
              <option value="project">Top Project</option>
              <option value="developer">Developer / Builder</option>
              <option value="city">City</option>
              <option value="category">Category</option>
              <option value="custom-link">Custom Link</option>
            </select>
          </label>
          <label>
            <span className="wf-label">Link / Page / Area / Category</span>
            <input className="wf-input bg-white" value={item.slug || ""} onChange={(event) => onChange({ slug: event.target.value })} placeholder="/properties or area/category" />
          </label>
          <label>
            <span className="wf-label">Sort Order</span>
            <input className="wf-input bg-white" type="number" min="1" value={item.sortOrder || ""} onChange={(event) => onChange({ sortOrder: Number(event.target.value || 0) })} placeholder="1" />
          </label>
          <label>
            <span className="wf-label">Active / Inactive</span>
            <select className="wf-input bg-white" value={item.enabled === false ? "inactive" : "active"} onChange={(event) => onChange({ enabled: event.target.value === "active", showInNavbar: event.target.value === "active" })}>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </label>
          <label className="md:col-span-2 xl:col-span-5">
            <span className="wf-label">Helper Text</span>
            <input className="wf-input bg-white" value={item.description || ""} onChange={(event) => onChange({ description: event.target.value })} placeholder="Optional short note shown inside dropdowns" />
          </label>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={onDelete} className="wf-btn wf-btn-secondary flex-1 justify-center text-red-600"><Trash2 size={16} /> Delete</button>
        </div>
      </div>
    </div>
  );
}

function ContactCMSForm({ value, onChange, disabled }) {
  const location = { ...(defaultContactContent.location || {}), ...(value.location || {}) };
  const whatsappSettings = { ...(defaultContactContent.whatsappSettings || {}), ...(value.whatsappSettings || {}) };
  const updateLocation = (patch) => {
    const nextLocation = { ...location, ...patch };
    onChange({
      location: nextLocation,
      address: nextLocation.address || value.address,
    });
  };
  const updateWhatsApp = (patch) => {
    const nextSettings = { ...whatsappSettings, ...patch };
    onChange({
      whatsappSettings: nextSettings,
      whatsapp: nextSettings.phone || value.whatsapp,
    });
  };
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.14)] sm:p-6">
      <h3 className="text-xl font-bold">Contact Us Page</h3>
      <p className="mt-1 text-sm text-slate-500">Edit public contact details, office location, map links, WhatsApp, timing, and socials.</p>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="Page Title" name="contactTitle" value={value.title} onChange={(event) => onChange({ title: event.target.value })} />
        <Field label="Phone Number" name="phone" value={value.phone} onChange={(event) => onChange({ phone: event.target.value })} />
        <label className="md:col-span-2">
          <span className="wf-label">Subtitle</span>
          <textarea className="wf-input min-h-24" value={value.subtitle || ""} onChange={(event) => onChange({ subtitle: event.target.value })} />
        </label>
        <Field label="Email" name="email" type="email" value={value.email} onChange={(event) => onChange({ email: event.target.value })} />
        <Field label="Office Timing" name="officeTiming" value={value.officeTiming} onChange={(event) => onChange({ officeTiming: event.target.value })} />
        <Field label="Map Link" name="mapLink" value={value.mapLink} onChange={(event) => onChange({ mapLink: event.target.value })} />
        <div className="md:col-span-2 rounded-2xl border border-emerald-100 bg-emerald-50/60 p-4">
          <h4 className="font-extrabold text-slate-950">WhatsApp Floating Icon</h4>
          <p className="mt-1 text-sm text-slate-500">Control the public WhatsApp chat button without code changes.</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <Field label="WhatsApp Phone Number" name="whatsappPhone" value={whatsappSettings.phone || value.whatsapp || ""} onChange={(event) => updateWhatsApp({ phone: event.target.value })} />
            <label>
              <span className="wf-label">Enable / Disable</span>
              <select className="wf-input" value={whatsappSettings.enabled === false ? "disabled" : "enabled"} onChange={(event) => updateWhatsApp({ enabled: event.target.value === "enabled" })}>
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </label>
            <label>
              <span className="wf-label">Icon Position</span>
              <select className="wf-input" value={whatsappSettings.position || "bottom-right"} onChange={(event) => updateWhatsApp({ position: event.target.value })}>
                <option value="bottom-right">Bottom Right</option>
                <option value="bottom-left">Bottom Left</option>
              </select>
            </label>
            <label>
              <span className="wf-label">Display On Pages</span>
              <select className="wf-input" value={whatsappSettings.displayOn || "all"} onChange={(event) => updateWhatsApp({ displayOn: event.target.value })}>
                <option value="all">All Pages</option>
                <option value="property-pages">Property Pages Only</option>
                <option value="homepage">Homepage Only</option>
              </select>
            </label>
            <label className="md:col-span-2">
              <span className="wf-label">Default Message</span>
              <textarea className="wf-input min-h-24" value={whatsappSettings.message || ""} onChange={(event) => updateWhatsApp({ message: event.target.value })} />
            </label>
          </div>
        </div>
        <label className="md:col-span-2">
          <span className="wf-label">Address</span>
          <textarea className="wf-input min-h-20" value={value.address || ""} onChange={(event) => onChange({ address: event.target.value, location: { ...location, address: event.target.value } })} />
        </label>
        <LocationAutocompleteField
          label="Google Location Search"
          name="contactLocation"
          value={location.address || value.address || ""}
          options={defaultNavbarAreas.map(normalizeAreaName)}
          onChange={(event) => updateLocation({ address: event.target.value })}
          placeholder="Search office location"
          onPlaceSelect={(place) => updateLocation(place)}
        />
        <Field label="Map Embed URL" name="mapEmbed" value={value.mapEmbed} onChange={(event) => onChange({ mapEmbed: event.target.value })} />
        <Field label="Area" name="area" value={location.area} onChange={(event) => updateLocation({ area: event.target.value })} />
        <Field label="City" name="city" value={location.city} onChange={(event) => updateLocation({ city: event.target.value })} />
        <Field label="State" name="state" value={location.state} onChange={(event) => updateLocation({ state: event.target.value })} />
        <Field label="Pincode" name="pincode" value={location.pincode} onChange={(event) => updateLocation({ pincode: event.target.value })} />
        <Field label="Latitude" name="lat" type="number" value={location.lat ?? ""} onChange={(event) => updateLocation({ lat: event.target.value === "" ? null : Number(event.target.value) })} />
        <Field label="Longitude" name="lng" type="number" value={location.lng ?? ""} onChange={(event) => updateLocation({ lng: event.target.value === "" ? null : Number(event.target.value) })} />
        <Field label="Google Place ID" name="placeId" value={location.placeId} onChange={(event) => updateLocation({ placeId: event.target.value })} />
        <div className="md:col-span-2">
          <h4 className="mb-3 font-extrabold text-slate-950">Social Links</h4>
          <div className="grid gap-3 md:grid-cols-2">
            {["instagram", "facebook", "linkedin", "youtube"].map((item) => (
              <Field key={item} label={labelize(item)} name={item} value={value.socials?.[item] || ""} onChange={(event) => onChange({ socials: { ...(value.socials || {}), [item]: event.target.value } })} />
            ))}
          </div>
        </div>
      </div>
      {disabled && <p className="mt-4 rounded-xl bg-blue-50 p-3 text-sm font-bold text-blue-700">Uploading or saving content...</p>}
    </div>
  );
}

function AboutCMSForm({ value, onChange, onUpload, disabled }) {
  const stats = Array.isArray(value.stats) ? value.stats : [];
  const features = Array.isArray(value.features) ? value.features : [];
  const updateStat = (index, patch) => {
    onChange({ stats: stats.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)) });
  };
  const updateFeature = (index, patch) => {
    onChange({ features: features.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)) });
  };
  return (
    <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.14)] sm:p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-xl font-bold">About Us CMS</h3>
          <p className="mt-1 text-sm text-slate-500">Edit the client-facing About Us page, owner profile, story, and SEO content.</p>
        </div>
      </div>
      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <Field label="About Page Title" name="title" value={value.title} onChange={(event) => onChange({ title: event.target.value })} />
        <Field label="SEO Title" name="seoTitle" value={value.seoTitle} onChange={(event) => onChange({ seoTitle: event.target.value })} />
        <label className="md:col-span-2">
          <span className="wf-label">Subtitle</span>
          <textarea className="wf-input min-h-24" value={value.subtitle || ""} onChange={(event) => onChange({ subtitle: event.target.value })} />
        </label>
        <label className="md:col-span-2">
          <span className="wf-label">Main Description</span>
          <textarea className="wf-input min-h-24" value={value.mainDescription || ""} onChange={(event) => onChange({ mainDescription: event.target.value })} />
        </label>
        <ImageUrlField label="Hero Image" value={value.heroImage} onChange={(heroImage) => onChange({ heroImage })} onUpload={(file) => onUpload("heroImage", file)} disabled={disabled} />
        <ImageUrlField label="Owner Photo" value={value.ownerPhoto} onChange={(ownerPhoto) => onChange({ ownerPhoto })} onUpload={(file) => onUpload("ownerPhoto", file)} disabled={disabled} />
        <Field label="Owner / Founder Name" name="ownerName" value={value.ownerName} onChange={(event) => onChange({ ownerName: event.target.value })} />
        <Field label="Owner Designation" name="ownerDesignation" value={value.ownerDesignation} onChange={(event) => onChange({ ownerDesignation: event.target.value })} />
        <label className="md:col-span-2">
          <span className="wf-label">Owner Bio</span>
          <textarea className="wf-input min-h-24" value={value.ownerBio || ""} onChange={(event) => onChange({ ownerBio: event.target.value })} />
        </label>
        <label className="md:col-span-2">
          <span className="wf-label">Owner Quote</span>
          <textarea className="wf-input min-h-20" value={value.ownerQuote || ""} onChange={(event) => onChange({ ownerQuote: event.target.value })} />
        </label>
        <Field label="Vision Title" name="visionTitle" value={value.visionTitle} onChange={(event) => onChange({ visionTitle: event.target.value })} />
        <Field label="Mission Title" name="missionTitle" value={value.missionTitle} onChange={(event) => onChange({ missionTitle: event.target.value })} />
        <label>
          <span className="wf-label">Vision Content</span>
          <textarea className="wf-input min-h-24" value={value.visionContent || ""} onChange={(event) => onChange({ visionContent: event.target.value })} />
        </label>
        <label>
          <span className="wf-label">Mission Content</span>
          <textarea className="wf-input min-h-24" value={value.missionContent || ""} onChange={(event) => onChange({ missionContent: event.target.value })} />
        </label>
        <Field label="Story Title" name="storyTitle" value={value.storyTitle} onChange={(event) => onChange({ storyTitle: event.target.value })} />
        <label>
          <span className="wf-label">SEO Description</span>
          <textarea className="wf-input min-h-24" value={value.seoDescription || ""} onChange={(event) => onChange({ seoDescription: event.target.value })} />
        </label>
        <label className="md:col-span-2">
          <span className="wf-label">Company Story</span>
          <textarea className="wf-input min-h-28" value={value.storyContent || ""} onChange={(event) => onChange({ storyContent: event.target.value })} />
        </label>
      </div>
      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold">Stats</h4>
            <button type="button" className="wf-btn wf-btn-secondary" onClick={() => onChange({ stats: [...stats, { label: "", value: "" }] })}><Plus size={16} /> Add</button>
          </div>
          <div className="mt-4 space-y-3">
            {stats.map((item, index) => (
              <div key={`${item.label}-${index}`} className="grid gap-2 rounded-xl bg-white p-3 sm:grid-cols-[1fr_1fr_auto]">
                <input className="wf-input" value={item.label || ""} onChange={(event) => updateStat(index, { label: event.target.value })} placeholder="Label" />
                <input className="wf-input" value={item.value || ""} onChange={(event) => updateStat(index, { value: event.target.value })} placeholder="Value" />
                <button type="button" className="grid h-12 w-12 place-items-center rounded-xl border border-red-100 text-red-600" onClick={() => onChange({ stats: stats.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <div className="flex items-center justify-between">
            <h4 className="font-extrabold">Why Choose Us Cards</h4>
            <button type="button" className="wf-btn wf-btn-secondary" onClick={() => onChange({ features: [...features, { title: "", desc: "" }] })}><Plus size={16} /> Add</button>
          </div>
          <div className="mt-4 space-y-3">
            {features.map((item, index) => (
              <div key={`${item.title}-${index}`} className="rounded-xl bg-white p-3">
                <div className="flex gap-2">
                  <input className="wf-input" value={item.title || ""} onChange={(event) => updateFeature(index, { title: event.target.value })} placeholder="Card title" />
                  <button type="button" className="grid h-12 w-12 shrink-0 place-items-center rounded-xl border border-red-100 text-red-600" onClick={() => onChange({ features: features.filter((_, itemIndex) => itemIndex !== index) })}><Trash2 size={16} /></button>
                </div>
                <textarea className="wf-input mt-2 min-h-20" value={item.desc || ""} onChange={(event) => updateFeature(index, { desc: event.target.value })} placeholder="Card description" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function UsersSection() {
  const { staffToken } = useStaffAuth();
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pagination, setPagination] = useState({ page: 1, limit: 20, total: 0, pages: 1 });
  const [search, setSearch] = useState("");
  const [filterProvider, setFilterProvider] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [exportFormat, setExportFormat] = useState("excel");
  const [exporting, setExporting] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const res = await staffApi.userStats();
      setStats(res.data);
    } catch { /* silent */ }
  }, []);

  const fetchUsers = useCallback(async (page = 1) => {
    setLoading(true);
    setError("");
    try {
      const res = await staffApi.users(
        toQueryString({ page, limit: 20, search: search || undefined, authProvider: filterProvider || undefined, status: filterStatus || undefined, role: filterRole || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined })
      );
      setUsers(res.data || []);
      setPagination(res.pagination || { page: 1, limit: 20, total: 0, pages: 1 });
    } catch (err) {
      setError(err.message || "Failed to load users");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [search, filterProvider, filterStatus, filterRole, dateFrom, dateTo]);

  useEffect(() => {
    const timer = window.setTimeout(fetchStats, 0);
    return () => window.clearTimeout(timer);
  }, [fetchStats]);
  useEffect(() => {
    const timer = window.setTimeout(() => fetchUsers(1), 0);
    return () => window.clearTimeout(timer);
  }, [fetchUsers]);

  const handleToggleStatus = async (user) => {
    const nextStatus = user.status === "active" ? "disabled" : "active";
    setStatusUpdating(user._id);
    try {
      await staffApi.updateUserStatus(user._id, nextStatus);
      setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, status: nextStatus } : u));
      fetchStats();
    } catch (err) {
      alert(err.message || "Failed to update user status");
    } finally {
      setStatusUpdating(null);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const url = staffApi.usersExportUrl(exportFormat, { authProvider: filterProvider || undefined, status: filterStatus || undefined, role: filterRole || undefined, dateFrom: dateFrom || undefined, dateTo: dateTo || undefined });
      const resp = await fetch(url, { headers: { Authorization: `Bearer ${staffToken}` } });
      if (!resp.ok) throw new Error("Export failed");
      const blob = await resp.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `users-${Date.now()}.${exportFormat === "pdf" ? "html" : "xls"}`;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      alert(err.message || "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const statCards = [
    { label: "Total Users", value: stats?.total ?? "—", bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-100" },
    { label: "Active Accounts", value: stats?.activeCount ?? "—", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-100" },
    { label: "Disabled", value: stats?.disabledCount ?? "—", bg: "bg-red-50", text: "text-red-600", border: "border-red-100" },
    { label: "Today's Joins", value: stats?.todayCount ?? "—", bg: "bg-violet-50", text: "text-violet-700", border: "border-violet-100" },
    { label: "Google Sign-Ups", value: stats?.googleCount ?? "—", bg: "bg-rose-50", text: "text-rose-700", border: "border-rose-100" },
    { label: "Email Sign-Ups", value: stats?.emailCount ?? "—", bg: "bg-slate-50", text: "text-slate-700", border: "border-slate-200" },
  ];

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : null;

  return (
    <div>
      <PageTitle
        title="User Management"
        subtitle={`${pagination.total || 0} registered user${(pagination.total || 0) !== 1 ? "s" : ""}`}
        action={
          <button onClick={() => setShowExport((p) => !p)} className="wf-btn wf-btn-secondary">
            <Download size={15} />
            Export
          </button>
        }
      />

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {statCards.map(({ label, value, bg, text, border }) => (
          <div key={label} className={`rounded-2xl border ${border} ${bg} p-4`}>
            <p className="text-xs font-bold text-slate-500">{label}</p>
            <p className={`mt-1 text-2xl font-extrabold ${text}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Export Panel */}
      {showExport && (
        <div className="mb-6 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 shadow-sm sm:p-5">
          <p className="mb-3 text-sm font-bold text-slate-700">Export Users</p>
          <div className="flex flex-wrap items-center gap-3">
            {["excel", "pdf"].map((fmt) => (
              <button key={fmt} onClick={() => setExportFormat(fmt)} className={`rounded-lg px-4 py-2 text-xs font-bold transition ${exportFormat === fmt ? "bg-blue-600 text-white shadow" : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"}`}>
                {fmt === "excel" ? "Excel (.xls)" : "PDF (.html)"}
              </button>
            ))}
            <button onClick={handleExport} disabled={exporting} className="wf-btn wf-btn-primary disabled:opacity-70">
              <Download size={15} />
              {exporting ? "Exporting…" : "Download"}
            </button>
          </div>
        </div>
      )}

      {/* Search + Filters */}
      <div className="mb-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.06)]">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name, email, mobile…" className="wf-input pl-9 text-sm" />
          </div>
          <button onClick={() => setShowFilters((p) => !p)} className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 transition">
            {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
        {showFilters && (
          <div className="mt-3 grid grid-cols-2 gap-3 border-t border-slate-100 pt-3 sm:grid-cols-4">
            <div>
              <label className="wf-label">Method</label>
              <select className="wf-input text-sm" value={filterProvider} onChange={(e) => setFilterProvider(e.target.value)}>
                <option value="">All</option>
                <option value="google">Google</option>
                <option value="local">Email</option>
              </select>
            </div>
            <div>
              <label className="wf-label">Status</label>
              <select className="wf-input text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">All</option>
                <option value="active">Active</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div>
              <label className="wf-label">Role</label>
              <select className="wf-input text-sm" value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
                <option value="">All</option>
                <option value="user">User</option>
                <option value="owner">Owner</option>
              </select>
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2 sm:col-span-1">
              <div>
                <label className="wf-label">From</label>
                <input type="date" className="wf-input text-sm" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
              </div>
              <div>
                <label className="wf-label">To</label>
                <input type="date" className="wf-input text-sm" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>

      {error && <div className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700">{error}</div>}

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.08)] lg:block">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-500">
            <tr>
              <th className="px-5 py-4">User</th>
              <th className="px-4 py-4">Mobile</th>
              <th className="px-4 py-4">Method</th>
              <th className="px-4 py-4">Role</th>
              <th className="px-4 py-4">Registered</th>
              <th className="px-4 py-4">Last Login</th>
              <th className="px-4 py-4">Status</th>
              <th className="px-4 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {loading && <tr><td colSpan="8" className="px-5 py-10 text-center text-sm font-bold text-slate-500">Loading users…</td></tr>}
            {!loading && users.length === 0 && (
              <tr><td colSpan="8" className="px-5 py-10"><EmptyState title="No users found" description="Try adjusting your search or filters." /></td></tr>
            )}
            {!loading && users.map((u) => (
              <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {u.avatar ? (
                      <img src={u.avatar} alt={u.name} className="h-9 w-9 rounded-full object-cover border border-slate-200 shrink-0" />
                    ) : (
                      <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                        {u.name?.[0]?.toUpperCase() || "?"}
                      </div>
                    )}
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">{u.name}</p>
                      <p className="truncate text-xs text-slate-500">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3.5 text-sm text-slate-600">{u.phone || <span className="text-slate-300">—</span>}</td>
                <td className="px-4 py-3.5">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold ${u.authProvider === "google" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"}`}>
                    {u.authProvider === "google" ? "Google" : "Email"}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold capitalize ${u.role === "owner" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{fmtDate(u.createdAt) || "—"}</td>
                <td className="px-4 py-3.5 text-xs text-slate-500">{fmtDate(u.lastLoginAt) || <span className="text-slate-300">Never</span>}</td>
                <td className="px-4 py-3.5">
                  <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${u.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                    {u.status === "active" ? "Active" : "Disabled"}
                  </span>
                </td>
                <td className="px-4 py-3.5 text-right">
                  <button
                    onClick={() => handleToggleStatus(u)}
                    disabled={statusUpdating === u._id}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${u.status === "active" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
                  >
                    {statusUpdating === u._id ? "Saving…" : u.status === "active" ? "Deactivate" : "Activate"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 lg:hidden">
        {loading && <p className="py-8 text-center text-sm font-bold text-slate-500">Loading users…</p>}
        {!loading && users.length === 0 && <EmptyState title="No users found" description="Try adjusting your search or filters." />}
        {!loading && users.map((u) => (
          <div key={u._id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {u.avatar ? (
                  <img src={u.avatar} alt={u.name} className="h-10 w-10 rounded-full object-cover border shrink-0" />
                ) : (
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {u.name?.[0]?.toUpperCase() || "?"}
                  </div>
                )}
                <div className="min-w-0">
                  <p className="truncate font-semibold text-slate-900">{u.name}</p>
                  <p className="truncate text-xs text-slate-500">{u.email}</p>
                </div>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${u.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-600"}`}>
                {u.status === "active" ? "Active" : "Disabled"}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className={`rounded-full px-2 py-0.5 font-bold ${u.authProvider === "google" ? "bg-rose-50 text-rose-700" : "bg-blue-50 text-blue-700"}`}>
                {u.authProvider === "google" ? "Google" : "Email"}
              </span>
              <span className={`rounded-full px-2 py-0.5 font-bold capitalize ${u.role === "owner" ? "bg-amber-50 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                {u.role}
              </span>
              {u.phone && <span className="text-slate-500">{u.phone}</span>}
              {fmtDate(u.createdAt) && <span className="text-slate-400">{fmtDate(u.createdAt)}</span>}
            </div>
            <div className="mt-3 flex justify-end border-t border-slate-50 pt-3">
              <button
                onClick={() => handleToggleStatus(u)}
                disabled={statusUpdating === u._id}
                className={`rounded-lg px-3 py-1.5 text-xs font-bold transition disabled:opacity-50 ${u.status === "active" ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}
              >
                {statusUpdating === u._id ? "Saving…" : u.status === "active" ? "Deactivate" : "Activate"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            Showing {Math.min((pagination.page - 1) * pagination.limit + 1, pagination.total)}–{Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total}
          </p>
          <div className="flex gap-2">
            <button disabled={pagination.page <= 1} onClick={() => fetchUsers(pagination.page - 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40">
              Previous
            </button>
            <button disabled={pagination.page >= pagination.pages} onClick={() => fetchUsers(pagination.page + 1)} className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function ImageUrlField({ label, value, onChange, onUpload, disabled }) {
  return (
    <div>
      <span className="wf-label">{label}</span>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input className="wf-input min-w-0 flex-1" value={value || ""} onChange={(event) => onChange(event.target.value)} placeholder="Image URL" />
        <label className={`wf-btn wf-btn-secondary justify-center ${disabled ? "pointer-events-none opacity-60" : "cursor-pointer"}`}>
          <Upload size={16} />
          Upload
          <input type="file" accept="image/*" className="hidden" disabled={disabled} onChange={(event) => { onUpload(event.target.files?.[0]); event.target.value = ""; }} />
        </label>
      </div>
    </div>
  );
}

const emptyCert = { title: "", description: "", image: "", publicId: "", displayOrder: 0, isActive: true };

function CertificationsAdminSection() {
  const [certs, setCerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyCert);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [preview, setPreview] = useState(null);

  const flash = (msg, isError = false) => {
    if (isError) { setError(msg); setSuccessMsg(""); }
    else { setSuccessMsg(msg); setError(""); }
  };

  const fetchCerts = useCallback(async () => {
    setLoading(true);
    try {
      const res = await staffApi.certifications();
      setCerts(res.data || []);
    } catch (err) {
      flash(err.message || "Failed to load certifications.", true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(fetchCerts, 0);
    return () => window.clearTimeout(timer);
  }, [fetchCerts]);

  const openAdd = () => { setEditing(null); setForm(emptyCert); setShowForm(true); };
  const openEdit = (cert) => { setEditing(cert); setForm({ title: cert.title || "", description: cert.description || "", image: cert.image || "", publicId: cert.publicId || "", displayOrder: cert.displayOrder ?? 0, isActive: cert.isActive !== false }); setShowForm(true); };
  const closeForm = () => { setShowForm(false); setEditing(null); setForm(emptyCert); };

  const handleImageUpload = async (file) => {
    if (!file) return;
    if (file.type !== "image/png") { flash("Only PNG files are allowed.", true); return; }
    if (file.size > 5 * 1024 * 1024) { flash("Image must be under 5 MB.", true); return; }
    setUploading(true);
    try {
      const res = await staffApi.uploadCertificationImage(file);
      setForm((prev) => ({ ...prev, image: res.data.url, publicId: res.data.publicId }));
    } catch (err) {
      flash(err.message || "Image upload failed.", true);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!form.image) { flash("Please upload a PNG image.", true); return; }
    setSaving(true);
    try {
      if (editing) {
        await staffApi.updateCertification(editing._id, form);
        flash("Certification updated.");
      } else {
        await staffApi.createCertification(form);
        flash("Certification added.");
      }
      closeForm();
      fetchCerts();
    } catch (err) {
      flash(err.message || "Failed to save certification.", true);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (cert) => {
    if (!window.confirm(`Delete "${cert.title || "this certification"}"? This cannot be undone.`)) return;
    setDeleting(cert._id);
    try {
      await staffApi.deleteCertification(cert._id);
      flash("Certification deleted.");
      fetchCerts();
    } catch (err) {
      flash(err.message || "Failed to delete.", true);
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (cert) => {
    try {
      await staffApi.updateCertification(cert._id, { isActive: !cert.isActive });
      flash(`Certification ${!cert.isActive ? "enabled" : "disabled"}.`);
      fetchCerts();
    } catch (err) {
      flash(err.message || "Failed to update status.", true);
    }
  };

  return (
    <>
      <PageTitle
        title="Certifications"
        subtitle="Manage achievements and certifications displayed on the About page."
        action={
          <button onClick={openAdd} className="wf-btn wf-btn-primary w-full sm:w-auto">
            <Plus size={17} /> Add Certification
          </button>
        }
      />
      <InlineAlert message={error} />
      <InlineAlert message={successMsg} tone="green" />

      {loading && <LoadingState label="Loading certifications..." />}

      {!loading && certs.length === 0 && (
        <EmptyState
          title="No certifications yet"
          description="Add your first certification to showcase it on the About page."
        />
      )}

      {!loading && certs.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {certs.map((cert) => (
            <div key={cert._id} className="group relative flex flex-col rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden hover:shadow-md transition-all">
              <button
                onClick={() => setPreview(cert)}
                className="relative aspect-square w-full bg-slate-50 flex items-center justify-center overflow-hidden"
                aria-label="Preview"
              >
                <img
                  src={cert.image}
                  alt={cert.title || "Certification"}
                  className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Eye size={22} className="text-white drop-shadow" />
                </div>
              </button>

              <div className="flex flex-col gap-1.5 p-3 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-slate-900 text-sm">{cert.title || <span className="italic text-slate-400">No title</span>}</p>
                    {cert.description && <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{cert.description}</p>}
                  </div>
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${cert.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                    {cert.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-[10px] text-slate-400">Order: {cert.displayOrder}</p>
              </div>

              <div className="flex items-center gap-1.5 border-t border-slate-50 px-3 py-2">
                <button onClick={() => openEdit(cert)} className="flex-1 rounded-lg bg-slate-50 px-2 py-1.5 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition flex items-center justify-center gap-1">
                  <Edit3 size={13} /> Edit
                </button>
                <button onClick={() => handleToggleActive(cert)} className={`flex-1 rounded-lg px-2 py-1.5 text-xs font-bold transition flex items-center justify-center gap-1 ${cert.isActive ? "bg-amber-50 text-amber-700 hover:bg-amber-100" : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"}`}>
                  {cert.isActive ? <EyeOff size={13} /> : <Eye size={13} />}
                  {cert.isActive ? "Disable" : "Enable"}
                </button>
                <button
                  onClick={() => handleDelete(cert)}
                  disabled={deleting === cert._id}
                  className="rounded-lg bg-red-50 px-2 py-1.5 text-xs font-bold text-red-600 hover:bg-red-100 transition disabled:opacity-50 flex items-center gap-1"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && createPortal(
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl bg-white shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h3 className="font-bold text-slate-900 text-lg">{editing ? "Edit Certification" : "Add Certification"}</h3>
              <button onClick={closeForm} className="grid h-8 w-8 place-items-center rounded-full hover:bg-slate-100 transition">
                <X size={18} />
              </button>
            </div>

            <div className="px-6 py-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div>
                <span className="wf-label">Certification Image (PNG only) <span className="text-red-500">*</span></span>
                <div className="mt-2 flex flex-col gap-3">
                  {form.image && (
                    <div className="relative w-32 h-32 rounded-xl border border-slate-200 bg-slate-50 overflow-hidden flex items-center justify-center">
                      <img src={form.image} alt="Preview" className="w-full h-full object-contain p-2" />
                    </div>
                  )}
                  <label className={`wf-btn wf-btn-secondary w-fit ${uploading ? "pointer-events-none opacity-60" : "cursor-pointer"}`}>
                    <Upload size={15} />
                    {uploading ? "Uploading…" : form.image ? "Replace Image" : "Upload PNG"}
                    <input
                      type="file"
                      accept=".png,image/png"
                      className="hidden"
                      disabled={uploading}
                      onChange={(e) => { handleImageUpload(e.target.files?.[0]); e.target.value = ""; }}
                    />
                  </label>
                  <p className="text-xs text-slate-400">PNG only · Max 5 MB</p>
                </div>
              </div>

              <div>
                <label className="wf-label" htmlFor="cert-title">Title <span className="text-slate-400 font-normal">(Optional)</span></label>
                <input id="cert-title" className="wf-input mt-1" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. ISO 9001 Certified" />
              </div>

              <div>
                <label className="wf-label" htmlFor="cert-desc">Short Description <span className="text-slate-400 font-normal">(Optional)</span></label>
                <textarea id="cert-desc" className="wf-input mt-1 min-h-[72px]" value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="Brief description of this certification" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="wf-label" htmlFor="cert-order">Display Order</label>
                  <input id="cert-order" type="number" min={0} className="wf-input mt-1" value={form.displayOrder} onChange={(e) => setForm((p) => ({ ...p, displayOrder: Number(e.target.value) || 0 }))} />
                </div>
                <div className="flex flex-col justify-end pb-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <div
                      onClick={() => setForm((p) => ({ ...p, isActive: !p.isActive }))}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${form.isActive ? "bg-blue-600" : "bg-slate-300"}`}
                    >
                      <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transform transition-transform ${form.isActive ? "translate-x-6" : "translate-x-1"}`} />
                    </div>
                    <span className="text-sm font-semibold text-slate-700">{form.isActive ? "Active" : "Inactive"}</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
              <button onClick={closeForm} className="wf-btn wf-btn-secondary">Cancel</button>
              <button onClick={handleSave} disabled={saving || uploading} className="wf-btn wf-btn-primary disabled:opacity-60">
                <Save size={16} />
                {saving ? "Saving…" : editing ? "Save Changes" : "Add Certification"}
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {preview && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={() => setPreview(null)}
        >
          <div className="relative max-h-[90vh] max-w-2xl w-full rounded-2xl bg-white overflow-hidden shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setPreview(null)} className="absolute top-3 right-3 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow hover:bg-white transition z-10">
              <X size={18} className="text-slate-700" />
            </button>
            <img src={preview.image} alt={preview.title || "Certification"} className="w-full max-h-[75vh] object-contain" />
            {(preview.title || preview.description) && (
              <div className="px-6 py-4 border-t border-slate-100">
                {preview.title && <p className="font-bold text-slate-900 text-lg">{preview.title}</p>}
                {preview.description && <p className="text-slate-500 text-sm mt-1">{preview.description}</p>}
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
