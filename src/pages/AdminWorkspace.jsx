import { useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  BarChart3,
  Bell,
  Building2,
  Calendar,
  Check,
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
  Plus,
  Save,
  Search,
  Settings,
  Shield,
  Trash2,
  Upload,
  User,
  UserCheck,
  Users,
  X,
} from "lucide-react";
import { useStaffAuth } from "../contexts/useStaffAuth";
import { publicApi, staffApi } from "../services/api";

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: BarChart3, roles: ["admin", "supervisor"], permission: "dashboard:access" },
  { key: "properties", label: "Property Management", icon: Building2, roles: ["admin", "supervisor"], permission: "assigned:view" },
  { key: "supervisors", label: "Supervisor Management", icon: Users, roles: ["admin"] },
  { key: "owners", label: "Owner Management", icon: UserCheck, roles: ["admin"] },
  { key: "enquiries", label: "Enquiries", icon: MessageSquare, roles: ["admin", "supervisor"], permission: "enquiries:view" },
  { key: "analytics", label: "Analytics", icon: BarChart3, roles: ["admin", "supervisor"], permission: "analytics:access" },
  { key: "reports", label: "Reports & Export", icon: FileText, roles: ["admin", "supervisor"], permission: "reports:export" },
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
];

const defaultSupervisorPermissions = [
  "dashboard:access",
  "enquiries:view",
  "properties:add",
  "properties:edit",
  "leads:manage",
  "properties:status",
  "analytics:access",
  "assigned:view",
];

const propertyOptionGroups = {
  amenities: ["Parking", "Lift", "Security", "Garden", "Swimming Pool", "Gym", "CCTV", "Power Backup", "Club House", "WiFi", "Air Conditioning", "Water Supply", "Balcony", "Furnished", "Semi Furnished", "Modular Kitchen", "Visitor Parking", "Kids Play Area", "Fire Safety", "Pet Friendly"],
  features: ["Corner Property", "Wide Road Access", "Road Facing", "Vaastu Compliant", "Gated Community", "Prime Location", "High Footfall", "Main Road Touch", "Near Metro", "Near School", "Near Hospital", "Near Market", "New Construction", "Ready Possession", "High ROI"],
  facilities: ["24/7 Water", "Generator Backup", "Society Office", "Waste Management", "Intercom", "Maintenance Staff", "Rainwater Harvesting", "EV Charging", "Service Lift", "Conference Room", "Pantry", "Reception Area"],
  highlights: ["Premium Location", "Verified Listing", "Negotiable Price", "Immediate Possession", "Clear Title", "Loan Approved", "Investor Friendly", "Owner Listed", "Exclusive Mandate"],
  propertyTags: ["ROI", "Pre Leased", "Barter", "Commercial", "Residential", "Office", "Showroom", "Warehouse", "Apartment", "Villa", "Plot", "New Launch", "Hot Deal", "Featured"],
  furnishing: ["Unfurnished", "Semi Furnished", "Fully Furnished", "Bare Shell", "Warm Shell"],
  facing: ["East", "West", "North", "South", "North-East", "North-West", "South-East", "South-West", "Road Facing", "Garden Facing"],
  propertyStatus: ["Ready", "Under Construction", "New Launch", "Resale", "Sold", "Rented"],
  category: ["Residential", "Commercial", "Industrial", "Land/Plot", "Pre-Leased", "Investment", "Retail", "Office"],
  availability: ["Immediate", "Within 15 Days", "Within 30 Days", "Within 3 Months", "After 3 Months", "Under Construction"],
};

function hasStaffPermission(user, permission) {
  if (!permission || user.role === "admin") return true;
  return (user.permissions || []).includes(permission);
}

const emptyProperty = {
  title: "",
  location: "",
  city: "",
  type: "Apartments",
  price: "",
  beds: 0,
  baths: 0,
  sqft: 0,
  measurement: { value: 0, unit: "sqft", customUnit: "" },
  area: "",
  tag: "Standard",
  badge: "Featured",
  badgeColor: "bg-blue-600",
  status: "active",
  propertyStatus: "Ready",
  category: "",
  availability: "",
  facing: "",
  visibility: "public",
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
  furnishing: "",
  propertyTags: [],
  isPreLeased: false,
  isBarter: false,
  roi: "",
  contact: { name: "", phone: "", email: "" },
  map: { address: "", latitude: null, longitude: null, embedUrl: "" },
  seo: { metaTitle: "", metaDescription: "", slug: "" },
  yearBuilt: null,
  propertyCode: "",
  assignedTo: "",
  source: "pricing",
};

function statusClass(status) {
  const normalized = String(status).toLowerCase();
  if (normalized === "active" || normalized === "closed" || normalized === "approved") return "bg-emerald-100 text-emerald-700";
  if (normalized === "pending" || normalized === "in-progress") return "bg-yellow-100 text-yellow-700";
  if (normalized === "new") return "bg-blue-100 text-blue-700";
  return "bg-slate-100 text-slate-700";
}

