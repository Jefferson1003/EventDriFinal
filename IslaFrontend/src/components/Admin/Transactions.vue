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
        <!-- Transactions Content -->
        <div class="transactions-content">
          <!-- Header -->
          <div class="transactions-header">
            <h1 class="page-title">Transactions</h1>
            <p class="page-subtitle">View and manage all payment transactions</p>
            
            <!-- Header Actions -->
            <div class="header-actions">
              <div class="search-box">
                <i class="fas fa-search"></i>
                <input 
                  type="text" 
                  v-model="searchQuery" 
                  placeholder="Search transactions..." 
                  class="search-input"
                >
              </div>
              <div class="filter-controls">
                <select v-model="filterStatus" class="filter-select">
                  <option value="">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                  <option value="refunded">Refunded</option>
                </select>
                <select v-model="filterType" class="filter-select">
                  <option value="">All Types</option>
                  <option value="sale">Sale</option>
                  <option value="refund">Refund</option>
                  <option value="topup">Top-up</option>
                </select>
                <div class="export-dropdown">
                  <button class="btn-primary" @click="toggleExportDropdown">
                    <i class="fas fa-download"></i> Export
                  </button>
                  <div v-if="showExportDropdown" class="export-options">
                    <button @click="exportToPDF">Export as PDF</button>
                    <button @click="exportToExcel">Export as Excel</button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Stats Cards -->
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon completed">
                <i class="fas fa-check-circle"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.totalCompleted }}</div>
                <div class="stat-label">Completed</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon pending">
                <i class="fas fa-clock"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.totalPending }}</div>
                <div class="stat-label">Pending</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon revenue">
                <i class="fas fa-money-bill-wave"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">₱{{ stats.totalRevenue.toLocaleString() }}</div>
                <div class="stat-label">Total Revenue</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon today">
                <i class="fas fa-calendar-day"></i>
              </div>
              <div class="stat-info">
                <div class="stat-value">{{ stats.todayTransactions }}</div>
                <div class="stat-label">Today</div>
              </div>
            </div>
          </div>

          <!-- Transactions Table -->
          <div class="transactions-table-container">
            <div class="table-header">
              <h3>Recent Transactions</h3>
              <div class="table-actions">
                <button class="btn-secondary" @click="refreshTransactions">
                  <i class="fas fa-sync-alt"></i> Refresh
                </button>
              </div>
            </div>

            <div class="table-responsive">
              <table class="transactions-table">
                <thead>
                  <tr>
                    <th>Transaction ID</th>
                    <th>Customer</th>
                    <th>Type</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="transaction in paginatedTransactions" :key="transaction.id">
                    <td class="transaction-id">
                      <span class="id-text">#{{ transaction.id }}</span>
                    </td>
                    <td class="customer-cell">
                      <div class="customer-info">
                        <div class="customer-name">{{ transaction.customerName }}</div>
                        <div class="customer-email">{{ transaction.customerEmail }}</div>
                      </div>
                    </td>
                    <td>
                      <span class="type-badge" :class="transaction.type">
                        {{ transaction.type }}
                      </span>
                    </td>
                    <td class="amount-cell">
                      <span class="amount" :class="{ negative: transaction.type === 'refund' }">
                        {{ transaction.type === 'refund' ? '-' : '' }}₱{{ transaction.amount.toLocaleString() }}
                      </span>
                    </td>
                    <td>
                      <span class="status-badge" :class="transaction.status">
                        {{ transaction.status }}
                      </span>
                    </td>
                    <td class="date-cell">
                      {{ formatDate(transaction.date) }}
                    </td>
                    <td class="actions-cell">
                      <button class="action-btn view-btn" @click="viewTransaction(transaction)" title="View Details">
                        <i class="fas fa-eye"></i>
                      </button>
                      <button 
                        v-if="transaction.status === 'pending'" 
                        class="action-btn approve-btn" 
                        @click="approveTransaction(transaction)"
                        title="Approve"
                      >
                        <i class="fas fa-check"></i>
                      </button>
                      <button 
                        v-if="transaction.status === 'completed' && transaction.type === 'sale'" 
                        class="action-btn refund-btn" 
                        @click="refundTransaction(transaction)"
                        title="Refund"
                      >
                        <i class="fas fa-undo"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Empty State -->
              <div v-if="filteredTransactions.length === 0" class="empty-state">
                <i class="fas fa-receipt"></i>
                <h3>No transactions found</h3>
                <p>No transactions match your current filters.</p>
                <button class="btn-primary" @click="clearFilters">Clear Filters</button>
              </div>
            </div>

            <!-- Pagination -->
            <div class="pagination" v-if="filteredTransactions.length > 0">
              <div class="pagination-info">
                Showing {{ Math.min(filteredTransactions.length, itemsPerPage) }} of {{ filteredTransactions.length }} transactions
              </div>
              <div class="pagination-controls">
                <button 
                  class="pagination-btn" 
                  :disabled="currentPage === 1" 
                  @click="currentPage--"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <span class="pagination-page">Page {{ currentPage }}</span>
                <button 
                  class="pagination-btn" 
                  :disabled="currentPage * itemsPerPage >= filteredTransactions.length" 
                  @click="currentPage++"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Transaction Details Modal -->
        <div v-if="showTransactionModal" class="modal-overlay" @click="closeModal">
          <div class="modal transaction-modal" @click.stop>
            <div class="modal-header">
              <h3>Transaction Details</h3>
              <button class="close-btn" @click="closeModal">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <div v-if="selectedTransaction" class="transaction-details">
                <div class="detail-section">
                  <h4>Transaction Information</h4>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <label>Transaction ID</label>
                      <div class="detail-value">#{{ selectedTransaction.id }}</div>
                    </div>
                    <div class="detail-item">
                      <label>Type</label>
                      <div class="detail-value">
                        <span class="type-badge" :class="selectedTransaction.type">
                          {{ selectedTransaction.type }}
                        </span>
                      </div>
                    </div>
                    <div class="detail-item">
                      <label>Status</label>
                      <div class="detail-value">
                        <span class="status-badge" :class="selectedTransaction.status">
                          {{ selectedTransaction.status }}
                        </span>
                      </div>
                    </div>
                    <div class="detail-item">
                      <label>Amount</label>
                      <div class="detail-value amount-large" :class="{ negative: selectedTransaction.type === 'refund' }">
                        {{ selectedTransaction.type === 'refund' ? '-' : '' }}₱{{ selectedTransaction.amount.toLocaleString() }}
                      </div>
                    </div>
                    <div class="detail-item">
                      <label>Date & Time</label>
                      <div class="detail-value">{{ formatDateTime(selectedTransaction.date) }}</div>
                    </div>
                    <div class="detail-item">
                      <label>Payment Method</label>
                      <div class="detail-value">{{ selectedTransaction.paymentMethod }}</div>
                    </div>
                  </div>
                </div>

                <div class="detail-section">
                  <h4>Customer Information</h4>
                  <div class="detail-grid">
                    <div class="detail-item">
                      <label>Customer Name</label>
                      <div class="detail-value">{{ selectedTransaction.customerName }}</div>
                    </div>
                    <div class="detail-item">
                      <label>Email</label>
                      <div class="detail-value">{{ selectedTransaction.customerEmail }}</div>
                    </div>
                    <div class="detail-item">
                      <label>Phone</label>
                      <div class="detail-value">{{ selectedTransaction.customerPhone || 'N/A' }}</div>
                    </div>
                  </div>
                </div>

                <div class="detail-section" v-if="selectedTransaction.items">
                  <h4>Items</h4>
                  <div class="items-list">
                    <div v-for="item in selectedTransaction.items" :key="item.id" class="item-row">
                      <div class="item-name">{{ item.name }}</div>
                      <div class="item-quantity">x{{ item.quantity }}</div>
                      <div class="item-price">₱{{ item.price.toLocaleString() }}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-actions">
              <button class="btn-secondary" @click="closeModal">Close</button>
              <button 
                v-if="selectedTransaction && selectedTransaction.status === 'pending'" 
                class="btn-primary" 
                @click="approveTransaction(selectedTransaction)"
              >
                Approve Transaction
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Transactions',
  data() {
    return {
      // Navbar Data
      showNotifications: false,
      showUserMenu: false,
      isDarkMode: false,
      admin: {
        name: '',
        email: '',
        avatar: ''
      },
      notifications: [],

      // Transactions Data
      searchQuery: '',
      filterStatus: '',
      filterType: '',
      currentPage: 1,
      itemsPerPage: 10,
      showTransactionModal: false,
      showExportDropdown: false,
      selectedTransaction: null,
      
      stats: {
        totalCompleted: 0,
        totalPending: 0,
        totalRevenue: 0,
        todayTransactions: 0
      },

      transactions: []
    }
  },
  computed: {
    notificationCount() {
      return this.notifications.length
    },
    filteredTransactions() {
      let filtered = this.transactions;

      // Filter by search query
      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase();
        filtered = filtered.filter(transaction => 
          transaction.id.toLowerCase().includes(query) ||
          transaction.customerName.toLowerCase().includes(query) ||
          transaction.customerEmail.toLowerCase().includes(query)
        );
      }

      // Filter by status
      if (this.filterStatus) {
        filtered = filtered.filter(transaction => transaction.status === this.filterStatus);
      }

      // Filter by type
      if (this.filterType) {
        filtered = filtered.filter(transaction => transaction.type === this.filterType);
      }

      return filtered;
    },
    paginatedTransactions() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.filteredTransactions.slice(start, end);
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
    
    // Load transactions data
    await this.loadTransactionsData();

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
    // Navbar Methods
    toggleNotifications() {
      this.showNotifications = !this.showNotifications
      this.showUserMenu = false
      this.showExportDropdown = false
    },
    
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
      this.showNotifications = false
      this.showExportDropdown = false
    },
    
    closeUserMenu() {
      this.showUserMenu = false
    },

    closeDropdowns() {
      this.showNotifications = false
      this.showUserMenu = false
      this.showExportDropdown = false
    },

    toggleExportDropdown() {
      this.showExportDropdown = !this.showExportDropdown
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
      if (!event.target.closest('.admin-dropdown') && !event.target.closest('.export-dropdown')) {
        this.closeDropdowns();
      }
    },

    // Load admin data
    async loadAdminData() {
      try {
        // In a real app, this would be an API call
        const adminData = localStorage.getItem('islaAdmin');
        if (adminData) {
          this.admin = JSON.parse(adminData);
        } else {
          // Default admin data
          this.admin = {
            name: 'Admin User',
            email: 'admin@islacafe.com',
            avatar: '/images/admin-avatar.png'
          };
        }

        // Load notifications
        await this.loadNotifications();
      } catch (error) {
        console.error('Error loading admin data:', error);
      }
    },

    // Load notifications
    async loadNotifications() {
      try {
        // In a real app, this would be an API call
        this.notifications = [];
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    },

    // Load transactions data
    async loadTransactionsData() {
      try {
        // In a real app, this would be an API call
        const response = await this.fetchTransactionsFromAPI();
        this.transactions = response.transactions;
        this.stats = response.stats;
      } catch (error) {
        console.error('Error loading transactions:', error);
        // Fallback to empty data
        this.transactions = [];
        this.refreshStats();
      }
    },

    // Mock API call for transactions
    async fetchTransactionsFromAPI() {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // This would be replaced with actual API call
      return {
        transactions: [],
        stats: {
          totalCompleted: 0,
          totalPending: 0,
          totalRevenue: 0,
          todayTransactions: 0
        }
      };
    },

    // Transactions Methods
    formatDate(date) {
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    },

    formatDateTime(date) {
      return new Date(date).toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },

    viewTransaction(transaction) {
      this.selectedTransaction = transaction;
      this.showTransactionModal = true;
    },

    approveTransaction(transaction) {
      transaction.status = 'completed';
      this.showNotification(`Transaction ${transaction.id} approved successfully`, 'success');
      this.closeModal();
      this.refreshStats();
    },

    refundTransaction(transaction) {
      if (confirm(`Are you sure you want to refund ₱${transaction.amount.toLocaleString()} for transaction ${transaction.id}?`)) {
        transaction.status = 'refunded';
        this.showNotification(`Transaction ${transaction.id} refunded successfully`, 'success');
        this.refreshStats();
      }
    },

    exportToPDF() {
      this.showExportDropdown = false;
      this.showNotification('Exporting transactions as PDF...', 'info');
      // PDF export implementation would go here
      // This would typically use a library like jsPDF or generate a server-side PDF
    },

    exportToExcel() {
      this.showExportDropdown = false;
      this.showNotification('Exporting transactions as Excel...', 'info');
      // Excel export implementation would go here
      // This would typically use a library like SheetJS or generate a server-side Excel file
    },

    refreshTransactions() {
      this.showNotification('Transactions refreshed', 'success');
      this.loadTransactionsData();
    },

    clearFilters() {
      this.searchQuery = '';
      this.filterStatus = '';
      this.filterType = '';
      this.currentPage = 1;
    },

    refreshStats() {
      // Recalculate stats based on current transactions
      this.stats.totalCompleted = this.transactions.filter(t => t.status === 'completed').length;
      this.stats.totalPending = this.transactions.filter(t => t.status === 'pending').length;
      this.stats.totalRevenue = this.transactions
        .filter(t => t.status === 'completed' && t.type === 'sale')
        .reduce((sum, t) => sum + t.amount, 0);
      
      const today = new Date().toDateString();
      this.stats.todayTransactions = this.transactions.filter(t => 
        new Date(t.date).toDateString() === today
      ).length;
    },

    closeModal() {
      this.showTransactionModal = false;
      this.selectedTransaction = null;
    },

    showNotification(message, type = 'info') {
      // In a real app, this would use a proper notification system
      console.log(`${type.toUpperCase()}: ${message}`);
      // For now, we'll use alert but this should be replaced with a proper UI notification
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
  background: #5a3921; /* Dark brown for day mode */
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
  background: #2a2a3a; /* Dark background for dark mode */
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
  color: #d4b896; /* Light beige text for day mode */
  text-decoration: none;
  transition: all 0.3s ease;
  font-weight: 600;
  gap: 10px;
  border-left: 3px solid transparent;
  font-size: 14px;
}

.admin-sidebar.dark-mode .admin-sidebar-item {
  color: #e0e0e0; /* Light text for dark mode */
}

.admin-sidebar-item:hover {
  background: #6b451e; /* Darker brown on hover for day mode */
  color: #ffffff;
  border-left-color: #88592e;
}

.admin-sidebar.dark-mode .admin-sidebar-item:hover {
  background: #3a3a4a; /* Darker background on hover for dark mode */
  color: #ffffff;
}

.admin-active-sidebar-item {
  background: #6b451e; /* Active state for day mode */
  color: #ffffff;
  border-left-color: #88592e;
}

.admin-sidebar.dark-mode .admin-active-sidebar-item {
  background: #88592e; /* Active state for dark mode */
  color: #ffffff;
}

.admin-sidebar-item i {
  width: 18px;
  text-align: center;
  color: #d4b896; /* Light beige icons for day mode */
  font-size: 14px;
}

.admin-sidebar.dark-mode .admin-sidebar-item i {
  color: #e0e0e0; /* Light icons for dark mode */
}

.admin-sidebar-item:hover i,
.admin-active-sidebar-item i {
  color: #ffffff; /* White icons on hover/active */
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

/* Transactions Content Styles */
.transactions-content {
  max-width: 100%;
}

.transactions-header {
  background: white;
  border-radius: 0.8rem;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 10px rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .transactions-header {
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
  margin: 0 0 1rem 0;
}

.admin-container.dark-mode .page-subtitle {
  color: #a0a5c0;
}

.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  flex: 1;
  max-width: 300px;
}

.search-box i {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-input {
  width: 100%;
  padding: 0.6rem 0.6rem 0.6rem 2rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.4rem;
  font-size: 0.9rem;
  transition: border-color 0.3s ease;
}

.admin-container.dark-mode .search-input {
  background: var(--isla-dark-hover);
  border-color: var(--isla-dark-border);
  color: var(--isla-dark-text);
}

.search-input:focus {
  outline: none;
  border-color: #88592e;
}

.filter-controls {
  display: flex;
  gap: 0.8rem;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.6rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.4rem;
  background: white;
  font-size: 0.9rem;
  cursor: pointer;
}

.admin-container.dark-mode .filter-select {
  background: var(--isla-dark-hover);
  border-color: var(--isla-dark-border);
  color: var(--isla-dark-text);
}

.export-dropdown {
  position: relative;
}

.export-options {
  position: absolute;
  top: 100%;
  right: 0;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 0.4rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  margin-top: 0.5rem;
  min-width: 150px;
}

.admin-container.dark-mode .export-options {
  background: var(--isla-dark-card);
  border-color: var(--isla-dark-border);
}

.export-options button {
  display: block;
  width: 100%;
  padding: 0.8rem 1rem;
  border: none;
  background: none;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
}

.admin-container.dark-mode .export-options button {
  color: var(--isla-dark-text);
}

.export-options button:hover {
  background: #f5f5f5;
}

.admin-container.dark-mode .export-options button:hover {
  background: var(--isla-dark-hover);
}

.btn-primary {
  background: #88592e;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 0.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-primary:hover {
  background: #6b451e;
  transform: translateY(-1px);
}

.btn-secondary {
  background: #d4b896;
  color: #5a3921;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.4rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-secondary:hover {
  background: #c4a57c;
  transform: translateY(-1px);
}

/* Stats Grid */
.stats-grid {
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
}

.admin-container.dark-mode .stat-card {
  background: var(--isla-dark-card);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  color: white;
}

.stat-icon.completed {
  background: #10b981;
}

.stat-icon.pending {
  background: #f59e0b;
}

.stat-icon.revenue {
  background: #88592e;
}

.stat-icon.today {
  background: #3b82f6;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 0.2rem;
}

.admin-container.dark-mode .stat-value {
  color: var(--isla-dark-text);
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
  font-weight: 500;
}

.admin-container.dark-mode .stat-label {
  color: #a0a5c0;
}

/* Transactions Table */
.transactions-table-container {
  background: white;
  border-radius: 0.8rem;
  padding: 1.2rem;
  box-shadow: 0 2px 10px rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .transactions-table-container {
  background: var(--isla-dark-card);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.table-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.2rem;
  font-weight: 600;
}

.admin-container.dark-mode .table-header h3 {
  color: var(--isla-dark-text);
}

.table-responsive {
  overflow-x: auto;
}

.transactions-table {
  width: 100%;
  border-collapse: collapse;
}

.transactions-table th {
  background: #f8f5f2;
  padding: 0.8rem;
  text-align: left;
  font-weight: 600;
  color: #333;
  font-size: 0.8rem;
  border-bottom: 2px solid #e0e0e0;
}

.admin-container.dark-mode .transactions-table th {
  background: var(--isla-dark-hover);
  color: var(--isla-dark-text);
  border-bottom-color: var(--isla-dark-border);
}

.transactions-table td {
  padding: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
}

.admin-container.dark-mode .transactions-table td {
  border-bottom-color: var(--isla-dark-border);
  color: var(--isla-dark-text);
}

.transactions-table tr:hover {
  background: #f8f5f2;
}

.admin-container.dark-mode .transactions-table tr:hover {
  background: var(--isla-dark-hover);
}

/* Table Cell Styles */
.transaction-id .id-text {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #88592e;
}

.customer-cell .customer-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 0.2rem;
}

.admin-container.dark-mode .customer-cell .customer-name {
  color: var(--isla-dark-text);
}

.customer-cell .customer-email {
  font-size: 0.8rem;
  color: #666;
}

.admin-container.dark-mode .customer-cell .customer-email {
  color: #a0a5c0;
}

.type-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;
}

.type-badge.sale {
  background: #e8f5e8;
  color: #2e7d32;
}

.type-badge.refund {
  background: #ffebee;
  color: #c62828;
}

.type-badge.topup {
  background: #e3f2fd;
  color: #1565c0;
}

.status-badge {
  padding: 0.3rem 0.6rem;
  border-radius: 1rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;
}

.status-badge.completed {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge.pending {
  background: #fff3e0;
  color: #ef6c00;
}

.status-badge.failed {
  background: #ffebee;
  color: #c62828;
}

.status-badge.refunded {
  background: #f3e5f5;
  color: #7b1fa2;
}

.amount-cell .amount {
  font-weight: 700;
  color: #2e7d32;
}

.amount-cell .amount.negative {
  color: #c62828;
}

.date-cell {
  color: #666;
  white-space: nowrap;
}

.admin-container.dark-mode .date-cell {
  color: #a0a5c0;
}

.actions-cell {
  white-space: nowrap;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.4rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-right: 0.4rem;
}

.action-btn.view-btn {
  color: #3b82f6;
}

.action-btn.view-btn:hover {
  background: #3b82f6;
  color: white;
}

.action-btn.approve-btn {
  color: #10b981;
}

.action-btn.approve-btn:hover {
  background: #10b981;
  color: white;
}

.action-btn.refund-btn {
  color: #ef4444;
}

.action-btn.refund-btn:hover {
  background: #ef4444;
  color: white;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #666;
}

.empty-state i {
  font-size: 3rem;
  color: #d4b896;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: #333;
  font-size: 1.2rem;
}

.admin-container.dark-mode .empty-state h3 {
  color: var(--isla-dark-text);
}

.empty-state p {
  margin: 0 0 1.5rem 0;
  color: #666;
}

.admin-container.dark-mode .empty-state p {
  color: #a0a5c0;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.admin-container.dark-mode .pagination {
  border-top-color: var(--isla-dark-border);
}

.pagination-info {
  color: #666;
  font-size: 0.8rem;
}

.admin-container.dark-mode .pagination-info {
  color: #a0a5c0;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.pagination-btn {
  background: #f8f5f2;
  border: none;
  padding: 0.5rem;
  border-radius: 0.3rem;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #333;
}

.admin-container.dark-mode .pagination-btn {
  background: var(--isla-dark-hover);
  color: var(--isla-dark-text);
}

.pagination-btn:hover:not(:disabled) {
  background: #88592e;
  color: white;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-page {
  font-size: 0.9rem;
  font-weight: 600;
  color: #333;
}

.admin-container.dark-mode .pagination-page {
  color: var(--isla-dark-text);
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
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 0.8rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  max-width: 90%;
  max-height: 90%;
  overflow: auto;
}

.admin-container.dark-mode .modal {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.admin-container.dark-mode .modal-header {
  border-bottom-color: var(--isla-dark-border);
}

.modal-header h3 {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
  font-weight: 600;
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
  padding: 0.5rem;
  border-radius: 0.3rem;
  transition: all 0.3s ease;
}

.close-btn:hover {
  background: #f5f5f5;
  color: #333;
}

.admin-container.dark-mode .close-btn {
  color: #a0a5c0;
}

.admin-container.dark-mode .close-btn:hover {
  background: var(--isla-dark-hover);
  color: var(--isla-dark-text);
}

.modal-body {
  padding: 1.5rem;
}

/* Transaction Modal */
.transaction-modal {
  max-width: 600px;
}

.transaction-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.detail-section h4 {
  margin: 0 0 1rem 0;
  color: #88592e;
  font-size: 1.1rem;
  font-weight: 600;
}

.admin-container.dark-mode .detail-section h4 {
  color: #e0e0e0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.detail-item label {
  font-weight: 600;
  color: #666;
  font-size: 0.8rem;
}

.admin-container.dark-mode .detail-item label {
  color: #a0a5c0;
}

.detail-value {
  color: #333;
  font-weight: 500;
  font-size: 0.9rem;
}

.admin-container.dark-mode .detail-value {
  color: var(--isla-dark-text);
}

.amount-large {
  font-size: 1.2rem;
  font-weight: 700;
  color: #2e7d32;
}

.amount-large.negative {
  color: #c62828;
}

.items-list {
  border: 1px solid #e0e0e0;
  border-radius: 0.4rem;
  overflow: hidden;
}

.admin-container.dark-mode .items-list {
  border-color: var(--isla-dark-border);
}

.item-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.8rem;
  border-bottom: 1px solid #f0f0f0;
}

.admin-container.dark-mode .item-row {
  border-bottom-color: var(--isla-dark-border);
}

.item-row:last-child {
  border-bottom: none;
}

.item-name {
  flex: 1;
  font-weight: 500;
}

.item-quantity {
  color: #666;
  margin: 0 1rem;
}

.admin-container.dark-mode .item-quantity {
  color: #a0a5c0;
}

.item-price {
  font-weight: 600;
  color: #333;
}

.admin-container.dark-mode .item-price {
  color: var(--isla-dark-text);
}

/* Modal Actions */
.modal-actions {
  display: flex;
  gap: 0.8rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
  padding-top: 1rem;
  border-top: 1px solid #f0f0f0;
}

.admin-container.dark-mode .modal-actions {
  border-top-color: var(--isla-dark-border);
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-actions {
    flex-direction: column;
    align-items: stretch;
  }
  
  .search-box {
    max-width: none;
  }
  
  .filter-controls {
    justify-content: space-between;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .table-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
  
  .pagination {
    flex-direction: column;
    gap: 1rem;
    align-items: center;
  }
  
  .detail-grid {
    grid-template-columns: 1fr;
  }
  
  .modal-actions {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
  
  .filter-controls {
    flex-direction: column;
    align-items: stretch;
  }
  
  .transactions-table {
    font-size: 0.8rem;
  }
  
  .transactions-table th,
  .transactions-table td {
    padding: 0.6rem 0.4rem;
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