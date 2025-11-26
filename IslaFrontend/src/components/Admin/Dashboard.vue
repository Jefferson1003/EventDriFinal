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
        <!-- Dashboard Content -->
        <div class="admin-dashboard">
          <!-- Page Header -->
          <div class="dashboard-header">
            <h1 class="page-title">Dashboard Overview</h1>
            <p class="page-subtitle">Real-time insights and business analytics</p>
            
            <!-- Date Range Filter -->
            <div class="date-filter">
              <select v-model="dateRange" @change="updateDashboardData" class="range-select">
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
              <button class="refresh-btn" @click="refreshData">
                <i class="fas fa-sync-alt"></i>
              </button>
            </div>
          </div>

          <!-- Key Metrics - Compact Version -->
          <div class="metrics-grid-compact">
            <div class="metric-card-compact">
              <div class="metric-icon-compact revenue">
                <i class="fas fa-money-bill-wave"></i>
              </div>
              <div class="metric-info-compact">
                <h3>₱{{ formatNumber(totalRevenue) }}</h3>
                <p>Total Revenue</p>
                <span class="metric-trend-compact positive">
                  <i class="fas fa-arrow-up"></i> {{ revenueGrowth }}%
                </span>
              </div>
            </div>
            
            <div class="metric-card-compact">
              <div class="metric-icon-compact orders">
                <i class="fas fa-shopping-cart"></i>
              </div>
              <div class="metric-info-compact">
                <h3>{{ formatNumber(totalOrders) }}</h3>
                <p>Total Orders</p>
                <span class="metric-trend-compact positive">
                  <i class="fas fa-arrow-up"></i> {{ orderGrowth }}%
                </span>
              </div>
            </div>
            
            <div class="metric-card-compact">
              <div class="metric-icon-compact customers">
                <i class="fas fa-users"></i>
              </div>
              <div class="metric-info-compact">
                <h3>{{ formatNumber(totalCustomers) }}</h3>
                <p>Total Customers</p>
                <span class="metric-trend-compact positive">
                  <i class="fas fa-arrow-up"></i> {{ customerGrowth }}%
                </span>
              </div>
            </div>
            
            <div class="metric-card-compact">
              <div class="metric-icon-compact average">
                <i class="fas fa-chart-line"></i>
              </div>
              <div class="metric-info-compact">
                <h3>₱{{ formatNumber(averageOrderValue) }}</h3>
                <p>Avg Order Value</p>
                <span class="metric-trend-compact" :class="aovTrend">
                  <i :class="aovTrendIcon"></i> {{ aovGrowth }}%
                </span>
              </div>
            </div>
          </div>

          <!-- Charts Section -->
          <div class="charts-grid">
            <!-- Revenue Chart -->
            <div class="chart-card large">
              <div class="chart-header">
                <h3>Revenue Overview</h3>
                <div class="chart-legend">
                  <span class="legend-item">
                    <span class="legend-color revenue"></span>
                    Revenue
                  </span>
                  <span class="legend-item">
                    <span class="legend-color orders"></span>
                    Orders
                  </span>
                </div>
              </div>
              <div class="chart-container">
                <canvas ref="revenueChart"></canvas>
              </div>
            </div>

            <!-- Sales by Category -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>Sales by Category</h3>
              </div>
              <div class="chart-container">
                <canvas ref="categoryChart"></canvas>
              </div>
            </div>

            <!-- Order Trends -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>Order Trends</h3>
              </div>
              <div class="chart-container">
                <canvas ref="orderTrendChart"></canvas>
              </div>
            </div>

            <!-- Top Products -->
            <div class="chart-card">
              <div class="chart-header">
                <h3>Top Products</h3>
              </div>
              <div class="chart-container">
                <canvas ref="topProductsChart"></canvas>
              </div>
            </div>
          </div>

          <!-- Recent Activity & Quick Stats -->
          <div class="activity-stats-grid">
            <!-- Recent Orders -->
            <div class="activity-card">
              <div class="activity-header">
                <h3>Recent Orders</h3>
                <router-link to="/admin/orders" class="view-all">View All</router-link>
              </div>
              <div class="activity-list">
                <div v-for="order in recentOrders" :key="order.id" class="activity-item">
                  <div class="activity-avatar">
                    <img :src="order.customerAvatar" :alt="order.customerName">
                  </div>
                  <div class="activity-details">
                    <h4>{{ order.customerName }}</h4>
                    <p>Order #{{ order.id }} • ₱{{ order.amount }}</p>
                    <span class="activity-time">{{ order.time }}</span>
                  </div>
                  <div class="activity-status" :class="order.status">
                    {{ order.status }}
                  </div>
                </div>
              </div>
            </div>

            <!-- Quick Stats -->
            <div class="stats-card">
              <div class="stats-header">
                <h3>Quick Stats</h3>
              </div>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-value">{{ lowStockItems }}</div>
                  <div class="stat-label">Low Stock Items</div>
                  <div class="stat-trend negative">
                    <i class="fas fa-exclamation-triangle"></i> Needs attention
                  </div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ pendingOrders }}</div>
                  <div class="stat-label">Pending Orders</div>
                  <div class="stat-trend neutral">Awaiting processing</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ newCustomers }}</div>
                  <div class="stat-label">New Customers This Week</div>
                  <div class="stat-trend positive">Growing</div>
                </div>
                <div class="stat-item">
                  <div class="stat-value">{{ tableOccupancy }}%</div>
                  <div class="stat-label">Current Table Occupancy</div>
                  <div class="stat-trend positive">Good traffic</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Inventory Alerts -->
          <div class="alerts-section">
            <div class="section-header">
              <h3>Inventory Alerts</h3>
              <router-link to="/admin/inventory" class="view-all">Manage Inventory</router-link>
            </div>
            <div class="alerts-grid">
              <div v-for="alert in inventoryAlerts" :key="alert.id" class="alert-card" :class="alert.priority">
                <div class="alert-icon">
                  <i :class="alert.icon"></i>
                </div>
                <div class="alert-content">
                  <h4>{{ alert.title }}</h4>
                  <p>{{ alert.message }}</p>
                  <span class="alert-time">{{ alert.time }}</span>
                </div>
                <div class="alert-action">
                  <button class="btn-small" @click="handleAlertAction(alert)">
                    {{ alert.action }}
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
import { Chart, registerables } from 'chart.js/auto';

