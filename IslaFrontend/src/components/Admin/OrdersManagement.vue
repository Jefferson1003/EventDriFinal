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
              <router-link to="/admin/adminaccount" class="admin-dropdown-item" @click="closeUserMenu">
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
        <!-- Orders Content -->
        <div class="admin-orders">
          <!-- Page Header -->
          <div class="orders-header">
            <h1 class="page-title">Orders Management</h1>
            <p class="page-subtitle">Manage and track customer orders</p>
            
            <!-- Quick Actions -->
            <div class="quick-actions">
              <button class="action-btn primary" @click="refreshOrders">
                <i class="fas fa-sync-alt"></i> Refresh
              </button>
              <button class="action-btn secondary" @click="exportOrders">
                <i class="fas fa-download"></i> Export CSV
              </button>
              <button class="action-btn secondary" @click="showPendingOnly = !showPendingOnly">
                <i class="fas fa-clock"></i> 
                {{ showPendingOnly ? 'Show All' : 'Pending Only' }}
              </button>
            </div>
          </div>

          <!-- Orders Stats -->
          <div class="orders-stats">
            <div class="stat-card">
              <div class="stat-icon total">
                <i class="fas fa-shopping-cart"></i>
              </div>
              <div class="stat-info">
                <h3>{{ totalOrders }}</h3>
                <p>Total Orders</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon pending">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-info">
                <h3>{{ pendingOrders }}</h3>
                <p>Pending</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon processing">
                <i class="fas fa-cog"></i>
              </div>
              <div class="stat-info">
                <h3>{{ processingOrders }}</h3>
                <p>Processing</p>
              </div>
            </div>
            
            <div class="stat-card">
              <div class="stat-icon completed">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-info">
                <h3>{{ completedOrders }}</h3>
                <p>Completed</p>
              </div>
            </div>
          </div>

          <!-- Search and Filters -->
          <div class="orders-controls">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search orders..." 
                v-model="searchQuery"
                @input="filterOrders"
              >
            </div>
            
            <div class="filter-controls">
              <select v-model="statusFilter" @change="filterOrders" class="status-filter">
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready for Pickup</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <select v-model="timeFilter" @change="filterOrders" class="time-filter">
                <option value="all">All Time</option>
                <option value="today">Today</option>
                <option value="week">This Week</option>
                <option value="month">This Month</option>
              </select>

              <input 
                type="date" 
                v-model="dateFilter"
                @change="filterOrders"
                class="date-filter"
                placeholder="Select date"
              >
            </div>
          </div>

          <!-- Orders Table -->
          <div class="orders-table-container">
            <table class="orders-table">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Order Time</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="order in filteredOrders" :key="order.id" :class="`status-${order.status}`">
                  <td class="order-id-cell">
                    <strong>#{{ order.id }}</strong>
                  </td>
                  <td class="customer-cell">
                    <div class="customer-info">
                      <div class="customer-avatar">
                        <i class="fas fa-user"></i>
                      </div>
                      <div class="customer-details">
                        <h4>{{ order.customerName }}</h4>
                        <p class="customer-contact">{{ order.customerPhone || order.customerEmail }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="items-cell">
                    <div class="items-list">
                      <div v-for="item in order.items.slice(0, 2)" :key="item.id" class="item-preview">
                        <span class="item-name">{{ item.name }}</span>
                        <span class="item-quantity">x{{ item.quantity }}</span>
                      </div>
                      <div v-if="order.items.length > 2" class="more-items">
                        +{{ order.items.length - 2 }} more items
                      </div>
                    </div>
                  </td>
                  <td class="total-cell">
                    <strong>₱{{ order.totalAmount }}</strong>
                  </td>
                  <td class="status-cell">
                    <span class="status-badge" :class="order.status">
                      {{ getStatusText(order.status) }}
                    </span>
                  </td>
                  <td class="time-cell">
                    <div class="order-time">
                      <div class="order-date">{{ formatDate(order.orderTime) }}</div>
                      <div class="order-time-small">{{ formatTime(order.orderTime) }}</div>
                    </div>
                  </td>
                  <td class="actions-cell">
                    <div class="action-buttons">
                      <button class="btn-icon view" @click="viewOrder(order)" title="View Details">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        v-if="order.status === 'pending'" 
                        class="btn-icon confirm" 
                        @click="updateOrderStatus(order, 'confirmed')"
                        title="Confirm Order"
                      >
                        <i class="fas fa-check"></i>
                      </button>
                      <button 
                        v-if="order.status === 'confirmed'" 
                        class="btn-icon prepare" 
                        @click="updateOrderStatus(order, 'preparing')"
                        title="Start Preparing"
                      >
                        <i class="fas fa-utensils"></i>
                      </button>
                      <button 
                        v-if="order.status === 'preparing'" 
                        class="btn-icon ready" 
                        @click="updateOrderStatus(order, 'ready')"
                        title="Mark as Ready"
                      >
                        <i class="fas fa-box"></i>
                      </button>
                      <button 
                        v-if="order.status === 'ready'" 
                        class="btn-icon complete" 
                        @click="updateOrderStatus(order, 'completed')"
                        title="Complete Order"
                      >
                        <i class="fas fa-flag-checkered"></i>
                      </button>
                      <button 
                        v-if="['pending', 'confirmed', 'preparing'].includes(order.status)" 
                        class="btn-icon cancel" 
                        @click="confirmCancel(order)"
                        title="Cancel Order"
                      >
                        <i class="fas fa-times"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>

            <!-- Empty State -->
            <div v-if="filteredOrders.length === 0" class="empty-state">
              <i class="fas fa-shopping-cart"></i>
              <h3>No orders found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button @click="clearFilters" class="clear-filters-btn">
                Clear Filters
              </button>
            </div>
          </div>

          <!-- Order Details Modal -->
          <div v-if="showOrderModal" class="modal-overlay" @click="closeModal">
            <div class="modal order-modal" @click.stop>
              <div class="modal-header">
                <h3>Order Details - #{{ selectedOrder?.id }}</h3>
                <button class="close-btn" @click="closeModal">
                  <i class="fas fa-times"></i>
                </button>
              </div>
              
              <div class="modal-body">
                <div v-if="selectedOrder" class="order-details">
                  <!-- Order Summary -->
                  <div class="order-summary">
                    <div class="summary-row">
                      <div class="summary-item">
                        <label>Customer Name:</label>
                        <span>{{ selectedOrder.customerName }}</span>
                      </div>
                      <div class="summary-item">
                        <label>Order Time:</label>
                        <span>{{ formatDateTime(selectedOrder.orderTime) }}</span>
                      </div>
                    </div>
                    <div class="summary-row">
                      <div class="summary-item">
                        <label>Contact:</label>
                        <span>{{ selectedOrder.customerPhone || selectedOrder.customerEmail }}</span>
                      </div>
                      <div class="summary-item">
                        <label>Status:</label>
                        <span class="status-badge" :class="selectedOrder.status">
                          {{ getStatusText(selectedOrder.status) }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <!-- Order Items -->
                  <div class="order-items-section">
                    <h4>Order Items</h4>
                    <div class="order-items-list">
                      <div v-for="item in selectedOrder.items" :key="item.id" class="order-item">
                        <div class="item-image">
                          <img :src="item.image" :alt="item.name" @error="handleProductImageError">
                        </div>
                        <div class="item-details">
                          <h5>{{ item.name }}</h5>
                          <p class="item-customization" v-if="item.customizations">
                            {{ formatCustomizations(item.customizations) }}
                          </p>
                          <div class="item-price">
                            ₱{{ item.price }} x {{ item.quantity }}
                          </div>
                        </div>
                        <div class="item-total">
                          ₱{{ (item.price * item.quantity).toFixed(2) }}
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Order Total -->
                  <div class="order-total-section">
                    <div class="total-row">
                      <span>Subtotal:</span>
                      <span>₱{{ selectedOrder.subtotal }}</span>
                    </div>
                    <div class="total-row" v-if="selectedOrder.discount > 0">
                      <span>Discount:</span>
                      <span>-₱{{ selectedOrder.discount }}</span>
                    </div>
                    <div class="total-row">
                      <span>Service Charge:</span>
                      <span>₱{{ selectedOrder.serviceCharge }}</span>
                    </div>
                    <div class="total-row grand-total">
                      <span>Total Amount:</span>
                      <span>₱{{ selectedOrder.totalAmount }}</span>
                    </div>
                  </div>

                  <!-- Order Actions -->
                  <div class="order-actions" v-if="!['completed', 'cancelled'].includes(selectedOrder.status)">
                    <h4>Update Status</h4>
                    <div class="status-actions">
                      <button 
                        v-if="selectedOrder.status === 'pending'" 
                        class="btn primary" 
                        @click="updateOrderStatus(selectedOrder, 'confirmed')"
                      >
                        Confirm Order
                      </button>
                      <button 
                        v-if="selectedOrder.status === 'confirmed'" 
                        class="btn primary" 
                        @click="updateOrderStatus(selectedOrder, 'preparing')"
                      >
                        Start Preparing
                      </button>
                      <button 
                        v-if="selectedOrder.status === 'preparing'" 
                        class="btn primary" 
                        @click="updateOrderStatus(selectedOrder, 'ready')"
                      >
                        Mark as Ready
                      </button>
                      <button 
                        v-if="selectedOrder.status === 'ready'" 
                        class="btn primary" 
                        @click="updateOrderStatus(selectedOrder, 'completed')"
                      >
                        Complete Order
                      </button>
                      <button 
                        v-if="!['completed', 'cancelled'].includes(selectedOrder.status)" 
                        class="btn danger" 
                        @click="confirmCancel(selectedOrder)"
                      >
                        Cancel Order
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Cancel Confirmation Modal -->
          <div v-if="showCancelModal" class="modal-overlay" @click="closeModal">
            <div class="modal cancel-modal" @click.stop>
              <div class="modal-header">
                <h3>Confirm Cancellation</h3>
              </div>
              <div class="modal-body">
                <p>Are you sure you want to cancel order #{{ orderToCancel?.id }}? This action cannot be undone.</p>
                <div class="cancel-reason" v-if="orderToCancel">
                  <label>Reason for cancellation:</label>
                  <textarea v-model="cancelReason" placeholder="Enter reason for cancellation..." rows="3"></textarea>
                </div>
                <div class="modal-actions">
                  <button @click="closeModal" class="btn secondary">Keep Order</button>
                  <button @click="cancelOrder" class="btn danger">Cancel Order</button>
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
export default {
  name: 'OrdersManagement',
  data() {
    return {
      // Navigation Data
      showNotifications: false,
      showUserMenu: false,
      isDarkMode: false,
      admin: {
        name: 'Admin User',
        email: 'admin@islacafe.com',
        avatar: '/images/admin-avatar.png'
      },
      notifications: [],

      // Orders Data
      searchQuery: '',
      statusFilter: 'all',
      timeFilter: 'all',
      dateFilter: '',
      showPendingOnly: false,
      showOrderModal: false,
      showCancelModal: false,
      selectedOrder: null,
      orderToCancel: null,
      cancelReason: '',
      orders: []
    }
  },
  computed: {
    notificationCount() {
      return this.notifications.length
    },
    filteredOrders() {
      let filtered = this.orders;

      // Search filter
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(order =>
          order.id.toString().includes(query) ||
          order.customerName.toLowerCase().includes(query) ||
          order.customerPhone?.includes(query) ||
          order.customerEmail?.toLowerCase().includes(query)
        );
      }

      // Status filter
      if (this.statusFilter !== 'all') {
        filtered = filtered.filter(order => order.status === this.statusFilter);
      }

      // Time filter
      if (this.timeFilter !== 'all') {
        const now = new Date();
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.orderTime);
          switch (this.timeFilter) {
            case 'today':
              return orderDate.toDateString() === now.toDateString();
            case 'week':
              const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
              return orderDate >= startOfWeek;
            case 'month':
              return orderDate.getMonth() === now.getMonth() && orderDate.getFullYear() === now.getFullYear();
            default:
              return true;
          }
        });
      }

      // Date filter
      if (this.dateFilter) {
        filtered = filtered.filter(order => {
          const orderDate = new Date(order.orderTime).toISOString().split('T')[0];
          return orderDate === this.dateFilter;
        });
      }

      // Pending only filter
      if (this.showPendingOnly) {
        filtered = filtered.filter(order => order.status === 'pending');
      }

      return filtered;
    },
    totalOrders() {
      return this.orders.length;
    },
    pendingOrders() {
      return this.orders.filter(order => order.status === 'pending').length;
    },
    processingOrders() {
      return this.orders.filter(order => ['confirmed', 'preparing', 'ready'].includes(order.status)).length;
    },
    completedOrders() {
      return this.orders.filter(order => order.status === 'completed').length;
    }
  },
  mounted() {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('islaDarkMode');
    if (savedDarkMode) {
      this.isDarkMode = JSON.parse(savedDarkMode);
      this.applyDarkModeStyles();
    }

    // Load Font Awesome if not already loaded
    this.loadFontAwesome();

    // Add click outside listener
    document.addEventListener('click', this.handleClickOutside);

    // Load orders data
    this.loadOrders();
  },
  beforeUnmount() {
    // Remove event listener when component is destroyed
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
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
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMCAzNEMzMy4zMTM3IDM0IDM2IDMxLjMxMzcgMzYgMjhDMzYgMjQuNjg2MyAzMy4zMTM3IDIyIDMwIDIyQzI2LjY4NjMgMjIgMjQgMjQuNjg2MyAyNCAyOEMyNCAzMS4zMTM3IDI2LjY4NjMgMzQgMzAgMzRaIiBmaWxsPSIjODg1OTJFIi8+CjxwYXRoIGQ9Ik0zOCAzOEgyMkMyMC44OTU0IDM4IDIwIDM3LjEwNDYgMjAgMzZWMjJDMjAgMjAuODk1NCAyMC44OTU0IDIwIDIyIDIwSDM4QzM5LjEwNDYgMjAgNDAgMjAuODk1NCA0MCAyMlYzNkM0MCAzNy4xMDQ2IDM5LjEwNDYgMzggMzggMzhaTTIyIDIyVjM2SDM4VjIySDIyWiIgZmlsbD0iIzg4NTkyRSIvPgo8L3N2Zz4K';
    },
    
    handleAvatarError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMzAiIGN5PSIzMCIgcj0iMzAiIGZpbGw9IiNGNUY1RjUiLz4KPGNpcmNsZSBjeD0iMzAiIGN5PSIyNCIgcj0iOCIgZmlsbD0iIzg4NTkyRSIvPgo8cGF0aCBkPSJNMTggNDhDMjEuMzEzNyA0OCAyNCA0NS4zMTM3IDI0IDQyQzI0IDM4LjY4NjMgMjEuMzEzNyAzNiAxOCAzNkMxNC42ODYzIDM2IDEyIDM4LjY4NjMgMTIgNDJDMTIgNDUuMzEzNyAxNC42ODYzIDQ4IDE4IDQ4WiIgZmlsbD0iIzg4NTkyRSIvPgo8L3N2Zz4K';
    },

    handleProductImageError(event) {
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0yNSAzMEMyOC4zMTM3IDMwIDMxIDI3LjMxMzcgMzEgMjRDMzEgMjAuNjg2MyAyOC4zMTM3IDE4IDI1IDE4QzIxLjY4NjMgMTggMTkgMjAuNjg2MyAxOSAyNEMxOSAyNy4zMTM3IDIxLjY4NjMgMzAgMjUgMzBaIiBmaWxsPSIjODg1OTJFIi8+CjxwYXRoIGQ9Ik0zMiAzNEgxOEMxNi44OTU0IDM0IDE2IDMzLjEwNDYgMTYgMzJWMTlDMTYgMTcuODk1NCAxNi44OTU0IDE3IDE4IDE3SDMyQzMzLjEwNDYgMTcgMzQgMTcuODk1NCAzNCAxOVYzMkMzNCAzMy4xMDQ2IDMzLjEwNDYgMzQgMzIgMzRaTTE4IDE5VjMySDMyVjE5SDE4WiIgZmlsbD0iIzg4NTkyRSIvPgo8L3N2Zz4K';
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

    // Orders Methods
    async loadOrders() {
      try {
        // Simulate API call to load orders
        // In a real application, this would be an API call
        const response = await this.$api.get('/admin/orders');
        this.orders = response.data.orders;
      } catch (error) {
        console.error('Error loading orders:', error);
        this.showNotification('Failed to load orders', 'error');
      }
    },

    filterOrders() {
      // Filtering is handled in computed property
    },

    clearFilters() {
      this.searchQuery = '';
      this.statusFilter = 'all';
      this.timeFilter = 'all';
      this.dateFilter = '';
      this.showPendingOnly = false;
    },

    refreshOrders() {
      this.loadOrders();
      this.showNotification('Orders refreshed', 'success');
    },

    viewOrder(order) {
      this.selectedOrder = order;
      this.showOrderModal = true;
    },

    async updateOrderStatus(order, newStatus) {
      try {
        // Simulate API call to update order status
        const response = await this.$api.put(`/admin/orders/${order.id}/status`, {
          status: newStatus
        });

        // Update local order status
        order.status = newStatus;
        
        this.showNotification(`Order #${order.id} status updated to ${this.getStatusText(newStatus)}`, 'success');
        
        // Close modal if open
        if (this.showOrderModal) {
          this.closeModal();
        }
      } catch (error) {
        console.error('Error updating order status:', error);
        this.showNotification('Failed to update order status', 'error');
      }
    },

    confirmCancel(order) {
      this.orderToCancel = order;
      this.cancelReason = '';
      this.showCancelModal = true;
    },

    async cancelOrder() {
      if (!this.orderToCancel) return;

      try {
        // Simulate API call to cancel order
        const response = await this.$api.put(`/admin/orders/${this.orderToCancel.id}/cancel`, {
          reason: this.cancelReason
        });

        // Update local order status
        this.orderToCancel.status = 'cancelled';
        
        this.showNotification(`Order #${this.orderToCancel.id} has been cancelled`, 'success');
        this.closeModal();
      } catch (error) {
        console.error('Error cancelling order:', error);
        this.showNotification('Failed to cancel order', 'error');
      }
    },

    getStatusText(status) {
      const statusMap = {
        'pending': 'Pending',
        'confirmed': 'Confirmed',
        'preparing': 'Preparing',
        'ready': 'Ready for Pickup',
        'completed': 'Completed',
        'cancelled': 'Cancelled'
      };
      return statusMap[status] || status;
    },

    formatDate(dateString) {
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },

    formatTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },

    formatDateTime(dateString) {
      const date = new Date(dateString);
      return date.toLocaleString();
    },

    formatCustomizations(customizations) {
      if (!customizations || customizations.length === 0) return '';
      return customizations.map(c => `${c.name} (+₱${c.price})`).join(', ');
    },

    exportOrders() {
      // Simple CSV export implementation
      const headers = ['Order ID', 'Customer', 'Items Count', 'Total Amount', 'Status', 'Order Time'];
      const csvData = this.filteredOrders.map(order => [
        order.id,
        order.customerName,
        order.items.length,
        order.totalAmount,
        this.getStatusText(order.status),
        this.formatDateTime(order.orderTime)
      ]);
      
      const csvContent = [headers, ...csvData]
        .map(row => row.map(cell => `"${cell}"`).join(','))
        .join('\n');
      
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `orders_${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      this.showNotification('Orders exported successfully', 'success');
    },

    closeModal() {
      this.showOrderModal = false;
      this.showCancelModal = false;
      this.selectedOrder = null;
      this.orderToCancel = null;
      this.cancelReason = '';
    },

    showNotification(message, type = 'info') {
      // In a real application, you might use a toast notification library
      console.log(`${type.toUpperCase()}: ${message}`);
      // For demo purposes, we'll use alert
      alert(`${type.toUpperCase()}: ${message}`);
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

/* Orders Specific Styles */
.admin-orders {
  padding: 0;
  background: transparent;
  min-height: auto;
}

/* Orders Header */
.orders-header {
  background: white;
  border-radius: 0.8rem;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 10px rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .orders-header {
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

/* Orders Stats */
.orders-stats {
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

.stat-icon.pending {
  background: #fff3e0;
  color: #ff9800;
}

.stat-icon.processing {
  background: #e8eaf6;
  color: #3f51b5;
}

.stat-icon.completed {
  background: #e8f5e8;
  color: #4caf50;
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

/* Orders Controls */
.orders-controls {
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

.admin-container.dark-mode .orders-controls {
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

.status-filter,
.time-filter {
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

.admin-container.dark-mode .status-filter,
.admin-container.dark-mode .time-filter {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
  border-color: var(--isla-dark-border);
}

.date-filter {
  padding: 0.6rem 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.4rem;
  background: white;
  color: #333;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
  min-width: 140px;
}

.admin-container.dark-mode .date-filter {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
  border-color: var(--isla-dark-border);
}

.status-filter:focus,
.time-filter:focus,
.date-filter:focus {
  outline: none;
  border-color: #88592e;
}

/* Orders Table */
.orders-table-container {
  background: white;
  border-radius: 0.8rem;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .orders-table-container {
  background: var(--isla-dark-card);
}

.orders-table {
  width: 100%;
  border-collapse: collapse;
}

.orders-table th {
  background: #88592e;
  color: white;
  padding: 0.8rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.orders-table td {
  padding: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
}

.admin-container.dark-mode .orders-table td {
  border-bottom-color: var(--isla-dark-border);
}

.orders-table tr:last-child td {
  border-bottom: none;
}

.orders-table tr:hover {
  background: #f8f5f2;
}

.admin-container.dark-mode .orders-table tr:hover {
  background: var(--isla-dark-hover);
}

/* Status row colors */
.status-pending {
  background: #fff8f0;
}

.status-confirmed {
  background: #f0f8ff;
}

.status-preparing {
  background: #f0f0ff;
}

.status-ready {
  background: #f0fff0;
}

.status-completed {
  background: #f8fff8;
}

.status-cancelled {
  background: #fff0f0;
}

.admin-container.dark-mode .status-pending {
  background: #2a2a1a;
}

.admin-container.dark-mode .status-confirmed {
  background: #1a1a2a;
}

.admin-container.dark-mode .status-preparing {
  background: #1a1a2a;
}

.admin-container.dark-mode .status-ready {
  background: #1a2a1a;
}

.admin-container.dark-mode .status-completed {
  background: #1a2a1a;
}

.admin-container.dark-mode .status-cancelled {
  background: #2a1a1a;
}

/* Table Cells */
.order-id-cell {
  font-weight: 600;
  color: #88592e;
}

.admin-container.dark-mode .order-id-cell {
  color: var(--isla-dark-text);
}

.customer-cell .customer-info {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.customer-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: #88592e;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.8rem;
}

.customer-details h4 {
  margin: 0 0 0.2rem 0;
  color: #333;
  font-weight: 600;
  font-size: 0.9rem;
}

.admin-container.dark-mode .customer-details h4 {
  color: var(--isla-dark-text);
}

.customer-contact {
  margin: 0;
  color: #666;
  font-size: 0.7rem;
}

.admin-container.dark-mode .customer-contact {
  color: #a0a5c0;
}

.items-cell .items-list {
  max-width: 200px;
}

.item-preview {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.2rem;
  font-size: 0.8rem;
}

.item-name {
  color: #333;
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.admin-container.dark-mode .item-name {
  color: var(--isla-dark-text);
}

.item-quantity {
  color: #666;
  font-weight: 600;
  margin-left: 0.5rem;
}

.admin-container.dark-mode .item-quantity {
  color: #a0a5c0;
}

.more-items {
  color: #88592e;
  font-size: 0.7rem;
  font-style: italic;
  margin-top: 0.2rem;
}

.total-cell {
  font-weight: 700;
  color: #88592e;
  font-size: 0.9rem;
}

.admin-container.dark-mode .total-cell {
  color: var(--isla-dark-text);
}

.status-cell .status-badge {
  padding: 0.4rem 0.8rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.pending {
  background: #fff3e0;
  color: #ef6c00;
}

.status-badge.confirmed {
  background: #e3f2fd;
  color: #1976d2;
}

.status-badge.preparing {
  background: #e8eaf6;
  color: #3f51b5;
}

.status-badge.ready {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.completed {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.cancelled {
  background: #ffebee;
  color: #c62828;
}

.admin-container.dark-mode .status-badge.pending {
  background: #e65100;
  color: #ffcc80;
}

.admin-container.dark-mode .status-badge.confirmed {
  background: #0d47a1;
  color: #bbdefb;
}

.admin-container.dark-mode .status-badge.preparing {
  background: #1a237e;
  color: #c5cae9;
}

.admin-container.dark-mode .status-badge.ready {
  background: #1b5e20;
  color: #a5d6a7;
}

.admin-container.dark-mode .status-badge.completed {
  background: #1b5e20;
  color: #a5d6a7;
}

.admin-container.dark-mode .status-badge.cancelled {
  background: #b71c1c;
  color: #ef9a9a;
}

.time-cell .order-time {
  font-size: 0.8rem;
}

.order-date {
  color: #333;
  font-weight: 600;
  margin-bottom: 0.1rem;
}

.admin-container.dark-mode .order-date {
  color: var(--isla-dark-text);
}

.order-time-small {
  color: #666;
  font-size: 0.7rem;
}

.admin-container.dark-mode .order-time-small {
  color: #a0a5c0;
}

.actions-cell .action-buttons {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
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

.btn-icon.view {
  background: #e3f2fd;
  color: #1976d2;
}

.btn-icon.view:hover {
  background: #1976d2;
  color: white;
}

.btn-icon.confirm {
  background: #e8f5e8;
  color: #2e7d32;
}

.btn-icon.confirm:hover {
  background: #2e7d32;
  color: white;
}

.btn-icon.prepare {
  background: #e8eaf6;
  color: #3f51b5;
}

.btn-icon.prepare:hover {
  background: #3f51b5;
  color: white;
}

.btn-icon.ready {
  background: #fff3e0;
  color: #ef6c00;
}

.btn-icon.ready:hover {
  background: #ef6c00;
  color: white;
}

.btn-icon.complete {
  background: #e8f5e8;
  color: #2e7d32;
}

.btn-icon.complete:hover {
  background: #2e7d32;
  color: white;
}

.btn-icon.cancel {
  background: #ffebee;
  color: #e74c3c;
}

.btn-icon.cancel:hover {
  background: #e74c3c;
  color: white;
}

.admin-container.dark-mode .btn-icon.view {
  background: #0d47a1;
  color: #bbdefb;
}

.admin-container.dark-mode .btn-icon.confirm {
  background: #1b5e20;
  color: #a5d6a7;
}

.admin-container.dark-mode .btn-icon.prepare {
  background: #1a237e;
  color: #c5cae9;
}

.admin-container.dark-mode .btn-icon.ready {
  background: #e65100;
  color: #ffcc80;
}

.admin-container.dark-mode .btn-icon.complete {
  background: #1b5e20;
  color: #a5d6a7;
}

.admin-container.dark-mode .btn-icon.cancel {
  background: #b71c1c;
  color: #ffcdd2;
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

/* Order Details Modal */
.order-modal {
  max-width: 700px;
}

.order-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.order-summary {
  background: #f8f5f2;
  border-radius: 0.6rem;
  padding: 1rem;
}

.admin-container.dark-mode .order-summary {
  background: var(--isla-dark-hover);
}

.summary-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 0.8rem;
}

.summary-row:last-child {
  margin-bottom: 0;
}

.summary-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.summary-item label {
  font-weight: 600;
  color: #666;
  font-size: 0.8rem;
}

.admin-container.dark-mode .summary-item label {
  color: #a0a5c0;
}

.summary-item span {
  color: #333;
  font-size: 0.9rem;
}

.admin-container.dark-mode .summary-item span {
  color: var(--isla-dark-text);
}

.order-items-section h4,
.order-actions h4 {
  margin-bottom: 1rem;
  color: #88592e;
  font-size: 1.1rem;
}

.admin-container.dark-mode .order-items-section h4,
.admin-container.dark-mode .order-actions h4 {
  color: var(--isla-dark-text);
}

.order-items-list {
  border: 1px solid #e0e0e0;
  border-radius: 0.6rem;
  overflow: hidden;
}

.admin-container.dark-mode .order-items-list {
  border-color: var(--isla-dark-border);
}

.order-item {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #e0e0e0;
  gap: 1rem;
}

.admin-container.dark-mode .order-item {
  border-bottom-color: var(--isla-dark-border);
}

.order-item:last-child {
  border-bottom: none;
}

.item-image {
  width: 50px;
  height: 50px;
  border-radius: 0.4rem;
  overflow: hidden;
  flex-shrink: 0;
}

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-details {
  flex: 1;
}

.item-details h5 {
  margin: 0 0 0.4rem 0;
  color: #333;
  font-size: 0.9rem;
}

.admin-container.dark-mode .item-details h5 {
  color: var(--isla-dark-text);
}

.item-customization {
  margin: 0 0 0.4rem 0;
  color: #666;
  font-size: 0.7rem;
  font-style: italic;
}

.admin-container.dark-mode .item-customization {
  color: #a0a5c0;
}

.item-price {
  color: #88592e;
  font-weight: 600;
  font-size: 0.8rem;
}

.item-total {
  font-weight: 700;
  color: #333;
  font-size: 0.9rem;
}

.admin-container.dark-mode .item-total {
  color: var(--isla-dark-text);
}

.order-total-section {
  border-top: 2px solid #e0e0e0;
  padding-top: 1rem;
}

.admin-container.dark-mode .order-total-section {
  border-top-color: var(--isla-dark-border);
}

.total-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
}

.total-row.grand-total {
  font-weight: 700;
  font-size: 1.1rem;
  color: #88592e;
  border-top: 1px solid #e0e0e0;
  padding-top: 0.5rem;
  margin-top: 0.5rem;
}

.admin-container.dark-mode .total-row.grand-total {
  color: var(--isla-dark-text);
  border-top-color: var(--isla-dark-border);
}

.order-actions .status-actions {
  display: flex;
  gap: 0.8rem;
  flex-wrap: wrap;
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

.btn.primary:hover {
  background: #6b451e;
}

.btn.secondary {
  background: #d4b896;
  color: #5a3921;
}

.btn.secondary:hover {
  background: #c4a57c;
}

.btn.danger {
  background: #e74c3c;
  color: white;
}

.btn.danger:hover {
  background: #c0392b;
}

.admin-container.dark-mode .btn.secondary {
  background: #8d6e63;
  color: #ffffff;
}

/* Cancel Modal */
.cancel-modal {
  max-width: 500px;
}

.cancel-reason {
  margin: 1rem 0;
}

.cancel-reason label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #333;
}

.admin-container.dark-mode .cancel-reason label {
  color: var(--isla-dark-text);
}

.cancel-reason textarea {
  width: 100%;
  padding: 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  resize: vertical;
  min-height: 80px;
}

.admin-container.dark-mode .cancel-reason textarea {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
  border-color: var(--isla-dark-border);
}

.cancel-reason textarea:focus {
  outline: none;
  border-color: #88592e;
}

.modal-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
}

/* Responsive Design */
@media (max-width: 768px) {
  .orders-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .orders-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-controls {
    justify-content: space-between;
  }
  
  .orders-table {
    font-size: 0.8rem;
  }
  
  .customer-cell .customer-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.4rem;
  }
  
  .actions-cell .action-buttons {
    flex-direction: column;
    gap: 0.2rem;
  }
  
  .summary-row {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .order-actions .status-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .orders-stats {
    grid-template-columns: 1fr;
  }
  
  .quick-actions {
    flex-direction: column;
  }
  
  .action-btn {
    justify-content: center;
  }
  
  .filter-controls {
    flex-direction: column;
  }
  
  .status-filter,
  .time-filter,
  .date-filter {
    min-width: auto;
    width: 100%;
  }
}
</style>