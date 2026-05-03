// Authentication utility functions

export function getToken() {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
}

export function setToken(token) {
    if (typeof window === "undefined") return
    localStorage.setItem("token", token)
}

export function removeToken() {
    if (typeof window === "undefined") return
    localStorage.removeItem("token")
}

export function isAuthenticated() {
    return !!getToken()
}

// Migrate additional auth logic from: src/context/AuthContext.jsx
