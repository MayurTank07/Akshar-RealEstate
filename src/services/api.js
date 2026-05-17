const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (typeof window !== "undefined" && window.location.hostname !== "localhost" && window.location.hostname !== "127.0.0.1"
    ? "https://akshar-realestate-backend.onrender.com/api"
    : "http://127.0.0.1:5001/api");

function getStaffToken() {
  return localStorage.getItem("staffToken");
}

async function request(path, options = {}) {
  const { authRequired = false, token: explicitToken, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});
  const isFormData = fetchOptions.body instanceof FormData;
  if (!isFormData) headers.set("Content-Type", "application/json");

  const token = explicitToken ?? getStaffToken();
  if (authRequired && !token) {
    const error = new Error("Authentication required");
    error.status = 401;
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("staff-auth:unauthorized"));
    }
    throw error;
  }
  if (token) headers.set("Authorization", `Bearer ${token}`);

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const error = new Error(data?.message || "Request failed");
    error.status = response.status;
    error.details = data?.details;
    if (response.status === 401 && token && typeof window !== "undefined" && path !== "/auth/staff/login") {
      window.dispatchEvent(new CustomEvent("staff-auth:unauthorized"));
    }
    throw error;
  }

  return data;
}

export const publicApi = {
  properties: () => request("/public/properties", { token: null }),
  property: (id) => request(`/public/properties/${id}`, { token: null }),
  createEnquiry: (payload) => request("/public/enquiries", { method: "POST", body: JSON.stringify(payload), token: null }),
  content: () => request("/public/content", { token: null }),
};

export const staffApi = {
  login: (payload) => request("/auth/staff/login", { method: "POST", body: JSON.stringify(payload), token: null }),
  logout: (token) => request("/auth/logout", { method: "POST", body: JSON.stringify({}), token, authRequired: true }),
  me: () => request("/auth/me", { authRequired: true }),
  updateProfile: (payload) => request("/auth/me", { method: "PUT", body: JSON.stringify(payload), authRequired: true }),
  changePassword: (payload) => request("/auth/me/password", { method: "PUT", body: JSON.stringify(payload), authRequired: true }),
  uploadAvatar: (file) => {
    const formData = new FormData();
    formData.append("avatar", file);
    return request("/auth/me/avatar", { method: "POST", body: formData, authRequired: true });
  },
  dashboard: () => request("/admin/dashboard", { authRequired: true }),
  analytics: () => request("/admin/analytics", { authRequired: true }),
  notifications: () => request("/admin/notifications", { authRequired: true }),
  markNotificationRead: (id) => request(`/admin/notifications/${id}/read`, { method: "PUT", body: JSON.stringify({}), authRequired: true }),
  markAllNotificationsRead: () => request("/admin/notifications/read-all", { method: "PUT", body: JSON.stringify({}), authRequired: true }),
  properties: (query = "") => request(`/admin/properties${query}`, { authRequired: true }),
  createProperty: (payload) => request("/admin/properties", { method: "POST", body: JSON.stringify(payload), authRequired: true }),
  updateProperty: (id, payload) => request(`/admin/properties/${id}`, { method: "PUT", body: JSON.stringify(payload), authRequired: true }),
  deleteProperty: (id) => request(`/admin/properties/${id}`, { method: "DELETE", authRequired: true }),
  uploadPropertyImages: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    return request("/admin/uploads/property-images", { method: "POST", body: formData, authRequired: true });
  },
  enquiries: (query = "") => request(`/admin/enquiries${query}`, { authRequired: true }),
  updateEnquiry: (id, payload) => request(`/admin/enquiries/${id}`, { method: "PUT", body: JSON.stringify(payload), authRequired: true }),
  deleteEnquiry: (id) => request(`/admin/enquiries/${id}`, { method: "DELETE", authRequired: true }),
  staff: () => request("/admin/staff", { authRequired: true }),
  createStaff: (payload) => request("/admin/staff", { method: "POST", body: JSON.stringify(payload), authRequired: true }),
  updateStaff: (id, payload) => request(`/admin/staff/${id}`, { method: "PUT", body: JSON.stringify(payload), authRequired: true }),
  deleteStaff: (id) => request(`/admin/staff/${id}`, { method: "DELETE", authRequired: true }),
  owners: () => request("/admin/owners", { authRequired: true }),
  updateOwnerStatus: (id, status) => request(`/admin/owners/${id}/status`, { method: "PUT", body: JSON.stringify({ status }), authRequired: true }),
  updateContent: (id, value) => request(`/admin/content/${id}`, { method: "PUT", body: JSON.stringify({ value }), authRequired: true }),
  reportUrl: (type, range, format = "csv") => `${API_BASE_URL}/admin/reports/export?type=${encodeURIComponent(type)}&range=${encodeURIComponent(range)}&format=${encodeURIComponent(format)}`,
};

export { API_BASE_URL };
