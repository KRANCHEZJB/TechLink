import axios from 'axios'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  
  register: (userData: any) =>
    api.post('/auth/register', userData),
  
  getProfile: () =>
    api.get('/auth/profile'),
}

// Events API
export const eventsAPI = {
  getAll: () => api.get('/events'),
  getUpcoming: () => api.get('/events/upcoming'),
  getById: (id: string) => api.get(`/events/${id}`),
  getByOrganization: (orgId: string) => api.get(`/events/organization/${orgId}`),
  create: (eventData: any) => api.post('/events', eventData),
  update: (id: string, eventData: any) => api.patch(`/events/${id}`, eventData),
  delete: (id: string) => api.delete(`/events/${id}`),
}

// Organizations API
export const organizationsAPI = {
  getAll: () => api.get('/organizations'),
  getById: (id: string) => api.get(`/organizations/${id}`),
  create: (orgData: any) => api.post('/organizations', orgData),
  update: (id: string, orgData: any) => api.patch(`/organizations/${id}`, orgData),
  verify: (id: string) => api.put(`/organizations/${id}/verify`),
}

// Registrations API
export const registrationsAPI = {
  getAll: () => api.get('/registrations'),
  getById: (id: string) => api.get(`/registrations/${id}`),
  getByUser: (userId: string) => api.get(`/registrations/user/${userId}`),
  getByEvent: (eventId: string) => api.get(`/registrations/event/${eventId}`),
  create: (registrationData: any) => api.post('/registrations', registrationData),
  updateStatus: (id: string, status: string) => api.put(`/registrations/${id}/status/${status}`),
  delete: (id: string) => api.delete(`/registrations/${id}`),
}

// Users API
export const usersAPI = {
  getAll: () => api.get('/users'),
  getById: (id: string) => api.get(`/users/${id}`),
  update: (id: string, userData: any) => api.patch(`/users/${id}`, userData),
  delete: (id: string) => api.delete(`/users/${id}`),
}

export default api
