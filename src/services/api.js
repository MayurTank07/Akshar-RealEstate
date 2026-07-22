const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://127.0.0.1:5001/api" : "https://akshar-realestate-backend.onrender.com/api");

const publicGetCache = new Map();
const PUBLIC_GET_TTL_MS = 60_000;

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
  const method = String(fetchOptions.method || "GET").toUpperCase();
  const isPublicGet = method === "GET" && explicitToken === null && path.startsWith("/public/");
  const cached = isPublicGet ? publicGetCache.get(path) : null;
  if (cached && cached.expiresAt > Date.now()) return cached.promise;

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

  const promise = fetch(`${API_BASE_URL}${path}`, {
    ...fetchOptions,
    headers,
  })
    .then(async (response) => {
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
    })
    .catch((error) => {
      if (isPublicGet) publicGetCache.delete(path);
      throw error;
    });

  if (isPublicGet) publicGetCache.set(path, { promise, expiresAt: Date.now() + PUBLIC_GET_TTL_MS });
  return promise;
}

export const publicApi = {
  properties: (params = {}) => request(`/public/properties${typeof params === "string" ? params : toQueryString(params)}`, { token: null }),
  property: (id) => request(`/public/properties/${id}`, { token: null }),
  propertyBySlug: (slug) => request(`/public/properties/slug/${encodeURIComponent(slug)}`, { token: null }),
  propertyOptions: () => request("/public/property-options", { token: null }),
  locations: (params = {}) => request(`/public/locations${typeof params === "string" ? params : toQueryString(params)}`, { token: null }),
  createEnquiry: (payload) => request("/public/enquiries", { method: "POST", body: JSON.stringify(payload), token: null }),
  content: () => request("/public/content", { token: null }),
  certifications: () => request("/public/certifications", { token: null }),
};

