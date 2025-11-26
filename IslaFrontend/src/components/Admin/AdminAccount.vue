<template>
  <div class="admin-container" :class="{ 'dark-mode': isDarkMode }">
    <!-- Admin Navbar (exactly as you had it) -->
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
      <!-- Sidebar (exactly as you had it) -->
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

      <!-- Main Content Area - ONLY THIS PART IS MODIFIED -->
      <main class="admin-content">
        <!-- Account Content -->
        <div class="admin-account-content">
          <!-- Header -->
          <div class="account-header">
            <div class="header-content">
              <div class="header-text">
                <h1 class="page-title">Admin Account</h1>
                <p class="page-subtitle">Manage your profile and account settings</p>
              </div>
              <div class="header-actions">
                <button class="btn-secondary" @click="editProfile">
                  <i class="fas fa-edit"></i> Edit Profile
                </button>
              </div>
            </div>
          </div>

          <!-- Main Content Grid -->
          <div class="account-layout">
            <!-- Profile Section -->
            <div class="profile-section">
              <div class="profile-card">
                <div class="profile-header">
                  <div class="avatar-container">
                    <div class="avatar-wrapper">
                      <img :src="adminData.avatar" :alt="adminData.name" class="profile-avatar">
                      <button class="avatar-edit-btn" @click="triggerAvatarUpload" title="Change photo">
                        <i class="fas fa-camera"></i>
                      </button>
                      <input 
                        type="file" 
                        ref="avatarInput" 
                        @change="handleAvatarUpload" 
                        accept="image/*" 
                        class="avatar-file-input"
                      >
                    </div>
                    <div class="profile-info">
                      <h2>{{ adminData.name }}</h2>
                      <p class="profile-role">{{ adminData.role }}</p>
                      <p class="profile-email">{{ adminData.email }}</p>
                    </div>
                  </div>
                </div>

                <div class="profile-stats">
                  <div class="stat-item">
                    <div class="stat-icon">
                      <i class="fas fa-sign-in-alt"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">{{ adminData.stats.lastLogin }}</div>
                      <div class="stat-label">Last Login</div>
                    </div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-icon">
                      <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                      <div class="stat-value">{{ adminData.stats.sessions }}</div>
                      <div class="stat-label">Active Sessions</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Settings Section -->
            <div class="settings-section">
              <!-- Personal Information Card -->
              <div class="settings-card">
                <div class="card-header">
                  <i class="fas fa-user"></i>
                  <h3>Personal Information</h3>
                </div>
                <div class="card-content">
                  <div class="info-grid">
                    <div class="info-item">
                      <label>Full Name</label>
                      <div class="info-value">{{ adminData.name }}</div>
                    </div>
                    <div class="info-item">
                      <label>Email Address</label>
                      <div class="info-value">{{ adminData.email }}</div>
                    </div>
                    <div class="info-item">
                      <label>Phone Number</label>
                      <div class="info-value">{{ adminData.phone || 'Not set' }}</div>
                    </div>
                    <div class="info-item">
                      <label>Role</label>
                      <div class="info-value">{{ adminData.role }}</div>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Security Card -->
              <div class="settings-card">
                <div class="card-header">
                  <i class="fas fa-shield-alt"></i>
                  <h3>Security</h3>
                </div>
                <div class="card-content">
                  <form @submit.prevent="updatePassword" class="security-form">
                    <div class="form-row">
                      <div class="form-group">
                        <label>Current Password</label>
                        <input 
                          type="password" 
                          v-model="passwordForm.current" 
                          placeholder="Enter current password"
                          required
                        >
                      </div>
                    </div>
                    <div class="form-row">
                      <div class="form-group">
                        <label>New Password</label>
                        <input 
                          type="password" 
                          v-model="passwordForm.new" 
                          placeholder="Enter new password"
                          required
                        >
                      </div>
                      <div class="form-group">
                        <label>Confirm Password</label>
                        <input 
                          type="password" 
                          v-model="passwordForm.confirm" 
                          placeholder="Confirm new password"
                          required
                        >
                      </div>
                    </div>
                    <div class="password-strength" :class="passwordStrength">
                      <div class="strength-bar">
                        <div class="strength-fill" :class="passwordStrength"></div>
                      </div>
                      <span class="strength-text">Password Strength: {{ passwordStrengthText }}</span>
                    </div>
                    <div class="form-actions">
                      <button type="submit" class="btn-primary">
                        <i class="fas fa-key"></i> Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              <!-- Preferences Card -->
              <div class="settings-card">
                <div class="card-header">
                  <i class="fas fa-sliders-h"></i>
                  <h3>Preferences</h3>
                </div>
                <div class="card-content">
                  <div class="preference-item">
                    <div class="preference-info">
                      <h4>Dark Mode</h4>
                      <p>Toggle between light and dark theme</p>
                    </div>
                    <div class="preference-action">
                      <label class="toggle-switch">
                        <input type="checkbox" v-model="isDarkMode" @change="toggleDarkMode">
                        <span class="slider"></span>
                      </label>
                    </div>
                  </div>
                  <div class="preference-item">
                    <div class="preference-info">
                      <h4>Email Notifications</h4>
                      <p>Receive email alerts for important updates</p>
                    </div>
                    <div class="preference-action">
                      <label class="toggle-switch">
                        <input type="checkbox" v-model="emailNotifications">
                        <span class="slider"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Edit Profile Modal -->
        <div v-if="showEditModal" class="modal-overlay" @click="closeModal">
          <div class="modal edit-profile-modal" @click.stop>
            <div class="modal-header">
              <h3>Edit Profile</h3>
              <button class="close-btn" @click="closeModal">
                <i class="fas fa-times"></i>
              </button>
            </div>
            <div class="modal-body">
              <form @submit.prevent="saveProfile" class="edit-form">
                <div class="form-group">
                  <label>Full Name</label>
                  <input type="text" v-model="editForm.name" required>
                </div>
                <div class="form-group">
                  <label>Email Address</label>
                  <input type="email" v-model="editForm.email" required>
                </div>
                <div class="form-group">
                  <label>Phone Number</label>
                  <input type="tel" v-model="editForm.phone" placeholder="+63 912 345 6789">
                </div>
                <div class="modal-actions">
                  <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
                  <button type="submit" class="btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AdminAccount',
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

      // Account Data
      adminData: {
        name: '',
        email: '',
        phone: '',
        role: '',
        avatar: '',
        stats: {
          lastLogin: '',
          sessions: 0
        }
      },
      showEditModal: false,
      editForm: {
        name: '',
        email: '',
        phone: ''
      },
      passwordForm: {
        current: '',
        new: '',
        confirm: ''
      },
      emailNotifications: true
    }
  },
  computed: {
    notificationCount() {
      return this.notifications.length
    },
    passwordStrength() {
      if (!this.passwordForm.new) return 'empty';
      if (this.passwordForm.new.length < 6) return 'weak';
      if (this.passwordForm.new.length < 8) return 'medium';
      return 'strong';
    },
    passwordStrengthText() {
      const strengths = {
        empty: 'Not set',
        weak: 'Weak',
        medium: 'Medium',
        strong: 'Strong'
      };
      return strengths[this.passwordStrength];
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
    await this.loadNotifications();

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
    // Load admin data from API or localStorage
    async loadAdminData() {
      try {
        // Try to get from localStorage first (fallback)
        const savedAdmin = localStorage.getItem('islaAdmin');
        if (savedAdmin) {
          const adminData = JSON.parse(savedAdmin);
          this.admin = { ...adminData };
          this.adminData = { ...adminData };
        } else {
          // Set default empty values
          this.admin = {
            name: 'Admin User',
            email: 'admin@islacafe.com',
            avatar: '/images/admin-avatar.png'
          };
          this.adminData = {
            name: 'Admin User',
            email: 'admin@islacafe.com',
            phone: '+63 912 345 6789',
            role: 'Administrator',
            avatar: '/images/admin-avatar.png',
            stats: {
              lastLogin: '2 hours ago',
              sessions: 1
            }
          };
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
        // Set fallback values
        this.setFallbackAdminData();
      }
    },

    // Load notifications from API
    async loadNotifications() {
      try {
        // This would typically come from an API call
        // For now, we'll set empty array
        this.notifications = [];
      } catch (error) {
        console.error('Error loading notifications:', error);
        this.notifications = [];
      }
    },

    // Set fallback admin data
    setFallbackAdminData() {
      this.admin = {
        name: 'Admin User',
        email: 'admin@islacafe.com',
        avatar: '/images/admin-avatar.png'
      };
      this.adminData = {
        name: 'Admin User',
        email: 'admin@islacafe.com',
        phone: '+63 912 345 6789',
        role: 'Administrator',
        avatar: '/images/admin-avatar.png',
        stats: {
          lastLogin: '2 hours ago',
          sessions: 1
        }
      };
    },

    // Navbar Methods (unchanged)
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

    // Account Methods
    editProfile() {
      this.editForm = { ...this.adminData };
      this.showEditModal = true;
    },
    
    async saveProfile() {
      try {
        this.adminData = { ...this.editForm };
        this.admin.name = this.editForm.name; // Update navbar admin name
        
        // Save to localStorage or API
        localStorage.setItem('islaAdmin', JSON.stringify(this.adminData));
        
        this.showNotification('Profile updated successfully', 'success');
        this.closeModal();
      } catch (error) {
        console.error('Error saving profile:', error);
        this.showNotification('Error updating profile', 'error');
      }
    },
    
    async updatePassword() {
      try {
        if (this.passwordForm.new !== this.passwordForm.confirm) {
          this.showNotification('Passwords do not match', 'error');
          return;
        }
        if (this.passwordForm.new.length < 6) {
          this.showNotification('Password must be at least 6 characters', 'error');
          return;
        }
        
        // Here you would typically make an API call to update the password
        // await api.updatePassword(this.passwordForm);
        
        this.showNotification('Password updated successfully', 'success');
        this.passwordForm = { current: '', new: '', confirm: '' };
      } catch (error) {
        console.error('Error updating password:', error);
        this.showNotification('Error updating password', 'error');
      }
    },
    
    triggerAvatarUpload() {
      this.$refs.avatarInput.click();
    },
    
    handleAvatarUpload(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          this.adminData.avatar = e.target.result;
          this.admin.avatar = e.target.result; // Update navbar avatar too
          
          // Save updated avatar
          localStorage.setItem('islaAdmin', JSON.stringify(this.adminData));
          
          this.showNotification('Avatar updated successfully', 'success');
        };
        reader.readAsDataURL(file);
      }
    },
    
    closeModal() {
      this.showEditModal = false;
    },
    
    showNotification(message, type = 'info') {
      // You can replace this with a proper notification system
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
  background-color: var(--isla-dark-bg);
}

/* Navbar Styles (EXACTLY AS YOU HAD THEM) */
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
  font-size: 14px;
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

/* Sidebar Styles (EXACTLY AS YOU HAD THEM) */
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
  padding: 20px;
  background: #f8f4e9;
  transition: all 0.3s ease;
  overflow-y: auto;
}

