import axios from "axios"

const API_BASE_URL = "https://form.codepeak.software/api/v1"

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
})

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token")
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        return response.data
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            window.location.href = "/login"
        }
        return Promise.reject(error.response?.data || error.message)
    }
)

// Auth API
export const authAPI = {
    login: (credentials) => api.post("/auth/login", credentials),
    // register: (userData) => api.post("/auth/register", userData), // Disabled - use joinRequestAPI instead
    forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
    resetPassword: (token, password) => api.post("/auth/reset-password", { token, password }),
    changePassword: (passwords) => api.put("/auth/change-password", passwords),
}

// Join Request API
export const joinRequestAPI = {
    create: (requestData) => api.post("/join-requests", requestData),
    getAll: (params) => api.get("/join-requests", { params }),
    getById: (id) => api.get(`/join-requests/${id}`),
    approve: (id, data) => api.patch(`/join-requests/${id}/approve`, data),
    deny: (id, data) => api.patch(`/join-requests/${id}/deny`, data),
    delete: (id) => api.delete(`/join-requests/${id}`),
}

// Users API
export const usersAPI = {
    getMe: () => api.get("/users/me"),
    updateMe: (userData) => api.put("/users/me", userData),
    getAll: (params) => api.get("/users", { params }),
    getById: (id) => api.get(`/users/${id}`),
    create: (userData) => api.post("/auth/register", userData), // Admin can create users through registration
    update: (id, userData) => api.put(`/users/${id}`, userData),
    delete: (id) => api.delete(`/users/${id}`),
}

// Positions API
export const positionsAPI = {
    getAll: (params) => api.get("/positions", { params }),
    getById: (id) => api.get(`/positions/${id}`),
    create: (positionData) => api.post("/positions", positionData),
    update: (id, positionData) => api.put(`/positions/${id}`, positionData),
    delete: (id) => api.delete(`/positions/${id}`),
}

// News API
export const newsAPI = {
    getAll: (params) => api.get("/news", { params }),
    getById: (id) => api.get(`/news/${id}`),
    create: (formData) =>
        api.post("/news", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    update: (id, formData) =>
        api.put(`/news/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    delete: (id) => api.delete(`/news/${id}`),
}

// Events API
export const eventsAPI = {
    getAll: (params) => api.get("/events", { params }),
    getById: (id) => api.get(`/events/${id}`),
    getRegisteredUsers: (id) => api.get(`/events/${id}/registered-users`),
    create: (formData) =>
        api.post("/events", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    update: (id, formData) =>
        api.put(`/events/${id}`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    delete: (id) => api.delete(`/events/${id}`),
    register: (id) => api.post(`/events/${id}/register`),
    guestRegister: (id, payload) => api.post(`/events/${id}/guest-register`, payload),
}

// Media API
export const mediaAPI = {
    getAll: (params) => api.get("/media", { params }),
    getById: (id) => api.get(`/media/${id}`),
    upload: (formData) =>
        api.post("/media", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        }),
    update: (id, data) => api.put(`/media/${id}`, data),
    delete: (id) => api.delete(`/media/${id}`),
}

// Notifications API
export const notificationsAPI = {
    send: (data) => api.post("/notifications", data),
    sendByRole: (data) => api.post("/notifications/role", data),
    sendByGovernorate: (data) => api.post("/notifications/governorate", data),
}

// Timeline API
export const timelineAPI = {
    getAll: (params) => api.get("/timeline", { params }),
    getById: (id) => api.get(`/timeline/${id}`),
    create: (timelineData) => api.post("/timeline", timelineData),
    update: (id, timelineData) => api.put(`/timeline/${id}`, timelineData),
    delete: (id) => api.delete(`/timeline/${id}`),
}

// Hero Images API
export const heroImagesAPI = {
    getAll: () => api.get("/hero-images"), // returns { success, data: HeroImage[] }
    getAllAdmin: () => api.get("/hero-images/admin"),
}

export default api