export const userApi = {
  register: (payload) => request("/auth/user/register", { method: "POST", body: JSON.stringify(payload), token: null }),
  login: (payload) => request("/auth/user/login", { method: "POST", body: JSON.stringify(payload), token: null }),
  google: (payload) => request("/auth/user/google", { method: "POST", body: JSON.stringify(payload), token: null }),
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
  deletePending: (id) => request(`/public/owner/properties/${id}`, { method: "DELETE", authRequired: true, token: getUserToken() }),
  requestDelete: (id, reason) => request(`/public/owner/properties/${id}/delete-request`, { method: "POST", body: JSON.stringify({ reason }), authRequired: true, token: getUserToken() }),
  upload: (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    return request("/public/owner/uploads", { method: "POST", body: formData, authRequired: true, token: getUserToken() });
  },
  uploadProof: (files, documentType, customDocumentName = "") => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    formData.append("documentType", documentType);
    if (customDocumentName) formData.append("customDocumentName", customDocumentName);
    return request("/public/owner/proofs", { method: "POST", body: formData, authRequired: true, token: getUserToken() });
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
  uploadCover: (file) => {
    const formData = new FormData();
    formData.append("cover", file);
    return request("/auth/me/cover", { method: "POST", body: formData, authRequired: true });
  },
  removeCover: () => request("/auth/me/cover", { method: "DELETE", authRequired: true }),
  dashboard: () => request("/admin/dashboard", { authRequired: true }),
  analytics: (query = "") => request(`/admin/analytics${typeof query === "string" ? query : toQueryString(query)}`, { authRequired: true }),
  notifications: () => request("/admin/notifications", { authRequired: true }),
  markNotificationRead: (id) => request(`/admin/notifications/${id}/read`, { method: "PUT", body: JSON.stringify({}), authRequired: true }),
  markAllNotificationsRead: () => request("/admin/notifications/read-all", { method: "PUT", body: JSON.stringify({}), authRequired: true }),
  properties: (query = "") => request(`/admin/properties${query}`, { authRequired: true }),
  propertyOptions: () => request("/admin/property-options", { authRequired: true }),
  createPropertyOption: (payload) => request("/admin/property-options", { method: "POST", body: JSON.stringify(payload), authRequired: true }),
  locations: (params = {}) => request(`/admin/locations${typeof params === "string" ? params : toQueryString(params)}`, { authRequired: true }),
  createLocation: (payload) => request("/admin/locations", { method: "POST", body: JSON.stringify(payload), authRequired: true }),
  nextPropertyCode: (params = {}) => request(`/admin/properties/next-code${toQueryString(params)}`, { authRequired: true }),
  checkPropertyCode: (propertyCode, params = {}) => request(`/admin/properties/code/${encodeURIComponent(propertyCode)}/available${toQueryString(params)}`, { authRequired: true }),
  createProperty: (payload) => request("/admin/properties", { method: "POST", body: JSON.stringify(payload), authRequired: true }),
  updateProperty: (id, payload) => request(`/admin/properties/${id}`, { method: "PUT", body: JSON.stringify(payload), authRequired: true }),
  deleteProperty: (id) => request(`/admin/properties/${id}`, { method: "DELETE", authRequired: true }),
  uploadPropertyImages: (files, meta = {}) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    Object.entries(meta).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") formData.append(key, value);
    });
    return request("/admin/uploads/property-images", { method: "POST", body: formData, authRequired: true });
  },
  enquiries: (query = "") => request(`/admin/enquiries${query}`, { authRequired: true }),
  updateEnquiry: (id, payload) => request(`/admin/enquiries/${id}`, { method: "PUT", body: JSON.stringify(payload), authRequired: true }),
  deleteEnquiry: (id) => request(`/admin/enquiries/${id}`, { method: "DELETE", authRequired: true }),
  staff: () => request("/admin/staff", { authRequired: true }),
  createStaff: (payload) => request("/admin/staff", { method: "POST", body: JSON.stringify(payload), authRequired: true }),
  updateStaff: (id, payload) => request(`/admin/staff/${id}`, { method: "PUT", body: JSON.stringify(payload), authRequired: true }),
  uploadStaffCover: (id, file) => {
    const formData = new FormData();
    formData.append("cover", file);
    return request(`/admin/staff/${id}/cover`, { method: "POST", body: formData, authRequired: true });
  },
  removeStaffCover: (id) => request(`/admin/staff/${id}/cover`, { method: "DELETE", authRequired: true }),
  deleteStaff: (id) => request(`/admin/staff/${id}`, { method: "DELETE", authRequired: true }),
  owners: (query = "") => request(`/admin/owners${typeof query === "string" ? query : toQueryString(query)}`, { authRequired: true }),
  updateOwnerContent: (id, payload) => request(`/admin/owners/${id}`, { method: "PUT", body: JSON.stringify(payload), authRequired: true }),
  updateOwnerStatus: (id, payload) => request(`/admin/owners/${id}/status`, { method: "PUT", body: JSON.stringify(typeof payload === "string" ? { status: payload } : payload), authRequired: true }),
  reviewOwnerDelete: (id, payload) => request(`/admin/owners/${id}/delete`, { method: "PUT", body: JSON.stringify(payload), authRequired: true }),
  deleteOwner: (id) => request(`/admin/owners/${id}`, { method: "DELETE", authRequired: true }),
  users: (query = "") => request(`/admin/users${typeof query === "string" ? query : toQueryString(query)}`, { authRequired: true }),
  userStats: () => request("/admin/users/stats", { authRequired: true }),
  updateUserStatus: (id, status) => request(`/admin/users/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }), authRequired: true }),
  deleteUser: (id) => request(`/admin/users/${id}`, { method: "DELETE", authRequired: true }),
  usersExportUrl: (format, params = {}) => `${API_BASE_URL}/admin/users/export${toQueryString({ ...params, format })}`,
  updateContent: (id, value) => request(`/admin/content/${id}`, { method: "PUT", body: JSON.stringify({ value }), authRequired: true }),
  soldRentedReport: (query = "") => request(`/admin/reports/sold-rented${typeof query === "string" ? query : toQueryString(query)}`, { authRequired: true }),
  reportUrl: (type, range, format = "csv", params = {}) => `${API_BASE_URL}/admin/reports/export${toQueryString({ ...params, type, range, format })}`,
  certifications: () => request("/admin/certifications", { authRequired: true }),
  uploadCertificationImage: (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return request("/admin/certifications/upload", { method: "POST", body: formData, authRequired: true });
  },
  createCertification: (payload) => request("/admin/certifications", { method: "POST", body: JSON.stringify(payload), authRequired: true }),
  updateCertification: (id, payload) => request(`/admin/certifications/${id}`, { method: "PUT", body: JSON.stringify(payload), authRequired: true }),
  deleteCertification: (id) => request(`/admin/certifications/${id}`, { method: "DELETE", authRequired: true }),
};

export { API_BASE_URL, toQueryString };
