const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://akshar-realestate-backend.onrender.com/api";

function toQueryString(params = {}) {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== "all") {
      searchParams.set(key, value);
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

function getStaffToken() {
  return localStorage.getItem("staffToken");
}

function getUserToken() {
  return localStorage.getItem("userToken");
}

async function request(path, options = {}) {
  const { authRequired = false, token: explicitToken, ...fetchOptions } = options;
  const headers = new Headers(fetchOptions.headers || {});
  const isFormData = fetchOptions.body instanceof FormData;
  if (!isFormData) headers.set("Content-Type", "application/json");

  const token = explicitToken === null ? null : explicitToken ?? getStaffToken();
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

export const userApi = {
  register: (payload) => request("/auth/user/register", { method: "POST", body: JSON.stringify(payload), token: null }),
  login: (payload) => request("/auth/user/login", { method: "POST", body: JSON.stringify(payload), token: null }),
  me: () => request("/auth/user/me", { authRequired: true, token: getUserToken() }),
  logout: () => request("/auth/user/logout", { method: "POST", body: JSON.stringify({}), authRequired: true, token: getUserToken() }),
  wishlist: () => request("/auth/user/wishlist", { authRequired: true, token: getUserToken() }),
  saveWishlist: (property) => request("/auth/user/wishlist", { method: "POST", body: JSON.stringify(property), authRequired: true, token: getUserToken() }),
  removeWishlist: (key) => request(`/auth/user/wishlist/${encodeURIComponent(key)}`, { method: "DELETE", authRequired: true, token: getUserToken() }),
};

export const ownerApi = {
  list: () => request("/public/owner/properties", { authRequired: true, token: getUserToken() }),
  create: (payload) => request("/public/owner/properties", { method: "POST", body: JSON.stringify(payload), authRequired: true, token: getUserToken() }),
  update: (id, payload) => request(`/public/owner/properties/${id}`, { method: "PUT", body: JSON.stringify(payload), authRequired: true, token: getUserToken() }),
  upload: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return request("/public/owner/uploads", { method: "POST", body: formData, authRequired: true, token: getUserToken() });
  },
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
  analytics: (query = "") => request(`/admin/analytics${typeof query === "string" ? query : toQueryString(query)}`, { authRequired: true }),
  notifications: () => request("/admin/notifications", { authRequired: true }),
  markNotificationRead: (id) => request(`/admin/notifications/${id}/read`, { method: "PUT", body: JSON.stringify({}), authRequired: true }),
  markAllNotificationsRead: () => request("/admin/notifications/read-all", { method: "PUT", body: JSON.stringify({}), authRequired: true }),
  properties: (query = "") => request(`/admin/properties${query}`, { authRequired: true }),
  nextPropertyCode: (params = {}) => request(`/admin/properties/next-code${toQueryString(params)}`, { authRequired: true }),
  checkPropertyCode: (propertyCode, params = {}) => request(`/admin/properties/code/${encodeURIComponent(propertyCode)}/available${toQueryString(params)}`, { authRequired: true }),
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
  owners: (query = "") => request(`/admin/owners${typeof query === "string" ? query : toQueryString(query)}`, { authRequired: true }),
  updateOwnerStatus: (id, payload) => request(`/admin/owners/${id}/status`, { method: "PUT", body: JSON.stringify(typeof payload === "string" ? { status: payload } : payload), authRequired: true }),
  updateContent: (id, value) => request(`/admin/content/${id}`, { method: "PUT", body: JSON.stringify({ value }), authRequired: true }),
  soldRentedReport: (query = "") => request(`/admin/reports/sold-rented${typeof query === "string" ? query : toQueryString(query)}`, { authRequired: true }),
  reportUrl: (type, range, format = "csv", params = {}) => `${API_BASE_URL}/admin/reports/export${toQueryString({ ...params, type, range, format })}`,
};

export { API_BASE_URL, toQueryString };
