import React, { createContext, useContext, useReducer, useEffect } from 'react';

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
  error: null
};

const authReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false };
    
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
        error: null
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null
      };
    
    case 'CLEAR_ERROR':
      return { ...state, error: null };
    
    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    // Check for existing session on app load
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('currentUser');
        const sessionExpiry = localStorage.getItem('sessionExpiry');
        
        if (storedUser && sessionExpiry) {
          const now = new Date().getTime();
          const expiry = parseInt(sessionExpiry);
          
          if (now < expiry) {
            // Session is still valid
            dispatch({ 
              type: 'LOGIN_SUCCESS', 
              payload: JSON.parse(storedUser) 
            });
          } else {
            // Session expired
            localStorage.removeItem('currentUser');
            localStorage.removeItem('sessionExpiry');
            dispatch({ type: 'SET_LOADING', payload: false });
          }
        } else {
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  const register = async (userData) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Check if user already exists
      const userExists = existingUsers.find(user => user.email === userData.email);
      if (userExists) {
        throw new Error('Un usuario con este correo electrónico ya existe');
      }
      
      // Create new user
      const newUser = {
        id: Date.now().toString(),
        name: userData.name,
        email: userData.email,
        password: userData.password, // In a real app, this would be hashed
        createdAt: new Date().toISOString(),
        profile: {
          institution: userData.institution || '',
          degree: userData.degree || '',
          field: userData.field || ''
        }
      };
      
      // Save user
      existingUsers.push(newUser);
      localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
      
      // Create session
      const userSession = {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        profile: newUser.profile
      };
      
      const sessionExpiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      localStorage.setItem('sessionExpiry', sessionExpiry.toString());
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: userSession });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const login = async (email, password) => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Get existing users
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      
      // Find user
      const user = existingUsers.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Credenciales inválidas');
      }
      
      // Create session
      const userSession = {
        id: user.id,
        name: user.name,
        email: user.email,
        profile: user.profile
      };
      
      const sessionExpiry = new Date().getTime() + (24 * 60 * 60 * 1000); // 24 hours
      localStorage.setItem('currentUser', JSON.stringify(userSession));
      localStorage.setItem('sessionExpiry', sessionExpiry.toString());
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: userSession });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: error.message });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('sessionExpiry');
    dispatch({ type: 'LOGOUT' });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const updateProfile = (profileData) => {
    try {
      const updatedUser = { ...state.user, profile: { ...state.user.profile, ...profileData } };
      
      // Update in localStorage
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update registered users
      const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
      const updatedUsers = existingUsers.map(user => 
        user.id === state.user.id 
          ? { ...user, profile: { ...user.profile, ...profileData } }
          : user
      );
      localStorage.setItem('registeredUsers', JSON.stringify(updatedUsers));
      
      dispatch({ type: 'LOGIN_SUCCESS', payload: updatedUser });
    } catch (error) {
      dispatch({ type: 'SET_ERROR', payload: 'Error al actualizar el perfil' });
    }
  };

  const value = {
    ...state,
    register,
    login,
    logout,
    clearError,
    updateProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};