function formatDate(value) {
  if (!value) return "Today";
  return new Intl.DateTimeFormat("en-CA").format(new Date(value));
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

  useEffect(() => {
    setSidebarOpen(false);
  }, [activeSection]);

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
            <div className="relative hidden w-full max-w-[420px] sm:block">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input className="wf-input rounded-xl pl-12" placeholder="Search properties, owners, enquiries..." />
            </div>
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
            {notificationsOpen && <NotificationsPanel data={notifications} onReload={loadNotifications} />}
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
          {activeSection === "dashboard" && <DashboardSection />}
          {activeSection === "properties" && <PropertiesSection canDelete={canDeleteProperty} canCreate={canCreateProperty} />}
          {activeSection === "supervisors" && <SupervisorsSection />}
          {activeSection === "owners" && <OwnersSection />}
          {activeSection === "enquiries" && <EnquiriesSection canDelete={staffUser.role === "admin"} canManage={canManageLeads} />}
          {activeSection === "analytics" && <AnalyticsSection />}
          {activeSection === "reports" && <ReportsSection token={staffToken} role={staffUser.role} />}
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

function NotificationsPanel({ data, onReload }) {
  const markOne = async (id) => {
    await staffApi.markNotificationRead(id);
    onReload();
  };
  const markAll = async () => {
    await staffApi.markAllNotificationsRead();
    onReload();
  };

  return (
    <div className="fixed left-4 right-4 top-20 z-50 w-[min(92vw,390px)] overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-2xl sm:left-auto sm:right-6">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div>
          <p className="text-sm font-extrabold text-slate-950">Notifications</p>
          <p className="text-xs text-slate-500">{data.unreadCount || 0} unread updates</p>
        </div>
        <button type="button" onClick={markAll} className="text-xs font-bold text-blue-600 hover:text-blue-700">
          Mark all read
        </button>
      </div>
      <div className="max-h-[70vh] overflow-y-auto sm:max-h-[420px]">
        {data.notifications?.length ? (
          data.notifications.map((item) => (
            <button
              key={item._id}
              type="button"
              onClick={() => markOne(item._id)}
              className={`block w-full border-b border-slate-50 px-5 py-4 text-left transition hover:bg-slate-50 ${item.read ? "bg-white" : "bg-blue-50/60"}`}
            >
              <div className="flex gap-3">
                <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.read ? "bg-slate-300" : "bg-blue-600"}`} />
                <span className="min-w-0">
                  <span className="block text-sm font-bold text-slate-950">{item.title}</span>
                  <span className="mt-1 block text-sm text-slate-500">{item.description}</span>
                  <span className="mt-2 block text-xs font-semibold text-slate-400">{formatDate(item.createdAt)} · {item.actorName}</span>
                </span>
              </div>
            </button>
          ))
        ) : (
          <p className="px-5 py-8 text-center text-sm font-semibold text-slate-500">No notifications yet.</p>
        )}
      </div>
    </div>
  );
}

function ProfilePanel({ user, onClose, onSaved, onLogout }) {
  const [form, setForm] = useState({ name: user.name || "", email: user.email || "", phone: user.phone || "", designation: user.designation || "", avatar: user.avatar || "" });
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
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="grid h-12 w-12 place-items-center overflow-hidden rounded-full bg-gradient-to-br from-blue-600 to-purple-600 text-white">
            {form.avatar ? <img src={form.avatar} alt={form.name} className="h-full w-full object-cover" /> : <User size={20} />}
          </span>
          <div>
            <p className="font-extrabold text-slate-950">{user.name}</p>
            <p className="text-xs capitalize text-slate-500">{user.role}</p>
          </div>
        </div>
        <button type="button" onClick={onClose} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-slate-100"><X size={17} /></button>
      </div>
      <div className="max-h-[75vh] overflow-y-auto p-5 sm:max-h-[72vh]">
        {message && <p className="mb-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-700">{message}</p>}
        {error && <p className="mb-4 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600">{error}</p>}
        <form onSubmit={saveProfile} className="space-y-4">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700 hover:bg-slate-200">
            <Upload size={17} />
            Upload profile photo
            <input type="file" accept="image/*" className="hidden" onChange={uploadAvatar} />
          </label>
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

function DashboardSection() {
  const [data, setData] = useState(null);

  useEffect(() => {
    staffApi.dashboard().then((response) => setData(response.data)).catch(() => setData(null));
  }, []);

  const metrics = data?.metrics || {};
  const quick = data?.quickStats || {};
  const supervisorMode = Boolean(data?.supervisorMode);

  return (
    <>
      <PageTitle
        title="Dashboard Overview"
        subtitle="Welcome back! Here's what's happening today."
        action={<button className="wf-btn wf-btn-primary w-full sm:w-auto">Generate Report</button>}
      />

      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 xl:grid-cols-5">
        <StatCard icon={Building2} color="purple" label={supervisorMode ? "My Properties" : "Total Properties"} value={metrics.totalProperties ?? 0} />
        <StatCard icon={MessageSquare} label={supervisorMode ? "My Enquiries" : "Total Enquiries"} value={metrics.totalEnquiries ?? 0} />
        <StatCard icon={Users} color="green" label="Conversion Rate" value={`${metrics.conversionRate ?? 0}%`} />
        <StatCard icon={Home} color="teal" label="Active Listings" value={metrics.activeListings ?? 0} />
        <StatCard icon={Check} color="green" label="Sold / Rented" value={metrics.soldRented ?? 0} />
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1fr_0.9fr]">
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
          <button className="mt-6 w-full rounded-xl border border-white/20 bg-white/15 px-4 py-3 text-sm font-semibold transition-colors hover:bg-white/25 active:scale-[0.98]">View All Details</button>
        </div>
      </div>

      <div className="mt-8 grid gap-5 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
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
      </div>

      {(data?.supervisorPerformance || []).length > 0 && (
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
  const [properties, setProperties] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const searchParams = new URLSearchParams();
      if (query) searchParams.set("search", query);
      if (status !== "all") searchParams.set("status", status);
      const response = await staffApi.properties(`?${searchParams.toString()}`);
      setProperties(response.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let active = true;
    staffApi
      .properties()
      .then((response) => {
        if (active) setProperties(response.data);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const remove = async (id) => {
    if (!window.confirm("Delete this property?")) return;
    await staffApi.deleteProperty(id);
    load();
  };

  return (
    <>
      <PageTitle
        title="Property Management"
        subtitle="Manage all properties and listings"
        action={canCreate ? <button onClick={() => setEditing(emptyProperty)} className="wf-btn wf-btn-primary w-full sm:w-auto"><Plus size={18} /> Add Property</button> : null}
      />
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" />
            <input className="wf-input pl-10" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search properties..." />
          </div>
          <select className="wf-input w-full sm:w-36" value={status} onChange={(event) => setStatus(event.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
          <button onClick={load} className="wf-btn wf-btn-secondary w-full sm:w-auto">Filter</button>
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
                      <p className="text-xs text-slate-400">ID: {property._id.slice(-6).toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 text-sm text-slate-600">{property.location}</td>
                <td className="px-4 py-4 font-semibold text-blue-600">{property.price}</td>
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
                    <p className="mt-0.5 text-xs text-slate-400">ID: {property._id.slice(-6).toUpperCase()}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(property.status)}`}>{property.status}</span>
                </div>
                <div className="mt-2.5 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm">
                  <span className="flex items-center gap-1.5 text-slate-600"><Building2 size={14} className="text-slate-400" />{property.location || "—"}</span>
                  <span className="font-semibold text-blue-600">{property.price || "—"}</span>
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
        {!loading && !properties.length && <p className="rounded-2xl bg-slate-50 py-12 text-center text-sm font-semibold text-slate-500">No properties found.</p>}
      </div>

      {editing && <PropertyModal property={editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </>
  );
}

function PropertyModal({ property, onClose, onSaved }) {
  const { staffUser } = useStaffAuth();
  const [supervisors, setSupervisors] = useState([]);
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
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const maxImageSizeMb = 15;

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
    const numberFields = ["beds", "baths", "sqft", "yearBuilt", "measurement.value", "map.latitude", "map.longitude"];
    const nextValue = type === "checkbox" ? checked : numberFields.includes(name) ? (value === "" ? null : Number(value)) : value;
    updatePath(name, nextValue);
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

  const save = async (event) => {
    event.preventDefault();
    setError("");
    setUploading(true);
    try {
      let uploadedUrls = [];
      if (pendingFiles.length) {
        const response = await staffApi.uploadPropertyImages(pendingFiles.map((item) => item.file));
        uploadedUrls = response.data.urls;
      }
      const gallery = [...form.gallery.map((item) => item.trim()).filter(Boolean), ...uploadedUrls];
      if (!form.image && !gallery[0]) {
        throw new Error("Please add at least one property image.");
      }
      const measurementValue = form.measurement?.value || form.sqft || 0;
      const measurementUnit = form.measurement?.unit === "custom" ? form.measurement.customUnit || "unit" : form.measurement?.unit || "sqft";
      const payload = {
        ...form,
        image: form.image || gallery[0],
        gallery,
        assignedTo: typeof form.assignedTo === "object" ? form.assignedTo?._id || null : form.assignedTo || null,
        measurement: { ...form.measurement, value: measurementValue },
        sqft: form.sqft || (measurementUnit === "sqft" ? measurementValue : 0),
        area: form.area || `${measurementValue} ${measurementUnit}`,
        badge: form.badge || form.tag,
      };
      if (form._id) await staffApi.updateProperty(form._id, payload);
      else await staffApi.createProperty(payload);
      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[500] grid place-items-center bg-slate-950/50 p-4">
      <form onSubmit={save} className="wf-smooth-scroll max-h-[92vh] w-full max-w-6xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-extrabold">{form._id ? "Edit Property" : "Add Property"}</h3>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"><X size={20} /></button>
        </div>
        {error && <p className="mb-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p>}
        {uploading && <p className="mb-4 rounded-xl bg-blue-50 p-3 text-sm font-bold text-blue-700">Uploading images and saving property...</p>}

        <div className="space-y-6">
          <FormSection title="Core Listing" subtitle="Controls cards, listing pages, and the top of the property detail page.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Property Title" name="title" value={form.title} onChange={update} required />
              <Field label="Price" name="price" value={form.price} onChange={update} placeholder="₹2.8 Cr or ₹45 K" required />
              <Field label="Location" name="location" value={form.location} onChange={update} required />
              <Field label="City" name="city" value={form.city} onChange={update} />
              <Field label="Property Type" name="type" value={form.type} onChange={update} required />
              <Field label="Owner / Seller" name="ownerName" value={form.ownerName} onChange={update} />
              <label>
                <span className="wf-label">Listing Status</span>
                <select className="wf-input" name="status" value={form.status} onChange={update}>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                  <option value="sold">Sold</option>
                  <option value="rented">Rented</option>
                </select>
              </label>
              <label>
                <span className="wf-label">Visibility</span>
                <select className="wf-input" name="visibility" value={form.visibility} onChange={update}>
                  <option value="public">Public website</option>
                  <option value="private">Admin only</option>
                </select>
              </label>
              <label>
                <span className="wf-label">Client-side Source</span>
                <select className="wf-input" name="source" value={form.source} onChange={update}>
                  <option value="pricing">Pricing/Listings</option>
                  <option value="home">Home Featured</option>
                </select>
              </label>
              <label>
                <span className="wf-label">Display Tag</span>
                <select className="wf-input" name="tag" value={form.tag} onChange={update}>
                  <option>Featured</option>
                  <option>New</option>
                  <option>Hot</option>
                  <option>Standard</option>
                </select>
              </label>
              {staffUser.role === "admin" && (
                <label className="md:col-span-2">
                  <span className="wf-label">Assign Supervisor</span>
                  <select className="wf-input" name="assignedTo" value={form.assignedTo?._id || form.assignedTo || ""} onChange={update}>
                    <option value="">Unassigned / Admin owned</option>
                    {supervisors.map((item) => (
                      <option key={item._id} value={item._id}>{item.name} ({item.status})</option>
                    ))}
                  </select>
                </label>
              )}
              <label className="md:col-span-2">
                <span className="wf-label">Description</span>
                <textarea className="wf-input min-h-32" name="description" value={form.description} onChange={update} placeholder="Premium property description shown on the detail page." />
              </label>
            </div>
          </FormSection>

          <FormSection title="Media Gallery" subtitle="Upload/select multiple images, preview them, and reorder the public gallery.">
            <div className="grid gap-4 lg:grid-cols-[1fr_220px]">
              <div>
                <Field label="Primary Image URL" name="image" value={form.image} onChange={update} placeholder="Optional if selecting image files" />
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

          <FormSection title="Measurements & Features" subtitle="These values power listing cards and the detail summary/detail sections.">
            <div className="grid gap-4 md:grid-cols-3">
              <Field label="Bedrooms" name="beds" type="number" value={form.beds} onChange={update} />
              <Field label="Bathrooms" name="baths" type="number" value={form.baths} onChange={update} />
              <Field label="Legacy Sqft" name="sqft" type="number" value={form.sqft} onChange={update} />
              <Field label="Measurement Value" name="measurement.value" type="number" value={form.measurement.value ?? ""} onChange={update} />
              <label>
                <span className="wf-label">Measurement Unit</span>
                <select className="wf-input" name="measurement.unit" value={form.measurement.unit} onChange={update}>
                  <option value="sqft">Sqft</option>
                  <option value="vigha">Vigha</option>
                  <option value="acre">Acre</option>
                  <option value="sq-yard">Sq Yard</option>
                  <option value="sq-meter">Sq Meter</option>
                  <option value="guntha">Guntha</option>
                  <option value="hectare">Hectare</option>
                  <option value="custom">Custom</option>
                </select>
              </label>
              <Field label="Custom Unit" name="measurement.customUnit" value={form.measurement.customUnit} onChange={update} />
              <OptionSelect label="Property Status" name="propertyStatus" value={form.propertyStatus} options={propertyOptionGroups.propertyStatus} onChange={update} />
              <OptionSelect label="Property Category" name="category" value={form.category} options={propertyOptionGroups.category} onChange={update} />
              <OptionSelect label="Availability" name="availability" value={form.availability} options={propertyOptionGroups.availability} onChange={update} />
              <OptionSelect label="Facing" name="facing" value={form.facing} options={propertyOptionGroups.facing} onChange={update} />
              <Field label="Parking" name="parking" value={form.parking} onChange={update} placeholder="Parking for 3 Cars" />
              <OptionSelect label="Furnishing" name="furnishing" value={form.furnishing} options={propertyOptionGroups.furnishing} onChange={update} />
              <Field label="Year Built" name="yearBuilt" type="number" value={form.yearBuilt ?? ""} onChange={update} />
              <Field label="Property Code" name="propertyCode" value={form.propertyCode} onChange={update} placeholder="LX-0001" />
              <Field label="Video URL" name="videoUrl" value={form.videoUrl} onChange={update} />
            </div>
          </FormSection>

          <FormSection title="Amenities & Content Blocks" subtitle="Choose common options with checkboxes. Add custom values when needed.">
            <div className="space-y-6">
              <SelectableTagGroup label="Amenities" value={form.amenities} options={propertyOptionGroups.amenities} onChange={(items) => setForm((current) => ({ ...current, amenities: items }))} />
              <SelectableTagGroup label="Property Features" value={form.features} options={propertyOptionGroups.features} onChange={(items) => setForm((current) => ({ ...current, features: items }))} />
              <SelectableTagGroup label="Facilities" value={form.facilities} options={propertyOptionGroups.facilities} onChange={(items) => setForm((current) => ({ ...current, facilities: items }))} />
              <SelectableTagGroup label="Highlights" value={form.highlights} options={propertyOptionGroups.highlights} onChange={(items) => setForm((current) => ({ ...current, highlights: items }))} />
              <SelectableTagGroup label="Property Tags" value={form.propertyTags} options={propertyOptionGroups.propertyTags} onChange={(items) => setForm((current) => ({ ...current, propertyTags: items }))} />
            </div>
          </FormSection>

          <FormSection title="Investment, Contact & Map" subtitle="Controls ROI/pre-leased badges, sidebar expert details, and map metadata.">
            <div className="grid gap-4 md:grid-cols-3">
              <ToggleField label="Featured Property" name="featured" checked={form.featured} onChange={update} />
              <ToggleField label="Pre-Leased" name="isPreLeased" checked={form.isPreLeased} onChange={update} />
              <ToggleField label="Barter Available" name="isBarter" checked={form.isBarter} onChange={update} />
              <Field label="ROI" name="roi" value={form.roi} onChange={update} placeholder="8.5% yearly" />
              <Field label="Contact Name" name="contact.name" value={form.contact.name} onChange={update} />
              <Field label="Contact Phone" name="contact.phone" value={form.contact.phone} onChange={update} />
              <Field label="Contact Email" name="contact.email" type="email" value={form.contact.email} onChange={update} />
              <Field label="Map Address" name="map.address" value={form.map.address} onChange={update} />
              <Field label="Latitude" name="map.latitude" type="number" value={form.map.latitude ?? ""} onChange={update} />
              <Field label="Longitude" name="map.longitude" type="number" value={form.map.longitude ?? ""} onChange={update} />
              <label className="md:col-span-3">
                <span className="wf-label">Map Embed URL</span>
                <input className="wf-input" name="map.embedUrl" value={form.map.embedUrl} onChange={update} />
              </label>
            </div>
          </FormSection>

          <FormSection title="SEO Metadata" subtitle="Optional fields for production CMS control.">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Slug" name="seo.slug" value={form.seo.slug} onChange={update} />
              <Field label="Meta Title" name="seo.metaTitle" value={form.seo.metaTitle} onChange={update} />
              <label className="md:col-span-2">
                <span className="wf-label">Meta Description</span>
                <textarea className="wf-input min-h-24" name="seo.metaDescription" value={form.seo.metaDescription} onChange={update} />
              </label>
            </div>
          </FormSection>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="wf-btn wf-btn-secondary w-full sm:w-auto" disabled={uploading}>Cancel</button>
          <button type="submit" className="wf-btn wf-btn-primary w-full sm:w-auto" disabled={uploading}>{uploading ? "Saving..." : "Save Property"}</button>
        </div>
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

function Field({ label, name, value, onChange, type = "text", required = false, placeholder = "" }) {
  return (
    <label>
      <span className="wf-label">{label}</span>
      <input className="wf-input" name={name} type={type} value={value ?? ""} onChange={onChange} required={required} placeholder={placeholder} />
    </label>
  );
}

function OptionSelect({ label, name, value, options, onChange }) {
  return (
    <label>
      <span className="wf-label">{label}</span>
      <select className="wf-input" name={name} value={value || ""} onChange={onChange}>
        <option value="">Select {label.toLowerCase()}</option>
        {options.map((option) => <option key={option} value={option}>{option}</option>)}
      </select>
    </label>
  );
}

function SelectableTagGroup({ label, value = [], options, onChange }) {
  const [custom, setCustom] = useState("");
  const selected = new Set(value);
  const toggle = (option) => {
    onChange(selected.has(option) ? value.filter((item) => item !== option) : [...value, option]);
  };
  const addCustom = () => {
    const next = custom.trim();
    if (!next) return;
    if (!selected.has(next)) onChange([...value, next]);
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
    const response = await staffApi.staff();
    setStaff(response.data);
    setLoading(false);
  };

  useEffect(() => {
    let active = true;
    staffApi.staff().then((response) => {
      if (!active) return;
      setStaff(response.data);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  const toggleStatus = async (item) => {
    await staffApi.updateStaff(item._id, { status: item.status === "active" ? "disabled" : "active" });
    load();
  };

  const remove = async (item) => {
    if (!window.confirm(`Delete ${item.name}? This cannot be undone.`)) return;
    await staffApi.deleteStaff(item._id);
    load();
  };

  return (
    <>
      <PageTitle
        title="Supervisor Management"
        subtitle="Create, permission, monitor, and manage property supervisors"
        action={<button onClick={() => setEditing({ role: "supervisor", status: "active", permissions: defaultSupervisorPermissions })} className="wf-btn wf-btn-primary w-full sm:w-auto"><Plus size={18} /> Create Supervisor</button>}
      />

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
          <div key={item._id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_10px_28px_rgba(15,23,42,0.14)] sm:p-6">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-purple-600 to-teal-600 text-white sm:h-14 sm:w-14"><Shield size={24} className="sm:hidden" /><Shield size={28} className="hidden sm:block" /></span>
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
        ))}
      </div>
      {loading && <p className="mt-6 text-sm font-bold text-slate-500">Loading supervisors...</p>}
      {!loading && !visibleSupervisors.length && <p className="mt-6 rounded-2xl bg-slate-50 p-6 text-center text-sm font-bold text-slate-500">No supervisors match your filters.</p>}
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
    role: "supervisor",
    status: supervisor?.status || "active",
    permissions: supervisor?.permissions?.length ? supervisor.permissions : defaultSupervisorPermissions,
    propertiesManaged: supervisor?.propertiesManaged || 0,
  });
  const [error, setError] = useState("");
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
    try {
      const payload = { ...form };
      if (isEdit && !payload.password) delete payload.password;
      if (isEdit) await staffApi.updateStaff(supervisor._id, payload);
      else await staffApi.createStaff({ ...payload, password: payload.password || "Supervisor@12345" });
      onSaved();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="fixed inset-0 z-[500] grid place-items-center bg-slate-950/50 p-4">
      <form onSubmit={save} className="wf-smooth-scroll max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-2xl font-extrabold">{isEdit ? "Edit Supervisor" : "Create Supervisor"}</h3>
          <button type="button" onClick={onClose} className="grid h-10 w-10 place-items-center rounded-xl hover:bg-slate-100"><X size={20} /></button>
        </div>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">{error}</p>}
        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.2fr]">
          <FormSection title="Profile" subtitle="Supervisor account and login details.">
            <div className="grid gap-4">
              <Field label="Name" name="name" value={form.name} onChange={update} required />
              <Field label="Email" name="email" type="email" value={form.email} onChange={update} required />
              <Field label="Phone" name="phone" value={form.phone} onChange={update} />
              <Field label="Designation" name="designation" value={form.designation} onChange={update} />
              <label>
                <span className="wf-label">Status</span>
                <select className="wf-input" name="status" value={form.status} onChange={update}>
                  <option value="active">Active</option>
                  <option value="disabled">Disabled</option>
                </select>
              </label>
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
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className="wf-btn wf-btn-secondary w-full sm:w-auto">Cancel</button>
          <button className="wf-btn wf-btn-primary w-full sm:w-auto">{isEdit ? "Save Supervisor" : "Create Supervisor"}</button>
        </div>
      </form>
    </div>
  );
}

function SupervisorDetails({ supervisor, onClose }) {
  const performance = supervisor.performance || {};
  return (
    <div className="fixed inset-0 z-[500] grid place-items-center bg-slate-950/50 p-4">
      <div className="w-full max-w-3xl rounded-2xl bg-white p-4 shadow-2xl sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-purple-600 to-teal-600 text-white"><Shield size={28} /></span>
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
  );
}

function OwnersSection() {
  const [owners, setOwners] = useState([]);
  const [tab, setTab] = useState("pending");
  const load = async () => setOwners((await staffApi.owners()).data);
  useEffect(() => {
    let active = true;
    staffApi.owners().then((response) => {
      if (active) setOwners(response.data);
    });
    return () => {
      active = false;
    };
  }, []);
  const counts = ["pending", "approved", "rejected"].reduce((acc, key) => ({ ...acc, [key]: owners.filter((owner) => owner.status === key).length }), {});
  const visible = owners.filter((owner) => owner.status === tab);
  return (
    <>
      <PageTitle title="Owner Management" subtitle="Review and approve property owner applications" />
      <div className="rounded-2xl border border-slate-100 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
        <div className="grid grid-cols-3 border-b border-slate-200">
          {["pending", "approved", "rejected"].map((key) => (
            <button key={key} onClick={() => setTab(key)} className={`relative px-2 py-3.5 text-sm font-semibold capitalize transition-colors sm:px-4 sm:py-4 ${tab === key ? "text-blue-600" : "text-slate-500 hover:text-slate-700"}`}>
              {key} <span className={`ml-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${tab === key ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>{counts[key] || 0}</span>
              {tab === key && <span className="absolute bottom-0 left-2 right-2 h-0.5 rounded-full bg-blue-600" />}
            </button>
          ))}
        </div>
        <div className="space-y-3 p-4 sm:p-6">
          {visible.length === 0 && <p className="py-8 text-center text-sm text-slate-500">No {tab} owners found.</p>}
          {visible.map((owner) => (
            <div key={owner._id} className="rounded-xl border border-slate-100 p-4 transition-shadow hover:shadow-[0_4px_12px_rgba(15,23,42,0.06)] sm:p-5">
              {/* Desktop row layout */}
              <div className="hidden md:grid md:grid-cols-[1.2fr_1fr_1fr_0.6fr_auto] md:items-center md:gap-4">
                <OwnerCell label="Name" value={owner.name} />
                <OwnerCell label="Email" value={owner.email} />
                <OwnerCell label="Phone" value={owner.phone} />
                <OwnerCell label="Properties" value={owner.propertyCount} />
                {tab === "pending" && (
                  <div className="flex gap-2">
                    <button onClick={() => staffApi.updateOwnerStatus(owner._id, "approved").then(load)} className="wf-btn bg-emerald-600 text-white"><Check size={16} /> Approve</button>
                    <button onClick={() => staffApi.updateOwnerStatus(owner._id, "rejected").then(load)} className="wf-btn bg-red-600 text-white"><X size={16} /> Reject</button>
                  </div>
                )}
              </div>
              {/* Mobile card layout */}
              <div className="md:hidden">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-bold text-slate-950">{owner.name}</p>
                    <p className="mt-0.5 text-xs text-slate-500">{owner.email}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">{owner.propertyCount} props</span>
                </div>
                {owner.phone && <p className="mt-2 text-sm text-slate-600">{owner.phone}</p>}
                {tab === "pending" && (
                  <div className="mt-3 flex gap-2 border-t border-slate-100 pt-3">
                    <button onClick={() => staffApi.updateOwnerStatus(owner._id, "approved").then(load)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 px-3 py-2.5 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100"><Check size={15} /> Approve</button>
                    <button onClick={() => staffApi.updateOwnerStatus(owner._id, "rejected").then(load)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"><X size={15} /> Reject</button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

function OwnerCell({ label, value }) {
  return <div><p className="text-xs text-slate-500 sm:text-sm">{label}</p><p className="mt-1 font-medium text-slate-900">{value}</p></div>;
}

function EnquiriesSection({ canDelete, canManage }) {
  const [enquiries, setEnquiries] = useState([]);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const load = async () => {
    const params = new URLSearchParams();
    if (query) params.set("search", query);
    if (status !== "all") params.set("status", status);
    setEnquiries((await staffApi.enquiries(`?${params.toString()}`)).data);
  };
  useEffect(() => {
    let active = true;
    staffApi.enquiries().then((response) => {
      if (active) setEnquiries(response.data);
    });
    return () => {
      active = false;
    };
  }, []);
  const counts = { new: enquiries.filter((item) => item.status === "new").length, "in-progress": enquiries.filter((item) => item.status === "in-progress").length, closed: enquiries.filter((item) => item.status === "closed").length };
  return (
    <>
      <PageTitle
        title="Enquiry Overview"
        subtitle="Manage and track all property enquiries"
        action={(
          <div className="flex flex-wrap gap-3">
            <BadgeCount label="New" value={counts.new} />
            <BadgeCount label="In Progress" value={counts["in-progress"]} tone="yellow" />
            <BadgeCount label="Closed" value={counts.closed} tone="green" />
          </div>
        )}
      />
      <div className="mb-6 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <div className="relative flex-1"><Search className="absolute left-3.5 top-1/2 h-4.5 w-4.5 -translate-y-1/2 text-slate-400" /><input className="wf-input pl-10" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search enquiries..." /></div>
          <select className="wf-input w-full sm:w-36" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All Status</option><option value="new">New</option><option value="in-progress">In Progress</option><option value="closed">Closed</option></select>
          <button onClick={load} className="wf-btn wf-btn-secondary w-full sm:w-auto"><Filter size={17} /> Filter</button>
        </div>
      </div>
      {/* Desktop Table */}
      <div className="hidden lg:block overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-[0_10px_28px_rgba(15,23,42,0.14)]">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs text-slate-600"><tr><th className="px-6 py-4">User</th><th className="px-4 py-4">Property</th><th className="px-4 py-4">Date</th><th className="px-4 py-4">Status</th><th className="px-4 py-4">Message</th><th className="px-6 py-4 text-right">Action</th></tr></thead>
          <tbody className="divide-y divide-slate-100">
            {enquiries.map((item) => (
              <tr key={item._id} className="transition-colors hover:bg-slate-50/60">
                <td className="px-6 py-4"><p className="font-semibold text-slate-950">{item.name}</p><p className="text-xs text-slate-500">{item.email}</p></td>
                <td className="px-4 py-4 text-sm text-slate-700">{item.propertyTitle || item.preferredLocation || item.propertyType || "General enquiry"}</td>
                <td className="px-4 py-4 text-sm text-slate-600"><Calendar size={14} className="mr-1.5 inline text-slate-400" />{formatDate(item.createdAt)}</td>
                <td className="px-4 py-4">{canManage ? <select value={item.status} onChange={(event) => staffApi.updateEnquiry(item._id, { status: event.target.value }).then(load)} className={`rounded-full border-0 px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}><option value="new">New</option><option value="in-progress">In Progress</option><option value="closed">Closed</option></select> : <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span>}</td>
                <td className="max-w-xs truncate px-4 py-4 text-sm text-slate-600">{item.message || "No message"}</td>
                <td className="px-6 py-4 text-right">{canDelete && <button onClick={() => staffApi.deleteEnquiry(item._id).then(load)} className="grid h-9 w-9 place-items-center rounded-lg text-red-500 transition hover:bg-red-50"><Trash2 size={17} /></button>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile/Tablet Card View */}
      <div className="lg:hidden space-y-3">
        {enquiries.map((item) => (
          <div key={item._id} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_4px_16px_rgba(15,23,42,0.08)] transition-shadow hover:shadow-[0_8px_24px_rgba(15,23,42,0.12)]">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="font-bold text-slate-950">{item.name}</p>
                <p className="mt-0.5 text-xs text-slate-500">{item.email}</p>
              </div>
              {canManage ? (
                <select value={item.status} onChange={(event) => staffApi.updateEnquiry(item._id, { status: event.target.value }).then(load)} className={`shrink-0 rounded-full border-0 px-2.5 py-1 text-xs font-semibold ${statusClass(item.status)}`}><option value="new">New</option><option value="in-progress">In Progress</option><option value="closed">Closed</option></select>
              ) : (
                <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusClass(item.status)}`}>{item.status}</span>
              )}
            </div>
            <div className="mt-3 rounded-xl bg-slate-50 px-3 py-2.5">
              <p className="text-xs font-semibold text-slate-500">Property</p>
              <p className="mt-0.5 text-sm text-slate-800">{item.propertyTitle || item.preferredLocation || item.propertyType || "General enquiry"}</p>
            </div>
            {item.message && (
              <p className="mt-3 line-clamp-2 text-sm text-slate-600">{item.message}</p>
            )}
            <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-500"><Calendar size={13} className="text-slate-400" />{formatDate(item.createdAt)}</span>
              {canDelete && <button onClick={() => staffApi.deleteEnquiry(item._id).then(load)} className="flex items-center gap-1.5 rounded-lg bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"><Trash2 size={13} /> Remove</button>}
            </div>
          </div>
        ))}
        {!enquiries.length && <p className="rounded-2xl bg-slate-50 py-12 text-center text-sm font-semibold text-slate-500">No enquiries found.</p>}
      </div>
    </>
  );
}

function BadgeCount({ label, value, tone = "blue" }) {
  const tones = { blue: "border-blue-200 bg-blue-50 text-blue-600", yellow: "border-yellow-200 bg-yellow-50 text-yellow-700", green: "border-emerald-200 bg-emerald-50 text-emerald-700" };
  return <div className={`flex-1 rounded-xl border px-3 py-2 text-center sm:flex-none sm:px-5 sm:py-2.5 ${tones[tone]}`}><p className="text-lg font-semibold sm:text-xl">{value}</p><p className="text-[10px] font-medium sm:text-xs">{label}</p></div>;
}

function AnalyticsSection() {
  const { staffToken } = useStaffAuth();
  const [data, setData] = useState(null);
  const [exporting, setExporting] = useState("");
  useEffect(() => { staffApi.analytics().then((response) => setData(response.data)); }, []);
  const cards = data?.cards || {};
  const exportAnalytics = async (format) => {
    if (!staffToken) {
      window.dispatchEvent(new CustomEvent("staff-auth:unauthorized"));
      return;
    }
    setExporting(format);
    try {
      const response = await fetch(staffApi.reportUrl("analytics", "this-month", format), { headers: { Authorization: `Bearer ${staffToken}` } });
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
      <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        <StatCard icon={Users} color="purple" label="Total Leads" value={cards.totalLeads ?? 0} />
        <StatCard icon={ClipboardList} color="teal" label="Conversion Rate" value={`${cards.conversionRate ?? 0}%`} />
        <StatCard icon={FileText} color="green" label="Revenue Generated" value={cards.revenueGenerated ?? "₹0 Cr"} />
        <StatCard icon={BarChart3} label="Avg Response Time" value={cards.avgResponseTime ?? "0 hrs"} />
      </div>
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <LineChartCard title="Weekly Enquiries & Conversions" points={data?.weekly || []} />
        <BarChartCard title="Lead Sources" points={data?.sources || []} />
      </div>
      <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-6">
        <h3 className="text-lg font-bold sm:text-xl">Conversion Funnel</h3>
        <div className="mt-5 space-y-4 sm:mt-6">{(data?.funnel || []).map((item) => <div key={item.label} className="space-y-1.5 sm:grid sm:grid-cols-[130px_1fr_80px] sm:items-center sm:gap-3 sm:space-y-0"><span className="block text-sm font-medium text-slate-600">{item.label}</span><div className="h-9 overflow-hidden rounded-lg bg-slate-100 sm:h-10"><div className="h-full rounded-lg bg-gradient-to-r from-blue-600 to-teal-500 transition-all duration-500" style={{ width: `${Math.max(item.percent, 4)}%` }} /></div><span className="block text-right text-sm font-bold text-slate-800">{item.value}</span></div>)}</div>
      </div>
    </>
  );
}

function LineChartCard({ title, points }) {
  const max = Math.max(...points.map((point) => point.enquiries || 0), 1);
  const polyline = points.map((point, index) => `${(index / Math.max(points.length - 1, 1)) * 100},${100 - ((point.enquiries || 0) / max) * 80}`).join(" ");
  return <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-6"><h3 className="text-lg font-bold sm:text-xl">{title}</h3><svg viewBox="0 0 100 100" className="mt-5 h-44 w-full overflow-visible sm:mt-6 sm:h-56 lg:h-64"><polyline points={polyline} fill="none" stroke="#14b8a6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" /><line x1="0" y1="100" x2="100" y2="100" stroke="#e2e8f0" /></svg></div>;
}

function BarChartCard({ title, points }) {
  const max = Math.max(...points.map((point) => point.value || 1), 1);
  return <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-[0_4px_16px_rgba(15,23,42,0.08)] sm:p-6"><h3 className="text-lg font-bold sm:text-xl">{title}</h3><div className="mt-5 flex h-44 items-end gap-2 sm:mt-6 sm:h-56 sm:gap-4 lg:h-64">{points.map((point) => <div key={point.label} className="flex flex-1 flex-col items-center gap-1.5"><div className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-500 transition-all duration-300" style={{ height: `${(point.value / max) * 100}%` }} /><span className="text-[10px] text-slate-500 sm:text-xs">{point.label}</span></div>)}</div></div>;
}

function ReportsSection({ token, role }) {
  const [type, setType] = useState("enquiries");
  const [range, setRange] = useState("this-month");
  const reportTypes = role === "admin" ? ["enquiries", "leads", "properties", "owners"] : ["enquiries", "leads", "properties"];
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

function SettingsSection() {
  const [content, setContent] = useState([]);
  const [siteName, setSiteName] = useState("Akshar Estate The Property HUB");
  const [message, setMessage] = useState("");

  useEffect(() => {
    publicApi.content().then((response) => {
      setContent(response.data);
      const site = response.data.find((item) => item.key === "siteName");
      if (site) setSiteName(site.value);
    });
  }, []);

  const updateLocal = (id, value) => setContent((items) => items.map((item) => (item._id === id ? { ...item, value } : item)));
  const save = async () => {
    for (const item of content) {
      await staffApi.updateContent(item._id, item.key === "siteName" ? siteName : item.value);
    }
    setMessage("Changes saved");
  };

  return (
    <>
      <PageTitle title="Platform Settings" subtitle="Configure platform preferences and branding" action={<button onClick={save} className="wf-btn wf-btn-primary w-full sm:w-auto"><Save size={17} /> Save Changes</button>} />
      {message && <p className="mb-4 rounded-xl bg-emerald-50 p-3 text-sm font-bold text-emerald-700">{message}</p>}
      <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.14)] sm:p-6">
        <h3 className="text-xl font-bold">Branding</h3>
        <label className="mt-6 block"><span className="wf-label">Site Name</span><input className="wf-input" value={siteName} onChange={(event) => setSiteName(event.target.value)} /></label>
        <div className="mt-6"><p className="wf-label">Platform Logo</p><div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4"><span className="grid h-20 w-20 place-items-center rounded-xl bg-gradient-to-br from-blue-600 to-teal-600 text-3xl text-white">A</span><button className="wf-btn wf-btn-secondary w-full sm:w-auto"><Upload size={18} /> Upload New Logo</button></div></div>
        <div className="mt-6"><p className="wf-label">Brand Colors</p><div className="flex flex-wrap gap-3"><span className="h-12 w-12 rounded-lg bg-blue-600 ring-1 ring-slate-200" /><span className="h-12 w-12 rounded-lg bg-teal-600 ring-1 ring-slate-200" /></div></div>
      </div>
      <div className="mt-8 rounded-2xl border border-slate-100 bg-white p-4 shadow-[0_10px_28px_rgba(15,23,42,0.14)] sm:p-6">
        <h3 className="text-xl font-bold">Website Content & Email Templates</h3>
        <div className="mt-6 space-y-5">{content.filter((item) => item.key !== "siteName").map((item) => <label key={item._id} className="block"><span className="wf-label">{item.label}</span>{item.type === "textarea" ? <textarea className="wf-input min-h-28" value={item.value} onChange={(event) => updateLocal(item._id, event.target.value)} /> : <input className="wf-input" value={item.value} onChange={(event) => updateLocal(item._id, event.target.value)} />}</label>)}</div>
      </div>
    </>
  );
}
