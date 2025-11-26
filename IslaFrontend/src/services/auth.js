import axios from 'axios';

const API_URL = 'http://localhost:8000';

class AuthService {
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
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
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
          console.log('🛡️ Unauthorized - Logging out user');
          this.logout();
          
          // Redirect to login if we're not already there
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
        
        return Promise.reject(error);
      }
    );
  }

  async login(credentials) {
    try {
      console.log('🔐 Attempting login with:', { 
        email: credentials.email, 
        password: '***' // Don't log actual password
      });
      
      const response = await this.api.post('/auth/login', credentials);
      
      console.log('✅ Login successful:', response.data);
      
      // Extract token from response - handle different possible formats
      const token = response.data.tokens?.access_token || 
                   response.data.token || 
                   response.data.access_token ||
                   response.data.tokens?.token;
      
      if (!token) {
        console.warn('⚠️ No token found in login response:', response.data);
        throw new Error('No authentication token received');
      }
      
      // Store token and user data
      this.setToken(token);
      
      if (response.data.user) {
        this.setUser(response.data.user);
      }
      
      return {
        success: true,
        user: response.data.user,
        tokens: response.data.tokens,
        message: response.data.message
      };
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      
      // Extract meaningful error message
      const errorMessage = this.extractErrorMessage(error) || 
                          'Login failed. Please check your credentials and try again.';
      
      throw new Error(errorMessage);
    }
  }

  async register(userData) {
    try {
      console.log('📝 Attempting registration with:', {
        name: userData.name,
        email: userData.email,
        password: '***',
        password_confirmation: '***'
      });
      
      const response = await this.api.post('/auth/register', userData);
      
      console.log('✅ Registration successful:', response.data);
      
      // Extract token from response
      const token = response.data.tokens?.access_token || 
                   response.data.token || 
                   response.data.access_token ||
                   response.data.tokens?.token;
      
      if (token) {
        this.setToken(token);
      }
      
      if (response.data.user) {
        this.setUser(response.data.user);
      }
      
      return {
        success: true,
        user: response.data.user,
        tokens: response.data.tokens,
        message: response.data.message
      };
      
    } catch (error) {
      console.error('❌ Registration failed:', error);
      
      const errorMessage = this.extractErrorMessage(error) || 
                          'Registration failed. Please try again.';
      
      throw new Error(errorMessage);
    }
  }

  async logout() {
    try {
      console.log('👋 Logging out user');
      
      // Call logout endpoint if token exists
      const token = this.getToken();
      if (token) {
        await this.api.post('/auth/logout', {
          refresh_token: this.getRefreshToken() // if you have refresh token logic
        });
      }
    } catch (error) {
      console.warn('⚠️ Logout API call failed, but clearing local storage anyway:', error);
    } finally {
      // Always clear local storage
      this.clearAuthData();
      console.log('✅ User logged out and local storage cleared');
    }
  }

  async getProfile() {
    try {
      console.log('👤 Fetching user profile');
      const response = await this.api.get('/auth/profile');
      return response.data;
    } catch (error) {
      console.error('❌ Failed to fetch profile:', error);
      throw new Error(this.extractErrorMessage(error) || 'Failed to load user profile');
    }
  }

  async refreshToken() {
    try {
      console.log('🔄 Refreshing token');
      const refreshToken = this.getRefreshToken();
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await this.api.post('/auth/refresh', {
        refresh_token: refreshToken
      });
      
      const newToken = response.data.tokens?.access_token || 
                      response.data.token || 
                      response.data.access_token;
      
      if (newToken) {
        this.setToken(newToken);
        console.log('✅ Token refreshed successfully');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      this.clearAuthData();
      throw error;
    }
  }

  // Utility methods
 setToken(token) {
  localStorage.setItem('access_token', token); // Change from 'token' to 'access_token'
  console.log('💾 Token stored in localStorage');
}

  setUser(user) {
    localStorage.setItem('user', JSON.stringify(user));
    console.log('💾 User data stored in localStorage');
  }

 getToken() {
  return localStorage.getItem('access_token'); // Change from 'token' to 'access_token'
}

  getUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getRefreshToken() {
    // If you implement refresh token logic, store it separately
    return localStorage.getItem('refresh_token');
  }

  clearAuthData() {
  localStorage.removeItem('access_token'); // Change from 'token' to 'access_token'
  localStorage.removeItem('user');
  localStorage.removeItem('refresh_token');
  console.log('🧹 All auth data cleared from localStorage');
}

  isAuthenticated() {
    const token = this.getToken();
    if (!token) return false;

    // Optional: Check token expiration if you have JWT decoding
    try {
      // If you want to check JWT expiration, you can decode it here
      // const payload = JSON.parse(atob(token.split('.')[1]));
      // return payload.exp > Date.now() / 1000;
      return true;
    } catch (error) {
      console.warn('⚠️ Token validation error:', error);
      return false;
    }
  }

  extractErrorMessage(error) {
    if (!error.response) {
      return error.message || 'Network error. Please check your connection.';
    }

    const { data, status } = error.response;

    // Handle different error formats
    if (typeof data === 'string') {
      return data;
    }

    if (data?.error) {
      return data.error;
    }

    if (data?.message) {
      return data.message;
    }

    if (data?.errors) {
      const errors = data.errors;
      if (typeof errors === 'string') {
        return errors;
      }
      if (Array.isArray(errors)) {
        return errors[0];
      }
      if (typeof errors === 'object') {
        const firstError = Object.values(errors)[0];
        return Array.isArray(firstError) ? firstError[0] : firstError;
      }
    }

    // Default status-based messages
    switch (status) {
      case 400: return 'Bad request. Please check your input.';
      case 401: return 'Unauthorized. Please login again.';
      case 403: return 'Access forbidden.';
      case 404: return 'Endpoint not found.';
      case 422: return 'Validation failed. Please check your input.';
      case 429: return 'Too many requests. Please try again later.';
      case 500: return 'Server error. Please try again later.';
      case 502: return 'Bad gateway. Please try again later.';
      case 503: return 'Service unavailable. Please try again later.';
      default: return `Request failed with status ${status}`;
    }
  }

  // Optional: Method to check if user has specific role
  hasRole(role) {
    const user = this.getUser();
    return user?.role === role;
  }

  // Optional: Method to check if user is admin
 isAdmin() {
  const user = this.getUser();
  return user?.role?.toLowerCase() === 'admin';
}

isUser() {
  const user = this.getUser();
  const role = user?.role?.toLowerCase();
  return role === 'user' || !role; // Default to user if no role
}
getRedirectPath() {
  const user = this.getUser();
  if (!user) return '/login';
  
  const role = user.role?.toLowerCase();
  return role === 'admin' ? '/admin/dashboard' : '/user/account';
}
}

// Create and export singleton instance
const authService = new AuthService();
export default authService;