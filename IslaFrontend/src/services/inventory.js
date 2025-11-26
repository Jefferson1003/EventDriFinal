import api from './api';

export const inventoryService = {
    // Get all products with filters
    async getInventory(params = {}) {
        try {
            const response = await api.get('/api/admin/inventory', { params });
            return response.data;
        } catch (error) {
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
                } else if (key !== 'image') {
                    formData.append(key, productData[key]);
                }
            });
            
            // Append image if exists and is a File object
            if (productData.image && productData.image instanceof File) {
                formData.append('image', productData.image);
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
                } else if (key !== 'image') {
                    formData.append(key, productData[key]);
                }
            });
            
            // Append image if exists and is a new file
            if (productData.image && productData.image instanceof File) {
                formData.append('image', productData.image);
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
            message: 'Network error or server unavailable'
        };
    }
};