// services/inventory.js
import api from './api';
import authService from './auth';

export const inventoryService = {
  // Get all products with filters
  async getInventory(params = {}) {
    try {
      console.log('📦 Fetching inventory with params:', params);
      const response = await api.get('/api/admin/inventory', { params });
      console.log('📦 Inventory API Response:', response.data);
      
      if (response.data && response.data.success !== undefined) {
        return response.data;
      } else {
        return {
          success: true,
          data: response.data,
          stats: {}
        };
      }
    } catch (error) {
      console.error('❌ Inventory API Error:', error.response?.data || error.message);
      throw this.handleError(error);
    }
  },

  // Get product by ID
  async getProduct(id) {
    try {
      const response = await api.get(`/api/admin/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },
  // Create product
   async createProduct(productData) {
    try {
      const formData = new FormData();
      
      // Append basic fields
      Object.keys(productData).forEach(key => {
        if (key === 'sizes' || key === 'addons') {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key !== 'image' && key !== 'imageFile') {
          formData.append(key, productData[key]);
        }
      });
      
      // Append image if exists and is a File object
      if (productData.imageFile && productData.imageFile instanceof File) {
        formData.append('image', productData.imageFile);
      }
      
      const response = await api.post('/api/admin/inventory', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Update product
  async updateProduct(id, productData) {
    try {
      const formData = new FormData();
      
      // Append basic fields
      Object.keys(productData).forEach(key => {
        if (key === 'sizes' || key === 'addons') {
          formData.append(key, JSON.stringify(productData[key]));
        } else if (key !== 'image' && key !== 'imageFile') {
          formData.append(key, productData[key]);
        }
      });
      
      // Append image if exists and is a new file
      if (productData.imageFile && productData.imageFile instanceof File) {
        formData.append('image', productData.imageFile);
      }
      
      const response = await api.put(`/api/admin/inventory/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Delete product
   async deleteProduct(id) {
    try {
      const response = await api.delete(`/api/admin/inventory/${id}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },


  // Toggle product status
   async toggleProductStatus(id) {
    try {
      const response = await api.post(`/api/admin/inventory/${id}/toggle-status`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },
  // Export to CSV
  async exportCSV() {
    try {
      const response = await api.get('/api/admin/inventory/export/csv');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },

  // Get categories
  async getCategories() {
    try {
      const response = await api.get('/api/admin/categories');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  },
  // Error handler
 handleError(error) {
    if (error.response?.data) {
      return error.response.data;
    }
    return {
      success: false,
      message: error.message || 'Network error or server unavailable'
    };
  }
};