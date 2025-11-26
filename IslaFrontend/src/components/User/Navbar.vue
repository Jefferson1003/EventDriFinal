<template>
  <nav class="isla-navbar" :class="{ 'isla-dark-mode': isDarkMode }">
    <div class="isla-nav-container">
      <!-- Left side - Logo and Title -->
      <div class="isla-nav-left">
        <router-link to="/user/home" class="isla-logo-link">
          <img src="/images/logo.png" alt="ISLA CAFE" class="isla-logo" @error="handleImageError">
          <span class="isla-brand-name">ISLA CAFE</span>
        </router-link>
      </div>

      <!-- Right side - Navigation items -->
      <div class="isla-nav-right">
        <router-link to="/user/home" class="isla-nav-item" active-class="isla-active-link">
          <span class="isla-nav-link">
            <i class="fas fa-home"></i> Home
          </span>
        </router-link>
        
        <router-link to="/user/menu" class="isla-nav-item" active-class="isla-active-link">
          <span class="isla-nav-link">
            <i class="fas fa-utensils"></i> Menu
          </span>
        </router-link>

        <router-link to="/user/about-us" class="isla-nav-item" active-class="isla-active-link">
          <span class="isla-nav-link">
            <i class="fas fa-user"></i> About Us
          </span>
        </router-link>

        <router-link to="/user/find-store" class="isla-nav-item" active-class="isla-active-link">
          <span class="isla-nav-link">
            <i class="fas fa-map-marker-alt"></i> Find Store
          </span>
        </router-link>

        <!-- Dark/Light Mode Toggle -->
        <div class="isla-nav-item isla-toggle-item" @click="toggleDarkMode">
          <span class="isla-nav-link isla-toggle-link">
            <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
            {{ isDarkMode ? ' Light' : ' Dark' }}
          </span>
        </div>

        <!-- Combined Cart & Wishlist with dropdown -->
        <div class="isla-nav-item isla-dropdown">
          <span class="isla-nav-link isla-cart-toggle" @click="toggleCart">
            <i class="fas fa-shopping-cart"></i> Cart
            <span class="isla-cart-badge" v-if="cartCount > 0">{{ cartCount }}</span>
            <span class="isla-wishlist-badge" v-if="wishlistCount > 0">{{ wishlistCount }}</span>
          </span>
          <div v-if="showCart" class="isla-dropdown-content isla-cart-dropdown" @click.stop>
            <div class="isla-dropdown-tabs">
              <button 
                class="isla-tab-btn" 
                :class="{ 'isla-active': activeCartTab === 'cart' }"
                @click="activeCartTab = 'cart'"
              >
                Cart ({{ cartCount }})
              </button>
              <button 
                class="isla-tab-btn" 
                :class="{ 'isla-active': activeCartTab === 'wishlist' }"
                @click="activeCartTab = 'wishlist'"
              >
                Wishlist ({{ wishlistCount }})
              </button>
            </div>
            
            <!-- Cart Tab Content -->
            <div v-if="activeCartTab === 'cart'" class="isla-tab-content">
              <div class="isla-dropdown-header">
                <h3>Your Cart</h3>
              </div>
              <div class="isla-cart-items">
                <div v-if="cartItems.length === 0" class="isla-empty-cart">
                  <i class="fas fa-shopping-cart"></i>
                  <p>Your cart is empty</p>
                </div>
                <div v-else>
                  <div v-for="item in cartItems" :key="item.id" class="isla-cart-item">
                    <div class="isla-item-image">
                      <img :src="item.image" :alt="item.name" @error="handleImageError">
                    </div>
                    <div class="isla-item-details">
                      <h4>{{ item.name }}</h4>
                      <p class="isla-item-price">₱{{ item.price.toFixed(2) }}</p>
                      <div class="isla-item-quantity">
                        <button @click="decreaseQuantity(item)">-</button>
                        <span>{{ item.quantity }}</span>
                        <button @click="increaseQuantity(item)">+</button>
                      </div>
                    </div>
                    <button class="isla-remove-item" @click="removeFromCart(item)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                  <div class="isla-cart-total">
                    <p>Total: <strong>₱{{ cartTotal.toFixed(2) }}</strong></p>
                    <button class="isla-checkout-btn" @click="proceedToCheckout">
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Wishlist Tab Content -->
            <div v-if="activeCartTab === 'wishlist'" class="isla-tab-content">
              <div class="isla-dropdown-header">
                <h3>Your Wishlist</h3>
              </div>
              <div class="isla-wishlist-items">
                <div v-if="wishlistItems.length === 0" class="isla-empty-wishlist">
                  <i class="fas fa-heart"></i>
                  <p>Your wishlist is empty</p>
                </div>
                <div v-else>
                  <div v-for="item in wishlistItems" :key="item.id" class="isla-wishlist-item">
                    <div class="isla-item-image">
                      <img :src="item.image" :alt="item.name" @error="handleImageError">
                    </div>
                    <div class="isla-item-details">
                      <h4>{{ item.name }}</h4>
                      <p class="isla-item-price">₱{{ item.price.toFixed(2) }}</p>
                      <div class="isla-item-actions">
                        <button class="isla-move-to-cart-btn" @click="moveToCart(item)">
                          <i class="fas fa-shopping-cart"></i> Add to Cart
                        </button>
                      </div>
                    </div>
                    <button class="isla-remove-item" @click="removeFromWishlist(item)">
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- User Account with dropdown -->
        <div class="isla-nav-item isla-dropdown">
          <div class="isla-user-account" @click="toggleUserMenu">
            <img :src="user.avatar" alt="User" class="isla-user-avatar" @error="handleAvatarError">
            <span class="isla-user-name">{{ user.name || 'Account' }}</span>
          </div>
          <div v-if="showUserMenu" class="isla-dropdown-content isla-user-dropdown" @click.stop>
            <div class="isla-user-info">
              <img :src="user.avatar" alt="User" class="isla-user-avatar-large" @error="handleAvatarError">
              <div class="isla-user-details">
                <h4>{{ user.name || 'User' }}</h4>
                <p>{{ user.email || 'user@example.com' }}</p>
              </div>
            </div>
            <div class="isla-dropdown-divider"></div>
            <router-link to="/user/account" class="isla-dropdown-item" @click="closeUserMenu">
              <i class="fas fa-user"></i> My Account
            </router-link>
            <button @click="handleLogout" class="isla-dropdown-item isla-logout-btn">
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  name: 'IslaNavbar',
  data() {
    return {
      showCart: false,
      showUserMenu: false,
      activeCartTab: 'cart',
      isDarkMode: false,
      user: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '/images/default-avatar.png'
      },
      cartItems: [
        {
          id: 1,
          name: 'Cappuccino',
          price: 120.00,
          quantity: 2,
          image: '/images/cappuccino.jpg'
        },
        {
          id: 2,
          name: 'Chocolate Cake',
          price: 85.00,
          quantity: 1,
          image: '/images/chocolate-cake.jpg'
        }
      ],
      wishlistItems: [
        {
          id: 3,
          name: 'Caramel Macchiato',
          price: 135.00,
          image: '/images/caramel-macchiato.jpg'
        }
      ]
    }
  },
  computed: {
    cartCount() {
      return this.cartItems.reduce((total, item) => total + item.quantity, 0)
    },
    wishlistCount() {
      return this.wishlistItems.length
    },
    cartTotal() {
      return this.cartItems.reduce((total, item) => total + (item.price * item.quantity), 0)
    }
  },
  methods: {
    // Navigation methods
    toggleCart() {
      this.showCart = !this.showCart
      this.showUserMenu = false
    },
    
    toggleUserMenu() {
      this.showUserMenu = !this.showUserMenu
      this.showCart = false
    },
    
    closeUserMenu() {
      this.showUserMenu = false
    },

    closeDropdowns() {
      this.showCart = false
      this.showUserMenu = false
    },

    // Dark/Light Mode Toggle
    toggleDarkMode() {
      this.isDarkMode = !this.isDarkMode;
      localStorage.setItem('islaDarkMode', this.isDarkMode);
      
      // Apply to entire body and html for global dark mode
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
        localStorage.removeItem('islaUser');
        localStorage.removeItem('islaAccessToken');
        localStorage.removeItem('islaRefreshToken');
        this.$router.push('/login');
      } catch (error) {
        console.error('Logout error:', error);
        localStorage.removeItem('islaUser');
        localStorage.removeItem('islaAccessToken');
        localStorage.removeItem('islaRefreshToken');
        this.$router.push('/login');
      }
    },

    async fetchUserProfile() {
      try {
        const storedUser = localStorage.getItem('islaUser');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          this.user = {
            name: userData.name || 'User',
            email: userData.email || '',
            avatar: userData.avatar || '/images/default-avatar.png'
          };
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
      }
    },

    // Cart methods
    addToCart(product) {
      const existingItem = this.cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.cartItems.push({
          ...product,
          quantity: 1
        });
      }
      
      this.showCart = true;
      this.activeCartTab = 'cart';
      this.saveCartToStorage();
      this.showNotification('Added to Cart', `${product.name} has been added to your cart`, 'success');
    },

    removeFromCart(item) {
      this.cartItems = this.cartItems.filter(cartItem => cartItem.id !== item.id);
      this.saveCartToStorage();
    },

    increaseQuantity(item) {
      item.quantity++;
      this.saveCartToStorage();
    },

    decreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        this.removeFromCart(item);
      }
      this.saveCartToStorage();
    },

    proceedToCheckout() {
      if (this.cartItems.length === 0) {
        this.showNotification('Cart Empty', 'Your cart is empty!', 'warning');
        return;
      }
      this.$router.push('/checkout');
    },

    // Wishlist methods
    addToWishlist(product) {
      if (!this.wishlistItems.find(item => item.id === product.id)) {
        this.wishlistItems.push({...product});
        this.saveWishlistToStorage();
        this.showNotification('Added to Wishlist', `${product.name} has been added to your wishlist`, 'info');
      }
    },

    removeFromWishlist(item) {
      this.wishlistItems = this.wishlistItems.filter(wishlistItem => wishlistItem.id !== item.id);
      this.saveWishlistToStorage();
    },

    moveToCart(item) {
      this.addToCart(item);
      this.removeFromWishlist(item);
    },

    // Storage methods
    saveCartToStorage() {
      localStorage.setItem('islaCartItems', JSON.stringify(this.cartItems));
    },

    saveWishlistToStorage() {
      localStorage.setItem('islaWishlistItems', JSON.stringify(this.wishlistItems));
    },

    loadCartFromStorage() {
      const savedCart = localStorage.getItem('islaCartItems');
      if (savedCart) {
        this.cartItems = JSON.parse(savedCart);
      }
    },

    loadWishlistFromStorage() {
      const savedWishlist = localStorage.getItem('islaWishlistItems');
      if (savedWishlist) {
        this.wishlistItems = JSON.parse(savedWishlist);
      }
    },

    // Notification method
    showNotification(title, message, type = 'info') {
      console.log(`${title}: ${message}`);
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
      if (!event.target.closest('.isla-dropdown')) {
        this.closeDropdowns();
      }
    }
  },
  mounted() {
    this.fetchUserProfile();
    this.loadCartFromStorage();
    this.loadWishlistFromStorage();
    
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('islaDarkMode');
    if (savedDarkMode) {
      this.isDarkMode = JSON.parse(savedDarkMode);
      if (this.isDarkMode) {
        document.body.classList.add('isla-global-dark-mode');
        document.documentElement.style.setProperty('--isla-dark-bg', '#0f0f14');
        document.documentElement.style.setProperty('--isla-dark-card', '#1a1a24');
        document.documentElement.style.setProperty('--isla-dark-text', '#e0e0e0');
        document.documentElement.style.setProperty('--isla-dark-border', '#2a2a3a');
      }
    }

    // Add Font Awesome if not already loaded
    this.loadFontAwesome();

    // Add click outside listener
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    // Remove event listener when component is destroyed
    document.removeEventListener('click', this.handleClickOutside);
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
.isla-navbar * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.isla-navbar {
  background: #88592e;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
  border-bottom: 3px solid #6b451e;
  transition: all 0.3s ease;
}

/* DARKER DARK MODE - Navbar */
.isla-navbar.isla-dark-mode {
  background: #1a1a24 !important;
  border-bottom-color: #2a2a3a !important;
}

.isla-nav-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  max-width: 100%;
  margin: 0 auto;
  height: 70px;
}

