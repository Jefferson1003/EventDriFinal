<template>
  <div class="admin-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- Admin Navbar -->
    <nav class="admin-navbar" :class="{ 'dark-mode': isDarkMode }">
      <div class="admin-nav-container">
        <!-- Left side - Logo and Title -->
        <div class="admin-nav-left">
          <router-link to="/admin" class="admin-logo-link">
            <img src="/images/logo.png" alt="ISLA CAFE" class="admin-logo" @error="handleImageError">
            <span class="admin-brand-name">ISLA CAFE ADMIN</span>
          </router-link>
        </div>

        <!-- Right side - Admin navigation items -->
        <div class="admin-nav-right">
          <!-- Notification -->
          <div class="admin-nav-item admin-dropdown">
            <span class="admin-nav-link" @click="toggleNotifications">
              <i class="fas fa-bell"></i>
              <span class="admin-badge" v-if="notificationCount > 0">{{ notificationCount }}</span>
            </span>
            <div v-if="showNotifications" class="admin-dropdown-content admin-notifications-dropdown" @click.stop>
              <div class="admin-dropdown-header">
                <h3>Notifications</h3>
              </div>
              <div class="admin-notifications-list">
                <div v-if="notifications.length === 0" class="admin-empty-notifications">
                  <i class="fas fa-bell-slash"></i>
                  <p>No new notifications</p>
                </div>
                <div v-else>
                  <div v-for="notification in notifications" :key="notification.id" class="admin-notification-item">
                    <div class="admin-notification-icon">
                      <i :class="notification.icon"></i>
                    </div>
                    <div class="admin-notification-details">
                      <h4>{{ notification.title }}</h4>
                      <p>{{ notification.message }}</p>
                      <span class="admin-notification-time">{{ notification.time }}</span>
                    </div>
                    <button class="admin-notification-dismiss" @click="dismissNotification(notification)">
                      <i class="fas fa-times"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Dark/Light Mode Toggle -->
          <div class="admin-nav-item admin-toggle-item" @click="toggleDarkMode">
            <span class="admin-nav-link admin-toggle-link">
              <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
            </span>
          </div>

          <!-- Admin Account -->
          <div class="admin-nav-item admin-dropdown">
            <div class="admin-user-account" @click="toggleUserMenu">
              <img :src="admin.avatar" alt="Admin" class="admin-user-avatar" @error="handleAvatarError">
              <span class="admin-user-name">{{ admin.name || 'Admin' }}</span>
            </div>
            <div v-if="showUserMenu" class="admin-dropdown-content admin-user-dropdown" @click.stop>
              <div class="admin-user-info">
                <img :src="admin.avatar" alt="Admin" class="admin-user-avatar-large" @error="handleAvatarError">
                <div class="admin-user-details">
                  <h4>{{ admin.name || 'Admin' }}</h4>
                  <p>{{ admin.email || 'admin@islacafe.com' }}</p>
                </div>
              </div>
              <div class="admin-dropdown-divider"></div>
              <router-link to="/admin/account" class="admin-dropdown-item" @click="closeUserMenu">
                <i class="fas fa-user-cog"></i> Admin Profile
              </router-link>
              <button @click="handleLogout" class="admin-dropdown-item admin-logout-btn">
                <i class="fas fa-sign-out-alt"></i> Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- Admin Sidebar and Main Content -->
    <div class="admin-main">
      <!-- Sidebar -->
      <aside class="admin-sidebar" :class="{ 'dark-mode': isDarkMode }">
        <div class="admin-sidebar-menu">
          <router-link 
            to="/dashboard" 
            class="admin-sidebar-item" 
            active-class="admin-active-sidebar-item"
          >
            <i class="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </router-link>
          
          <router-link 
            to="/ordersmanagement" 
            class="admin-sidebar-item" 
            active-class="admin-active-sidebar-item"
          >
            <i class="fas fa-shopping-cart"></i>
            <span>Orders</span>
          </router-link>
          
          <router-link 
            to="/inventory" 
            class="admin-sidebar-item" 
            active-class="admin-active-sidebar-item"
          >
            <i class="fas fa-boxes"></i>
            <span>Inventory</span>
          </router-link>
          
          <router-link 
            to="/transactions" 
            class="admin-sidebar-item" 
            active-class="admin-active-sidebar-item"
          >
            <i class="fas fa-exchange-alt"></i>
            <span>Transactions</span>
          </router-link>
          
          <router-link 
            to="/usermanagement" 
            class="admin-sidebar-item" 
            active-class="admin-active-sidebar-item"
          >
            <i class="fas fa-users"></i>
            <span>Users</span>
          </router-link>

          <router-link 
            to="/adminaccount" 
            class="admin-sidebar-item" 
            active-class="admin-active-sidebar-item"
          >
            <i class="fas fa-user-cog"></i>
            <span>Account</span>
          </router-link>
          
          <!-- Logout Button at Bottom -->
          <div class="sidebar-logout-section">
            <button @click="handleLogout" class="sidebar-logout-btn">
              <i class="fas fa-sign-out-alt"></i>
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      <!-- Main Content Area -->
      <main class="admin-content">
        <!-- Inventory Content -->
        <div class="admin-inventory">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Loading inventory...</p>
          </div>

          <!-- Page Header -->
          <div class="inventory-header" v-if="!loading">
            <h1 class="page-title">Inventory Management</h1>
            <p class="page-subtitle">Manage product stock, categories, and pricing</p>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
              <button class="action-btn primary" @click="showAddProductModal = true">
                <i class="fas fa-plus"></i> Add New Product
              </button>
              <button class="action-btn secondary" @click="exportInventory">
                <i class="fas fa-download"></i> Export CSV
              </button>
              <button class="action-btn secondary" @click="toggleLowStockFilter">
                <i class="fas fa-exclamation-triangle"></i> 
                {{ showLowStock ? 'Show All' : 'Low Stock Alert' }}
              </button>
            </div>
          </div>

          <!-- Inventory Stats -->
          <div class="inventory-stats" v-if="!loading">
            <div class="stat-card">
              <div class="stat-icon total">
                <i class="fas fa-boxes"></i>
              </div>
              <div class="stat-info">
                <h3>{{ totalProducts }}</h3>
                <p>Total Products</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon in-stock">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-info">
                <h3>{{ inStockProducts }}</h3>
                <p>In Stock</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon low-stock">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <div class="stat-info">
                <h3>{{ lowStockProducts }}</h3>
                <p>Low Stock</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon out-of-stock">
                <i class="fas fa-times-circle"></i>
              </div>
              <div class="stat-info">
                <h3>{{ outOfStockProducts }}</h3>
                <p>Out of Stock</p>
              </div>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="inventory-controls" v-if="!loading">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search products..." 
                v-model="searchQuery"
                @input="handleSearch"
              >
            </div>
            
            <div class="filter-controls">
              <select v-model="selectedCategory" @change="filterProducts" class="category-filter">
                <option value="all">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              
              <select v-model="stockFilter" @change="filterProducts" class="stock-filter">
                <option value="all">All Stock Status</option>
                <option value="in-stock">In Stock</option>
                <option value="low-stock">Low Stock</option>
                <option value="out-of-stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <!-- Inventory Table -->
          <div class="inventory-table-container" v-if="!loading">
            <table class="inventory-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in filteredProducts" :key="product.id" :class="getStockStatusClass(product)">
                  <td class="product-cell">
                    <div class="product-info">
                      <img 
                        :src="getProductImage(product.image)" 
                        :alt="product.name" 
                        class="product-thumb" 
                        @error="handleProductImageError"
                      >
                      <div class="product-details">
                        <h4>{{ product.name }}</h4>
                        <p class="product-description">{{ product.description }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="category-cell">
                    <span class="category-tag">{{ getCategoryName(product.category_id) }}</span>
                  </td>
                  <td class="price-cell">
                    <div class="price-info">
                      <span class="current-price">₱{{ product.price }}</span>
                      <span v-if="product.original_price" class="original-price">
                        ₱{{ product.original_price }}
                      </span>
                    </div>
                  </td>
                  <td class="stock-cell">
                    <div class="stock-info">
                      <span class="stock-quantity">{{ product.stock }}</span>
                      <div class="stock-warning" v-if="product.stock <= 5 && product.stock > 0 && product.in_stock">
                        Low stock!
                      </div>
                    </div>
                  </td>
                  <td class="status-cell">
                    <span class="status-badge" :class="getStockStatus(product)">
                      {{ getStockStatusText(product) }}
                    </span>
                  </td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button class="btn-icon edit" @click="editProduct(product)" title="Edit">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button class="btn-icon delete" @click="confirmDelete(product)" title="Delete">
                        <i class="fas fa-trash"></i>
                      </button>
                      <button 
                        class="btn-icon toggle" 
                        @click="toggleProductStatus(product)"
                        :title="product.in_stock ? 'Disable' : 'Enable'"
                      >
                        <i :class="product.in_stock ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="filteredProducts.length === 0 && !loading" class="empty-state">
              <i class="fas fa-box-open"></i>
              <h3>No products found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button @click="clearFilters" class="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          </div>

          <!-- Add/Edit Product Modal -->
          <div v-if="showAddProductModal || showEditProductModal" class="modal-overlay" @click="closeModal">
            <div class="modal product-modal" @click.stop>
              <div class="modal-header">
                <h3>{{ showEditProductModal ? 'Edit Product' : 'Add New Product' }}</h3>
                <button class="close-btn" @click="closeModal">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <div class="modal-body">
                <form @submit.prevent="saveProduct" class="product-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label>Product Name *</label>
                      <input 
                        type="text" 
                        v-model="currentProduct.name" 
                        required 
                        placeholder="Enter product name"
                      >
                    </div>
                    
                    <div class="form-group">
                      <label>Category *</label>
                      <select v-model="currentProduct.category_id" required>
                        <option value="">Select Category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">
                          {{ category.name }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Description</label>
                    <textarea 
                      v-model="currentProduct.description" 
                      placeholder="Enter product description"
                      rows="3"
                    ></textarea>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Price (₱) *</label>
                      <input 
                        type="number" 
                        v-model.number="currentProduct.price" 
                        required 
                        min="0" 
                        step="0.01"
                        placeholder="0.00"
                      >
                    </div>
                    
                    <div class="form-group">
                      <label>Original Price (₱)</label>
                      <input 
                        type="number" 
                        v-model.number="currentProduct.original_price" 
                        min="0" 
                        step="0.01"
                        placeholder="0.00"
                      >
                    </div>
                    
                    <div class="form-group">
                      <label>Stock Quantity *</label>
                      <input 
                        type="number" 
                        v-model.number="currentProduct.stock" 
                        required 
                        min="0"
                        placeholder="0"
                      >
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Calories</label>
                      <input 
                        type="number" 
                        v-model.number="currentProduct.calories" 
                        min="0"
                        placeholder="0"
                      >
                    </div>
                    
                    <div class="form-group">
                      <label>Product Image</label>
                      <div class="image-upload-section">
                        <input 
                          type="file" 
                          ref="imageInput"
                          @change="handleImageUpload"
                          accept="image/*"
                          class="image-file-input"
                        >
                        <button 
                          type="button" 
                          class="upload-image-btn"
                          @click="triggerImageUpload"
                        >
                          <i class="fas fa-upload"></i> Choose Image
                        </button>
                        <div v-if="currentProduct.image || currentProduct.imageFile" class="image-preview">
                          <img 
                            :src="currentProduct.imageFile ? URL.createObjectURL(currentProduct.imageFile) : getProductImage(currentProduct.image)" 
                            alt="Product preview" 
                            class="preview-image"
                          >
                          <button type="button" class="remove-image-btn" @click="removeImage">
                            <i class="fas fa-times"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="currentProduct.in_stock"> 
                      Product is available for sale
                    </label>
                  </div>

                  <div class="form-group">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="currentProduct.is_new"> 
                      Mark as New Product
                    </label>
                  </div>

                  <div class="form-group">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="currentProduct.is_bestseller"> 
                      Mark as Bestseller
                    </label>
                  </div>

                  <!-- Customization Options -->
                  <div class="form-group" v-if="showCustomizationOptions">
                    <label class="checkbox-label">
                      <input type="checkbox" v-model="currentProduct.customizable"> 
                      Enable Customization Options
                    </label>
                  </div>

                  <div v-if="currentProduct.customizable" class="customization-section">
                    <h4>Customization Options</h4>
                    
                    <div class="size-options">
                      <h5>Sizes</h5>
                      <div v-for="(size, index) in currentProduct.sizes" :key="index" class="size-option-row">
                        <input 
                          type="text" 
                          v-model="size.name" 
                          placeholder="Size name"
                          class="size-name"
                          required
                        >
                        <input 
                          type="number" 
                          v-model.number="size.price" 
                          placeholder="Price"
                          min="0"
                          step="0.01"
                          class="size-price"
                          required
                        >
                        <button 
                          type="button" 
                          @click="removeSize(index)" 
                          class="remove-size-btn"
                          v-if="currentProduct.sizes.length > 1"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      <button type="button" @click="addSize" class="add-option-btn">
                        <i class="fas fa-plus"></i> Add Size
                      </button>
                    </div>

                    <div class="addon-options">
                      <h5>Add-ons</h5>
                      <div v-for="(addon, index) in currentProduct.addons" :key="index" class="addon-option-row">
                        <input 
                          type="text" 
                          v-model="addon.name" 
                          placeholder="Add-on name"
                          class="addon-name"
                          required
                        >
                        <input 
                          type="number" 
                          v-model.number="addon.price" 
                          placeholder="Price"
                          min="0"
                          step="0.01"
                          class="addon-price"
                          required
                        >
                        <button 
                          type="button" 
                          @click="removeAddon(index)" 
                          class="remove-addon-btn"
                        >
                          <i class="fas fa-times"></i>
                        </button>
                      </div>
                      <button type="button" @click="addAddon" class="add-option-btn">
                        <i class="fas fa-plus"></i> Add Add-on
                      </button>
                    </div>
                  </div>

                  <div class="form-actions">
                    <button type="button" @click="closeModal" class="btn secondary" :disabled="saving">
                      Cancel
                    </button>
                    <button type="submit" class="btn primary" :disabled="saving">
                      <span v-if="saving">Saving...</span>
                      <span v-else>{{ showEditProductModal ? 'Update Product' : 'Add Product' }}</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Delete Confirmation Modal -->
          <div v-if="showDeleteModal" class="modal-overlay" @click="closeModal">
            <div class="modal delete-modal" @click.stop>
              <div class="modal-header">
                <h3>Confirm Delete</h3>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to delete "{{ productToDelete?.name }}"? This action cannot be undone.</p>
                <div class="modal-actions">
                  <button @click="closeModal" class="btn secondary" :disabled="deleting">Cancel</button>
                  <button @click="deleteProduct" class="btn danger" :disabled="deleting">
                    <span v-if="deleting">Deleting...</span>
                    <span v-else>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
// Direct API calls without external service
const API_BASE_URL = 'http://localhost:8000'; // Adjust to your LavaLust backend URL

// Simple API service directly in the component
const inventoryService = {
    async apiCall(url, options = {}) {
        const token = localStorage.getItem('islaAccessToken');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }

        try {
            const response = await fetch(`${API_BASE_URL}${url}`, {
                headers,
                ...options,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API call failed:', error);
            throw error;
        }
    },

    // Get all products with filters
    async getInventory(params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `/api/admin/inventory${queryString ? `?${queryString}` : ''}`;
            return await this.apiCall(url);
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // Get product by ID
    async getProduct(id) {
        try {
            return await this.apiCall(`/api/admin/inventory/${id}`);
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // Create product
    async createProduct(productData) {
        try {
            // For FormData, we need to handle differently
            const token = localStorage.getItem('islaAccessToken');
            const formData = new FormData();
            
            // Append all fields to FormData
            Object.keys(productData).forEach(key => {
                if (key === 'sizes' || key === 'addons') {
                    formData.append(key, JSON.stringify(productData[key]));
                } else if (key !== 'imageFile') {
                    formData.append(key, productData[key]);
                }
            });
            
            // Append image file if exists
            if (productData.imageFile) {
                formData.append('image', productData.imageFile);
            }

            const response = await fetch(`${API_BASE_URL}/api/admin/inventory`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // Update product
    async updateProduct(id, productData) {
        try {
            const token = localStorage.getItem('islaAccessToken');
            const formData = new FormData();
            
            // Append all fields to FormData
            Object.keys(productData).forEach(key => {
                if (key === 'sizes' || key === 'addons') {
                    formData.append(key, JSON.stringify(productData[key]));
                } else if (key !== 'imageFile') {
                    formData.append(key, productData[key]);
                }
            });
            
            // Append image file if exists
            if (productData.imageFile) {
                formData.append('image', productData.imageFile);
            }

            const response = await fetch(`${API_BASE_URL}/api/admin/inventory/${id}`, {
                method: 'POST', // LavaLust uses POST for updates with _method
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // Delete product
    async deleteProduct(id) {
        try {
            return await this.apiCall(`/api/admin/inventory/${id}`, {
                method: 'DELETE',
            });
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // Toggle product status
    async toggleProductStatus(id) {
        try {
            return await this.apiCall(`/api/admin/inventory/${id}/toggle-status`, {
                method: 'POST',
            });
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // Export to CSV
    async exportCSV() {
        try {
            return await this.apiCall('/api/admin/inventory/export/csv');
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // Get categories
    async getCategories() {
        try {
            return await this.apiCall('/api/admin/categories');
        } catch (error) {
            throw this.handleError(error);
        }
    },

    // Error handler
    handleError(error) {
        return {
            success: false,
            message: error.message || 'Network error or server unavailable'
        };
    }
};

export default {
  name: 'AdminInventory',
  data() {
    return {
      // Navigation Data
      showNotifications: false,
      showUserMenu: false,
      isDarkMode: false,
      admin: {
        name: '',
        email: '',
        avatar: ''
      },
      notifications: [],

      // Inventory Data
      loading: false,
      saving: false,
      deleting: false,
      searchQuery: '',
      selectedCategory: 'all',
      stockFilter: 'all',
      showLowStock: false,
      showAddProductModal: false,
      showEditProductModal: false,
      showDeleteModal: false,
      productToDelete: null,
      currentProduct: this.getEmptyProduct(),
      categories: [
        {
          id: 'coffee-based',
          name: 'Coffee-Based',
          icon: 'fas fa-coffee',
          description: 'Rich and aromatic coffee creations'
        },
        {
          id: 'blended-frappe',
          name: 'Blended/Frappe',
          icon: 'fas fa-blender',
          description: 'Icy blended coffee delights'
        },
        {
          id: 'non-coffee',
          name: 'Non-Coffee',
          icon: 'fas fa-mug-hot',
          description: 'Refreshing beverages without coffee'
        },
        {
          id: 'cold-brew-specialty',
          name: 'Cold Brew & Specialty',
          icon: 'fas fa-glass-whiskey',
          description: 'Specialty cold brews and unique drinks'
        },
        {
          id: 'bottled-canned',
          name: 'Bottled/Canned Drinks',
          icon: 'fas fa-wine-bottle',
          description: 'Grab-and-go bottled beverages'
        },
        {
          id: 'pasta-sandwiches',
          name: 'Pasta & Sandwiches',
          icon: 'fas fa-utensils',
          description: 'Hearty pasta dishes and sandwiches'
        },
        {
          id: 'cake-slices',
          name: 'Cake Slices',
          icon: 'fas fa-birthday-cake',
          description: 'Delicious cake slices for every taste'
        },
        {
          id: 'cookies',
          name: 'Cookies',
          icon: 'fas fa-cookie',
          description: 'Freshly baked cookies'
        },
        {
          id: 'brownies',
          name: 'Brownies',
          icon: 'fas fa-cookie-bite',
          description: 'Rich and fudgy brownies'
        },
        {
          id: 'muffins',
          name: 'Muffins',
          icon: 'fas fa-bread-slice',
          description: 'Moist and flavorful muffins'
        },
        {
          id: 'savory-pastry',
          name: 'Savory Pastry',
          icon: 'fas fa-cheese',
          description: 'Savory pastries and baked goods'
        }
      ],
      products: [],
      stats: {
        total_products: 0,
        in_stock_products: 0,
        low_stock_products: 0,
        out_of_stock_products: 0
      }
    }
  },
  computed: {
    notificationCount() {
      return this.notifications.length
    },
    filteredProducts() {
      let filtered = this.products;

      // Search filter
      if (this.searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          (product.description && product.description.toLowerCase().includes(this.searchQuery.toLowerCase()))
        );
      }

      // Category filter
      if (this.selectedCategory !== 'all') {
        filtered = filtered.filter(product => product.category_id === this.selectedCategory);
      }

      // Stock filter
      if (this.stockFilter !== 'all') {
        switch (this.stockFilter) {
          case 'in-stock':
            filtered = filtered.filter(product => product.in_stock && product.stock > 5);
            break;
          case 'low-stock':
            filtered = filtered.filter(product => product.in_stock && product.stock > 0 && product.stock <= 5);
            break;
          case 'out-of-stock':
            filtered = filtered.filter(product => !product.in_stock || product.stock === 0);
            break;
        }
      }

      // Low stock alert filter
      if (this.showLowStock) {
        filtered = filtered.filter(product => product.in_stock && product.stock > 0 && product.stock <= 5);
      }

      return filtered;
    },
    totalProducts() {
      return this.stats.total_products;
    },
    inStockProducts() {
      return this.stats.in_stock_products;
    },
    lowStockProducts() {
      return this.stats.low_stock_products;
    },
    outOfStockProducts() {
      return this.stats.out_of_stock_products;
    },
    showCustomizationOptions() {
      const customizableCategories = ['coffee-based', 'blended-frappe', 'non-coffee', 'cold-brew-specialty'];
      return !this.currentProduct.category_id || customizableCategories.includes(this.currentProduct.category_id);
    }
  },
  async mounted() {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('islaDarkMode');
    if (savedDarkMode) {
      this.isDarkMode = JSON.parse(savedDarkMode);
      this.applyDarkModeStyles();
    }

    // Load admin data
    await this.loadAdminData();
    await this.loadCategories();
    await this.loadInventoryData();

    // Add Font Awesome if not already loaded
    this.loadFontAwesome();

    // Add click outside listener
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    // Remove event listener when component is destroyed
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    // Load admin data from localStorage or API
    async loadAdminData() {
      try {
        const savedAdmin = localStorage.getItem('islaAdmin');
        if (savedAdmin) {
          const adminData = JSON.parse(savedAdmin);
          this.admin = { ...adminData };
        } else {
          this.setFallbackAdminData();
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        this.setFallbackAdminData();
      }
    },

    // Load inventory data
    async loadInventoryData() {
      try {
        this.loading = true;
        const response = await inventoryService.getInventory({
          search: this.searchQuery,
          category: this.selectedCategory !== 'all' ? this.selectedCategory : undefined,
          stock_filter: this.stockFilter !== 'all' ? this.stockFilter : undefined,
          show_low_stock: this.showLowStock ? 'true' : undefined
        });

        if (response.success) {
          this.products = response.data;
          this.stats = response.stats;
        } else {
          this.showNotification(response.message || 'Failed to load inventory', 'error');
        }
      } catch (error) {
        console.error('Error loading inventory data:', error);
        this.showNotification(error.message || 'Failed to load inventory data', 'error');
        this.products = [];
      } finally {
        this.loading = false;
      }
    },

    // Load categories from API
    async loadCategories() {
      try {
        const response = await inventoryService.getCategories();
        if (response.success) {
          // Use API categories if available, otherwise use default ones
          this.categories = response.data.length > 0 ? response.data : this.categories;
        } else {
          // If API fails, use the default categories defined in data()
          this.showNotification('Using default categories', 'info');
        }
      } catch (error) {
        console.error('Error loading categories:', error);
        // Use default categories if API fails
        this.showNotification('Using default categories', 'info');
      }
    },

    // Set fallback admin data
    setFallbackAdminData() {
      this.admin = {
        name: 'Admin User',
        email: 'admin@islacafe.com',
        avatar: '/images/admin-avatar.png'
      };
    },

    // Navbar Methods
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
      this.showUserMenu = false
    },
    
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
      this.showNotifications = false
    },
    
    closeUserMenu() {
      this.showUserMenu = false
    },

    closeDropdowns() {
      this.showNotifications = false
      this.showUserMenu = false
    },

    // Dark/Light Mode Toggle
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('islaDarkMode', this.isDarkMode);
      this.applyDarkModeStyles();
    },

    applyDarkModeStyles() {
      if (this.isDarkMode) {
        document.body.classList.add('isla-global-dark-mode');
        document.documentElement.style.setProperty('--isla-dark-bg', '#0f0f14');
        document.documentElement.style.setProperty('--isla-dark-card', '#1a1a24');
        document.documentElement.style.setProperty('--isla-dark-text', '#e0e0e0');
        document.documentElement.style.setProperty('--isla-dark-border', '#2a2a3a');
      } else {
        document.body.classList.remove('isla-global-dark-mode');
        document.documentElement.style.removeProperty('--isla-dark-bg');
        document.documentElement.style.removeProperty('--isla-dark-card');
        document.documentElement.style.removeProperty('--isla-dark-text');
        document.documentElement.style.removeProperty('--isla-dark-border');
      }
    },

    // Image error handling
    handleImageError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ0IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMCAzNEMzMy4zMTM3IDM0IDM2IDMxLjMxMzcgMzYgMjhDMzYgMjQuNjg2MyAzMy4zMTM3IDIyIDMwIDIyQzI2LjY4NjMgMjIgMjQgMjQuNjg2MyAyNCAyOEMyNCAzMS4zMTM3IDI2LjY4NjMgMzQgMzAgMzRaIiBmaWxsPSIjODg1OTJFIi8+CjxwYXRoIGQ9Ik0zOCAzOEgyMkMyMC44OTU0IDM4IDIwIDM3LjEwNDYgMjAgMzZWMjJDMjAgMjAuODk1NCAyMC44OTU0IDIwIDIyIDIwSDM4QzM5LjEwNDYgMjAgNDAgMjAuODk1NCA0MCAyMlYzNkM0MCAzNy4xMDQ2IDM5LjEwNDYgMzggMzggMzhaTTIyIDIyVjM2SDM4VjIySDIyWiIgZmlsbD0iIzg4NTkyRSIvPgo8L3N2Zz4K';
    },
    
    handleAvatarError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGNUY1RjUiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSIyNCIgcj0iOCIgZmlsbD0iIzg4NTkyRSIvPgo8cGF0aCBkPSJNMTggNDhDMjEuMzEzNyA0OCAyNCA0NS4zMTM3IDI0IDQyQzI0IDM4LjY4NjMgMjEuMzEzNyAzNiAxOCAzNkMxNC42ODYzIDM2IDEyIDM4LjY4NjMgMTIgNDJDMTIgNDUuMzEzNyAxNC42ODYzIDQ4IDE4IDQ4WiIgZmlsbD0iIzg4NTkyRSIvPgo8L3N2Zz4K';
    },

    handleProductImageError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNSAzMEMyOC4zMTM3IDMwIDMxIDI3LjMxMzcgMzEgMjRDMzEgMjAuNjg2MyAyOC4zMTM3IDE4IDI1IDE4QzIxLjY4NjMgMTggMTkgMjAuNjg2MyAxOSAyNEMxOSAyNy4zMTM3IDIxLjY4NjMgMzAgMjUgMzBaIiBmaWxsPSIjODg1OTJFIi8+CjxwYXRoIGQ9Ik0zMiAzNEgxOEMxNi44OTU0IDM0IDE2IDMzLjEwNDYgMTYgMzJWMTlDMTYgMTcuODk1NCAxNi44OTU0IDE3IDE4IDE3SDMyQzMzLjEwNDYgMTcgMzQgMTcuODk1NCAzNCAxOVYzMkMzNCAzMy4xMDQ2IDMzLjEwNDYgMzQgMzIgMzRaTTE4IDE5VjMySDMyVjE5SDE4WiIgZmlsbD0iIzg4NTkyRSIvPgo8L3N2Zz4K';
    },

    getProductImage(imagePath) {
      if (!imagePath) {
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNSAzMEMyOC4zMTM3IDMwIDMxIDI3LjMxMzcgMzEgMjRDMzEgMjAuNjg2MyAyOC4zMTM3IDE4IDI1IDE4QzIxLjY4NjMgMTggMTkgMjAuNjg2MyAxOSAyNEMxOSAyNy4zMTM3IDIxLjY4NjMgMzAgMjUgMzBaIiBmaWxsPSIjODg1OTJFIi8+CjxwYXRoIGQ9Ik0zMiAzNEgxOEMxNi44OTU0IDM0IDE2IDMzLjEwNDYgMTYgMzJWMTlDMTYgMTcuODk1NCAxNi44OTU0IDE3IDE4IDE3SDMyQzMzLjEwNDYgMTcgMzQgMTcuODk1NCAzNCAxOVYzMkMzNCAzMy4xMDQ2IDMzLjEwNDYgMzQgMzIgMzRaTTE4IDE5VjMySDMyVjE5SDE4WiIgZmlsbD0iIzg4NTkyRSIvPgo8L3N2Zz4K';
      }
      // If it's a full URL, return as is, otherwise construct the path
      if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
        return imagePath;
      }
      return `/uploads/${imagePath}`;
    },

    // User methods
    async handleLogout() {
      try {
        localStorage.removeItem('islaAdmin');
        localStorage.removeItem('islaAccessToken');
        localStorage.removeItem('islaRefreshToken');
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('islaAdmin');
        localStorage.removeItem('islaAccessToken');
        localStorage.removeItem('islaRefreshToken');
        this.$router.push('/login');
      }
    },

    // Notification methods
    dismissNotification(notification) {
      this.notifications = this.notifications.filter(n => n.id !== notification.id);
    },

    // Add this method to load Font Awesome
    loadFontAwesome() {
      if (document.querySelector('link[href*="font-awesome"]')) {
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    },

    // Handle clicks outside dropdowns
    handleClickOutside(event) {
      if (!event.target.closest('.admin-dropdown')) {
        this.closeDropdowns();
      }
    },

    // Inventory Methods
    handleSearch() {
      // Debounce search
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.loadInventoryData();
      }, 500);
    },

    filterProducts() {
      this.loadInventoryData();
    },

    toggleLowStockFilter() {
      this.showLowStock = !this.showLowStock;
      this.loadInventoryData();
    },

    clearFilters() {
      this.searchQuery = '';
      this.selectedCategory = 'all';
      this.stockFilter = 'all';
      this.showLowStock = false;
      this.loadInventoryData();
    },

    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : 'Unknown';
    },

    getStockStatus(product) {
      if (!product.in_stock || product.stock === 0) return 'out-of-stock';
      if (product.stock <= 5) return 'low-stock';
      return 'in-stock';
    },

    getStockStatusText(product) {
      if (!product.in_stock || product.stock === 0) return 'Out of Stock';
      if (product.stock <= 5) return 'Low Stock';
      return 'In Stock';
    },

    getStockStatusClass(product) {
      return `status-${this.getStockStatus(product)}`;
    },

    async toggleProductStatus(product) {
      try {
        const response = await inventoryService.toggleProductStatus(product.id);
        
        if (response.success) {
          this.showNotification(response.message, 'success');
          // Update local product status
          product.in_stock = response.data.in_stock;
          await this.loadInventoryData();
        } else {
          this.showNotification(response.message || 'Failed to update status', 'error');
        }
      } catch (error) {
        console.error('Error toggling product status:', error);
        this.showNotification(error.message || 'Failed to update product status', 'error');
      }
    },

    editProduct(product) {
      this.currentProduct = {
        ...product,
        category_id: product.category_id,
        sizes: product.sizes || [{ name: 'Regular', price: 0 }],
        addons: product.addons || []
      };
      this.showEditProductModal = true;
    },

    confirmDelete(product) {
      this.productToDelete = product;
      this.showDeleteModal = true;
    },

    async deleteProduct() {
      try {
        this.deleting = true;
        const response = await inventoryService.deleteProduct(this.productToDelete.id);
        
        if (response.success) {
          this.showNotification(response.message, 'success');
          await this.loadInventoryData();
          this.closeModal();
        } else {
          this.showNotification(response.message || 'Failed to delete product', 'error');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        this.showNotification(error.message || 'Failed to delete product', 'error');
      } finally {
        this.deleting = false;
      }
    },

    async saveProduct() {
      try {
        this.saving = true;
        
        let response;
        if (this.showEditProductModal) {
          response = await inventoryService.updateProduct(this.currentProduct.id, this.currentProduct);
        } else {
          response = await inventoryService.createProduct(this.currentProduct);
        }
        
        if (response.success) {
          this.showNotification(response.message, 'success');
          await this.loadInventoryData();
          this.closeModal();
        } else {
          this.showNotification(response.message || 'Failed to save product', 'error');
        }
      } catch (error) {
        console.error('Error saving product:', error);
        this.showNotification(error.message || 'Failed to save product', 'error');
      } finally {
        this.saving = false;
      }
    },

    getEmptyProduct() {
      return {
        id: null,
        name: '',
        description: '',
        price: 0,
        original_price: null,
        image: '',
        imageFile: null,
        category_id: '',
        calories: 0,
        stock: 0,
        in_stock: true,
        is_new: false,
        is_bestseller: false,
        customizable: false,
        sizes: [{ name: 'Regular', price: 0 }],
        addons: []
      };
    },

    addSize() {
      this.currentProduct.sizes.push({ name: '', price: 0 });
    },

    removeSize(index) {
      this.currentProduct.sizes.splice(index, 1);
    },

    addAddon() {
      this.currentProduct.addons.push({ name: '', price: 0 });
    },

    removeAddon(index) {
      this.currentProduct.addons.splice(index, 1);
    },

    closeModal() {
      this.showAddProductModal = false;
      this.showEditProductModal = false;
      this.showDeleteModal = false;
      this.productToDelete = null;
      this.currentProduct = this.getEmptyProduct();
      this.saving = false;
      this.deleting = false;
    },

    async exportInventory() {
      try {
        const response = await inventoryService.exportCSV();
        
        if (response.success) {
          // Convert to CSV and download
          const csvContent = response.data.map(row => 
            row.map(cell => `"${cell}"`).join(',')
          ).join('\n');
          
          const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.setAttribute('download', `inventory-${new Date().toISOString().split('T')[0]}.csv`);
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          
          this.showNotification('Inventory exported successfully', 'success');
        } else {
          this.showNotification(response.message || 'Failed to export inventory', 'error');
        }
      } catch (error) {
        console.error('Error exporting inventory:', error);
        this.showNotification(error.message || 'Failed to export inventory', 'error');
      }
    },

    // Image upload methods
    triggerImageUpload() {
      this.$refs.imageInput.click();
    },

    handleImageUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.currentProduct.imageFile = file;
        // Don't set the image preview here, let the template handle it
      }
    },

    removeImage() {
      this.currentProduct.image = '';
      this.currentProduct.imageFile = null;
      if (this.$refs.imageInput) {
        this.$refs.imageInput.value = '';
      }
    },

    showNotification(message, type = 'info') {
      // Simple notification implementation - you can replace with a proper toast library
      const notification = {
        id: Date.now(),
        title: type.charAt(0).toUpperCase() + type.slice(1),
        message: message,
        icon: type === 'success' ? 'fas fa-check-circle' : 
              type === 'error' ? 'fas fa-exclamation-circle' : 'fas fa-info-circle',
        time: 'Just now'
      };
      
      this.notifications.unshift(notification);
      
      // Auto remove after 5 seconds
      setTimeout(() => {
        this.dismissNotification(notification);
      }, 5000);
    }
  }
}
</script>

<style scoped>
/* CSS Variables for Dark Mode */
:root {
  --isla-dark-bg: #0f0f14;
  --isla-dark-card: #1a1a24;
  --isla-dark-text: #e0e0e0;
  --isla-dark-border: #2a2a3a;
  --isla-dark-hover: #2a2a3a;
}

/* Reset and base styles */
.admin-container * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.admin-container {
  min-height: 100vh;
  background-color: #f8f4e9;
  transition: all 0.3s ease;
}

.admin-container.dark-mode {
  background-color: #0f0f14;
}

/* Navbar Styles */
.admin-navbar {
  background: #88592e;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  border-bottom: 3px solid #6b451e;
  transition: all 0.3s ease;
}

.admin-navbar.dark-mode {
  background: #1a1a24 !important;
  border-bottom-color: #2a2a3a !important;
}

.admin-nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  max-width: 100%;
  margin: 0 auto;
  height: 60px;
}

.admin-nav-left .admin-logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.admin-logo {
  height: 35px;
  margin-right: 10px;
  border-radius: 5px;
}

.admin-brand-name {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 0.5px;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-brand-name {
  color: #ffffff !important;
}

.admin-nav-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.admin-nav-item {
  position: relative;
}

.admin-nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.admin-navbar.dark-mode .admin-nav-link {
  color: #e0e0e0 !important;
}

.admin-nav-link:hover {
  color: #88592e;
  background-color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.admin-navbar.dark-mode .admin-nav-link:hover {
  color: #1a1a24 !important;
  background-color: #e0e0e0 !important;
}

.admin-toggle-item .admin-nav-link {
  padding: 8px 12px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.admin-toggle-link {
  font-size: 13px;
}

.admin-user-account {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  border-radius: 5px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.admin-user-account:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.admin-navbar.dark-mode .admin-user-account:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.admin-user-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ffffff;
  transition: border-color 0.3s ease;
}

.admin-navbar.dark-mode .admin-user-avatar {
  border-color: #e0e0e0 !important;
}

.admin-user-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-user-name {
  color: #e0e0e0 !important;
}

.admin-dropdown {
  position: relative;
}

/* Dropdown Content */
.admin-dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  background: #ffffff;
  border-radius: 10px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
  min-width: 280px;
  z-index: 1001;
  margin-top: 8px;
  border: 2px solid #6b451e;
  overflow: hidden;
  transition: all 0.3s ease;
}

.admin-navbar.dark-mode .admin-dropdown-content {
  background: #1a1a24 !important;
  border-color: #2a2a3a !important;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
}

.admin-dropdown-header {
  padding: 15px;
  border-bottom: 2px solid #6b451e;
  background: #88592e;
  transition: all 0.3s ease;
}

.admin-navbar.dark-mode .admin-dropdown-header {
  background: #2a2a3a !important;
  border-bottom-color: #3a3a4a !important;
}

.admin-dropdown-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-dropdown-header h3 {
  color: #e0e0e0 !important;
}

/* Notifications and Messages Lists */
.admin-notifications-list {
  max-height: 350px;
  overflow-y: auto;
  background: #ffffff;
  transition: all 0.3s ease;
}

.admin-navbar.dark-mode .admin-notifications-list {
  background: #1a1a24 !important;
}

.admin-empty-notifications {
  text-align: center;
  color: #88592e;
  padding: 30px 15px;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-empty-notifications {
  color: #a0a5c0 !important;
}

.admin-empty-notifications i {
  font-size: 40px;
  margin-bottom: 10px;
  display: block;
  color: #88592e;
  opacity: 0.6;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-empty-notifications i {
  color: #3a3f5d !important;
  opacity: 0.4;
}

.admin-notification-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid #e0e0e0;
  gap: 10px;
  transition: border-color 0.3s ease;
}

.admin-navbar.dark-mode .admin-notification-item {
  border-bottom-color: #2a2a3a !important;
}

.admin-notification-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #88592e;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.admin-notification-details {
  flex: 1;
  min-width: 0;
}

.admin-notification-details h4 {
  margin: 0 0 4px 0;
  font-size: 14px;
  color: #333333;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-notification-details h4 {
  color: #e0e0e0 !important;
}

.admin-notification-details p {
  margin: 0 0 4px 0;
  font-size: 13px;
  color: #666666;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-notification-details p {
  color: #a0a5c0 !important;
}

.admin-notification-time {
  font-size: 11px;
  color: #999999;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-notification-time {
  color: #7a7f9a !important;
}

.admin-notification-dismiss {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 6px;
  border-radius: 4px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.admin-notification-dismiss:hover {
  background: #e74c3c;
  color: white;
}

/* User Dropdown */
.admin-user-dropdown {
  min-width: 220px;
}

.admin-user-info {
  display: flex;
  align-items: center;
  padding: 15px;
  gap: 12px;
  background: #88592e;
  transition: all 0.3s ease;
}

.admin-navbar.dark-mode .admin-user-info {
  background: #2a2a3a !important;
}

.admin-user-avatar-large {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ffffff;
  flex-shrink: 0;
  transition: border-color 0.3s ease;
}

.admin-navbar.dark-mode .admin-user-avatar-large {
  border-color: #e0e0e0 !important;
}

.admin-user-details {
  flex: 1;
  min-width: 0;
}

.admin-user-details h4 {
  margin: 0 0 4px 0;
  color: #ffffff;
  font-size: 16px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-user-details h4 {
  color: #e0e0e0 !important;
}

.admin-user-details p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-user-details p {
  color: rgba(224, 224, 224, 0.8) !important;
}

.admin-dropdown-divider {
  height: 1px;
  background: #88592e;
  margin: 0;
  transition: background 0.3s ease;
}

.admin-navbar.dark-mode .admin-dropdown-divider {
  background: #2a2a3a !important;
}

.admin-dropdown-item {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: #88592e;
  text-decoration: none;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  gap: 10px;
  font-weight: 600;
}

.admin-navbar.dark-mode .admin-dropdown-item {
  color: #e0e0e0 !important;
}

.admin-dropdown-item:hover {
  background: #88592e;
  color: #ffffff;
}

.admin-navbar.dark-mode .admin-dropdown-item:hover {
  background: #e0e0e0 !important;
  color: #1a1a24 !important;
}

.admin-logout-btn {
  color: #e74c3c;
}

.admin-logout-btn:hover {
  color: #ffffff;
  background: #e74c3c;
}

.admin-navbar.dark-mode .admin-logout-btn:hover {
  color: #1a1a24 !important;
  background: #e74c3c !important;
}

.admin-badge {
  position: absolute;
  top: -4px;
  right: -4px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  border: 2px solid #ffffff;
  pointer-events: none;
  transition: border-color 0.3s ease;
}

.admin-navbar.dark-mode .admin-badge {
  border-color: #1a1a24 !important;
}

/* Main Content Layout */
.admin-main {
  display: flex;
  min-height: calc(100vh - 60px);
}

/* Sidebar Styles */
.admin-sidebar {
  width: 200px;
  background: #5a3921;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  position: sticky;
  top: 60px;
  height: calc(100vh - 60px);
  overflow-y: auto;
  display: flex;
  flex-direction: column;
}

.admin-sidebar.dark-mode {
  background: #2a2a3a;
}

.admin-sidebar-menu {
  padding: 15px 0;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-sidebar-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #d4b896;
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 600;
  gap: 10px;
  border-left: 3px solid transparent;
  font-size: 14px;
}

.admin-sidebar.dark-mode .admin-sidebar-item {
  color: #e0e0e0;
}

.admin-sidebar-item:hover {
  background: #6b451e;
  color: #ffffff;
  border-left-color: #88592e;
}

.admin-sidebar.dark-mode .admin-sidebar-item:hover {
  background: #3a3a4a;
  color: #ffffff;
}

.admin-active-sidebar-item {
  background: #6b451e;
  color: #ffffff;
  border-left-color: #88592e;
}

.admin-sidebar.dark-mode .admin-active-sidebar-item {
  background: #88592e;
  color: #ffffff;
}

.admin-sidebar-item i {
  width: 18px;
  text-align: center;
  color: #d4b896;
  font-size: 14px;
}

.admin-sidebar.dark-mode .admin-sidebar-item i {
  color: #e0e0e0;
}

.admin-sidebar-item:hover i,
.admin-active-sidebar-item i {
  color: #ffffff;
}

/* Sidebar Logout Section */
.sidebar-logout-section {
  margin-top: auto;
  padding: 15px 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.sidebar-logout-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 12px 20px;
  background: transparent;
  border: none;
  color: #d4b896;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.sidebar-logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.sidebar-logout-btn i {
  width: 18px;
  text-align: center;
  font-size: 14px;
}

/* Content Area */
.admin-content {
  flex: 1;
  padding: 15px;
  background: #f8f4e9;
  transition: all 0.3s ease;
  overflow-y: auto;
}

.admin-container.dark-mode .admin-content {
  background: #0f0f14;
}

/* Inventory Styles */
.admin-inventory {
  padding: 0;
  background: transparent;
  min-height: auto;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem;
  color: #666;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #88592e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.admin-container.dark-mode .loading-state {
  color: #a0a5c0;
}

/* Header Styles */
.inventory-header {
  background: white;
  border-radius: 0.8rem;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 10px rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .inventory-header {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
}

.page-title {
  font-size: 1.6rem;
  color: #88592e;
  margin-bottom: 0.4rem;
  font-weight: 600;
}

.admin-container.dark-mode .page-title {
  color: #e0e0e0;
}

.page-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.admin-container.dark-mode .page-subtitle {
  color: #a0a5c0;
}

.quick-actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.action-btn.primary {
  background: #88592e;
  color: white;
}

.action-btn.primary:hover {
  background: #6b451e;
  transform: translateY(-1px);
}

.action-btn.secondary {
  background: #d4b896;
  color: #5a3921;
}

.action-btn.secondary:hover {
  background: #c4a57c;
  transform: translateY(-1px);
}

.admin-container.dark-mode .action-btn.secondary {
  background: #8d6e63;
  color: #ffffff;
}

/* Stats Cards */
.inventory-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 0.8rem;
  padding: 1.2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 2px 10px rgba(139, 115, 85, 0.1);
  transition: transform 0.3s ease;
}

.admin-container.dark-mode .stat-card {
  background: var(--isla-dark-card);
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon.total {
  background: #e3f2fd;
  color: #1976d2;
}

.stat-icon.in-stock {
  background: #e8f5e8;
  color: #4caf50;
}

.stat-icon.low-stock {
  background: #fff3e0;
  color: #ff9800;
}

.stat-icon.out-of-stock {
  background: #ffebee;
  color: #f44336;
}

.stat-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  color: #88592e;
}

.admin-container.dark-mode .stat-info h3 {
  color: var(--isla-dark-text);
}

.stat-info p {
  color: #666;
  font-size: 0.8rem;
  margin: 0;
}

.admin-container.dark-mode .stat-info p {
  color: #a0a5c0;
}

/* Controls */
.inventory-controls {
  background: white;
  border-radius: 0.8rem;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 2px 10px rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .inventory-controls {
  background: var(--isla-dark-card);
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 250px;
}

.search-box i {
  position: absolute;
  left: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
}

.admin-container.dark-mode .search-box i {
  color: #a0a5c0;
}

.search-box input {
  width: 100%;
  padding: 0.6rem 0.8rem 0.6rem 2.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.admin-container.dark-mode .search-box input {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
  border-color: var(--isla-dark-border);
}

.search-box input:focus {
  outline: none;
  border-color: #88592e;
}

.filter-controls {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.category-filter,
.stock-filter {
  padding: 0.6rem 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.4rem;
  background: white;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
  min-width: 140px;
}

.admin-container.dark-mode .category-filter,
.admin-container.dark-mode .stock-filter {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
  border-color: var(--isla-dark-border);
}

.category-filter:focus,
.stock-filter:focus {
  outline: none;
  border-color: #88592e;
}

/* Table Styles */
.inventory-table-container {
  background: white;
  border-radius: 0.8rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .inventory-table-container {
  background: var(--isla-dark-card);
}

.inventory-table {
  width: 100%;
  border-collapse: collapse;
}

.inventory-table th {
  background: #88592e;
  color: white;
  padding: 0.8rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.inventory-table td {
  padding: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
}

.admin-container.dark-mode .inventory-table td {
  border-bottom-color: var(--isla-dark-border);
}

.inventory-table tr:last-child td {
  border-bottom: none;
}

.inventory-table tr:hover {
  background: #f8f5f2;
}

.admin-container.dark-mode .inventory-table tr:hover {
  background: var(--isla-dark-hover);
}

/* Status row colors */
.status-in-stock {
  background: #f8fff8;
}

.status-low-stock {
  background: #fff8f0;
}

.status-out-of-stock {
  background: #fff0f0;
}

.admin-container.dark-mode .status-in-stock {
  background: #1a2a1a;
}

.admin-container.dark-mode .status-low-stock {
  background: #2a2a1a;
}

.admin-container.dark-mode .status-out-of-stock {
  background: #2a1a1a;
}

/* Table Cells */
.product-cell .product-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.product-thumb {
  width: 40px;
  height: 40px;
  border-radius: 0.4rem;
  object-fit: cover;
  border: 2px solid #e0e0e0;
}

.admin-container.dark-mode .product-thumb {
  border-color: var(--isla-dark-border);
}

.product-details h4 {
  margin: 0 0 0.2rem 0;
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.admin-container.dark-mode .product-details h4 {
  color: var(--isla-dark-text);
}

.product-description {
  margin: 0;
  color: #666;
  font-size: 0.7rem;
  line-height: 1.3;
}

.admin-container.dark-mode .product-description {
  color: #a0a5c0;
}

.category-cell .category-tag {
  background: #e8f5e8;
  color: #2e7d32;
  padding: 0.3rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  display: inline-block;
}

.admin-container.dark-mode .category-cell .category-tag {
  background: #1b5e20;
  color: #a5d6a7;
}

.price-cell .price-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.current-price {
  font-weight: 700;
  color: #88592e;
  font-size: 0.9rem;
}

.admin-container.dark-mode .current-price {
  color: #e0e0e0;
}

.original-price {
  text-decoration: line-through;
  color: #999;
  font-size: 0.7rem;
}

.admin-container.dark-mode .original-price {
  color: #7a7f9a;
}

.stock-cell .stock-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.stock-quantity {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.admin-container.dark-mode .stock-quantity {
  color: var(--isla-dark-text);
}

.stock-warning {
  color: #e74c3c;
  font-size: 0.7rem;
  font-weight: 600;
}

.status-cell .status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.in-stock {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.low-stock {
  background: #fff3e0;
  color: #ef6c00;
}

.status-badge.out-of-stock {
  background: #ffebee;
  color: #c62828;
}

.admin-container.dark-mode .status-badge.in-stock {
  background: #1b5e20;
  color: #a5d6a7;
}

.admin-container.dark-mode .status-badge.low-stock {
  background: #e65100;
  color: #ffcc80;
}

.admin-container.dark-mode .status-badge.out-of-stock {
  background: #b71c1c;
  color: #ef9a9a;
}

.actions-cell .action-buttons {
  display: flex;
  gap: 0.4rem;
}

.btn-icon {
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  transition: all 0.3s ease;
}

.btn-icon.edit {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-icon.edit:hover {
  background: #1976d2;
  color: white;
}

.btn-icon.delete {
  background: #ffebee;
  color: #e74c3c;
}

.btn-icon.delete:hover {
  background: #e74c3c;
  color: white;
}

.btn-icon.toggle {
  background: #fff3e0;
  color: #ff9800;
}

.btn-icon.toggle:hover {
  background: #ff9800;
  color: white;
}

.admin-container.dark-mode .btn-icon.edit {
  background: #0d47a1;
  color: #bbdefb;
}

.admin-container.dark-mode .btn-icon.delete {
  background: #b71c1c;
  color: #ffcdd2;
}

.admin-container.dark-mode .btn-icon.toggle {
  background: #e65100;
  color: #ffcc80;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #666;
}

.admin-container.dark-mode .empty-state {
  color: #a0a5c0;
}

.empty-state i {
  font-size: 3rem;
  color: #88592e;
  margin-bottom: 1rem;
  opacity: 0.6;
}

.admin-container.dark-mode .empty-state i {
  color: #3a3f5d;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
  color: #333;
}

.admin-container.dark-mode .empty-state h3 {
  color: var(--isla-dark-text);
}

.empty-state p {
  margin-bottom: 1.5rem;
}

.clear-filters-btn {
  background: #88592e;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.4rem;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.clear-filters-btn:hover {
  background: #6b451e;
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1002;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 0.8rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.admin-container.dark-mode .modal {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
}

.modal-header {
  padding: 1.2rem;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-container.dark-mode .modal-header {
  border-bottom-color: var(--isla-dark-border);
}

.modal-header h3 {
  margin: 0;
  color: #88592e;
}

.admin-container.dark-mode .modal-header h3 {
  color: var(--isla-dark-text);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.2rem;
  color: #666;
  cursor: pointer;
  padding: 0.4rem;
  border-radius: 0.2rem;
  transition: background 0.3s ease;
}

.close-btn:hover {
  background: #f0f0f0;
}

.admin-container.dark-mode .close-btn {
  color: #a0a5c0;
}

.admin-container.dark-mode .close-btn:hover {
  background: var(--isla-dark-hover);
}

.modal-body {
  padding: 1.2rem;
}

/* Product Form */
.product-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.admin-container.dark-mode .form-group label {
  color: var(--isla-dark-text);
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.6rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.admin-container.dark-mode .form-group input,
.admin-container.dark-mode .form-group select,
.admin-container.dark-mode .form-group textarea {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
  border-color: var(--isla-dark-border);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #88592e;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: normal;
}

.checkbox-label input[type="checkbox"] {
  margin: 0;
}

/* Image Upload Section */
.image-upload-section {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.image-file-input {
  display: none;
}

.upload-image-btn {
  background: #d4b896;
  color: #5a3921;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 0.4rem;
  cursor: pointer;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: background 0.3s ease;
}

.upload-image-btn:hover {
  background: #c4a57c;
}

.admin-container.dark-mode .upload-image-btn {
  background: #8d6e63;
  color: #ffffff;
}

.image-preview {
  position: relative;
  width: 100px;
  height: 100px;
  border: 2px solid #e0e0e0;
  border-radius: 0.4rem;
  overflow: hidden;
}

.admin-container.dark-mode .image-preview {
  border-color: var(--isla-dark-border);
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image-btn {
  position: absolute;
  top: 0.2rem;
  right: 0.2rem;
  background: #e74c3c;
  color: white;
  border: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
}

.remove-image-btn:hover {
  background: #c0392b;
}

/* Customization Section */
.customization-section {
  border: 1px solid #e0e0e0;
  border-radius: 0.4rem;
  padding: 1rem;
  background: #f9f9f9;
}

.admin-container.dark-mode .customization-section {
  background: var(--isla-dark-hover);
  border-color: var(--isla-dark-border);
}

.customization-section h4 {
  margin: 0 0 1rem 0;
  color: #88592e;
}

.admin-container.dark-mode .customization-section h4 {
  color: var(--isla-dark-text);
}

.customization-section h5 {
  margin: 0 0 0.8rem 0;
  color: #666;
  font-size: 0.9rem;
}

.admin-container.dark-mode .customization-section h5 {
  color: #a0a5c0;
}

.size-options,
.addon-options {
  margin-bottom: 1.5rem;
}

.size-option-row,
.addon-option-row {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
  align-items: center;
}

.size-name,
.addon-name {
  flex: 2;
}

.size-price,
.addon-price {
  flex: 1;
}

.remove-size-btn,
.remove-addon-btn {
  background: #e74c3c;
  color: white;
  border: none;
  width: 30px;
  height: 30px;
  border-radius: 0.2rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
}

.remove-size-btn:hover,
.remove-addon-btn:hover {
  background: #c0392b;
}

.add-option-btn {
  background: #88592e;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.3rem;
  cursor: pointer;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: background 0.3s ease;
}

.add-option-btn:hover {
  background: #6b451e;
}

/* Form Actions */
.form-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
}

.btn.primary {
  background: #88592e;
  color: white;
}

.btn.primary:hover:not(:disabled) {
  background: #6b451e;
}

.btn.primary:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.btn.secondary {
  background: #d4b896;
  color: #5a3921;
}

.btn.secondary:hover:not(:disabled) {
  background: #c4a57c;
}

.btn.secondary:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.btn.danger {
  background: #e74c3c;
  color: white;
}

.btn.danger:hover:not(:disabled) {
  background: #c0392b;
}

.btn.danger:disabled {
  background: #cccccc;
  cursor: not-allowed;
}

.admin-container.dark-mode .btn.secondary {
  background: #8d6e63;
  color: #ffffff;
}

/* Delete Modal */
.delete-modal {
  max-width: 400px;
}

.delete-modal .modal-body p {
  margin-bottom: 1.5rem;
  color: #333;
  line-height: 1.5;
}

.admin-container.dark-mode .delete-modal .modal-body p {
  color: var(--isla-dark-text);
}

.modal-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-nav-container {
    padding: 0 10px;
  }
  
  .admin-brand-name {
    font-size: 16px;
  }
  
  .admin-sidebar {
    width: 60px;
  }
  
  .admin-sidebar-item span {
    display: none;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .inventory-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .inventory-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    min-width: auto;
  }
  
  .filter-controls {
    justify-content: space-between;
  }
  
  .inventory-table {
    font-size: 0.8rem;
  }
  
  .product-cell .product-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
  
  .actions-cell .action-buttons {
    flex-direction: column;
    gap: 0.2rem;
  }
}

@media (max-width: 480px) {
  .inventory-stats {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .modal {
    margin: 1rem;
    max-height: calc(100vh - 2rem);
  }
}
</style>