import React, { createContext, useContext, useReducer, useEffect } from "react"
import { usersAPI } from "../api"

// Initial state
const initialState = {
    user: null,
    token: localStorage.getItem("token"),
    isAuthenticated: false,
    isLoading: true,
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
            localStorage.setItem("token", action.payload.token)
            localStorage.setItem("user", JSON.stringify(action.payload.user))
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
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                user: null,
                token: null,
                error: action.payload,
            }

        case AuthActionTypes.LOGOUT:
            localStorage.removeItem("token")
            localStorage.removeItem("user")
            return {
                ...state,
                isAuthenticated: false,
                isLoading: false,
                user: null,
                token: null,
                error: null,
            }

        case AuthActionTypes.UPDATE_USER:
            localStorage.setItem("user", JSON.stringify(action.payload))
            return {
                ...state,
                user: action.payload,
            }

        case AuthActionTypes.CLEAR_ERROR:
            return {
                ...state,
                error: null,
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
            const token = localStorage.getItem("token")
            const savedUser = localStorage.getItem("user")

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