.isla-nav-left .isla-logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
}

.isla-logo {
  height: 40px;
  margin-right: 12px;
  border-radius: 5px;
}

.isla-brand-name {
  font-size: 24px;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
  letter-spacing: 1px;
  transition: color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-brand-name {
  color: #ffffff !important;
}

.isla-nav-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.isla-nav-item {
  position: relative;
}

.isla-nav-link {
  color: #ffffff;
  text-decoration: none;
  font-weight: 600;
  padding: 10px 15px;
  border-radius: 8px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.isla-navbar.isla-dark-mode .isla-nav-link {
  color: #e0e0e0 !important;
}

.isla-nav-link:hover {
  color: #88592e;
  background-color: #ffffff;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

.isla-navbar.isla-dark-mode .isla-nav-link:hover {
  color: #1a1a24 !important;
  background-color: #e0e0e0 !important;
}

.isla-active-link .isla-nav-link {
  color: #88592e;
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.isla-navbar.isla-dark-mode .isla-active-link .isla-nav-link {
  color: #1a1a24 !important;
  background-color: #e0e0e0 !important;
}

/* Toggle specific styles */
.isla-toggle-item .isla-nav-link {
  padding: 10px 15px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.isla-toggle-link {
  font-size: 14px;
}

.isla-cart-toggle {
  position: relative;
}

.isla-user-account {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.isla-user-account:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.isla-navbar.isla-dark-mode .isla-user-account:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.isla-user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #ffffff;
  transition: border-color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-user-avatar {
  border-color: #e0e0e0 !important;
}

.isla-user-name {
  color: #ffffff;
  font-weight: 600;
  transition: color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-user-name {
  color: #e0e0e0 !important;
}

.isla-dropdown {
  position: relative;
}

/* DARKER DARK MODE - Dropdown Content */
.isla-dropdown-content {
  position: absolute;
  top: 100%;
  right: 0;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
  min-width: 320px;
  z-index: 1001;
  margin-top: 10px;
  border: 2px solid #6b451e;
  overflow: hidden;
  transition: all 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-dropdown-content {
  background: #1a1a24 !important;
  border-color: #2a2a3a !important;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
}

.isla-dropdown-header {
  padding: 20px;
  border-bottom: 2px solid #6b451e;
  background: #88592e;
  transition: all 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-dropdown-header {
  background: #2a2a3a !important;
  border-bottom-color: #3a3a4a !important;
}

.isla-dropdown-header h3 {
  margin: 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
  transition: color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-dropdown-header h3 {
  color: #e0e0e0 !important;
}

.isla-dropdown-tabs {
  display: flex;
  border-bottom: 2px solid #6b451e;
  background: #ffffff;
  transition: all 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-dropdown-tabs {
  background: #1a1a24 !important;
  border-bottom-color: #2a2a3a !important;
}

.isla-tab-btn {
  flex: 1;
  padding: 15px;
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #88592e;
  transition: all 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-tab-btn {
  color: #e0e0e0 !important;
}

.isla-tab-btn.isla-active {
  color: #ffffff;
  background: #88592e;
  border-bottom: 3px solid #6b451e;
}

.isla-navbar.isla-dark-mode .isla-tab-btn.isla-active {
  color: #1a1a24 !important;
  background: #e0e0e0 !important;
  border-bottom-color: #88592e !important;
}

.isla-tab-btn:hover {
  background-color: rgba(136, 89, 46, 0.1);
}

.isla-navbar.isla-dark-mode .isla-tab-btn:hover {
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.isla-tab-content {
  max-height: 400px;
  overflow-y: auto;
  background: #ffffff;
  transition: all 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-tab-content {
  background: #1a1a24 !important;
}

/* BROWN SCROLL BAR */
.isla-tab-content::-webkit-scrollbar {
  width: 8px;
}

.isla-tab-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 4px;
}

.isla-tab-content::-webkit-scrollbar-thumb {
  background: #88592e;
  border-radius: 4px;
}

.isla-tab-content::-webkit-scrollbar-thumb:hover {
  background: #6b451e;
}

.isla-navbar.isla-dark-mode .isla-tab-content::-webkit-scrollbar-track {
  background: #2a2a3a !important;
}

.isla-navbar.isla-dark-mode .isla-tab-content::-webkit-scrollbar-thumb {
  background: #88592e !important;
}

.isla-navbar.isla-dark-mode .isla-tab-content::-webkit-scrollbar-thumb:hover {
  background: #a67c52 !important;
}

.isla-cart-items, .isla-wishlist-items {
  padding: 20px;
}

.isla-empty-cart, .isla-empty-wishlist {
  text-align: center;
  color: #88592e;
  padding: 40px 20px;
  transition: color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-empty-cart,
.isla-navbar.isla-dark-mode .isla-empty-wishlist {
  color: #a0a5c0 !important;
}

.isla-empty-cart i, .isla-empty-wishlist i {
  font-size: 48px;
  margin-bottom: 15px;
  display: block;
  color: #88592e;
  opacity: 0.6;
  transition: color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-empty-cart i,
.isla-navbar.isla-dark-mode .isla-empty-wishlist i {
  color: #3a3f5d !important;
  opacity: 0.4;
}

.isla-cart-item, .isla-wishlist-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #e0e0e0;
  gap: 12px;
  transition: border-color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-cart-item,
.isla-navbar.isla-dark-mode .isla-wishlist-item {
  border-bottom-color: #2a2a3a !important;
}

.isla-item-image {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  overflow: hidden;
  border: 2px solid #88592e;
  flex-shrink: 0;
  transition: border-color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-item-image {
  border-color: #88592e !important;
}

.isla-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.isla-item-details {
  flex: 1;
  min-width: 0;
}

.isla-item-details h4 {
  margin: 0 0 8px 0;
  font-size: 15px;
  color: #333333;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-item-details h4 {
  color: #e0e0e0 !important;
}

.isla-item-price {
  color: #88592e;
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 8px;
  transition: color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-item-price {
  color: #a67c52 !important;
}

.isla-item-quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.isla-item-quantity button {
  width: 28px;
  height: 28px;
  border: 2px solid #88592e;
  background: #ffffff;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #88592e;
  font-weight: bold;
  transition: all 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-item-quantity button {
  background: #1a1a24 !important;
  border-color: #88592e !important;
  color: #88592e !important;
}

.isla-item-quantity button:hover {
  background: #88592e;
  color: #ffffff;
}

.isla-navbar.isla-dark-mode .isla-item-quantity button:hover {
  background: #88592e !important;
  color: #1a1a24 !important;
}

.isla-item-actions {
  margin-top: 10px;
}

.isla-move-to-cart-btn {
  background: #88592e;
  color: #ffffff;
  border: none;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 5px;
  transition: all 0.3s ease;
  font-weight: 600;
}

.isla-move-to-cart-btn:hover {
  background: #6b451e;
  transform: translateY(-2px);
}

.isla-remove-item {
  background: none;
  border: none;
  color: #e74c3c;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.isla-remove-item:hover {
  background: #e74c3c;
  color: white;
}

.isla-cart-total {
  padding: 20px 0;
  border-top: 3px solid #88592e;
  text-align: center;
  background: rgba(136, 89, 46, 0.1);
  transition: all 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-cart-total {
  background: rgba(42, 42, 58, 0.3) !important;
  border-top-color: #88592e !important;
}

.isla-cart-total p {
  margin: 0 0 15px 0;
  font-size: 18px;
  font-weight: 700;
  color: #88592e;
  transition: color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-cart-total p {
  color: #e0e0e0 !important;
}

.isla-checkout-btn {
  width: 100%;
  padding: 15px;
  background: #88592e;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 16px;
}

.isla-checkout-btn:hover {
  background: #6b451e;
  transform: translateY(-2px);
}

/* DARKER DARK MODE - User Dropdown */
.isla-user-dropdown {
  min-width: 250px;
}

.isla-user-info {
  display: flex;
  align-items: center;
  padding: 20px;
  gap: 15px;
  background: #88592e;
  transition: all 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-user-info {
  background: #2a2a3a !important;
}

.isla-user-avatar-large {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid #ffffff;
  flex-shrink: 0;
  transition: border-color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-user-avatar-large {
  border-color: #e0e0e0 !important;
}

.isla-user-details {
  flex: 1;
  min-width: 0;
}

.isla-user-details h4 {
  margin: 0 0 5px 0;
  color: #ffffff;
  font-size: 18px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-user-details h4 {
  color: #e0e0e0 !important;
}

.isla-user-details p {
  margin: 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-user-details p {
  color: rgba(224, 224, 224, 0.8) !important;
}

.isla-dropdown-divider {
  height: 2px;
  background: #88592e;
  margin: 0;
  transition: background 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-dropdown-divider {
  background: #2a2a3a !important;
}

.isla-dropdown-item {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  color: #88592e;
  text-decoration: none;
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 15px;
  gap: 12px;
  font-weight: 600;
}

.isla-navbar.isla-dark-mode .isla-dropdown-item {
  color: #e0e0e0 !important;
}

.isla-dropdown-item:hover {
  background: #88592e;
  color: #ffffff;
}

.isla-navbar.isla-dark-mode .isla-dropdown-item:hover {
  background: #e0e0e0 !important;
  color: #1a1a24 !important;
}

.isla-logout-btn {
  color: #e74c3c;
}

.isla-logout-btn:hover {
  color: #ffffff;
  background: #e74c3c;
}

.isla-navbar.isla-dark-mode .isla-logout-btn:hover {
  color: #1a1a24 !important;
  background: #e74c3c !important;
}

.isla-cart-badge, .isla-wishlist-badge {
  position: absolute;
  top: -5px;
  right: -5px;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  border: 2px solid #ffffff;
  pointer-events: none;
  transition: border-color 0.3s ease;
}

.isla-navbar.isla-dark-mode .isla-cart-badge {
  border-color: #1a1a24 !important;
}

.isla-wishlist-badge {
  background: #88592e;
  top: -5px;
  right: 10px;
}

.isla-navbar.isla-dark-mode .isla-wishlist-badge {
  border-color: #1a1a24 !important;
}

/* Responsive Design */
@media (max-width: 768px) {
  .isla-nav-right {
    gap: 10px;
  }

  .isla-user-name {
    display: none;
  }

  .isla-dropdown-content {
    min-width: 280px;
    right: -10px;
  }

  .isla-nav-link {
    padding: 8px 10px;
    font-size: 13px;
  }

  .isla-toggle-item .isla-nav-link {
    width: auto;
    height: auto;
  }

  .isla-brand-name {
    font-size: 20px;
  }

  .isla-logo {
    height: 32px;
    margin-right: 8px;
  }
}

@media (max-width: 480px) {
  .isla-nav-container {
    padding: 0 10px;
  }

  .isla-dropdown-content {
    min-width: 250px;
    right: -5px;
  }

  .isla-nav-link {
    padding: 6px 8px;
    font-size: 12px;
  }

  .isla-brand-name {
    font-size: 18px;
  }
}
</style>

<style>
/* Global Dark Mode Styles - Keep this unscoped */
.isla-global-dark-mode {
  background-color: #0f0f14 !important;
  color: #e0e0e0 !important;
}

.isla-global-dark-mode .isla-dropdown-content {
  background: #1a1a24 !important;
  color: #e0e0e0 !important;
}

.isla-global-dark-mode .isla-tab-content {
  background: #1a1a24 !important;
}
</style>