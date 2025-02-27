import { jwtDecode } from 'jwt-decode';

export const getUserFromToken = () => {
  if (typeof window === 'undefined') {
    return null;
  }

  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    const decoded = jwtDecode(token);
    if (!decoded || Date.now() >= decoded.exp * 1000) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      return null;
    }
    return decoded;
  } catch (error) {
    console.error('Error decoding token:', error);
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    return null;
  }
};

export const isAuthenticated = () => {
  return getUserFromToken() !== null;
};

export const hasRole = (requiredRole) => {
  const user = getUserFromToken();
  if (!user) return false;
  return user.role === requiredRole;
};

export const isAdmin = () => hasRole('admin');
export const isDoctor = () => hasRole('doctor');
export const isPatient = () => hasRole('patient');

export const saveUserSession = (token, refreshToken) => {
  localStorage.setItem('token', token);
  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken);
  }
};

export const clearUserSession = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('refreshToken');
};