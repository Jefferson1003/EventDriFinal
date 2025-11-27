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
        <!-- User Management Content -->
        <div class="admin-user-management">
          <!-- Page Header -->
          <div class="user-management-header">
            <h1 class="page-title">User Management</h1>
            <p class="page-subtitle">Manage customer accounts, permissions, and user data</p>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
              <button class="action-btn primary" @click="showAddUserModal = true">
                <i class="fas fa-user-plus"></i> Add New User
              </button>
              <button class="action-btn secondary" @click="exportUserData">
                <i class="fas fa-download"></i> Export Users
              </button>
              <button class="action-btn secondary" @click="refreshData">
                <i class="fas fa-sync-alt"></i> Refresh
              </button>
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <i class="fas fa-spinner fa-spin"></i>
            <p>Loading user data from database...</p>
          </div>

          <!-- Auth Error State -->
          <div v-if="authError" class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Authentication Error</h3>
            <p>{{ authError }}</p>
            <button @click="checkAuthentication" class="retry-btn">
              <i class="fas fa-redo"></i> Check Again
            </button>
            <button @click="handleLogout" class="retry-btn" style="margin-left: 10px; background: #666;">
              <i class="fas fa-sign-out-alt"></i> Login Again
            </button>
          </div>

          <!-- User Stats -->
          <div v-else-if="!loading && !authError" class="user-stats">
            <div class="stat-card">
              <div class="stat-icon total">
                <i class="fas fa-users"></i>
              </div>
              <div class="stat-info">
                <h3>{{ totalUsers }}</h3>
                <p>Total Users</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon active">
                <i class="fas fa-user-check"></i>
              </div>
              <div class="stat-info">
                <h3>{{ activeUsers }}</h3>
                <p>Active Users</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon new">
                <i class="fas fa-user-clock"></i>
              </div>
              <div class="stat-info">
                <h3>{{ newUsers }}</h3>
                <p>New This Month</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon blocked">
                <i class="fas fa-user-slash"></i>
              </div>
              <div class="stat-info">
                <h3>{{ blockedUsers }}</h3>
                <p>Blocked Users</p>
              </div>
            </div>
          </div>

          <!-- Search and Filters -->
          <div v-if="!loading && !authError" class="user-controls">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search users by name, email, or phone..." 
                v-model="searchQuery"
                @input="filterUsers"
              >
            </div>
            
            <div class="filter-controls">
              <select v-model="statusFilter" @change="filterUsers" class="status-filter">
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="blocked">Blocked</option>
              </select>
              
              <select v-model="sortBy" @change="sortUsers" class="sort-filter">
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="orders">Most Orders</option>
              </select>
            </div>
          </div>

          <!-- Users Table -->
          <div v-if="!loading && !authError" class="users-table-container">
            <table class="users-table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Orders</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id" :class="getUserStatusClass(user)">
                  <td class="user-cell">
                    <div class="user-info">
                      <img :src="user.avatar" :alt="user.name" class="user-avatar" @error="handleAvatarError">
                      <div class="user-details">
                        <h4>{{ user.name }}</h4>
                        <p class="user-id">ID: {{ user.id }}</p>
                        <div class="user-tags">
                          <span v-if="user.isNew" class="tag new">New</span>
                          <span v-if="user.isBlocked" class="tag blocked">
                            <i class="fas fa-ban"></i> Blocked
                          </span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="contact-cell">
                    <div class="contact-info">
                      <div class="email">
                        <i class="fas fa-envelope"></i>
                        {{ user.email }}
                      </div>
                      <div class="phone" v-if="user.phone && user.phone !== 'Not provided'">
                        <i class="fas fa-phone"></i>
                        {{ user.phone }}
                      </div>
                    </div>
                  </td>
                  <td class="status-cell">
                    <span class="status-badge" :class="user.status">
                      <i :class="getStatusIcon(user.status)"></i>
                      {{ user.status }}
                    </span>
                  </td>
                  <td class="orders-cell">
                    <div class="orders-info">
                      <div class="orders-count">{{ user.orders }}</div>
                      <div class="orders-amount">₱{{ user.totalSpent.toLocaleString() }}</div>
                    </div>
                  </td>
                  <td class="joined-cell">
                    <div class="joined-info">
                      <div class="join-date">{{ formatDate(user.joinDate) }}</div>
                      <div class="join-days">{{ getDaysAgo(user.joinDate) }}</div>
                    </div>
                  </td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button class="btn-icon view" @click="viewUserDetails(user)" title="View Details">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button class="btn-icon edit" @click="editUser(user)" title="Edit User">
                        <i class="fas fa-edit"></i>
                      </button>
                      <button 
                        v-if="user.status !== 'blocked'"
                        class="btn-icon block" 
                        @click="blockUser(user)"
                        :disabled="user.id === currentAdminId"
                        title="Block User"
                      >
                        <i class="fas fa-ban"></i>
                      </button>
                      <button 
                        v-else
                        class="btn-icon unblock" 
                        @click="unblockUser(user)"
                        :disabled="user.id === currentAdminId"
                        title="Unblock User"
                      >
                        <i class="fas fa-check-circle"></i>
                      </button>
                      <button 
                        class="btn-icon delete" 
                        @click="confirmDelete(user)"
                        :disabled="user.id === currentAdminId"
                        title="Delete User"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="filteredUsers.length === 0" class="empty-state">
              <i class="fas fa-users-slash"></i>
              <h3>No users found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button @click="clearFilters" class="clear-filters-btn">
                Clear Filters
              </button>
            </div>

            <!-- Pagination -->
            <div v-if="filteredUsers.length > 0" class="pagination">
              <button 
                class="pagination-btn" 
                @click="previousPage" 
                :disabled="currentPage === 1"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              
              <span class="page-info">
                Page {{ currentPage }} of {{ totalPages }}
              </span>
              
              <button 
                class="pagination-btn" 
                @click="nextPage" 
                :disabled="currentPage === totalPages"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
          </div>

          <!-- Error State -->
          <div v-if="error && !authError" class="error-state">
            <i class="fas fa-exclamation-triangle"></i>
            <h3>Failed to load user data</h3>
            <p>{{ error }}</p>
            <button @click="fetchInitialData" class="retry-btn">
              <i class="fas fa-redo"></i> Try Again
            </button>
          </div>

          <!-- User Details Modal -->
          <div v-if="showUserDetailsModal" class="modal-overlay" @click="closeModal">
            <div class="modal user-details-modal" @click.stop>
              <div class="modal-header">
                <h3>User Details</h3>
                <button class="close-btn" @click="closeModal">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <div class="modal-body" v-if="selectedUser">
                <div class="user-profile">
                  <div class="profile-header">
                    <img :src="selectedUser.avatar" :alt="selectedUser.name" class="profile-avatar" @error="handleAvatarError">
                    <div class="profile-info">
                      <h2>{{ selectedUser.name }}</h2>
                      <p class="user-email">{{ selectedUser.email }}</p>
                      <div class="profile-badges">
                        <span class="badge" :class="selectedUser.status">{{ selectedUser.status }}</span>
                        <span v-if="selectedUser.isBlocked" class="badge blocked">
                          <i class="fas fa-ban"></i> Blocked
                        </span>
                        <span v-if="selectedUser.isNew" class="badge new">New User</span>
                      </div>
                    </div>
                  </div>

                  <div class="profile-details">
                    <div class="detail-section">
                      <h4>Contact Information</h4>
                      <div class="detail-grid">
                        <div class="detail-item">
                          <label><i class="fas fa-phone"></i> Phone:</label>
                          <span>{{ selectedUser.phone || 'Not provided' }}</span>
                        </div>
                        <div class="detail-item">
                          <label><i class="fas fa-map-marker-alt"></i> Address:</label>
                          <span>{{ selectedUser.address || 'Not provided' }}</span>
                        </div>
                        <div class="detail-item">
                          <label><i class="fas fa-calendar"></i> Member Since:</label>
                          <span>{{ formatDate(selectedUser.joinDate) }}</span>
                        </div>
                        <div v-if="selectedUser.blockedUntil" class="detail-item">
                          <label><i class="fas fa-clock"></i> Blocked Until:</label>
                          <span>{{ formatDate(selectedUser.blockedUntil) }}</span>
                        </div>
                        <div v-if="selectedUser.blockReason" class="detail-item">
                          <label><i class="fas fa-exclamation-triangle"></i> Block Reason:</label>
                          <span>{{ selectedUser.blockReason }}</span>
                        </div>
                      </div>
                    </div>

                    <div class="detail-section">
                      <h4>Order Statistics</h4>
                      <div class="stats-grid">
                        <div class="stat-item">
                          <div class="stat-value">{{ selectedUser.orders }}</div>
                          <div class="stat-label">Total Orders</div>
                        </div>
                        <div class="stat-item">
                          <div class="stat-value">₱{{ selectedUser.totalSpent.toLocaleString() }}</div>
                          <div class="stat-label">Total Spent</div>
                        </div>
                        <div class="stat-item">
                          <div class="stat-value">₱{{ selectedUser.averageOrderValue.toLocaleString() }}</div>
                          <div class="stat-label">Avg. Order Value</div>
                        </div>
                        <div class="stat-item">
                          <div class="stat-value">{{ selectedUser.lastOrder === 'Never' ? 'Never' : formatDate(selectedUser.lastOrder) }}</div>
                          <div class="stat-label">Last Order</div>
                        </div>
                      </div>
                    </div>

                    <div class="detail-section">
                      <h4>Preferences</h4>
                      <div class="preferences">
                        <div class="preference-item" v-if="selectedUser.preferences && selectedUser.preferences.favoriteCategory">
                          <span class="preference-label">Favorite Category:</span>
                          <span class="preference-value">{{ selectedUser.preferences.favoriteCategory }}</span>
                        </div>
                        <div class="preference-item" v-if="selectedUser.preferences && selectedUser.preferences.dietaryRestrictions">
                          <span class="preference-label">Dietary Restrictions:</span>
                          <span class="preference-value">{{ selectedUser.preferences.dietaryRestrictions || 'None' }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Add/Edit User Modal -->
          <div v-if="showAddUserModal || showEditUserModal" class="modal-overlay" @click="closeModal">
            <div class="modal user-form-modal" @click.stop>
              <div class="modal-header">
                <h3>{{ showEditUserModal ? 'Edit User' : 'Add New User' }}</h3>
                <button class="close-btn" @click="closeModal">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <div class="modal-body">
                <form @submit.prevent="saveUser" class="user-form">
                  <div class="form-row">
                    <div class="form-group">
                      <label>Full Name *</label>
                      <input 
                        type="text" 
                        v-model="currentUser.name" 
                        required 
                        placeholder="Enter full name"
                      >
                    </div>
                    
                    <div class="form-group">
                      <label>Email Address *</label>
                      <input 
                        type="email" 
                        v-model="currentUser.email" 
                        required 
                        placeholder="Enter email address"
                      >
                    </div>
                  </div>

                  <div class="form-row">
                    <div class="form-group">
                      <label>Phone Number</label>
                      <input 
                        type="tel" 
                        v-model="currentUser.phone" 
                        placeholder="Enter phone number"
                      >
                    </div>
                    
                    <div class="form-group">
                      <label>Status *</label>
                      <select v-model="currentUser.status" required>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="blocked">Blocked</option>
                      </select>
                    </div>
                  </div>

                  <div class="form-group">
                    <label>Address</label>
                    <textarea 
                      v-model="currentUser.address" 
                      placeholder="Enter full address"
                      rows="3"
                    ></textarea>
                  </div>

                  <div v-if="currentUser.status === 'blocked'" class="form-row">
                    <div class="form-group">
                      <label>Blocked Until</label>
                      <input 
                        type="date" 
                        v-model="currentUser.blockedUntil"
                        :min="new Date().toISOString().split('T')[0]"
                      >
                    </div>
                    
                    <div class="form-group">
                      <label>Block Reason</label>
                      <input 
                        type="text" 
                        v-model="currentUser.blockReason" 
                        placeholder="Reason for blocking user"
                      >
                    </div>
                  </div>

                  <div v-if="!showEditUserModal" class="form-row">
                    <div class="form-group">
                      <label>Password *</label>
                      <input 
                        type="password" 
                        v-model="currentUser.password" 
                        required 
                        placeholder="Enter password"
                      >
                    </div>
                    
                    <div class="form-group">
                      <label>Confirm Password *</label>
                      <input 
                        type="password" 
                        v-model="currentUser.confirmPassword" 
                        required 
                        placeholder="Confirm password"
                      >
                    </div>
                  </div>

                  <div class="form-actions">
                    <button type="button" @click="closeModal" class="btn secondary">
                      Cancel
                    </button>
                    <button type="submit" class="btn primary">
                      {{ showEditUserModal ? 'Update User' : 'Add User' }}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          <!-- Block User Modal -->
          <div v-if="showBlockModal" class="modal-overlay" @click="closeModal">
            <div class="modal block-modal" @click.stop>
              <div class="modal-header">
                <h3>Block User</h3>
                <button class="close-btn" @click="closeModal">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to block user "{{ userToBlock?.name }}"?</p>
                
                <div class="form-group">
                  <label>Block Reason *</label>
                  <textarea 
                    v-model="blockReason" 
                    placeholder="Enter reason for blocking this user"
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div class="form-group">
                  <label>Block Until (Optional)</label>
                  <input 
                    type="date" 
                    v-model="blockUntilDate"
                    :min="new Date().toISOString().split('T')[0]"
                    placeholder="Select end date for block"
                  >
                  <small>Leave empty for permanent block</small>
                </div>

                <div class="modal-actions">
                  <button @click="closeModal" class="btn secondary">Cancel</button>
                  <button @click="confirmBlock" class="btn danger">Block User</button>
                </div>
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
                <p>Are you sure you want to delete user "{{ userToDelete?.name }}"? This action cannot be undone and will permanently remove all user data.</p>
                <div class="modal-actions">
                  <button @click="closeModal" class="btn secondary">Cancel</button>
                  <button @click="deleteUser" class="btn danger">Delete User</button>
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
import axios from 'axios';
import authService from '../../services/auth';

export default {
  name: 'UserManagement',
  data() {
    return {
      // Auth state
      authChecked: false,
      authError: null,
      
      // Navbar Data
      showNotifications: false,
      showUserMenu: false,
      isDarkMode: false,
      admin: {
        name: '',
        email: '',
        avatar: '/images/admin-avatar.png'
      },
      notifications: [],

      // User Management Data
      searchQuery: '',
      statusFilter: 'all',
      sortBy: 'newest',
      currentPage: 1,
      itemsPerPage: 10,
      showUserDetailsModal: false,
      showAddUserModal: false,
      showEditUserModal: false,
      showBlockModal: false,
      showDeleteModal: false,
      selectedUser: null,
      userToDelete: null,
      userToBlock: null,
      blockReason: '',
      blockUntilDate: '',
      currentUser: this.getEmptyUser(),
      currentAdminId: '',
      users: [],
      loading: false,
      error: null
    }
  },
  computed: {
    notificationCount() {
      return this.notifications.length
    },
    filteredUsers() {
      let filtered = this.users;

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(user =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          (user.phone && user.phone.toLowerCase().includes(query))
        );
      }

      // Status filter
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(user => user.status === this.statusFilter);
      }

      // Sorting
      switch (this.sortBy) {
        case 'newest':
          filtered.sort((a, b) => new Date(b.joinDate) - new Date(a.joinDate));
          break;
        case 'oldest':
          filtered.sort((a, b) => new Date(a.joinDate) - new Date(b.joinDate));
          break;
        case 'name':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'orders':
          filtered.sort((a, b) => b.orders - a.orders);
          break;
      }

      // Pagination
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return filtered.slice(startIndex, startIndex + this.itemsPerPage);
    },
    totalUsers() {
      return this.users.length;
    },
    activeUsers() {
      return this.users.filter(user => user.status === 'active').length;
    },
    newUsers() {
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
      return this.users.filter(user => new Date(user.joinDate) > oneMonthAgo).length;
    },
    blockedUsers() {
      return this.users.filter(user => user.status === 'blocked').length;
    },
    totalPages() {
      return Math.ceil(this.users.length / this.itemsPerPage);
    }
  },
  async mounted() {
    console.log('🚀 UserManagement mounted - starting auth check');
    
    // Debug current auth state
    this.debugAuthState();
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('islaDarkMode');
    if (savedDarkMode) {
      this.isDarkMode = JSON.parse(savedDarkMode);
      this.applyDarkModeStyles();
    }

    // Add Font Awesome
    this.loadFontAwesome();
    document.addEventListener('click', this.handleClickOutside);
    
    // Check authentication
    await this.checkAuthentication();
    
    if (this.authChecked && !this.authError) {
      await this.fetchInitialData();
    }
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    // Debug method to check auth state
    debugAuthState() {
      console.log('🔍 AUTH DEBUG:');
      console.log('  - authService.isAuthenticated():', authService.isAuthenticated());
      console.log('  - authService.getUser():', authService.getUser());
      console.log('  - authService.getToken():', authService.getToken() ? 'Present' : 'Missing');
      
      // Check localStorage directly
      const token = localStorage.getItem('islaAccessToken');
      const admin = localStorage.getItem('islaAdmin');
      console.log('  - localStorage.islaAccessToken:', token ? `Present (${token.length} chars)` : 'Missing');
      console.log('  - localStorage.islaAdmin:', admin ? 'Present' : 'Missing');
      
      if (admin) {
        try {
          console.log('  - Parsed admin data:', JSON.parse(admin));
        } catch (e) {
          console.error('  - Error parsing admin data:', e);
        }
      }
    },

    // Check authentication using authService
    async checkAuthentication() {
      console.log('🔐 Checking authentication with authService...');
      
      if (!authService.isAuthenticated()) {
        this.authError = 'Not authenticated. Please login.';
        this.authChecked = true;
        console.error('❌ Authentication failed');
        
        this.showNotification('Please login to continue', 'error');
        setTimeout(() => {
          this.$router.push('/login');
        }, 1500);
        return false;
      }
      
      const user = authService.getUser();
      if (!user || user.role !== 'admin') {
        this.authError = 'Admin access required';
        this.authChecked = true;
        console.error('❌ Admin access required, user role:', user?.role);
        
        this.showNotification('Admin access required', 'error');
        setTimeout(() => {
          this.$router.push(user ? '/user/account' : '/login');
        }, 1500);
        return false;
      }
      
      // Set admin data
      this.admin = { ...user };
      this.currentAdminId = user.id;
      this.authChecked = true;
      
      console.log('✅ Authentication successful - Admin user:', user);
      return true;
    },

    async fetchInitialData() {
      if (!this.authChecked) {
        await this.checkAuthentication();
      }
      
      if (this.authError) {
        this.error = this.authError;
        this.loading = false;
        return;
      }

      this.loading = true;
      this.error = null;
      
      try {
        console.log('📦 Fetching users from database...');
        await this.fetchUsers();
        
        this.showNotification('User data loaded successfully', 'success');
      } catch (error) {
        console.error('Error fetching initial data:', error);
        this.error = this.getErrorMessage(error);
        this.showNotification(`Failed to load data: ${this.error}`, 'error');
      } finally {
        this.loading = false;
      }
    },

    async fetchUsers() {
      // Get token using authService
      const token = authService.getToken();
      console.log('🔐 Fetching users with token from authService:', token ? 'Available' : 'Missing');

      if (!token) {
        throw new Error('No authentication token found');
      }

      try {
        let response;

        // Use authService API instance (which automatically includes token)
        console.log('Using authService API instance');
        response = await authService.api.get('/api/admin/users');

        console.log('API Response:', response);

        if (response.data && response.data.success) {
          this.users = this.formatUserData(response.data.data);
          console.log(`✅ Successfully loaded ${this.users.length} users`);
        } else {
          throw new Error(response.data?.message || 'Invalid response format');
        }

      } catch (error) {
        console.error('❌ Error in fetchUsers:', error);
        
        if (error.response?.status === 401) {
          this.handleTokenExpired();
          throw new Error('Authentication failed');
        } else if (error.response) {
          console.error('Response error:', error.response.status, error.response.data);
          throw new Error(`Server error: ${error.response.status} - ${error.response.data.message || 'Unknown error'}`);
        } else if (error.request) {
          console.error('No response received:', error.request);
          throw new Error('Cannot connect to server. Please check if the server is running.');
        } else {
          throw new Error(error.message || 'Failed to fetch users');
        }
      }
    },

    formatUserData(users) {
      return users.map(user => ({
        id: user.id,
        name: user.name || 'No Name',
        email: user.email,
        phone: user.phone || 'Not provided',
        address: user.address || 'Not provided',
        avatar: user.avatar || '/images/default-avatar.png',
        status: user.status || 'active',
        orders: user.orders || user.order_count || 0,
        totalSpent: user.total_spent || user.totalSpent || 0,
        averageOrderValue: user.average_order_value || user.averageOrderValue || 0,
        lastOrder: user.last_order || user.lastOrder || 'Never',
        joinDate: user.join_date || user.created_at || new Date().toISOString(),
        isBlocked: user.is_blocked || user.status === 'blocked' || false,
        isNew: user.is_new || false,
        blockedUntil: user.blocked_until || null,
        blockReason: user.block_reason || '',
        preferences: user.preferences || {}
      }));
    },

    handleTokenExpired() {
      console.log('🔐 Token expired');
      authService.logout();
      this.showNotification('Session expired. Please login again.', 'error');
      setTimeout(() => {
        this.$router.push('/login');
      }, 2000);
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
        document.documentElement.style.setProperty('--isla-dark-hover', '#2a2a3a');
      } else {
        document.body.classList.remove('isla-global-dark-mode');
        document.documentElement.style.removeProperty('--isla-dark-bg');
        document.documentElement.style.removeProperty('--isla-dark-card');
        document.documentElement.style.removeProperty('--isla-dark-text');
        document.documentElement.style.removeProperty('--isla-dark-border');
        document.documentElement.style.removeProperty('--isla-dark-hover');
      }
    },

    // Image error handling
    handleImageError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMCAzNEMzMy4zMTM3IDM0IDM2IDMxLjMxMzcgMzYgMjhDMzYgMjQuNjg2MyAzMy4zMTM3IDIyIDMwIDIyQzI2LjY4NjMgMjIgMjQgMjQuNjg2MyAyNCAyOEMyNCAzMS4zMTM3IDI2LjY4NjMgMzQgMzAgMzRaIiBmaWxsPSIjODg1OTJFIi8+CjxwYXRoIGQ9Ik0zOCAzOEgyMkMyMC44OTU0IDM4IDIwIDM3LjEwNDYgMjAgMzZWMjJDMjAgMjAuODk1NCAyMC44OTU0IDIwIDIyIDIwSDM4QzM5LjEwNDYgMjAgNDAgMjAuODk1NCA0MCAyMlYzNkM0MCAzNy4xMDQ2IDM5LjEwNDYgMzggMzggMzhaTTIyIDIyVjM2SDM4VjIySDIyWiIgZmlsbD0iIzg4NTkyRSIvPgo8L3N2Zz4K';
    },
    
    handleAvatarError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGNUY1RjUiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSIyNCIgcj0iOCIgZmlsbD0iIzg4NTkyRSIvPgo8cGF0aCBkPSJNMTggNDhDMjEuMzEzNyA0OCAyNCA0NS4zMTM3IDI0IDQyQzI0IDM4LjY4NjMgMjEuMzEzNyAzNiAxOCAzNkMxNC42ODYzIDM2IDEyIDM4LjY4NjMgMTIgNDJDMTIgNDUuMzEzNyAxNC42ODYzIDQ4IDE4IDQ4WiIgZmlsbD0iIzg4NTkyRSIvPgo8L3N2Zz4K';
    },

    async refreshData() {
      await this.fetchInitialData();
    },

    // User methods
    async handleLogout() {
      authService.logout();
      this.$router.push('/login');
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
    
    // User Management Methods
    filterUsers() {
      this.currentPage = 1;
    },
    
    sortUsers() {
      // Sorting is handled in computed property
    },
    
    clearFilters() {
      this.searchQuery = '';
      this.statusFilter = 'all';
      this.sortBy = 'newest';
      this.currentPage = 1;
    },
    
    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    
    getUserStatusClass(user) {
      return `status-${user.status}`;
    },
    
    getStatusIcon(status) {
      switch (status) {
        case 'active': return 'fas fa-check-circle';
        case 'inactive': return 'fas fa-minus-circle';
        case 'blocked': return 'fas fa-ban';
        default: return 'fas fa-circle';
      }
    },
    
    formatDate(dateString) {
      if (!dateString || dateString === 'Never') return 'Never';
      
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      } catch (error) {
        return 'Invalid Date';
      }
    },
    
    getDaysAgo(dateString) {
      if (!dateString || dateString === 'Never') return 'Never';
      
      try {
        const joinDate = new Date(dateString);
        const today = new Date();
        const diffTime = Math.abs(today - joinDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        return `${diffDays} days ago`;
      } catch (error) {
        return 'Invalid Date';
      }
    },
    
    viewUserDetails(user) {
      this.selectedUser = { ...user };
      this.showUserDetailsModal = true;
    },
    
    editUser(user) {
      this.currentUser = { ...user };
      this.showEditUserModal = true;
    },
    
    async blockUser(user) {
      if (user.id === this.currentAdminId) {
        this.showNotification('Cannot block your own account', 'warning');
        return;
      }
      
      this.userToBlock = user;
      this.blockReason = '';
      this.blockUntilDate = '';
      this.showBlockModal = true;
    },
    
    async unblockUser(user) {
      if (user.id === this.currentAdminId) {
        this.showNotification('Cannot modify your own account status', 'warning');
        return;
      }
      
      try {
        const response = await authService.api.put(`/api/admin/users/${user.id}/unblock`, {});
        
        if (response.data.success) {
          user.status = 'active';
          user.isBlocked = false;
          user.blockedUntil = null;
          user.blockReason = '';
          this.showNotification(`User ${user.name} has been unblocked`, 'success');
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error unblocking user:', error);
        this.showNotification('Failed to unblock user', 'error');
      }
    },
    
    async confirmBlock() {
      if (!this.blockReason.trim()) {
        this.showNotification('Please provide a reason for blocking the user', 'error');
        return;
      }
      
      try {
        const response = await authService.api.put(`/api/admin/users/${this.userToBlock.id}/block`, {
          reason: this.blockReason,
          blocked_until: this.blockUntilDate || null
        });
        
        if (response.data.success) {
          this.userToBlock.status = 'blocked';
          this.userToBlock.isBlocked = true;
          this.userToBlock.blockReason = this.blockReason;
          this.userToBlock.blockedUntil = this.blockUntilDate || null;
          this.showNotification(`User ${this.userToBlock.name} has been blocked`, 'success');
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error blocking user:', error);
        this.showNotification('Failed to block user', 'error');
      }
      
      this.closeModal();
    },
    
    async updateUser(user) {
      try {
        await authService.api.put(`/api/admin/users/${user.id}`, user);
        this.showNotification(`User ${user.name} updated successfully`, 'success');
      } catch (error) {
        console.error('Error updating user:', error);
        this.showNotification('Failed to update user', 'error');
      }
    },
    
    confirmDelete(user) {
      if (user.id === this.currentAdminId) {
        this.showNotification('Cannot delete your own account', 'error');
        return;
      }
      
      this.userToDelete = user;
      this.showDeleteModal = true;
    },
    
    async deleteUser() {
      try {
        const response = await authService.api.delete(`/api/admin/users/${this.userToDelete.id}`);
        
        if (response.data.success) {
          const index = this.users.findIndex(u => u.id === this.userToDelete.id);
          if (index > -1) {
            this.users.splice(index, 1);
            this.showNotification(`User ${this.userToDelete.name} deleted successfully`, 'success');
          }
        } else {
          throw new Error(response.data.message);
        }
      } catch (error) {
        console.error('Error deleting user:', error);
        this.showNotification('Failed to delete user', 'error');
      }
      
      this.closeModal();
    },
    
    async saveUser() {
      try {
        if (this.showEditUserModal) {
          // Update existing user
          await this.updateUser(this.currentUser);
          const index = this.users.findIndex(u => u.id === this.currentUser.id);
          if (index > -1) {
            this.users[index] = { ...this.currentUser };
          }
        } else {
          // For now, we'll just show a message since we don't have create user endpoint
          this.showNotification('User creation feature coming soon', 'info');
        }
      } catch (error) {
        console.error('Error saving user:', error);
        this.showNotification('Failed to save user', 'error');
      }
      
      this.closeModal();
    },
    
    generateUserId() {
      return `user-${String(this.users.length + 1).padStart(3, '0')}`;
    },
    
    getEmptyUser() {
      return {
        id: null,
        name: '',
        email: '',
        phone: '',
        address: '',
        avatar: '/images/default-avatar.png',
        status: 'active',
        isBlocked: false,
        password: '',
        confirmPassword: '',
        blockedUntil: '',
        blockReason: ''
      };
    },
    
    closeModal() {
      this.showUserDetailsModal = false;
      this.showAddUserModal = false;
      this.showEditUserModal = false;
      this.showBlockModal = false;
      this.showDeleteModal = false;
      this.selectedUser = null;
      this.userToDelete = null;
      this.userToBlock = null;
      this.blockReason = '';
      this.blockUntilDate = '';
      this.currentUser = this.getEmptyUser();
    },
    
    async exportUserData() {
      try {
        const response = await authService.api.get('/api/admin/users/export/csv', {
          responseType: 'blob'
        });
        
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `users-${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
        
        this.showNotification('User data exported successfully', 'success');
      } catch (error) {
        console.error('Error exporting user data:', error);
        this.showNotification('Failed to export user data', 'error');
      }
    },
    
    getErrorMessage(error) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            return 'Authentication failed. Please login again.';
          case 403:
            return 'You do not have permission to access user data.';
          case 404:
            return 'API endpoint not found. Please check server configuration.';
          case 500:
            return 'Server error. Please try again later.';
          default:
            return `Server error: ${error.response.status}`;
        }
      } else if (error.request) {
        return 'Cannot connect to server. Please check your internet connection and ensure the server is running.';
      } else {
        return error.message || 'An unexpected error occurred';
      }
    },
    
    showNotification(message, type = 'info') {
      // Simple notification implementation
      const styles = {
        info: { background: '#88592e', color: 'white' },
        success: { background: '#4caf50', color: 'white' },
        error: { background: '#f44336', color: 'white' },
        warning: { background: '#ff9800', color: 'white' }
      };
      
      const notification = document.createElement('div');
      notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 12px 20px;
        border-radius: 4px;
        color: ${styles[type].color};
        background: ${styles[type].background};
        z-index: 10000;
        font-weight: 600;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      `;
      notification.textContent = message;
      
      document.body.appendChild(notification);
      
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 3000);
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
  background-color: var(--isla-dark-bg);
  color: var(--isla-dark-text);
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
  background: var(--isla-dark-card);
  border-bottom-color: var(--isla-dark-border);
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
  color: var(--isla-dark-text);
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
  color: var(--isla-dark-text);
}

.admin-nav-link:hover {
  color: #88592e;
  background-color: #ffffff;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
}

.admin-navbar.dark-mode .admin-nav-link:hover {
  color: var(--isla-dark-card);
  background-color: var(--isla-dark-text);
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
  background-color: rgba(255, 255, 255, 0.1);
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
  border-color: var(--isla-dark-text);
}

.admin-user-name {
  color: #ffffff;
  font-weight: 600;
  font-size: 13px;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-user-name {
  color: var(--isla-dark-text);
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
  background: var(--isla-dark-card);
  border-color: var(--isla-dark-border);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.5);
}

.admin-dropdown-header {
  padding: 15px;
  border-bottom: 2px solid #6b451e;
  background: #88592e;
  transition: all 0.3s ease;
}

.admin-navbar.dark-mode .admin-dropdown-header {
  background: var(--isla-dark-hover);
  border-bottom-color: var(--isla-dark-border);
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
  color: var(--isla-dark-text);
}

/* Notifications and Messages Lists */
.admin-notifications-list {
  max-height: 350px;
  overflow-y: auto;
  background: #ffffff;
  transition: all 0.3s ease;
}

.admin-navbar.dark-mode .admin-notifications-list {
  background: var(--isla-dark-card);
}

.admin-empty-notifications {
  text-align: center;
  color: #88592e;
  padding: 30px 15px;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-empty-notifications {
  color: var(--isla-dark-text);
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
  color: var(--isla-dark-text);
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
  border-bottom-color: var(--isla-dark-border);
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
  color: var(--isla-dark-text);
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
  color: var(--isla-dark-text);
}

.admin-notification-time {
  font-size: 11px;
  color: #999999;
  transition: color 0.3s ease;
}

.admin-navbar.dark-mode .admin-notification-time {
  color: var(--isla-dark-text);
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
  background: var(--isla-dark-hover);
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
  border-color: var(--isla-dark-text);
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
  color: var(--isla-dark-text);
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
  color: rgba(224, 224, 224, 0.8);
}

.admin-dropdown-divider {
  height: 1px;
  background: #88592e;
  margin: 0;
  transition: background 0.3s ease;
}

.admin-navbar.dark-mode .admin-dropdown-divider {
  background: var(--isla-dark-border);
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
  color: var(--isla-dark-text);
}

.admin-dropdown-item:hover {
  background: #88592e;
  color: #ffffff;
}

.admin-navbar.dark-mode .admin-dropdown-item:hover {
  background: var(--isla-dark-text);
  color: var(--isla-dark-card);
}

.admin-logout-btn {
  color: #e74c3c;
}

.admin-logout-btn:hover {
  color: #ffffff;
  background: #e74c3c;
}

.admin-navbar.dark-mode .admin-logout-btn:hover {
  color: var(--isla-dark-card);
  background: #e74c3c;
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
  border-color: var(--isla-dark-card);
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
  background: var(--isla-dark-card);
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
  color: var(--isla-dark-text);
}

.admin-sidebar-item:hover {
  background: #6b451e;
  color: #ffffff;
  border-left-color: #88592e;
}

.admin-sidebar.dark-mode .admin-sidebar-item:hover {
  background: var(--isla-dark-hover);
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
  color: var(--isla-dark-text);
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
  background: var(--isla-dark-bg);
}

/* User Management Content Styles */
.admin-user-management {
  padding: 0;
  background: transparent;
  min-height: auto;
}

.user-management-header {
  background: white;
  border-radius: 0.8rem;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 10px rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .user-management-header {
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
  color: var(--isla-dark-text);
}

.page-subtitle {
  color: #666;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
}

.admin-container.dark-mode .page-subtitle {
  color: var(--isla-dark-text);
}

.quick-actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
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

/* Loading State */
.loading-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #88592e;
}

.loading-state i {
  font-size: 2rem;
  margin-bottom: 1rem;
  display: block;
}

.loading-state p {
  margin: 0;
  font-size: 1rem;
}

/* Error State */
.error-state {
  text-align: center;
  padding: 3rem 1rem;
  color: #f44336;
  background: white;
  border-radius: 0.8rem;
  margin: 1rem 0;
}

.error-state i {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.error-state h3 {
  margin-bottom: 0.5rem;
  color: #f44336;
}

.error-state p {
  margin-bottom: 1.5rem;
  color: #666;
}

.retry-btn {
  background: #f44336;
  color: white;
  border: none;
  padding: 0.8rem 1.5rem;
  border-radius: 0.4rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin: 0 auto;
}

.retry-btn:hover {
  background: #d32f2f;
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.stat-card {
  background: white;
  border-radius: 0.6rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
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
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.stat-icon.total {
  background: #e3f2fd;
  color: #1976d2;
}

.stat-icon.active {
  background: #e8f5e8;
  color: #4caf50;
}

.stat-icon.new {
  background: #fff3e0;
  color: #ff9800;
}

.stat-icon.blocked {
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
  color: var(--isla-dark-text);
}

.user-controls {
  background: white;
  border-radius: 0.6rem;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
  box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .user-controls {
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

.search-box input {
  width: 100%;
  padding: 0.6rem 0.8rem 0.6rem 2.2rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.admin-container.dark-mode .search-box input {
  background: var(--isla-dark-hover);
  border-color: var(--isla-dark-border);
  color: var(--isla-dark-text);
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

.status-filter,
.sort-filter {
  padding: 0.6rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.4rem;
  background: white;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
  min-width: 130px;
}

.admin-container.dark-mode .status-filter,
.admin-container.dark-mode .sort-filter {
  background: var(--isla-dark-hover);
  border-color: var(--isla-dark-border);
  color: var(--isla-dark-text);
}

.status-filter:focus,
.sort-filter:focus {
  outline: none;
  border-color: #88592e;
}

.users-table-container {
  background: white;
  border-radius: 0.6rem;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
  margin-bottom: 1.5rem;
}

.admin-container.dark-mode .users-table-container {
  background: var(--isla-dark-card);
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: #88592e;
  color: white;
  padding: 0.8rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.users-table td {
  padding: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
}

.admin-container.dark-mode .users-table td {
  border-bottom-color: var(--isla-dark-border);
}

.users-table tr:last-child td {
  border-bottom: none;
}

.users-table tr:hover {
  background: #f8f5f2;
}

.admin-container.dark-mode .users-table tr:hover {
  background: var(--isla-dark-hover);
}

.status-active {
  background: #f8fff8;
}

.status-inactive {
  background: #fff8f0;
}

.status-blocked {
  background: #fff0f0;
}

.user-cell .user-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e0e0e0;
}

.user-details h4 {
  margin: 0 0 0.2rem 0;
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.admin-container.dark-mode .user-details h4 {
  color: var(--isla-dark-text);
}

.user-id {
  margin: 0 0 0.4rem 0;
  color: #666;
  font-size: 0.7rem;
}

.admin-container.dark-mode .user-id {
  color: var(--isla-dark-text);
}

.user-tags {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.tag {
  padding: 0.2rem 0.4rem;
  border-radius: 0.8rem;
  font-size: 0.6rem;
  font-weight: 600;
  text-transform: uppercase;
}

.tag.new {
  background: #fff3e0;
  color: #ff9800;
}

.tag.blocked {
  background: #ffebee;
  color: #f44336;
}

.contact-cell .contact-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.contact-info .email,
.contact-info .phone {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: #666;
}

.admin-container.dark-mode .contact-info .email,
.admin-container.dark-mode .contact-info .phone {
  color: var(--isla-dark-text);
}

.contact-info i {
  width: 14px;
  color: #88592e;
}

.status-cell .status-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.4rem 0.6rem;
  border-radius: 0.8rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;
  width: fit-content;
}

.status-badge.active {
  background: #e8f5e8;
  color: #4caf50;
}

.status-badge.inactive {
  background: #fff3e0;
  color: #ff9800;
}

.status-badge.blocked {
  background: #ffebee;
  color: #f44336;
}

.orders-cell .orders-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.orders-count {
  font-size: 1rem;
  font-weight: 700;
  color: #88592e;
}

.orders-amount {
  font-size: 0.7rem;
  color: #666;
}

.admin-container.dark-mode .orders-amount {
  color: var(--isla-dark-text);
}

.joined-cell .joined-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.join-date {
  font-weight: 600;
  color: #333;
  font-size: 0.8rem;
}

.admin-container.dark-mode .join-date {
  color: var(--isla-dark-text);
}

.join-days {
  font-size: 0.7rem;
  color: #666;
}

.admin-container.dark-mode .join-days {
  color: var(--isla-dark-text);
}

.actions-cell .action-buttons {
  display: flex;
  gap: 0.4rem;
}

.btn-icon {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 0.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.btn-icon.view {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-icon.view:hover {
  background: #1976d2;
  color: white;
}

.btn-icon.edit {
  background: #fff3e0;
  color: #ff9800;
}

.btn-icon.edit:hover {
  background: #ff9800;
  color: white;
}

.btn-icon.block {
  background: #fff3e0;
  color: #ff9800;
}

.btn-icon.block:hover {
  background: #ff9800;
  color: white;
}

.btn-icon.unblock {
  background: #e8f5e8;
  color: #4caf50;
}

.btn-icon.unblock:hover {
  background: #4caf50;
  color: white;
}

.btn-icon.delete {
  background: #ffebee;
  color: #f44336;
}

.btn-icon.delete:hover {
  background: #f44336;
  color: white;
}

.btn-icon.block:disabled,
.btn-icon.unblock:disabled,
.btn-icon.delete:disabled {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}

.empty-state {
  text-align: center;
  padding: 2rem 1rem;
  color: #666;
}

.empty-state i {
  font-size: 3rem;
  color: #e0e0e0;
  margin-bottom: 0.8rem;
  display: block;
}

.empty-state h3 {
  margin-bottom: 0.4rem;
  color: #5a5a5a;
  font-size: 1.2rem;
}

.admin-container.dark-mode .empty-state h3 {
  color: var(--isla-dark-text);
}

.empty-state p {
  margin-bottom: 1.2rem;
  color: #888;
}

.admin-container.dark-mode .empty-state p {
  color: var(--isla-dark-text);
}

.clear-filters-btn {
  background: #88592e;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.4rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
  font-size: 0.8rem;
}

.clear-filters-btn:hover {
  background: #6b451e;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.8rem;
  padding: 1rem;
  border-top: 1px solid #f0f0f0;
}

.admin-container.dark-mode .pagination {
  border-top-color: var(--isla-dark-border);
}

.pagination-btn {
  width: 35px;
  height: 35px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 0.3rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.admin-container.dark-mode .pagination-btn {
  background: var(--isla-dark-hover);
  border-color: var(--isla-dark-border);
  color: var(--isla-dark-text);
}

.pagination-btn:hover:not(:disabled) {
  background: #88592e;
  color: white;
  border-color: #88592e;
}

.pagination-btn:disabled {
  background: #f5f5f5;
  color: #ccc;
  cursor: not-allowed;
}

.page-info {
  color: #666;
  font-weight: 600;
  font-size: 0.8rem;
}

.admin-container.dark-mode .page-info {
  color: var(--isla-dark-text);
}

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
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: white;
  border-radius: 0.8rem;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.admin-container.dark-mode .modal {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f5f2;
}

.admin-container.dark-mode .modal-header {
  background: var(--isla-dark-hover);
  border-bottom-color: var(--isla-dark-border);
}

.modal-header h3 {
  margin: 0;
  color: #88592e;
  font-size: 1.2rem;
  font-weight: 600;
}

.admin-container.dark-mode .modal-header h3 {
  color: var(--isla-dark-text);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.1rem;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
  padding: 0.4rem;
}

.close-btn:hover {
  color: #333;
}

.admin-container.dark-mode .close-btn:hover {
  color: var(--isla-dark-text);
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
  flex: 1;
}

.user-profile .profile-header {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid #f0f0f0;
}

.admin-container.dark-mode .user-profile .profile-header {
  border-bottom-color: var(--isla-dark-border);
}

.profile-avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #88592e;
}

.profile-info h2 {
  margin: 0 0 0.4rem 0;
  color: #333;
  font-size: 1.5rem;
}

.admin-container.dark-mode .profile-info h2 {
  color: var(--isla-dark-text);
}

.user-email {
  margin: 0 0 0.8rem 0;
  color: #666;
  font-size: 1rem;
}

.admin-container.dark-mode .user-email {
  color: var(--isla-dark-text);
}

.profile-badges {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}

.badge {
  padding: 0.4rem 0.8rem;
  border-radius: 0.8rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;
}

.badge.active {
  background: #e8f5e8;
  color: #4caf50;
}

.badge.inactive {
  background: #fff3e0;
  color: #ff9800;
}

.badge.blocked {
  background: #ffebee;
  color: #f44336;
}

.badge.new {
  background: #e3f2fd;
  color: #1976d2;
}

.detail-section {
  margin-bottom: 1.5rem;
}

.detail-section h4 {
  margin: 0 0 0.8rem 0;
  color: #88592e;
  font-size: 1rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.4rem;
}

.admin-container.dark-mode .detail-section h4 {
  color: var(--isla-dark-text);
  border-bottom-color: var(--isla-dark-border);
}

.detail-grid {
  display: grid;
  gap: 0.8rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px solid #f8f8f8;
}

.admin-container.dark-mode .detail-item {
  border-bottom-color: var(--isla-dark-hover);
}

.detail-item label {
  font-weight: 600;
  color: #666;
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.9rem;
}

.admin-container.dark-mode .detail-item label {
  color: var(--isla-dark-text);
}

.detail-item span {
  color: #333;
  font-size: 0.9rem;
}

.admin-container.dark-mode .detail-item span {
  color: var(--isla-dark-text);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 0.8rem;
}

.stat-item {
  background: #f8f5f2;
  padding: 0.8rem;
  border-radius: 0.4rem;
  text-align: center;
}

.admin-container.dark-mode .stat-item {
  background: var(--isla-dark-hover);
}

.stat-value {
  font-size: 1.3rem;
  font-weight: 700;
  color: #88592e;
  margin-bottom: 0.2rem;
}

.admin-container.dark-mode .stat-value {
  color: var(--isla-dark-text);
}

.stat-label {
  font-size: 0.7rem;
  color: #666;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.admin-container.dark-mode .stat-label {
  color: var(--isla-dark-text);
}

.preferences {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.4rem 0;
}

.preference-label {
  font-weight: 600;
  color: #666;
  font-size: 0.9rem;
}

.admin-container.dark-mode .preference-label {
  color: var(--isla-dark-text);
}

.preference-value {
  color: #333;
  font-size: 0.9rem;
}

.admin-container.dark-mode .preference-value {
  color: var(--isla-dark-text);
}

.user-form {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.8rem;
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
  background: var(--isla-dark-hover);
  border-color: var(--isla-dark-border);
  color: var(--isla-dark-text);
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #88592e;
}

.form-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1.2rem;
  border-top: 1px solid #f0f0f0;
}

.admin-container.dark-mode .form-actions {
  border-top-color: var(--isla-dark-border);
}

.btn {
  padding: 0.6rem 1.2rem;
  border: none;
  border-radius: 0.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
}

.btn.primary {
  background: #88592e;
  color: white;
}

.btn.primary:hover {
  background: #6b451e;
}

.btn.secondary {
  background: #e0e0e0;
  color: #666;
}

.btn.secondary:hover {
  background: #d0d0d0;
}

.btn.danger {
  background: #f44336;
  color: white;
}

.btn.danger:hover {
  background: #d32f2f;
}

.block-modal,
.delete-modal {
  max-width: 500px;
}

.block-modal .form-group,
.delete-modal .form-group {
  margin-bottom: 1.2rem;
}

.block-modal small {
  color: #666;
  font-size: 0.7rem;
  margin-top: 0.2rem;
  display: block;
}

.admin-container.dark-mode .block-modal small {
  color: var(--isla-dark-text);
}

.delete-modal .modal-body {
  text-align: center;
}

.delete-modal p {
  margin-bottom: 1.5rem;
  color: #666;
  font-size: 1rem;
  line-height: 1.5;
}

.admin-container.dark-mode .delete-modal p {
  color: var(--isla-dark-text);
}

.modal-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-content {
    padding: 10px;
  }

  .user-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: auto;
  }

  .filter-controls {
    flex-direction: column;
  }

  .users-table {
    display: block;
    overflow-x: auto;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .modal-actions {
    flex-direction: column;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .admin-sidebar {
    width: 60px;
  }

  .admin-sidebar-item span {
    display: none;
  }

  .admin-sidebar-item {
    justify-content: center;
    padding: 12px;
  }

  .admin-nav-right {
    gap: 8px;
  }

  .admin-user-name {
    display: none;
  }

  .admin-dropdown-content {
    min-width: 250px;
    right: -10px;
  }

  .admin-nav-link {
    padding: 6px 8px;
    font-size: 12px;
  }

  .admin-toggle-item .admin-nav-link {
    width: auto;
    height: auto;
  }

  .admin-brand-name {
    font-size: 16px;
  }

  .admin-logo {
    height: 28px;
    margin-right: 6px;
  }
}

@media (max-width: 480px) {
  .quick-actions {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }

  .user-stats {
    grid-template-columns: 1fr;
  }

  .modal-overlay {
    padding: 0.5rem;
  }

  .modal-body {
    padding: 1rem;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .admin-nav-container {
    padding: 0 10px;
  }

  .admin-dropdown-content {
    min-width: 220px;
    right: -5px;
  }

  .admin-nav-link {
    padding: 5px 6px;
    font-size: 11px;
  }

  .admin-brand-name {
    font-size: 14px;
  }
}
</style>

<style>
/* Global Dark Mode Styles */
.isla-global-dark-mode {
  background-color: #0f0f14 !important;
  color: #e0e0e0 !important;
}

.isla-global-dark-mode .admin-dropdown-content {
  background: #1a1a24 !important;
  color: #e0e0e0 !important;
}

.isla-global-dark-mode .admin-notifications-list {
  background: #1a1a24 !important;
}
</style>