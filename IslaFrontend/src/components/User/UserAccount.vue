<template>
  <div class="user-account-container">
    <!-- Navbar Component -->
    <Navbar />

    <!-- Main Content -->
    <div class="user-account-content">
      <!-- Sidebar -->
      <div class="sidebar">
        <div class="user-profile">
          <img :src="user.avatar || '/images/default-avatar.png'" alt="User" class="profile-avatar">
          <div class="profile-info">
            <h3 class="profile-name">{{ user.name }}</h3>
            <p class="profile-email">{{ user.email }}</p>
          </div>
        </div>

        <nav class="sidebar-nav">
          <a 
            href="#" 
            class="nav-link"
            :class="{ active: activeTab === 'dashboard' }"
            @click.prevent="setActiveTab('dashboard')"
          >
            <i class="fas fa-chart-bar nav-icon"></i>
            <span>Dashboard</span>
          </a>
          
          <a 
            href="#" 
            class="nav-link"
            :class="{ active: activeTab === 'wishlist' }"
            @click.prevent="setActiveTab('wishlist')"
          >
            <i class="fas fa-heart nav-icon"></i>
            <span>Wishlist</span>
          </a>
          
          <a 
            href="#" 
            class="nav-link"
            :class="{ active: activeTab === 'orders' }"
            @click.prevent="setActiveTab('orders')"
          >
            <i class="fas fa-box nav-icon"></i>
            <span>My Orders</span>
          </a>
          
          <a 
            href="#" 
            class="nav-link"
            :class="{ active: activeTab === 'addresses' }"
            @click.prevent="setActiveTab('addresses')"
          >
            <i class="fas fa-home nav-icon"></i>
            <span>Addresses</span>
          </a>
          
          <a 
            href="#" 
            class="nav-link"
            :class="{ active: activeTab === 'settings' }"
            @click.prevent="setActiveTab('settings')"
          >
            <i class="fas fa-cog nav-icon"></i>
            <span>Account Settings</span>
          </a>
        </nav>
      </div>

      <!-- Content Area -->
      <div class="content-area">
        <!-- Dashboard View -->
        <div v-if="activeTab === 'dashboard'" class="tab-content">
          <h2 class="tab-title">Dashboard</h2>
          <div class="dashboard-cards">
            <div class="card" @click="showRecentOrdersModal = true">
              <div class="card-icon">
                <i class="fas fa-box"></i>
              </div>
              <div class="card-content">
                <h3>Recent Orders</h3>
                <p>You have {{ recentOrders.length }} recent orders</p>
                <div class="card-link">View All</div>
              </div>
            </div>
            <div class="card" @click="showWishlistModal = true">
              <div class="card-icon">
                <i class="fas fa-heart"></i>
              </div>
              <div class="card-content">
                <h3>Wishlist</h3>
                <p>{{ wishlistItems.length }} items in your wishlist</p>
                <div class="card-link">View Wishlist</div>
              </div>
            </div>
            <div class="card" @click="showAddressesModal = true">
              <div class="card-icon">
                <i class="fas fa-home"></i>
              </div>
              <div class="card-content">
                <h3>Addresses</h3>
                <p>{{ addresses.length }} saved addresses</p>
                <div class="card-link">Manage Addresses</div>
              </div>
            </div>
          </div>
          
          <div class="recent-activity">
            <h3>Recent Activity</h3>
            <div class="activity-list">
              <div v-if="recentActivities.length === 0" class="empty-state">
                <div class="empty-icon">
                  <i class="fas fa-info-circle"></i>
                </div>
                <h3>No recent activity</h3>
                <p>Your recent activity will appear here</p>
              </div>
              <div v-else v-for="activity in recentActivities" :key="activity.id" class="activity-item">
                <div class="activity-icon">
                  <i :class="activity.iconClass"></i>
                </div>
                <div class="activity-details">
                  <p class="activity-text">{{ activity.text }}</p>
                  <span class="activity-time">{{ activity.time }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Wishlist View -->
        <div v-if="activeTab === 'wishlist'" class="tab-content">
          <h2 class="tab-title">My Wishlist</h2>
          <div class="wishlist-grid">
            <div class="empty-state">
              <div class="empty-icon">
                <i class="fas fa-heart"></i>
              </div>
              <h3>Your wishlist is empty</h3>
              <p>Start adding items you love to your wishlist</p>
              <router-link to="/" class="browse-btn">Browse Products</router-link>
            </div>
          </div>
        </div>

        <!-- Orders View -->
        <div v-if="activeTab === 'orders'" class="tab-content">
          <h2 class="tab-title">My Orders</h2>
          <div class="orders-list">
            <div class="empty-state">
              <div class="empty-icon">
                <i class="fas fa-box"></i>
              </div>
              <h3>You haven't placed any orders yet</h3>
              <p>Start shopping to see your orders here</p>
              <router-link to="/" class="browse-btn">Browse Products</router-link>
            </div>
          </div>
        </div>

        <!-- Addresses View -->
        <div v-if="activeTab === 'addresses'" class="tab-content">
          <h2 class="tab-title">My Addresses</h2>
          <div class="addresses-header">
            <h3>Saved Addresses</h3>
            <button class="add-address-btn" @click="showAddAddressForm = true">
              <i class="fas fa-plus"></i> Add New Address
            </button>
          </div>
          
          <div class="addresses-grid">
            <!-- Show address cards if addresses exist -->
            <div v-if="addresses.length > 0" class="addresses-list">
              <div v-for="address in addresses" :key="address.id" class="address-card">
                <div class="address-header">
                  <h4>{{ address.name }}</h4>
                  <div class="address-actions">
                    <button class="edit-btn" @click="editAddress(address)">
                      <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="delete-btn" @click="deleteAddress(address.id)">
                      <i class="fas fa-trash"></i> Delete
                    </button>
                    <button 
                      v-if="!address.is_default" 
                      class="default-btn" 
                      @click="setDefaultAddress(address.id)"
                    >
                      <i class="fas fa-star"></i> Set Default
                    </button>
                  </div>
                </div>
                <div class="address-details">
                  <p><strong>Street:</strong> {{ address.street }}</p>
                  <p><strong>City:</strong> {{ address.city }}</p>
                  <p><strong>Province:</strong> {{ address.province }}</p>
                  <p><strong>ZIP Code:</strong> {{ address.zip_code }}</p>
                  <p><strong>Country:</strong> {{ address.country }}</p>
                  <p class="phone-number"><strong>Phone:</strong> {{ address.phone }}</p>
                </div>
                <div class="address-default" v-if="address.is_default">
                  <span class="default-badge">Default Address</span>
                </div>
              </div>
            </div>
            
            <!-- Show empty state if no addresses -->
            <div v-else class="empty-state">
              <div class="empty-icon">
                <i class="fas fa-home"></i>
              </div>
              <h3>You haven't added any address yet</h3>
              <p>Add your first address to get started</p>
              <button class="browse-btn" @click="showAddAddressForm = true">
                <i class="fas fa-plus"></i> Add Your First Address
              </button>
            </div>
          </div>
          
          <!-- Add/Edit Address Form -->
          <div v-if="showAddAddressForm" class="address-form-overlay">
            <div class="address-form">
              <h3>{{ editingAddress ? 'Edit Address' : 'Add New Address' }}</h3>
              <form @submit.prevent="saveAddress">
                <div class="form-group">
                  <label for="address-name">Address Name *</label>
                  <input 
                    type="text" 
                    id="address-name" 
                    v-model="addressForm.name" 
                    placeholder="Home, Office, etc."
                    required
                  >
                </div>
                <div class="form-group">
                  <label for="street">Street Address *</label>
                  <input 
                    type="text" 
                    id="street" 
                    v-model="addressForm.street" 
                    placeholder="Street name and number"
                    required
                  >
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="city">City *</label>
                    <input 
                      type="text" 
                      id="city" 
                      v-model="addressForm.city" 
                      placeholder="Enter city"
                      required
                    >
                  </div>
                  <div class="form-group">
                    <label for="province">Province *</label>
                    <input 
                      type="text" 
                      id="province" 
                      v-model="addressForm.province" 
                      placeholder="Enter province"
                      required
                    >
                  </div>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label for="zipCode">ZIP Code *</label>
                    <input 
                      type="text" 
                      id="zipCode" 
                      v-model="addressForm.zip_code" 
                      placeholder="Enter ZIP code"
                      required
                    >
                  </div>
                  <div class="form-group">
                    <label for="country">Country *</label>
                    <input 
                      type="text" 
                      id="country" 
                      v-model="addressForm.country" 
                      placeholder="Enter country"
                      required
                    >
                  </div>
                </div>
                <div class="form-group">
                  <label for="phone">Phone Number *</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model="addressForm.phone" 
                    placeholder="Enter phone number"
                    required
                  >
                </div>
                <div class="form-checkbox">
                  <input 
                    type="checkbox" 
                    id="isDefault" 
                    v-model="addressForm.is_default"
                  >
                  <label for="isDefault">Set as default address</label>
                </div>
                <div class="form-actions">
                  <button type="button" class="cancel-btn" @click="cancelAddressForm">Cancel</button>
                  <button type="submit" class="save-btn" :disabled="loading">
                    {{ loading ? 'Saving...' : (editingAddress ? 'Update Address' : 'Save Address') }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <!-- Settings View -->
        <div v-if="activeTab === 'settings'" class="tab-content">
          <h2 class="tab-title">Account Settings</h2>
          <div class="settings-sections">
            <div class="settings-section">
              <h3>Personal Information</h3>
              <form @submit.prevent="updateProfile">
                <div class="form-group">
                  <label for="fullName">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    v-model="user.name" 
                    required
                  >
                </div>
                <div class="form-group">
                  <label for="email">Email Address</label>
                  <input 
                    type="email" 
                    id="email" 
                    v-model="user.email" 
                    required
                    disabled
                  >
                  <small style="color: #666; font-size: 12px;">Email cannot be changed</small>
                </div>
                <div class="form-group">
                  <label for="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    v-model="user.phone" 
                    placeholder="Enter your phone number"
                  >
                </div>
                <button type="submit" class="save-settings-btn" :disabled="loading">
                  {{ loading ? 'Updating...' : 'Update Profile' }}
                </button>
              </form>
            </div>
            
            <div class="settings-section">
              <h3>Change Password</h3>
              <form @submit.prevent="changePassword">
                <div class="form-group">
                  <label for="currentPassword">Current Password</label>
                  <input 
                    type="password" 
                    id="currentPassword" 
                    v-model="passwordForm.currentPassword" 
                    required
                  >
                </div>
                <div class="form-group">
                  <label for="newPassword">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    v-model="passwordForm.newPassword" 
                    required
                  >
                </div>
                <div class="form-group">
                  <label for="confirmPassword">Confirm New Password</label>
                  <input 
                    type="password" 
                    id="confirmPassword" 
                    v-model="passwordForm.confirmPassword" 
                    required
                  >
                </div>
                <button type="submit" class="save-settings-btn" :disabled="loading">
                  {{ loading ? 'Changing...' : 'Change Password' }}
                </button>
              </form>
            </div>
            
            <div class="settings-section">
              <h3>Notification Preferences</h3>
              <div class="notification-settings">
                <div class="notification-item">
                  <input 
                    type="checkbox" 
                    id="emailNotifications" 
                    v-model="notificationSettings.email"
                  >
                  <label for="emailNotifications">Email Notifications</label>
                </div>
                <div class="notification-item">
                  <input 
                    type="checkbox" 
                    id="smsNotifications" 
                    v-model="notificationSettings.sms"
                  >
                  <label for="smsNotifications">SMS Notifications</label>
                </div>
                <div class="notification-item">
                  <input 
                    type="checkbox" 
                    id="promotionalEmails" 
                    v-model="notificationSettings.promotional"
                  >
                  <label for="promotionalEmails">Promotional Emails</label>
                </div>
                <button class="save-settings-btn" @click="saveNotificationSettings" :disabled="loading">
                  {{ loading ? 'Saving...' : 'Save Preferences' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Dashboard Modals -->
    <!-- Recent Orders Modal -->
    <div v-if="showRecentOrdersModal" class="modal-overlay" @click="showRecentOrdersModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Recent Orders</h3>
          <button class="close-btn" @click="showRecentOrdersModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="empty-state">
            <i class="fas fa-box empty-icon"></i>
            <p>No recent orders found</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-close-btn" @click="showRecentOrdersModal = false">Close</button>
        </div>
      </div>
    </div>

    <!-- Wishlist Modal -->
    <div v-if="showWishlistModal" class="modal-overlay" @click="showWishlistModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Your Wishlist</h3>
          <button class="close-btn" @click="showWishlistModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div class="empty-state">
            <i class="fas fa-heart empty-icon"></i>
            <p>Your wishlist is empty</p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-close-btn" @click="showWishlistModal = false">Close</button>
        </div>
      </div>
    </div>

    <!-- Addresses Modal -->
    <div v-if="showAddressesModal" class="modal-overlay" @click="showAddressesModal = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Your Addresses</h3>
          <button class="close-btn" @click="showAddressesModal = false">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="addresses.length === 0" class="empty-state">
            <i class="fas fa-home empty-icon"></i>
            <p>No addresses saved</p>
          </div>
          <div v-else class="addresses-list-modal">
            <div v-for="address in addresses" :key="address.id" class="address-item-modal">
              <div class="address-info-modal">
                <h4>{{ address.name }}</h4>
                <p>{{ address.street }}</p>
                <p>{{ address.city }}, {{ address.province }} {{ address.zip_code }}</p>
                <p>{{ address.country }}</p>
                <p>Phone: {{ address.phone }}</p>
                <div v-if="address.is_default" class="default-badge">Default</div>
              </div>
              <div class="address-actions-modal">
                <button class="edit-btn" @click="editAddress(address)">Edit</button>
                <button class="delete-btn" @click="deleteAddress(address.id)">Delete</button>
                <button 
                  v-if="!address.is_default" 
                  class="default-btn" 
                  @click="setDefaultAddress(address.id)"
                >
                  Set Default
                </button>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="modal-close-btn" @click="showAddressesModal = false">Close</button>
          <button class="add-address-btn" @click="showAddAddressForm = true; showAddressesModal = false;">
            Add New Address
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import Navbar from './Navbar.vue'
import authService from '../../services/auth';
import userService from '../../services/user';

export default {
  name: 'UserAccount',
  components: {
    Navbar
  },
  setup() {
    // Reactive data
    const activeTab = ref('dashboard')
    
    // Modal states
    const showRecentOrdersModal = ref(false)
    const showWishlistModal = ref(false)
    const showAddressesModal = ref(false)
    
    // Loading state
    const loading = ref(false)
    
    // User data
    const user = ref({
      name: '',
      email: '',
      phone: '',
      avatar: '/images/default-avatar.png'
    })
    
    // Empty data arrays
    const cartItems = ref([])
    const wishlistItems = ref([])
    const recentOrders = ref([])
    const recentActivities = ref([])
    const addresses = ref([])
    
    const showAddAddressForm = ref(false)
    const editingAddress = ref(null)
    const addressForm = ref({
      name: '',
      street: '',
      city: '',
      province: '',
      zip_code: '',
      country: 'Philippines',
      phone: '',
      is_default: false
    })
    
    // Settings data
    const passwordForm = ref({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    const notificationSettings = ref({
      email: true,
      sms: false,
      promotional: true
    })

    // Fetch user data from localStorage or API
    const fetchUserProfile = async () => {
      try {
        // First try to get from localStorage (fastest)
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          user.value = {
            name: userData.name || 'User',
            email: userData.email || '',
            phone: userData.phone || '',
            avatar: userData.avatar || '/images/default-avatar.png'
          };
          return;
        }

        // If not in localStorage, try to get from auth service
        const userData = authService.getUser();
        if (userData) {
          user.value = {
            name: userData.name,
            email: userData.email,
            phone: userData.phone || '',
            avatar: userData.avatar || '/images/default-avatar.png'
          };
        } else {
          // If still no data, try API call
          const response = await authService.getProfile();
          if (response && response.user) {
            user.value = {
              name: response.user.name,
              email: response.user.email,
              phone: response.user.phone || '',
              avatar: response.user.avatar || '/images/default-avatar.png'
            };
          }
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        // Final fallback
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          user.value.name = userData.name || 'User';
          user.value.email = userData.email || '';
        }
      }
    }

    // Fetch addresses from database
    const fetchAddresses = async () => {
      try {
        loading.value = true;
        const response = await userService.getAddresses();
        addresses.value = response.addresses || [];
      } catch (error) {
        console.error('Failed to fetch addresses:', error);
        alert('Failed to load addresses. Please try again.');
      } finally {
        loading.value = false;
      }
    }
    
    // Tab navigation
    const setActiveTab = (tab) => {
      activeTab.value = tab;
      if (tab === 'addresses') {
        fetchAddresses();
      }
    }
    
    // Address methods
    const editAddress = (address) => {
      editingAddress.value = address;
      addressForm.value = { 
        ...address,
        is_default: address.is_default === 1 || address.is_default === true
      };
      showAddAddressForm.value = true;
    }
    
    const deleteAddress = async (addressId) => {
      if (confirm('Are you sure you want to delete this address?')) {
        try {
          loading.value = true;
          await userService.deleteAddress(addressId);
          await fetchAddresses(); // Refresh the list
          alert('Address deleted successfully!');
        } catch (error) {
          console.error('Failed to delete address:', error);
          alert('Failed to delete address. Please try again.');
        } finally {
          loading.value = false;
        }
      }
    }
    
    const saveAddress = async () => {
      try {
        loading.value = true;
        
        const addressData = {
          name: addressForm.value.name,
          street: addressForm.value.street,
          city: addressForm.value.city,
          province: addressForm.value.province,
          zip_code: addressForm.value.zip_code,
          country: addressForm.value.country,
          phone: addressForm.value.phone,
          is_default: addressForm.value.is_default ? 1 : 0
        };

        if (editingAddress.value) {
          // Update existing address
          addressData.id = editingAddress.value.id;
          await userService.updateAddress(addressData);
          alert('Address updated successfully!');
        } else {
          // Add new address
          await userService.addAddress(addressData);
          alert('Address added successfully!');
        }
        
        await fetchAddresses(); // Refresh the list
        cancelAddressForm();
      } catch (error) {
        console.error('Error saving address:', error);
        const errorMessage = error.response?.data?.message || 'Failed to save address. Please try again.';
        alert(errorMessage);
      } finally {
        loading.value = false;
      }
    }
    
    const setDefaultAddress = async (addressId) => {
      try {
        loading.value = true;
        await userService.setDefaultAddress(addressId);
        await fetchAddresses(); // Refresh the list
        alert('Default address updated successfully!');
      } catch (error) {
        console.error('Failed to set default address:', error);
        alert('Failed to set default address. Please try again.');
      } finally {
        loading.value = false;
      }
    }
    
    const cancelAddressForm = () => {
      showAddAddressForm.value = false;
      editingAddress.value = null;
      addressForm.value = {
        name: '',
        street: '',
        city: '',
        province: '',
        zip_code: '',
        country: 'Philippines',
        phone: '',
        is_default: false
      };
    }
    
    // Settings methods
    const updateProfile = async () => {
      try {
        loading.value = true;
        await userService.updateProfile({
          name: user.value.name,
          phone: user.value.phone
        });
        
        // Update localStorage with new user data
        const updatedUser = {
          ...JSON.parse(localStorage.getItem('user') || '{}'),
          name: user.value.name,
          phone: user.value.phone
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Failed to update profile:', error);
        const errorMessage = error.response?.data?.message || 'Failed to update profile. Please try again.';
        alert(errorMessage);
      } finally {
        loading.value = false;
      }
    }
    
    const changePassword = async () => {
      try {
        if (passwordForm.value.newPassword !== passwordForm.value.confirmPassword) {
          alert('New passwords do not match!');
          return;
        }
        
        loading.value = true;
        await userService.changePassword(passwordForm.value);
        
        // Reset form
        passwordForm.value = {
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        };
        
        alert('Password changed successfully!');
      } catch (error) {
        console.error('Failed to change password:', error);
        const errorMessage = error.response?.data?.message || 'Failed to change password. Please try again.';
        alert(errorMessage);
      } finally {
        loading.value = false;
      }
    }
    
    const saveNotificationSettings = () => {
      // Show success message
      alert('Notification preferences saved!')
    }

    onMounted(async () => {
      // Fetch user data when component loads
      await fetchUserProfile();
      
      // Load addresses if on addresses tab
      if (activeTab.value === 'addresses') {
        await fetchAddresses();
      }
    })

    return {
      activeTab,
      showRecentOrdersModal,
      showWishlistModal,
      showAddressesModal,
      loading,
      user,
      cartItems,
      wishlistItems,
      recentOrders,
      recentActivities,
      addresses,
      showAddAddressForm,
      editingAddress,
      addressForm,
      passwordForm,
      notificationSettings,
      setActiveTab,
      editAddress,
      deleteAddress,
      saveAddress,
      setDefaultAddress,
      cancelAddressForm,
      updateProfile,
      changePassword,
      saveNotificationSettings,
      fetchAddresses
    }
  },
  watch: {
    activeTab(newTab) {
      if (newTab === 'addresses') {
        this.fetchAddresses();
      }
    }
  }
}
</script>

<style scoped>
/* Color Variables */
:root {
  --dark-brown: #5D4037;
  --brown: #795548;
  --light-brown: #A1887F;
  --beige: #F5F5DC;
  --light-beige: #FFF8E1;
  --gold: #D4AF37;
  --text-light: #FFF8E1;
  --text-dark: #3E2723;
  --container-bg: #F5F5DC;
  --card-bg: #FFF8E1;
  --sidebar-bg: #FFF8E1;


  
}

/* Dark Mode Variables */
@media (prefers-color-scheme: dark) {
  :root {
    --dark-brown: #3E2723;
    --brown: #5D4037;
    --light-brown: #8D6E63;
    --beige: #2A2118;
    --light-beige: #3A2E22;
    --text-light: #FFF8E1;
    --text-dark: #F5F5DC;
    --container-bg: #2A2118;
    --card-bg: #3A2E22;
    --sidebar-bg: #3A2E22;


    
  }
}

/* Base Styles */
.user-account-container {
  background-color: var(--container-bg);
  min-height: 100vh;
}

/* User Account Content Styles */
.user-account-content {
  display: flex;
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  min-height: calc(100vh - 70px);
  margin-top: 20px;
  gap: 25px;
  align-items: flex-start;
}

/* Sidebar Styles - Fixed on Left */
.sidebar {
  width: 280px;
  background: var(--sidebar-bg);
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 25px;
  height: fit-content;
  position: sticky;
  top: 90px; /* Reduced top space */
  flex-shrink: 0;
}

.user-profile {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--light-brown);
}

.profile-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 15px;
  border: 2px solid var(--gold);
}

.profile-info h3 {
  margin: 0 0 5px 0;
  color: var(--text-dark);
  font-size: 18px;
  font-weight: 600;
}

.profile-info p {
  margin: 0;
  color: var(--light-brown);
  font-size: 14px;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.sidebar-nav .nav-link {
  display: flex;
  align-items: center;
  padding: 12px 15px;
  color: var(--text-dark);
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  font-weight: 500;
  gap: 12px;
  cursor: pointer;
  border: 1px solid transparent;
}

.sidebar-nav .nav-link:hover {
  background-color: var(--beige);
  color: var(--dark-brown);
  border-color: var(--light-brown);
}

.sidebar-nav .nav-link.active {
  background-color: var(--dark-brown);
  color: var(--text-light);
  border-color: var(--dark-brown);
}

.nav-icon {
  width: 20px;
  text-align: center;
  font-size: 16px;
}

/* Content Area Styles */
.content-area {
  flex: 1;
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
  padding: 30px;
  border: 1px solid var(--light-brown);
}

.tab-title {
  color: var(--dark-brown);
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 24px;
  font-weight: 600;
}

/* Dashboard Styles */
.dashboard-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  display: flex;
  background: var(--beige);
  border-radius: 10px;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  border: 1px solid var(--light-brown);
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.card-icon {
  font-size: 32px;
  margin-right: 15px;
  color: var(--dark-brown);
  width: 40px;
  text-align: center;
}

.card-content h3 {
  margin: 0 0 8px 0;
  color: var(--text-dark);
  font-size: 16px;
  font-weight: 600;
}

.card-content p {
  margin: 0 0 12px 0;
  color: var(--light-brown);
  font-size: 14px;
}

.card-link {
  color: var(--dark-brown);
  text-decoration: none;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
}

.card-link:hover {
  text-decoration: underline;
}

.recent-activity h3 {
  color: var(--text-dark);
  margin-bottom: 15px;
  font-weight: 600;
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  padding: 15px;
  background: var(--beige);
  border-radius: 8px;
  border: 1px solid var(--light-brown);
}

.activity-icon {
  font-size: 18px;
  margin-right: 12px;
  color: var(--dark-brown);
  width: 20px;
  text-align: center;
}

.activity-details {
  flex: 1;
}

.activity-text {
  margin: 0 0 5px 0;
  color: var(--text-dark);
}

.activity-time {
  color: var(--light-brown);
  font-size: 12px;
}

/* Empty State Styles */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--beige);
  border-radius: 10px;
  border: 1px solid var(--light-brown);
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 20px;
  color: var(--light-brown);
}

.empty-state h3 {
  color: var(--text-dark);
  margin-bottom: 10px;
  font-weight: 600;
}

.empty-state p {
  color: var(--light-brown);
  margin-bottom: 25px;
}

.browse-btn {
  background-color: var(--dark-brown);
  color: var(--text-light);
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: 1px solid var(--dark-brown);
}

.browse-btn:hover {
  background-color: var(--brown);
}

/* Orders Styles */
.orders-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.order-card {
  border: 1px solid var(--light-brown);
  border-radius: 10px;
  padding: 20px;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: var(--beige);
}

.order-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.order-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.order-info h3 {
  margin: 0 0 5px 0;
  color: var(--text-dark);
}

.order-info p {
  margin: 0;
  color: var(--light-brown);
  font-size: 14px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-delivered {
  background-color: #d4edda;
  color: #155724;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-processing {
  background-color: #cce7ff;
  color: #004085;
}

.order-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.order-items p {
  margin: 5px 0;
  color: var(--text-dark);
}

.order-actions {
  display: flex;
  gap: 10px;
}

.view-details-btn, .reorder-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.view-details-btn {
  background-color: var(--beige);
  color: var(--text-dark);
  border: 1px solid var(--light-brown);
}

.view-details-btn:hover {
  background-color: var(--light-beige);
}

.reorder-btn {
  background-color: var(--dark-brown);
  color: var(--text-light);
  border: 1px solid var(--dark-brown);
}

.reorder-btn:hover {
  background-color: var(--brown);
}

/* Addresses Styles */
.addresses-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.addresses-header h3 {
  color: var(--text-dark);
  margin: 0;
  font-weight: 600;
}

.add-address-btn {
  background-color: var(--dark-brown);
  color: var(--text-light);
  border: none;
  padding: 10px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid var(--dark-brown);
}

.add-address-btn:hover {
  background-color: var(--brown);
}

.addresses-grid {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.addresses-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.address-card {
  border: 1px solid var(--light-brown);
  border-radius: 10px;
  padding: 20px;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  background: var(--beige);
}

.address-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.address-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--light-brown);
}

.address-header h4 {
  margin: 0;
  color: var(--text-dark);
  font-size: 18px;
  font-weight: 600;
}

.address-actions {
  display: flex;
  gap: 10px;
}

.edit-btn, .delete-btn, .default-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 5px;
}

.edit-btn {
  background-color: var(--beige);
  color: var(--text-dark);
  border: 1px solid var(--light-brown);
}

.edit-btn:hover {
  background-color: var(--light-beige);
}

.delete-btn {
  background-color: #fee;
  color: #e74c3c;
  border: 1px solid #fdd;
}

.delete-btn:hover {
  background-color: #fdd;
}

.default-btn {
  background-color: #f0f8ff;
  color: #007bff;
  border: 1px solid #007bff;
}

.default-btn:hover {
  background-color: #e3f2fd;
}

.address-details {
  margin-bottom: 15px;
}

.address-details p {
  margin: 8px 0;
  color: var(--text-dark);
  line-height: 1.4;
}

.phone-number {
  margin-top: 10px !important;
  color: var(--light-brown) !important;
}

.address-default {
  margin-top: 15px;
  padding-top: 10px;
  border-top: 1px solid var(--light-brown);
}

.default-badge {
  background-color: var(--dark-brown);
  color: var(--text-light);
  padding: 6px 12px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  display: inline-block;
}

/* Address Form Styles */
.address-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 20px;
}

.address-form {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 30px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid var(--light-brown);
}

.address-form h3 {
  color: var(--dark-brown);
  margin-top: 0;
  margin-bottom: 20px;
  font-weight: 600;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  color: var(--text-dark);
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid var(--light-brown);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  background: var(--beige);
  color: var(--text-dark);
}

.form-group input:focus {
  outline: none;
  border-color: var(--dark-brown);
}

.form-row {
  display: flex;
  gap: 15px;
}

.form-row .form-group {
  flex: 1;
}

.form-checkbox {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.form-checkbox input {
  margin-right: 8px;
}

.form-checkbox label {
  margin: 0;
  color: var(--text-dark);
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.cancel-btn, .save-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.cancel-btn {
  background-color: var(--beige);
  color: var(--text-dark);
  border: 1px solid var(--light-brown);
}

.cancel-btn:hover {
  background-color: var(--light-beige);
}

.save-btn {
  background-color: var(--dark-brown);
  color: var(--text-light);
  border: 1px solid var(--dark-brown);
}

.save-btn:hover {
  background-color: var(--brown);
}

/* Settings Styles */
.settings-sections {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.settings-section {
  border-bottom: 1px solid var(--light-brown);
  padding-bottom: 30px;
}

.settings-section:last-child {
  border-bottom: none;
}

.settings-section h3 {
  color: var(--text-dark);
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: 600;
}

.save-settings-btn {
  background-color: var(--dark-brown);
  color: var(--text-light);
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 10px;
  border: 1px solid var(--dark-brown);
}

.save-settings-btn:hover {
  background-color: var(--brown);
}

.notification-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  display: flex;
  align-items: center;
}

.notification-item input {
  margin-right: 10px;
}

.notification-item label {
  color: var(--text-dark);
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 20px;
}

.modal {
  background: var(--card-bg);
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 80vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid var(--light-brown);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--light-brown);
}

.modal-header h3 {
  margin: 0;
  color: var(--dark-brown);
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: var(--light-brown);
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: var(--text-dark);
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  padding: 20px;
  border-top: 1px solid var(--light-brown);
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.modal-close-btn {
  background-color: var(--beige);
  color: var(--text-dark);
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  border: 1px solid var(--light-brown);
}

.modal-close-btn:hover {
  background-color: var(--light-beige);
}

/* Modal Content Styles */
.orders-list-modal, .wishlist-items-modal, .addresses-list-modal {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.order-item-modal, .wishlist-item-modal, .address-item-modal {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border: 1px solid var(--light-brown);
  border-radius: 8px;
  background: var(--beige);
}

.order-info-modal h4, .item-info-modal h4, .address-info-modal h4 {
  margin: 0 0 5px 0;
  color: var(--text-dark);
}

.order-info-modal p, .item-info-modal p, .address-info-modal p {
  margin: 3px 0;
  color: var(--light-brown);
  font-size: 14px;
}

.item-price {
  color: var(--dark-brown);
  font-weight: 600;
}

.order-actions-modal, .item-actions-modal, .address-actions-modal {
  display: flex;
  gap: 10px;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .user-account-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .sidebar {
    width: 100%;
    position: static;
    top: auto;
  }
  
  .addresses-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  }
}

@media (max-width: 768px) {
  .user-account-content {
    padding: 15px;
    margin-top: 60px;
  }
  
  .content-area {
    padding: 20px;
  }
  
  .dashboard-cards {
    grid-template-columns: 1fr;
  }
  
  .addresses-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  
  .addresses-list {
    grid-template-columns: 1fr;
  }
  
  .address-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
  
  .address-actions {
    flex-wrap: wrap;
  }
}

@media (max-width: 480px) {
  .user-account-content {
    padding: 10px;
  }
  
  .content-area {
    padding: 15px;
  }
  
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  .address-form {
    padding: 20px;
  }
  
  .sidebar {
    padding: 20px;
  }
}

</style>