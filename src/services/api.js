import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// ── axios instance ────────────────────────────────────────────────────────────

const api = axios.create({ baseURL: BASE_URL });

// Attach JWT to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 anywhere, clear session and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ── auth ──────────────────────────────────────────────────────────────────────

export const authAPI = {
  register: (data) => api.post("/auth/register", data).then((r) => r.data),
  login:    (data) => api.post("/auth/login",    data).then((r) => r.data),
  me:       ()     => api.get("/auth/me")              .then((r) => r.data),
};

// ── medicines ─────────────────────────────────────────────────────────────────

export const medicinesAPI = {
  /** GET /api/medicines?search=&category=&completed= */
  getAll: (params = {}) =>
    api.get("/medicines", { params }).then((r) => r.data.medicines),

  /** GET /api/medicines/stats */
  getStats: () =>
    api.get("/medicines/stats").then((r) => r.data),

  /** GET /api/medicines/:id */
  getOne: (id) =>
    api.get(`/medicines/${id}`).then((r) => r.data),

  /** POST /api/medicines */
  create: (data) =>
    api.post("/medicines", data).then((r) => r.data.medicine),

  /** PUT /api/medicines/:id */
  update: (id, data) =>
    api.put(`/medicines/${id}`, data).then((r) => r.data.medicine),

  /** PATCH /api/medicines/:id/complete */
  toggleComplete: (id) =>
    api.patch(`/medicines/${id}/complete`).then((r) => r.data.medicine),

  /** DELETE /api/medicines/:id */
  remove: (id) =>
    api.delete(`/medicines/${id}`).then((r) => r.data),
};

// ── auth helpers (localStorage session) ──────────────────────────────────────

export function saveSession({ token, user }) {
  localStorage.setItem("token", token);
  localStorage.setItem("user",  JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getUser() {
  try {
    return JSON.parse(localStorage.getItem("user")) || null;
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export default api;
