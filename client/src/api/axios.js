import axios from 'axios';

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://mscaterers-server.onrender.com/api/v1',
  withCredentials: true
});

// Add request interceptor to inject token
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle 401s
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If we get a 401 on an admin route, clear the admin session
      const isAdminPath = window.location.pathname.includes('/admin');
      const isLoginPage = window.location.pathname.includes('/login');
      
      if (isAdminPath && !isLoginPage) {
        localStorage.removeItem('adminUser');
        localStorage.removeItem('adminToken');
        // Redirect to the appropriate login page
        if (window.location.pathname.startsWith('/mscaterers/admin')) {
          window.location.href = '/mscaterers/admin/login';
        } else {
          window.location.href = '/admin/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