// Register Chart.js components
Chart.register(...registerables);

export default {
  name: 'AdminDashboard',
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

      // Dashboard Data
      dateRange: '30d',
      totalRevenue: 0,
      totalOrders: 0,
      totalCustomers: 0,
      averageOrderValue: 0,
      revenueGrowth: 0,
      orderGrowth: 0,
      customerGrowth: 0,
      aovGrowth: 0,
      lowStockItems: 0,
      pendingOrders: 0,
      newCustomers: 0,
      tableOccupancy: 0,
      revenueChart: null,
      categoryChart: null,
      orderTrendChart: null,
      topProductsChart: null,
      
      // Dynamic Data
      recentOrders: [],
      inventoryAlerts: [],
      
      // Chart Data
      revenueData: {},
      categoryData: {},
      orderTrendData: {},
      topProductsData: {}
    }
  },
  computed: {
    notificationCount() {
      return this.notifications.length
    },
    aovTrend() {
      return this.aovGrowth >= 0 ? 'positive' : 'negative';
    },
    aovTrendIcon() {
      return this.aovGrowth >= 0 ? 'fas fa-arrow-up' : 'fas fa-arrow-down';
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
    await this.loadDashboardData();
    await this.loadNotifications();

    // Add Font Awesome if not already loaded
    this.loadFontAwesome();

    // Add click outside listener
    document.addEventListener('click', this.handleClickOutside);
    
    // Initialize charts
    this.initCharts();
  },
  beforeUnmount() {
    // Remove event listener when component is destroyed
    document.removeEventListener('click', this.handleClickOutside);
    
    // Clean up charts to prevent memory leaks
    if (this.revenueChart) this.revenueChart.destroy();
    if (this.categoryChart) this.categoryChart.destroy();
    if (this.orderTrendChart) this.orderTrendChart.destroy();
    if (this.topProductsChart) this.topProductsChart.destroy();
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

    // Load dashboard data
    async loadDashboardData() {
      try {
        // Initialize with empty/default values
        this.totalRevenue = 0;
        this.totalOrders = 0;
        this.totalCustomers = 0;
        this.averageOrderValue = 0;
        this.revenueGrowth = 0;
        this.orderGrowth = 0;
        this.customerGrowth = 0;
        this.aovGrowth = 0;
        this.lowStockItems = 0;
        this.pendingOrders = 0;
        this.newCustomers = 0;
        this.tableOccupancy = 0;
        
        this.recentOrders = [];
        this.inventoryAlerts = [];
        
        // Initialize chart data structures
        this.initializeChartData();
        
        // Update with current date range data
        this.updateDashboardData();
        
      } catch (error) {
        console.error('Error loading dashboard data:', error);
        this.setFallbackDashboardData();
      }
    },

    // Initialize chart data structures
    initializeChartData() {
      this.revenueData = {
        '7d': {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          revenue: [0, 0, 0, 0, 0, 0, 0],
          orders: [0, 0, 0, 0, 0, 0, 0]
        },
        '30d': {
          labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
          revenue: [0, 0, 0, 0],
          orders: [0, 0, 0, 0]
        },
        '90d': {
          labels: ['Month 1', 'Month 2', 'Month 3'],
          revenue: [0, 0, 0],
          orders: [0, 0, 0]
        },
        '1y': {
          labels: ['Q1', 'Q2', 'Q3', 'Q4'],
          revenue: [0, 0, 0, 0],
          orders: [0, 0, 0, 0]
        }
      };
      
      this.categoryData = {
        labels: ['Coffee-Based', 'Blended/Frappe', 'Non-Coffee', 'Pastry', 'Cakes', 'Cookies'],
        data: [0, 0, 0, 0, 0, 0],
        colors: ['#88592e', '#a67c52', '#c4a57c', '#d4b896', '#e8d4bc', '#f4e8d4']
      };
      
      this.orderTrendData = {
        labels: ['6AM', '9AM', '12PM', '3PM', '6PM', '9PM'],
        data: [0, 0, 0, 0, 0, 0]
      };
      
      this.topProductsData = {
        labels: ['Caramel Macchiato', 'Cappuccino', 'Chocolate Cake', 'Mocha Frappe', 'Espresso'],
        data: [0, 0, 0, 0, 0],
        colors: ['#88592e', '#a67c52', '#c4a57c', '#d4b896', '#e8d4bc']
      };
    },

    // Set fallback admin data
    setFallbackAdminData() {
      this.admin = {
        name: 'Admin User',
        email: 'admin@islacafe.com',
        avatar: '/images/admin-avatar.png'
      };
    },

    // Set fallback dashboard data
    setFallbackDashboardData() {
      this.totalRevenue = 0;
      this.totalOrders = 0;
      this.totalCustomers = 0;
      this.averageOrderValue = 0;
      this.revenueGrowth = 0;
      this.orderGrowth = 0;
      this.customerGrowth = 0;
      this.aovGrowth = 0;
      this.lowStockItems = 0;
      this.pendingOrders = 0;
      this.newCustomers = 0;
      this.tableOccupancy = 0;
      
      this.recentOrders = [];
      this.inventoryAlerts = [];
    },

    // Load notifications from API
    async loadNotifications() {
      try {
        this.notifications = [];
      } catch (error) {
        console.error('Error loading notifications:', error);
        this.notifications = [];
      }
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
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMCAzNEMzMy4zMTM3IDM0IDM2IDMxLjMxMzcgMzYgMjhDMzYgMjQuNjg2MyAzMy4zMTM3IDIyIDMwIDIyQzI2LjY4NjMgMjIgMjQgMjQuNjg2MyAyNCAyOEMyNCAzMS4zMTM3IDI2LjY4NjMgMzQgMzAgMzRaIiBmaWxsPSIjODg1OTJFIi8+CjxwYXRoIGQ9Ik0zOCAzOEgyMkMyMC44OTU0IDM4IDIwIDM3LjEwNDYgMjAgMzZWMjJDMjAgMjAuODk1NCAyMC44OTU0IDIwIDIyIDIwSDM4QzM5LjEwNDYgMjAgNDAgMjAuODk1NCA0MCAyMlYzNkM0MCAzNy4xMDQ2IDM5LjEwNDYgMzggMzggMzhaTTIyIDIyVjM2SDM4VjIySDIyWiIgZmlsbD0iIzg4NTkyRSIvPgo8L3N2Zz4K';
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
      if (!event.target.closest('.admin-dropdown')) {
        this.closeDropdowns();
      }
    },

    // Dashboard Methods
    initCharts() {
      this.createRevenueChart();
      this.createCategoryChart();
      this.createOrderTrendChart();
      this.createTopProductsChart();
    },
    
    createRevenueChart() {
      const ctx = this.$refs.revenueChart.getContext('2d');
      const data = this.revenueData[this.dateRange];
      
      this.revenueChart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: data.labels,
          datasets: [
            {
              label: 'Revenue',
              data: data.revenue,
              borderColor: '#88592e',
              backgroundColor: 'rgba(136, 89, 46, 0.1)',
              borderWidth: 3,
              fill: true,
              tension: 0.4,
              yAxisID: 'y'
            },
            {
              label: 'Orders',
              data: data.orders,
              borderColor: '#d4b896',
              backgroundColor: 'rgba(212, 184, 150, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              yAxisID: 'y1'
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  let label = context.dataset.label || '';
                  if (label === 'Revenue') {
                    return `${label}: ₱${context.parsed.y.toLocaleString()}`;
                  } else {
                    return `${label}: ${context.parsed.y} orders`;
                  }
                }
              }
            }
          },
          scales: {
            y: {
              type: 'linear',
              display: true,
              position: 'left',
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                callback: function(value) {
                  return '₱' + (value / 1000).toFixed(0) + 'K';
                }
              },
              title: {
                display: true,
                text: 'Revenue (₱)'
              }
            },
            y1: {
              type: 'linear',
              display: true,
              position: 'right',
              beginAtZero: true,
              grid: {
                drawOnChartArea: false,
              },
              title: {
                display: true,
                text: 'Orders'
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    },
    
    createCategoryChart() {
      const ctx = this.$refs.categoryChart.getContext('2d');
      
      this.categoryChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: this.categoryData.labels,
          datasets: [{
            data: this.categoryData.data,
            backgroundColor: this.categoryData.colors,
            borderWidth: 2,
            borderColor: '#ffffff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                usePointStyle: true,
                padding: 20,
                boxWidth: 12,
                font: {
                  size: 11
                }
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const label = context.label || '';
                  const value = context.parsed;
                  const total = context.dataset.data.reduce((a, b) => a + b, 0);
                  const percentage = Math.round((value / total) * 100);
                  return `${label}: ${percentage}% (${value}%)`;
                }
              }
            }
          },
          cutout: '65%'
        }
      });
    },
    
    createOrderTrendChart() {
      const ctx = this.$refs.orderTrendChart.getContext('2d');
      
      this.orderTrendChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.orderTrendData.labels,
          datasets: [{
            label: 'Orders',
            data: this.orderTrendData.data,
            backgroundColor: '#88592e',
            borderColor: '#88592e',
            borderWidth: 1,
            borderRadius: 6,
            borderSkipped: false,
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                stepSize: 10
              }
            },
            x: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    },
    
    createTopProductsChart() {
      const ctx = this.$refs.topProductsChart.getContext('2d');
      
      this.topProductsChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: this.topProductsData.labels,
          datasets: [{
            label: 'Sales',
            data: this.topProductsData.data,
            backgroundColor: this.topProductsData.colors,
            borderWidth: 0,
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              display: false
            }
          },
          scales: {
            x: {
              beginAtZero: true,
              grid: {
                color: 'rgba(0, 0, 0, 0.1)'
              },
              ticks: {
                callback: function(value) {
                  return value + ' sales';
                }
              }
            },
            y: {
              grid: {
                display: false
              }
            }
          }
        }
      });
    },
    
    updateDashboardData() {
      // Update metrics based on date range
      const ranges = {
        '7d': { 
          revenue: 0, 
          orders: 0, 
          customers: 0, 
          avgOrder: 0,
          revenueGrowth: 0,
          orderGrowth: 0,
          customerGrowth: 0,
          aovGrowth: 0
        },
        '30d': { 
          revenue: 0, 
          orders: 0, 
          customers: 0, 
          avgOrder: 0,
          revenueGrowth: 0,
          orderGrowth: 0,
          customerGrowth: 0,
          aovGrowth: 0
        },
        '90d': { 
          revenue: 0, 
          orders: 0, 
          customers: 0, 
          avgOrder: 0,
          revenueGrowth: 0,
          orderGrowth: 0,
          customerGrowth: 0,
          aovGrowth: 0
        },
        '1y': { 
          revenue: 0, 
          orders: 0, 
          customers: 0, 
          avgOrder: 0,
          revenueGrowth: 0,
          orderGrowth: 0,
          customerGrowth: 0,
          aovGrowth: 0
        }
      };
      
      const data = ranges[this.dateRange];
      this.totalRevenue = data.revenue;
      this.totalOrders = data.orders;
      this.totalCustomers = data.customers;
      this.averageOrderValue = data.avgOrder;
      this.revenueGrowth = data.revenueGrowth;
      this.orderGrowth = data.orderGrowth;
      this.customerGrowth = data.customerGrowth;
      this.aovGrowth = data.aovGrowth;
      
      // Refresh charts with new data
      this.refreshCharts();
    },
    
    refreshCharts() {
      // Destroy existing charts
      if (this.revenueChart) this.revenueChart.destroy();
      if (this.categoryChart) this.categoryChart.destroy();
      if (this.orderTrendChart) this.orderTrendChart.destroy();
      if (this.topProductsChart) this.topProductsChart.destroy();
      
      // Recreate charts with updated data
      this.initCharts();
    },
    
    refreshData() {
      this.updateDashboardData();
      this.showNotification('Dashboard data refreshed', 'success');
    },
    
    formatNumber(num) {
      if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
      } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
      }
      return num.toLocaleString();
    },
    
    handleAlertAction(alert) {
      switch (alert.action) {
        case 'Restock':
          this.$router.push('/admin/inventory');
          break;
        case 'Check':
          this.showNotification(`Checking ${alert.title}`, 'info');
          break;
        case 'Monitor':
          this.showNotification(`Monitoring ${alert.title}`, 'info');
          break;
      }
    },
    
    showNotification(message, type = 'info') {
      // In a real application, you might use a toast notification library
      console.log(`${type.toUpperCase()}: ${message}`);
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

/* Dashboard Styles */
.admin-dashboard {
  padding: 0;
  background: transparent;
  min-height: auto;
}

/* Header Styles */
.dashboard-header {
  background: white;
  border-radius: 0.8rem;
  padding: 1.2rem;
  margin-bottom: 1.2rem;
  box-shadow: 0 2px 10px rgba(139, 115, 85, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.admin-container.dark-mode .dashboard-header {
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

.date-filter {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.range-select {
  padding: 0.6rem 0.8rem;
  border: 2px solid #e0e0e0;
  border-radius: 0.4rem;
  background: white;
  color: #333;
  font-size: 0.9rem;
  cursor: pointer;
  transition: border-color 0.3s ease;
  min-width: 130px;
}

.admin-container.dark-mode .range-select {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
  border-color: var(--isla-dark-border);
}

.range-select:focus {
  outline: none;
  border-color: #88592e;
}

.refresh-btn {
  width: 38px;
  height: 38px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 0.4rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: #666;
}

.admin-container.dark-mode .refresh-btn {
  background: var(--isla-dark-card);
  border-color: var(--isla-dark-border);
  color: var(--isla-dark-text);
}

.refresh-btn:hover {
  border-color: #88592e;
  color: #88592e;
  transform: rotate(180deg);
}

/* Compact Metrics Grid */
.metrics-grid-compact {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.metric-card-compact {
  background: white;
  border-radius: 0.6rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 0.8rem;
  box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
  transition: transform 0.3s ease;
}

.admin-container.dark-mode .metric-card-compact {
  background: var(--isla-dark-card);
}

.metric-card-compact:hover {
  transform: translateY(-2px);
}

.metric-icon-compact {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  color: white;
  flex-shrink: 0;
}

.metric-icon-compact.revenue {
  background: linear-gradient(135deg, #4CAF50, #45a049);
}

.metric-icon-compact.orders {
  background: linear-gradient(135deg, #2196F3, #1976D2);
}

.metric-icon-compact.customers {
  background: linear-gradient(135deg, #FF9800, #F57C00);
}

.metric-icon-compact.average {
  background: linear-gradient(135deg, #9C27B0, #7B1FA2);
}

.metric-info-compact {
  flex: 1;
  min-width: 0;
}

.metric-info-compact h3 {
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.2rem;
  color: #333;
  line-height: 1.2;
}

.admin-container.dark-mode .metric-info-compact h3 {
  color: var(--isla-dark-text);
}

.metric-info-compact p {
  color: #666;
  font-size: 0.75rem;
  margin: 0 0 0.4rem 0;
  font-weight: 500;
}

.admin-container.dark-mode .metric-info-compact p {
  color: #a0a5c0;
}

.metric-trend-compact {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
}

.metric-trend-compact.positive {
  background: #e8f5e8;
  color: #4CAF50;
}

.metric-trend-compact.negative {
  background: #ffebee;
  color: #f44336;
}

/* Charts Grid */
.charts-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.chart-card {
  background: white;
  border-radius: 0.6rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .chart-card {
  background: var(--isla-dark-card);
}

.chart-card.large {
  grid-column: 1 / -1;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.chart-header h3 {
  margin: 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
}

.admin-container.dark-mode .chart-header h3 {
  color: var(--isla-dark-text);
}

.chart-legend {
  display: flex;
  gap: 0.8rem;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.7rem;
  color: #666;
}

.admin-container.dark-mode .legend-item {
  color: #a0a5c0;
}

.legend-color {
  width: 10px;
  height: 10px;
  border-radius: 2px;
}

.legend-color.revenue {
  background: #88592e;
}

.legend-color.orders {
  background: #d4b896;
}

.chart-container {
  height: 250px;
  position: relative;
}

.chart-card:not(.large) .chart-container {
  height: 200px;
}

/* Activity & Stats Grid */
.activity-stats-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.activity-card,
.stats-card {
  background: white;
  border-radius: 0.6rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .activity-card,
.admin-container.dark-mode .stats-card {
  background: var(--isla-dark-card);
}

.activity-header,
.stats-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.activity-header h3,
.stats-header h3 {
  margin: 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
}

.admin-container.dark-mode .activity-header h3,
.admin-container.dark-mode .stats-header h3 {
  color: var(--isla-dark-text);
}

.view-all {
  color: #88592e;
  text-decoration: none;
  font-weight: 600;
  font-size: 0.8rem;
  transition: color 0.3s ease;
}

.view-all:hover {
  color: #6b451e;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  border-radius: 0.4rem;
  transition: background-color 0.3s ease;
}

.activity-item:hover {
  background: #f8f5f2;
}

.admin-container.dark-mode .activity-item:hover {
  background: var(--isla-dark-hover);
}

.activity-avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  overflow: hidden;
}

.activity-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.activity-details {
  flex: 1;
}

.activity-details h4 {
  margin: 0 0 0.2rem 0;
  color: #333;
  font-size: 0.8rem;
  font-weight: 600;
}

.admin-container.dark-mode .activity-details h4 {
  color: var(--isla-dark-text);
}

.activity-details p {
  margin: 0 0 0.2rem 0;
  color: #666;
  font-size: 0.7rem;
}

.admin-container.dark-mode .activity-details p {
  color: #a0a5c0;
}

.activity-time {
  color: #999;
  font-size: 0.65rem;
}

.admin-container.dark-mode .activity-time {
  color: #7a7f9a;
}

.activity-status {
  padding: 0.2rem 0.6rem;
  border-radius: 0.8rem;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
}

.activity-status.completed {
  background: #e8f5e8;
  color: #4CAF50;
}

.activity-status.processing {
  background: #fff3e0;
  color: #FF9800;
}

.activity-status.pending {
  background: #e3f2fd;
  color: #2196F3;
}

/* Stats Grid */
.stats-grid {
  display: grid;
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
  font-size: 1.5rem;
  font-weight: 700;
  color: #88592e;
  margin-bottom: 0.2rem;
}

.admin-container.dark-mode .stat-value {
  color: #d7ccc8;
}

.stat-label {
  font-size: 0.7rem;
  color: #666;
  margin-bottom: 0.4rem;
  font-weight: 500;
}

.admin-container.dark-mode .stat-label {
  color: #a0a5c0;
}

.stat-trend {
  font-size: 0.65rem;
  font-weight: 600;
  padding: 0.2rem 0.4rem;
  border-radius: 0.8rem;
}

.stat-trend.positive {
  background: #e8f5e8;
  color: #4CAF50;
}

.stat-trend.negative {
  background: #ffebee;
  color: #f44336;
}

.stat-trend.neutral {
  background: #e3f2fd;
  color: #2196F3;
}

/* Alerts Section */
.alerts-section {
  background: white;
  border-radius: 0.6rem;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .alerts-section {
  background: var(--isla-dark-card);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h3 {
  margin: 0;
  color: #333;
  font-size: 1rem;
  font-weight: 600;
}

.admin-container.dark-mode .section-header h3 {
  color: var(--isla-dark-text);
}

.alerts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 0.8rem;
}

.alert-card {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem;
  border-radius: 0.4rem;
  border-left: 4px solid #e0e0e0;
}

.alert-card.high {
  border-left-color: #f44336;
  background: #fff0f0;
}

.alert-card.medium {
  border-left-color: #ff9800;
  background: #fff8f0;
}

.alert-card.low {
  border-left-color: #2196f3;
  background: #f0f8ff;
}

.admin-container.dark-mode .alert-card.high {
  background: #2a1a1a;
}

.admin-container.dark-mode .alert-card.medium {
  background: #2a2a1a;
}

.admin-container.dark-mode .alert-card.low {
  background: #1a1a2a;
}

.alert-icon {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}

.alert-card.high .alert-icon {
  background: #ffebee;
  color: #f44336;
}

.alert-card.medium .alert-icon {
  background: #fff3e0;
  color: #ff9800;
}

.alert-card.low .alert-icon {
  background: #e3f2fd;
  color: #2196f3;
}

.alert-content {
  flex: 1;
}

.alert-content h4 {
  margin: 0 0 0.2rem 0;
  color: #333;
  font-size: 0.8rem;
  font-weight: 600;
}

.admin-container.dark-mode .alert-content h4 {
  color: var(--isla-dark-text);
}

.alert-content p {
  margin: 0 0 0.2rem 0;
  color: #666;
  font-size: 0.7rem;
}

.admin-container.dark-mode .alert-content p {
  color: #a0a5c0;
}

.alert-time {
  color: #999;
  font-size: 0.65rem;
}

.admin-container.dark-mode .alert-time {
  color: #7a7f9a;
}

.alert-action .btn-small {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 0.3rem;
  font-size: 0.7rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.alert-card.high .btn-small {
  background: #f44336;
  color: white;
}

.alert-card.medium .btn-small {
  background: #ff9800;
  color: white;
}

.alert-card.low .btn-small {
  background: #2196f3;
  color: white;
}

.alert-card .btn-small:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .charts-grid {
    grid-template-columns: 1fr;
  }
  
  .activity-stats-grid {
    grid-template-columns: 1fr;
  }
  
  .metrics-grid-compact {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .admin-dashboard {
    padding: 0;
  }

  .admin-content {
    padding: 10px;
  }

  .dashboard-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .metrics-grid-compact {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .activity-stats-grid {
    grid-template-columns: 1fr;
  }

  .alerts-grid {
    grid-template-columns: 1fr;
  }

  .chart-card.large {
    grid-column: auto;
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
  .page-title {
    font-size: 1.3rem;
  }

  .metric-card-compact {
    flex-direction: column;
    text-align: center;
  }

  .activity-item {
    flex-direction: column;
    text-align: center;
  }

  .alert-card {
    flex-direction: column;
    text-align: center;
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
  
  .metrics-grid-compact {
    gap: 0.8rem;
  }
  
  .metric-card-compact {
    padding: 0.8rem;
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