import axiosInstance from './axiosInstance';

// Authentication
export const loginUser = (credentials) => {
  return axiosInstance.post('/auth/login', credentials);
};

export const registerUser = (userData) => {
  return axiosInstance.post('/auth/register', userData);
};

export const logoutUser = () => {
  return axiosInstance.post('/auth/logout');
};

// User management
export const getUserProfile = () => {
  return axiosInstance.get('/users/profile');
};

export const updateUserProfile = (profileData) => {
  return axiosInstance.put('/users/profile', profileData);
};

export const getAllUsers = (page = 1, limit = 10) => {
  return axiosInstance.get(`/users?page=${page}&limit=${limit}`);
};

// Doctor-specific
export const getDoctorProfile = () => {
  return axiosInstance.get('/doctors/profile');
};

export const updateDoctorProfile = (profileData) => {
  return axiosInstance.put('/doctors/profile', profileData);
};

export const updateDoctorAvailability = (availabilityData) => {
  return axiosInstance.put('/doctors/availability', availabilityData);
};

export const getAllDoctors = (page = 1, limit = 10) => {
  return axiosInstance.get(`/doctors?page=${page}&limit=${limit}`);
};

export const getDoctorById = (id) => {
  return axiosInstance.get(`/doctors/${id}`);
};

// Admin-specific
export const approveDoctorApplication = (doctorId, status) => {
  return axiosInstance.put(`/admin/doctors/${doctorId}/approve`, { status });
};

// Appointments
export const createAppointment = (appointmentData) => {
  return axiosInstance.post('/appointments', appointmentData);
};

export const getUserAppointments = () => {
  return axiosInstance.get('/appointments/user');
};

export const getDoctorAppointments = () => {
  return axiosInstance.get('/appointments/doctor');
};

export const updateAppointmentStatus = (appointmentId, status) => {
  return axiosInstance.put(`/appointments/${appointmentId}/status`, { status });
};

// Medical records
export const getUserDocuments = () => {
  return axiosInstance.get('/documents');
};

export const uploadDocument = (formData) => {
  return axiosInstance.post('/documents', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getDocumentById = (id) => {
  return axiosInstance.get(`/documents/${id}`);
};