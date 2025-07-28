import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  errors: [],
};

// Action types
const ErrorActionTypes = {
  ADD_ERROR: 'ADD_ERROR',
  REMOVE_ERROR: 'REMOVE_ERROR',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
};

// Reducer
const errorReducer = (state, action) => {
  switch (action.type) {
    case ErrorActionTypes.ADD_ERROR:
      const error = {
        id: Date.now() + Math.random(),
        message: action.payload.message,
        type: action.payload.type || 'error',
        timestamp: new Date(),
      };
      return {
        ...state,
        errors: [...state.errors, error],
      };

    case ErrorActionTypes.REMOVE_ERROR:
      return {
        ...state,
        errors: state.errors.filter(error => error.id !== action.payload),
      };

    case ErrorActionTypes.CLEAR_ERRORS:
      return {
        ...state,
        errors: [],
      };

    default:
      return state;
  }
};

// Create context
const ErrorContext = createContext();

// Error Provider component
export const ErrorProvider = ({ children }) => {
  const [state, dispatch] = useReducer(errorReducer, initialState);

  // Add error action
  const addError = (message, type = 'error') => {
    dispatch({
      type: ErrorActionTypes.ADD_ERROR,
      payload: { message, type },
    });

    // Auto remove error after 5 seconds
    setTimeout(() => {
      dispatch({
        type: ErrorActionTypes.REMOVE_ERROR,
        payload: state.errors[state.errors.length - 1]?.id,
      });
    }, 5000);
  };

  // Remove error action
  const removeError = (id) => {
    dispatch({
      type: ErrorActionTypes.REMOVE_ERROR,
      payload: id,
    });
  };

  // Clear all errors action
  const clearErrors = () => {
    dispatch({ type: ErrorActionTypes.CLEAR_ERRORS });
  };

  const value = {
    ...state,
    addError,
    removeError,
    clearErrors,
  };

  return <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>;
};

// Custom hook to use error context
export const useError = () => {
  const context = useContext(ErrorContext);
  if (!context) {
    throw new Error('useError must be used within an ErrorProvider');
  }
  return context;
};