import React, { createContext, useContext, useReducer, useEffect } from "react"
import { usersAPI } from "../api"

// SSR-safe localStorage wrapper
const safeLocalStorage = {
    getItem: (key) => (typeof window !== "undefined" ? localStorage.getItem(key) : null),
    setItem: (key, value) => typeof window !== "undefined" && localStorage.setItem(key, value),
    removeItem: (key) => typeof window !== "undefined" && localStorage.removeItem(key),
}

// Initial state
const initialState = {
    user: null,
    token: safeLocalStorage.getItem("token"),
    isAuthenticated: false,
    isLoading: typeof window === "undefined" ? false : true, // No loading on server
    isInitialized: typeof window === "undefined" ? true : false, // Already initialized on server
    error: null,
}

// Action types
const AuthActionTypes = {
    LOGIN_START: "LOGIN_START",
    LOGIN_SUCCESS: "LOGIN_SUCCESS",
    LOGIN_FAILURE: "LOGIN_FAILURE",
    LOGOUT: "LOGOUT",
    LOAD_USER_START: "LOAD_USER_START",
    LOAD_USER_SUCCESS: "LOAD_USER_SUCCESS",
    LOAD_USER_FAILURE: "LOAD_USER_FAILURE",
    CLEAR_ERROR: "CLEAR_ERROR",
    UPDATE_USER: "UPDATE_USER",
    SET_INITIALIZED: "SET_INITIALIZED",
}

// Reducer
const authReducer = (state, action) => {
    switch (action.type) {
        case AuthActionTypes.LOGIN_START:
        case AuthActionTypes.LOAD_USER_START:
            return {
                ...state,
                isLoading: true,
                error: null,
            }

        case AuthActionTypes.LOGIN_SUCCESS:
            safeLocalStorage.setItem("token", action.payload.token)
            safeLocalStorage.setItem("user", JSON.stringify(action.payload.user))
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload.user,
                token: action.payload.token,
                error: null,
            }

        case AuthActionTypes.LOAD_USER_SUCCESS:
            return {
                ...state,
                isAuthenticated: true,
                isLoading: false,
                user: action.payload,
                error: null,
            }

        case AuthActionTypes.LOGIN_FAILURE:
        case AuthActionTypes.LOAD_USER_FAILURE:
            safeLocalStorage.removeItem("token")
            safeLocalStorage.removeItem("user")
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                user: null,
                token: null,
                error: action.payload,
            }

        case AuthActionTypes.LOGOUT:
            safeLocalStorage.removeItem("token")
            safeLocalStorage.removeItem("user")
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                user: null,
                token: null,
                error: null,
            }

        case AuthActionTypes.UPDATE_USER:
            safeLocalStorage.setItem("user", JSON.stringify(action.payload))
            return {
                ...state,
                user: action.payload,
            }

        case AuthActionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null,
            }

        case AuthActionTypes.SET_INITIALIZED:
            return {
                ...state,
                isInitialized: true,
                isLoading: false,
            }

        default:
            return state
    }
}

// Create context
const AuthContext = createContext()

// Auth Provider component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState)

    // Load user on app start
    useEffect(() => {
        const loadUser = async () => {
            const token = safeLocalStorage.getItem("token")
            const savedUser = safeLocalStorage.getItem("user")

            if (token && savedUser) {
                try {
                    dispatch({ type: AuthActionTypes.LOAD_USER_START })
                    const response = await usersAPI.getMe()
                    dispatch({ type: AuthActionTypes.LOAD_USER_SUCCESS, payload: response.data })
                } catch (error) {
                    dispatch({ type: AuthActionTypes.LOAD_USER_FAILURE, payload: error.error })
                }
            } else {
                dispatch({ type: AuthActionTypes.LOAD_USER_FAILURE, payload: null })
            }

            // Mark initialization as complete
            dispatch({ type: AuthActionTypes.SET_INITIALIZED })
        }

        loadUser()
    }, [])

    // Login action
    const login = async (credentials) => {
        try {
            dispatch({ type: AuthActionTypes.LOGIN_START })
            const { authAPI } = await import("../api")
            const response = await authAPI.login(credentials)
            dispatch({ type: AuthActionTypes.LOGIN_SUCCESS, payload: response.data })
            return response
        } catch (error) {
            dispatch({ type: AuthActionTypes.LOGIN_FAILURE, payload: error.error })
            throw error
        }
    }

    // Register action
    const register = async (userData) => {
        try {
            dispatch({ type: AuthActionTypes.LOGIN_START })
            const { authAPI } = await import("../api")
            const response = await authAPI.register(userData)
            dispatch({ type: AuthActionTypes.LOGIN_SUCCESS, payload: response.data })
            return response
        } catch (error) {
            dispatch({ type: AuthActionTypes.LOGIN_FAILURE, payload: error.error })
            throw error
        }
    }

    // Logout action
    const logout = () => {
        dispatch({ type: AuthActionTypes.LOGOUT })
    }

    // Update user action
    const updateUser = (userData) => {
        dispatch({ type: AuthActionTypes.UPDATE_USER, payload: userData })
    }

    // Clear error action
    const clearError = () => {
        dispatch({ type: AuthActionTypes.CLEAR_ERROR })
    }

    const value = {
        ...state,
        login,
        register,
        logout,
        updateUser,
        clearError,
    }

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Custom hook to use auth context
export const useAuth = () => {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}
