'use client';

import React, { createContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getUserFromToken, saveUserSession, clearUserSession, isAuthenticated } from '../lib/auth';
import { loginUser, registerUser, logoutUser } from '../lib/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    const fetchUser = () => {
      const userData = getUserFromToken();
      setUser(userData);
      setLoading(false);
    };

    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await loginUser({ email, password });
      const { token, refreshToken, user: userData } = response.data;
      
      saveUserSession(token, refreshToken);
      setUser(userData);
      
      // Redirect based on role
      if (userData.role === 'admin') {
        router.push('/dashboard');
      } else if (userData.role === 'doctor') {
        router.push('/dashboard');
      } else {
        router.push('/dashboard');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to login. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await registerUser(userData);
      const { token, refreshToken, user: newUser } = response.data;
      
      if (token) {
        // Auto login after registration
        saveUserSession(token, refreshToken);
        setUser(newUser);
        router.push('/dashboard');
      } else {
        // Registration successful but requires verification
        router.push('/auth/login?registered=true');
      }
      
      return { success: true };
    } catch (error) {
      console.error('Registration error:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Failed to register. Please try again.'
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (isAuthenticated()) {
        await logoutUser();
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearUserSession();
      setUser(null);
      router.push('/auth/login');
    }
  };

  const refreshUserData = () => {
    const userData = getUserFromToken();
    setUser(userData);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      logout, 
      register, 
      isAuthenticated: () => isAuthenticated(),
      refreshUserData
    }}>
      {children}
    </AuthContext.Provider>
  );
};