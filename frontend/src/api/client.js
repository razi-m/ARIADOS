import axios from 'axios'

// In production VITE_API_URL is set to the deployed backend URL.
// Locally it's undefined, so we fall back to '/api' which Vite proxies to localhost:8000.
const baseURL = import.meta.env.VITE_API_URL
  ? `${import.meta.env.VITE_API_URL}/api`
  : '/api'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

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

export default api

export const authAPI = {
  login: (credentials) => api.post('/login', credentials)
}

export const inspectionsAPI = {
  getAll: () => api.get('/inspections'),
  getById: (id) => api.get(`/inspections/${id}`),
  create: (data) => api.post('/inspections', data),
  uploadVideo: (id, file) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post(`/inspections/${id}/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
  },
  analyze: (id) => api.post(`/inspections/${id}/analyze`),
  approve: (id) => api.post(`/inspections/${id}/approve`)
}

export const reportsAPI = {
  download: (inspectionId) => {
    return api.get(`/reports/${inspectionId}/download`, {
      responseType: 'blob'
    })
  }
}