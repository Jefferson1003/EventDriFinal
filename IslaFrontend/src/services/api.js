import axios from 'axios';
import authService from './auth';

const API_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      timeout: 10000,
    });

    // Add request interceptor to include token
    this.api.interceptors.request.use(
      (config) => {
        const token = authService.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
          console.log('🔐 Token attached to request:', token.substring(0, 20) + '...');
        } else {
          console.warn('⚠️ No token found for request');
        }
        
        console.log(`🚀 ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
        return config;
      },
      (error) => {
        console.error('❌ Request error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor to handle errors
    this.api.interceptors.response.use(
      (response) => {
        console.log(`✅ ${response.config.method?.toUpperCase()} ${response.config.url} - Success`);
        return response;
      },
      (error) => {
        console.error(`❌ ${error.config?.method?.toUpperCase()} ${error.config?.url} - Error:`, {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message
        });
        
        if (error.response?.status === 401) {
          console.log('🛡️ Unauthorized - Token might be invalid or expired');
          // Try to refresh token or redirect to login
          if (window.location.pathname !== '/login') {
            console.log('Redirecting to login...');
            authService.logout();
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  async get(url, config = {}) {
    try {
      const response = await this.api.get(url, config);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async post(url, data = {}, config = {}) {
    try {
      const response = await this.api.post(url, data, config);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async put(url, data = {}, config = {}) {
    try {
      const response = await this.api.put(url, data, config);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  async delete(url, config = {}) {
    try {
      const response = await this.api.delete(url, config);
      return response;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  handleError(error) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || 'Network error or server unavailable'
    };
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;