.admin-container.dark-mode .admin-content {
  background: var(--isla-dark-bg);
}

/* NEW ACCOUNT CONTENT STYLES (ONLY THIS PART IS MODIFIED) */
.admin-account-content {
  max-width: 1200px;
  margin: 0 auto;
}

/* Header */
.account-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(139, 115, 85, 0.08);
  border: 1px solid rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .account-header {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
  border-color: var(--isla-dark-border);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-text h1 {
  font-size: 28px;
  color: #88592e;
  margin-bottom: 4px;
  font-weight: 700;
}

.admin-container.dark-mode .header-text h1 {
  color: var(--isla-dark-text);
}

.header-text .page-subtitle {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.admin-container.dark-mode .header-text .page-subtitle {
  color: #a0a5c0;
}

/* Buttons */
.btn-primary {
  background: #88592e;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-primary:hover {
  background: #6b451e;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(136, 89, 46, 0.2);
}

.btn-secondary {
  background: #f0e6d8;
  color: #5a3921;
  border: none;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.btn-secondary:hover {
  background: #e0d6c8;
  transform: translateY(-1px);
}

/* Main Layout */
.account-layout {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 24px;
  align-items: start;
}

/* Profile Section */
.profile-section {
  position: sticky;
  top: 20px;
}

.profile-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(139, 115, 85, 0.08);
  border: 1px solid rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .profile-card {
  background: var(--isla-dark-card);
  border-color: var(--isla-dark-border);
}

.profile-header {
  margin-bottom: 20px;
}

.avatar-wrapper {
  position: relative;
  display: inline-block;
  margin-bottom: 16px;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #88592e;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-edit-btn {
  position: absolute;
  bottom: 4px;
  right: 4px;
  width: 32px;
  height: 32px;
  background: #88592e;
  border: 2px solid white;
  border-radius: 50%;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.3s ease;
}

.avatar-edit-btn:hover {
  background: #6b451e;
  transform: scale(1.1);
}

.avatar-file-input {
  display: none;
}

.profile-info h2 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 20px;
  font-weight: 700;
}

.admin-container.dark-mode .profile-info h2 {
  color: var(--isla-dark-text);
}

.profile-role {
  color: #88592e;
  font-weight: 600;
  margin: 0 0 4px 0;
  font-size: 14px;
}

.profile-email {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.admin-container.dark-mode .profile-email {
  color: #a0a5c0;
}

.profile-stats {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 16px;
  border-top: 1px solid rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .profile-stats {
  border-top-color: var(--isla-dark-border);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f5f2;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.admin-container.dark-mode .stat-item {
  background: var(--isla-dark-hover);
}

.stat-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  width: 36px;
  height: 36px;
  background: #88592e;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
}

.stat-content .stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #333;
  margin-bottom: 2px;
}

.admin-container.dark-mode .stat-content .stat-value {
  color: var(--isla-dark-text);
}

.stat-content .stat-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.admin-container.dark-mode .stat-content .stat-label {
  color: #a0a5c0;
}

/* Settings Section */
.settings-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.settings-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(139, 115, 85, 0.08);
  border: 1px solid rgba(139, 115, 85, 0.1);
  overflow: hidden;
}

.admin-container.dark-mode .settings-card {
  background: var(--isla-dark-card);
  border-color: var(--isla-dark-border);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px 24px;
  background: #f8f5f2;
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .card-header {
  background: var(--isla-dark-hover);
  border-bottom-color: var(--isla-dark-border);
}

.card-header i {
  color: #88592e;
  font-size: 16px;
  width: 20px;
  text-align: center;
}

.card-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.admin-container.dark-mode .card-header h3 {
  color: var(--isla-dark-text);
}

.card-content {
  padding: 24px;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item label {
  font-weight: 600;
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.admin-container.dark-mode .info-item label {
  color: #a0a5c0;
}

.info-value {
  color: #333;
  font-weight: 500;
  font-size: 14px;
  padding: 8px 0;
}

.admin-container.dark-mode .info-value {
  color: var(--isla-dark-text);
}

/* Forms */
.security-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group label {
  font-weight: 600;
  color: #333;
  font-size: 13px;
}

.admin-container.dark-mode .form-group label {
  color: var(--isla-dark-text);
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background: white;
}

.admin-container.dark-mode .form-group input {
  background: var(--isla-dark-hover);
  border-color: var(--isla-dark-border);
  color: var(--isla-dark-text);
}

.form-group input:focus {
  outline: none;
  border-color: #88592e;
  box-shadow: 0 0 0 3px rgba(136, 89, 46, 0.1);
}

/* Password Strength */
.password-strength {
  margin: 8px 0;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: #e0e0e0;
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 6px;
}

.admin-container.dark-mode .strength-bar {
  background: var(--isla-dark-border);
}

.strength-fill {
  height: 100%;
  transition: all 0.3s ease;
}

.strength-fill.empty {
  width: 0%;
  background: transparent;
}

.strength-fill.weak {
  width: 33%;
  background: #f44336;
}

.strength-fill.medium {
  width: 66%;
  background: #ff9800;
}

.strength-fill.strong {
  width: 100%;
  background: #4CAF50;
}

.strength-text {
  font-size: 12px;
  font-weight: 600;
  color: #666;
}

.admin-container.dark-mode .strength-text {
  color: #a0a5c0;
}

/* Preferences */
.preference-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
}

.preference-item:last-child {
  border-bottom: none;
}

.admin-container.dark-mode .preference-item {
  border-bottom-color: var(--isla-dark-border);
}

.preference-info h4 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.admin-container.dark-mode .preference-info h4 {
  color: var(--isla-dark-text);
}

.preference-info p {
  margin: 0;
  color: #666;
  font-size: 12px;
}

.admin-container.dark-mode .preference-info p {
  color: #a0a5c0;
}

/* Toggle Switch */
.toggle-switch {
  position: relative;
  display: inline-block;
  width: 50px;
  height: 24px;
}

.toggle-switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 24px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 16px;
  width: 16px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #88592e;
}

input:checked + .slider:before {
  transform: translateX(26px);
}

/* Form Actions */
.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
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
  padding: 20px;
}

.edit-profile-modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-width: 480px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.admin-container.dark-mode .edit-profile-modal {
  background: var(--isla-dark-card);
  color: var(--isla-dark-text);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(139, 115, 85, 0.1);
  background: #f8f5f2;
}

.admin-container.dark-mode .modal-header {
  background: var(--isla-dark-hover);
  border-bottom-color: var(--isla-dark-border);
}

.modal-header h3 {
  margin: 0;
  color: #88592e;
  font-size: 20px;
  font-weight: 600;
}

.admin-container.dark-mode .modal-header h3 {
  color: var(--isla-dark-text);
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #999;
  transition: color 0.3s ease;
  padding: 4px;
  border-radius: 4px;
}

.close-btn:hover {
  color: #333;
  background: rgba(0, 0, 0, 0.1);
}

.admin-container.dark-mode .close-btn:hover {
  color: var(--isla-dark-text);
  background: rgba(255, 255, 255, 0.1);
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.edit-form {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid rgba(139, 115, 85, 0.1);
}

.admin-container.dark-mode .modal-actions {
  border-top-color: var(--isla-dark-border);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .account-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .profile-section {
    position: static;
  }
}

@media (max-width: 768px) {
  .admin-content {
    padding: 16px;
  }
  
  .account-header {
    padding: 20px;
  }
  
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .profile-card,
  .settings-card {
    padding: 20px;
  }
  
  .card-content {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .admin-content {
    padding: 12px;
  }
  
  .account-header {
    padding: 16px;
  }
  
  .header-text h1 {
    font-size: 24px;
  }
  
  .profile-avatar {
    width: 80px;
    height: 80px;
  }
  
  .modal-overlay {
    padding: 16px;
  }
  
  .modal-body {
    padding: 20px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .btn-primary,
  .btn-secondary {
    width: 100%;
    justify-content: center;
  }
}
</style>

<style>
/* Global Dark Mode Styles - Keep this unscoped */
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