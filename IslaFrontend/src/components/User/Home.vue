<template>
  <div class="user-home-container" :class="{ 'isla-global-dark-mode': sharedDarkMode }">
    <!-- Navigation Bar -->
    <Navbar 
      :cart-items="sharedCartItems"
      :wishlist-items="sharedWishlistItems"
      :is-dark-mode="sharedDarkMode"
      @add-to-cart="handleAddToCart"
      @remove-from-cart="handleRemoveFromCart"
      @increase-quantity="handleIncreaseQuantity"
      @decrease-quantity="handleDecreaseQuantity"
      @toggle-dark-mode="handleToggleDarkMode"
      @add-to-wishlist="handleAddToWishlist"
      @remove-from-wishlist="handleRemoveFromWishlist"
      @move-to-cart="handleMoveToCart"
    />
   
    <!-- Main Home Content -->
    <main class="home-main">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="hero-content">
          <h1 class="hero-title">Welcome to ISLA CAFE</h1>
          <p class="hero-subtitle">Experience the finest coffee and delicious pastries in town</p>
          <button class="cta-button" @click="scrollToProducts">
            <i class="fas fa-coffee"></i>
            Order Now
          </button>
        </div>
        <div class="hero-image">
          <img src="/images/branch1.png" alt="Coffee" class="hero-img" @error="handleImageError">
        </div>
      </section>

      <!-- Ad Slider Section -->
      <section class="ad-slider-section">
        <div class="slider-container">
          <div class="slider-track" :style="{ transform: `translateX(-${currentSlide * 100}%)` }">
            <div class="slide" v-for="(ad, index) in ads" :key="index">
              <img :src="ad.image" :alt="ad.title" @error="handleImageError">
              <div class="slide-content">
                <h3>{{ ad.title }}</h3>
                <p>{{ ad.description }}</p>
                <button class="slide-btn" @click="handleAdClick(ad)">{{ ad.buttonText }}</button>
              </div>
            </div>
          </div>
          <button class="slider-nav prev" @click="prevSlide">
            <i class="fas fa-chevron-left"></i>
          </button>
          <button class="slider-nav next" @click="nextSlide">
            <i class="fas fa-chevron-right"></i>
          </button>
          <div class="slider-dots">
            <span 
              v-for="(ad, index) in ads" 
              :key="index" 
              :class="{ active: currentSlide === index }"
              @click="goToSlide(index)"
            ></span>
          </div>
        </div>
      </section>

      <!-- Featured Categories -->
      <section class="categories-section">
        <h2 class="section-title">Our Categories</h2>
        <div class="categories-grid">
          <div class="category-card" v-for="category in categories" :key="category.id" 
               @click="filterByCategory(category.id)">
            <div class="category-icon">
              <i :class="category.icon"></i>
            </div>
            <h3>{{ category.name }}</h3>
            <p>{{ category.description }}</p>
          </div>
        </div>
      </section>

      <!-- Featured Products -->
      <section class="products-section" id="products">
        <div class="section-header">
          <h2 class="section-title">Featured Products</h2>
          <div class="view-all" @click="viewAllProducts">
            View All <i class="fas fa-arrow-right"></i>
          </div>
        </div>

        <div class="products-grid">
          <div class="product-card" v-for="product in displayedProducts" :key="product.id">
            <div class="product-image">
              <img :src="product.image" :alt="product.name" @error="handleImageError">
              <button class="wishlist-btn" @click.stop="toggleWishlistProduct(product)">
                <i class="fas fa-heart" :class="{ active: isInWishlist(product) }"></i>
              </button>
            </div>
            <div class="product-info">
              <h3 class="product-name">{{ product.name }}</h3>
              <p class="product-description">{{ product.description }}</p>
              <div class="product-price">₱{{ product.price }}</div>
              <div class="product-rating">
                <i class="fas fa-star" v-for="star in 5" :key="star" 
                   :class="{ filled: star <= product.rating }"></i>
                <span>({{ product.reviews }})</span>
              </div>
              <button class="add-to-cart-btn" @click="addToCartFromHome(product)">
                <i class="fas fa-shopping-cart"></i>
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Newsletter -->
      <section class="newsletter-section">
        <div class="newsletter-content">
          <h2>Stay Updated</h2>
          <p>Subscribe to our newsletter for exclusive offers and updates</p>
          <div class="newsletter-form">
            <input type="email" placeholder="Enter your email" v-model="email">
            <button @click="subscribeNewsletter">Subscribe</button>
          </div>
        </div>
      </section>
    </main>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';

export default {
  name: 'UserHome',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      sharedDarkMode: false,
      sharedCartItems: [],
      sharedWishlistItems: [],
      email: '',
      currentSlide: 0,
      autoSlideInterval: null,
      ads: [
        {
          title: "Summer Special",
          description: "Cool down with our refreshing iced beverages",
          image: "/images/branch1.png",
          buttonText: "Explore Summer Menu"
        },
        {
          title: "Weekend Brunch",
          description: "Enjoy 20% off all pastries every weekend",
          image: "/images/branch1.png",
          buttonText: "View Weekend Deals"
        },
        {
          title: "New Coffee Blends",
          description: "Discover our exclusive single-origin coffee collection",
          image: "/images/branch1.png",
          buttonText: "Try New Blends"
        },
        {
          title: "Happy Hour",
          description: "50% off on all drinks from 3PM to 5PM",
          image: "/images/branch1.png",
          buttonText: "See Happy Hour Menu"
        },
        {
          title: "Seasonal Favorites",
          description: "Try our limited edition autumn specials",
          image: "/images/branch1.png",
          buttonText: "Explore Seasonal Menu"
        },
        {
          title: "Loyalty Program",
          description: "Join our loyalty program and earn free drinks",
          image: "/images/branch1.png",
          buttonText: "Join Now"
        }
      ],
      categories: [
        {
          id: 1,
          name: 'Coffee',
          icon: 'fas fa-coffee',
          description: 'Hot and cold coffee varieties'
        },
        {
          id: 2,
          name: 'Tea',
          icon: 'fas fa-mug-hot',
          description: 'Traditional and herbal teas'
        },
        {
          id: 3,
          name: 'Pastries',
          icon: 'fas fa-cookie',
          description: 'Freshly baked goods'
        },
        {
          id: 4,
          name: 'Sandwiches',
          icon: 'fas fa-bread-slice',
          description: 'Hearty sandwiches and wraps'
        }
      ],
      featuredProducts: [
        {
          id: 1,
          name: 'Caramel Macchiato',
          description: 'Rich espresso with caramel and steamed milk',
          price: 180,
          image: '/images/caramel-macchiato.jpg',
          rating: 5,
          reviews: 124
        },
        {
          id: 2,
          name: 'Blueberry Muffin',
          description: 'Freshly baked muffin with blueberries',
          price: 95,
          image: '/images/blueberry-muffin.jpg',
          rating: 4,
          reviews: 89
        },
        {
          id: 3,
          name: 'Iced Americano',
          description: 'Chilled espresso with ice',
          price: 120,
          image: '/images/iced-americano.jpg',
          rating: 4,
          reviews: 67
        },
        {
          id: 4,
          name: 'Chocolate Croissant',
          description: 'Flaky croissant with chocolate filling',
          price: 110,
          image: '/images/chocolate-croissant.jpg',
          rating: 5,
          reviews: 156
        },
        {
          id: 5,
          name: 'Cappuccino',
          description: 'Perfect blend of espresso and steamed milk',
          price: 150,
          image: '/images/cappuccino.jpg',
          rating: 5,
          reviews: 98
        },
        {
          id: 6,
          name: 'Matcha Latte',
          description: 'Creamy matcha green tea with milk',
          price: 160,
          image: '/images/matcha-latte.jpg',
          rating: 4,
          reviews: 76
        },
        {
          id: 7,
          name: 'Ham Cheese Croissant',
          description: 'Buttery croissant with ham and cheese',
          price: 120,
          image: '/images/ham-cheese-croissant.jpg',
          rating: 4,
          reviews: 112
        },
        {
          id: 8,
          name: 'Cookies & Cream Frappe',
          description: 'Blended ice cream with cookies',
          price: 190,
          image: '/images/cookies-cream-frappe.jpg',
          rating: 5,
          reviews: 134
        }
      ]
    }
  },
  computed: {
    displayedProducts() {
      return this.featuredProducts.slice(0, 8); // Show first 8 products
    }
  },
  methods: {
    // SHARED CART METHODS
    handleAddToCart(product) {
      const existingItem = this.sharedCartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity++;
      } else {
        this.sharedCartItems.push({
          ...product,
          quantity: 1
        });
      }
      
      this.saveCartToStorage();
      this.showNotification('Added to Cart', `${product.name} has been added to your cart`, 'success');
    },

    handleRemoveFromCart(item) {
      this.sharedCartItems = this.sharedCartItems.filter(cartItem => cartItem.id !== item.id);
      this.saveCartToStorage();
      this.showNotification('Removed from Cart', `${item.name} has been removed from your cart`, 'info');
    },

    handleIncreaseQuantity(item) {
      item.quantity++;
      this.saveCartToStorage();
    },

    handleDecreaseQuantity(item) {
      if (item.quantity > 1) {
        item.quantity--;
        this.saveCartToStorage();
      } else {
        this.handleRemoveFromCart(item);
      }
    },

    // SHARED WISHLIST METHODS
    handleAddToWishlist(product) {
      if (!this.sharedWishlistItems.find(item => item.id === product.id)) {
        this.sharedWishlistItems.push({...product});
        this.saveWishlistToStorage();
        this.showNotification('Added to Wishlist', `${product.name} has been added to your wishlist`, 'info');
      }
    },

    handleRemoveFromWishlist(item) {
      this.sharedWishlistItems = this.sharedWishlistItems.filter(wishlistItem => wishlistItem.id !== item.id);
      this.saveWishlistToStorage();
      this.showNotification('Removed from Wishlist', `${item.name} has been removed from your wishlist`, 'info');
    },

    handleMoveToCart(item) {
      this.handleAddToCart(item);
      this.handleRemoveFromWishlist(item);
    },

    // DARK MODE HANDLER
    handleToggleDarkMode() {
      this.sharedDarkMode = !this.sharedDarkMode;
      localStorage.setItem('islaDarkMode', this.sharedDarkMode);
      this.applyDarkModeStyles();
      
      // Emit event to let navbar know about dark mode change
      this.$emit('dark-mode-toggled', this.sharedDarkMode);
    },

    applyDarkModeStyles() {
      if (this.sharedDarkMode) {
        document.body.classList.add('isla-global-dark-mode');
        document.documentElement.style.setProperty('--isla-dark-bg', '#0f0f14');
        document.documentElement.style.setProperty('--isla-dark-card', '#1a1a24');
        document.documentElement.style.setProperty('--isla-dark-text', '#e0e0e0');
        document.documentElement.style.setProperty('--isla-dark-border', '#2a2a3a');
        document.documentElement.style.setProperty('--isla-dark-input', '#2a2a3a');
        document.documentElement.style.setProperty('--isla-dark-secondary', '#2a2a3a');
      } else {
        document.body.classList.remove('isla-global-dark-mode');
        document.documentElement.style.removeProperty('--isla-dark-bg');
        document.documentElement.style.removeProperty('--isla-dark-card');
        document.documentElement.style.removeProperty('--isla-dark-text');
        document.documentElement.style.removeProperty('--isla-dark-border');
        document.documentElement.style.removeProperty('--isla-dark-input');
        document.documentElement.style.removeProperty('--isla-dark-secondary');
      }
    },

    // SLIDER METHODS
    nextSlide() {
      this.currentSlide = (this.currentSlide + 1) % this.ads.length;
    },

    prevSlide() {
      this.currentSlide = (this.currentSlide - 1 + this.ads.length) % this.ads.length;
    },

    goToSlide(index) {
      this.currentSlide = index;
    },

    startAutoSlide() {
      this.autoSlideInterval = setInterval(() => {
        this.nextSlide();
      }, 4000); // Change slide every 4 seconds
    },

    stopAutoSlide() {
      if (this.autoSlideInterval) {
        clearInterval(this.autoSlideInterval);
        this.autoSlideInterval = null;
      }
    },

    handleAdClick(ad) {
      this.showNotification('Special Offer', `Exploring ${ad.title}`, 'info');
      // You can add navigation logic here based on the ad
    },

    // HOME-SPECIFIC METHODS
    addToCartFromHome(product) {
      this.handleAddToCart(product);
    },

    // Image error handling
    handleImageError(event) {
      console.log('Image failed to load:', event.target.src);
      // Create a placeholder image with the brown theme
      event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjhGNUYyIi8+CjxwYXRoIGQ9Ik0zMCAzNEMzMy4zMTM3IDM0IDM2IDMxLjMxMzcgMzYgMjhDMzYgMjQuNjg2MyAzMy4zMTM3IDIyIDMwIDIyQzI2LjY4NjMgMjIgMjQgMjQuNjg2MyAyNCAyOEMyNCAzMS4zMTM3IDI2LjY4NjMgMzQgMzAgMzRaIiBmaWxsPSIjODg1OTJFIi8+CjxwYXRoIGQ9Ik0zOCAzOEgyMkMyMC44OTU0IDM4IDIwIDM3LjEwNDYgMjAgMzZWMjJDMjAgMjAuODk1NCAyMC44OTU0IDIwIDIyIDIwSDM4QzM5LjEwNDYgMjAgNDAgMjAuODk1NCA0MCAyMlYzNkM0MCAzNy4xMDQ2IDM5LjEwNDYgMzggMzggMzhaTTIyIDIyVjM2SDM4VjIySDIyWiIgZmlsbD0iIzg4NTkyRSIvPgo8L3N2Zz4K';
    },

    // UI methods
    scrollToProducts() {
      const element = document.getElementById('products');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    },

    filterByCategory(categoryId) {
      const category = this.categories.find(c => c.id === categoryId);
      this.showNotification('Category Selected', `Showing ${category.name} products`, 'info');
      // Add actual filtering logic here
    },

    viewAllProducts() {
      this.showNotification('View All Products', 'Navigating to full product catalog', 'info');
      // Add navigation logic here
    },

    subscribeNewsletter() {
      if (!this.email) {
        this.showNotification('Error', 'Please enter your email address', 'error');
        return;
      }
      
      if (!this.validateEmail(this.email)) {
        this.showNotification('Error', 'Please enter a valid email address', 'error');
        return;
      }
      
      this.showNotification('Subscribed!', 'Thank you for subscribing to our newsletter', 'success');
      this.email = '';
    },

    validateEmail(email) {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return re.test(email);
    },

    // Wishlist methods for home page
    toggleWishlistProduct(product) {
      if (this.isInWishlist(product)) {
        this.handleRemoveFromWishlist(product);
      } else {
        this.handleAddToWishlist(product);
      }
    },

    isInWishlist(product) {
      return this.sharedWishlistItems.some(item => item.id === product.id);
    },

    // Storage methods
    saveCartToStorage() {
      localStorage.setItem('islaCartItems', JSON.stringify(this.sharedCartItems));
    },

    saveWishlistToStorage() {
      localStorage.setItem('islaWishlistItems', JSON.stringify(this.sharedWishlistItems));
    },

    loadCartFromStorage() {
      try {
        const savedCart = localStorage.getItem('islaCartItems');
        if (savedCart) {
          this.sharedCartItems = JSON.parse(savedCart);
        }
      } catch (error) {
        console.error('Error loading cart from storage:', error);
        this.sharedCartItems = [];
      }
    },

    loadWishlistFromStorage() {
      try {
        const savedWishlist = localStorage.getItem('islaWishlistItems');
        if (savedWishlist) {
          this.sharedWishlistItems = JSON.parse(savedWishlist);
        }
      } catch (error) {
        console.error('Error loading wishlist from storage:', error);
        this.sharedWishlistItems = [];
      }
    },

    // Notification method
    showNotification(title, message, type = 'info') {
      console.log(`[${type.toUpperCase()}] ${title}: ${message}`);
      // Using alert for simplicity - replace with toast notification in production
      alert(`${title}\n${message}`);
    },

    // Load Font Awesome
    loadFontAwesome() {
      if (document.querySelector('link[href*="font-awesome"]')) {
        return;
      }

      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
      document.head.appendChild(link);
    }
  },
  mounted() {
    // Check for saved dark mode preference
    const savedDarkMode = localStorage.getItem('islaDarkMode');
    if (savedDarkMode) {
      this.sharedDarkMode = JSON.parse(savedDarkMode);
      this.applyDarkModeStyles();
    }

    // Load cart and wishlist from storage
    this.loadCartFromStorage();
    this.loadWishlistFromStorage();

    // Load Font Awesome if not already loaded
    this.loadFontAwesome();

    // Start auto slide
    this.startAutoSlide();
  },
  beforeUnmount() {
    // Clean up auto slide interval
    this.stopAutoSlide();
  }
}
</script>

<style scoped>
/* CSS Variables for consistent theming */
:root {
  --primary-brown: #88592e;
  --dark-brown: #6b451e;
  --light-beige: #f8f5f2;
  --beige: #e8dfd6;
  --dark-beige: #d4c9bd;
  --white: #ffffff;
  --text-dark: #5a5a5a;
  --text-light: #888888;
  --gold: #ffc107;
  --red: #e74c3c;
  
  /* Dark mode variables */
  --isla-dark-bg: #0f0f14;
  --isla-dark-card: #1a1a24;
  --isla-dark-text: #e0e0e0;
  --isla-dark-border: #2a2a3a;
  --isla-dark-input: #2a2a3a;
  --isla-dark-secondary: #2a2a3a;
}

/* Base container with proper navbar spacing */
.user-home-container {
  position: relative;
  min-height: 100vh;
  background-color: var(--light-beige);
  transition: all 0.3s ease;
}

.user-home-container.isla-global-dark-mode {
  background-color: var(--isla-dark-bg) !important;
  color: var(--isla-dark-text) !important;
}

/* Main content - CRITICAL FIX for navbar */
.home-main {
  position: relative;
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px 0 20px; /* Adequate top padding for fixed navbar */
  z-index: 1; /* Lower than navbar */
}

/* Ensure all sections have proper z-index */
.hero-section,
.ad-slider-section,
.categories-section,
.products-section,
.newsletter-section {
  position: relative;
  z-index: 1;
}

/* Hero Section */
.hero-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: center;
  padding: 40px 0;
  min-height: 70vh;
  background: linear-gradient(to right, var(--light-beige) 0%, var(--beige) 100%);
  border-radius: 20px;
  margin-bottom: 40px;
  box-shadow: 0 10px 30px rgba(136, 89, 46, 0.1);
}

.isla-global-dark-mode .hero-section {
  background: linear-gradient(to right, var(--isla-dark-card) 0%, var(--isla-dark-secondary) 100%) !important;
}

.hero-content {
  text-align: left;
  padding-left: 20px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--primary-brown);
  margin-bottom: 20px;
  line-height: 1.2;
}

.isla-global-dark-mode .hero-title {
  color: var(--isla-dark-text) !important;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: var(--text-dark);
  margin-bottom: 30px;
  line-height: 1.6;
}

.isla-global-dark-mode .hero-subtitle {
  color: var(--isla-dark-text) !important;
  opacity: 0.9;
}

.cta-button {
  background: linear-gradient(135deg, var(--primary-brown) 0%, var(--dark-brown) 100%);
  color: var(--white);
  border: none;
  padding: 15px 30px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 4px 15px rgba(136, 89, 46, 0.3);
}

.cta-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(136, 89, 46, 0.4);
}

.hero-image {
  text-align: center;
}

.hero-img {
  max-width: 100%;
  height: auto;
  border-radius: 15px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
}

/* Ad Slider Section */
.ad-slider-section {
  margin: 60px 0;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  background: var(--beige);
  padding: 20px;
}

.isla-global-dark-mode .ad-slider-section {
  background: var(--isla-dark-card) !important;
}

.slider-container {
  position: relative;
  width: 100%;
  height: 400px;
  overflow: hidden;
  border-radius: 20px;
}

.slider-track {
  display: flex;
  transition: transform 0.5s ease-in-out;
  height: 100%;
}

.slide {
  min-width: 100%;
  height: 100%;
  position: relative;
}

.slide img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.slide-content {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(136, 89, 46, 0.8));
  color: var(--white);
  padding: 40px;
  text-align: center;
}

.slide-content h3 {
  font-size: 2rem;
  margin-bottom: 10px;
  font-weight: 600;
}

.slide-content p {
  font-size: 1.1rem;
  margin-bottom: 20px;
  opacity: 0.9;
}

.slide-btn {
  background: var(--primary-brown);
  color: var(--white);
  border: none;
  padding: 12px 30px;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

.slide-btn:hover {
  background: var(--dark-brown);
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
}

.slider-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(136, 89, 46, 0.8);
  border: none;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  color: var(--white);
}

.slider-nav:hover {
  background: var(--dark-brown);
  transform: translateY(-50%) scale(1.1);
}

.slider-nav.prev {
  left: 20px;
}

.slider-nav.next {
  right: 20px;
}

.slider-dots {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 10px;
}

.slider-dots span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
}

.slider-dots span.active {
  background: var(--white);
  transform: scale(1.2);
}

.slider-dots span:hover {
  background: var(--white);
}

/* Section Titles */
.section-title {
  text-align: center;
  font-size: 2.5rem;
  color: var(--primary-brown);
  margin-bottom: 50px;
  font-weight: 600;
}

.isla-global-dark-mode .section-title {
  color: var(--isla-dark-text) !important;
}

/* Categories Section */
.categories-section,
.products-section {
  padding: 80px 0;
}

.categories-section {
  background: var(--beige);
  border-radius: 20px;
  margin: 40px 0;
  padding: 60px 40px;
  box-shadow: 0 10px 30px rgba(136, 89, 46, 0.1);
}

.isla-global-dark-mode .categories-section {
  background: var(--isla-dark-card) !important;
  color: var(--isla-dark-text) !important;
  border: 1px solid var(--isla-dark-border);
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.category-card {
  background: var(--light-beige);
  padding: 40px 30px;
  border-radius: 15px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.isla-global-dark-mode .category-card {
  background: var(--isla-dark-secondary) !important;
  color: var(--isla-dark-text) !important;
  border: 1px solid var(--isla-dark-border);
}

.category-card:hover {
  transform: translateY(-5px);
  border-color: var(--primary-brown);
  box-shadow: 0 10px 30px rgba(136, 89, 46, 0.15);
}

.category-icon {
  font-size: 3rem;
  color: var(--primary-brown);
  margin-bottom: 20px;
}

.isla-global-dark-mode .category-icon {
  color: var(--isla-dark-text) !important;
}

.category-card h3 {
  color: var(--text-dark);
  margin-bottom: 10px;
  font-size: 1.3rem;
  font-weight: 600;
}

.isla-global-dark-mode .category-card h3 {
  color: var(--isla-dark-text) !important;
}

.category-card p {
  color: var(--text-light);
  margin: 0;
}

.isla-global-dark-mode .category-card p {
  color: var(--isla-dark-text) !important;
  opacity: 0.8;
}

/* Section Header */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.view-all {
  color: var(--primary-brown);
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: all 0.3s ease;
}

.isla-global-dark-mode .view-all {
  color: var(--isla-dark-text) !important;
}

.view-all:hover {
  gap: 12px;
  color: var(--dark-brown);
}

.isla-global-dark-mode .view-all:hover {
  color: var(--white) !important;
}

/* Products Grid - 4 in a row */
.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 30px;
}

.product-card {
  background: var(--white);
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  border: 1px solid rgba(0,0,0,0.05);
}

.isla-global-dark-mode .product-card {
  background: var(--isla-dark-card) !important;
  color: var(--isla-dark-text) !important;
  border: 1px solid var(--isla-dark-border);
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(136, 89, 46, 0.15);
}

.product-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.product-card:hover .product-image img {
  transform: scale(1.1);
}

.wishlist-btn {
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--white);
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.isla-global-dark-mode .wishlist-btn {
  background: var(--isla-dark-secondary) !important;
  color: var(--isla-dark-text) !important;
}

.wishlist-btn:hover {
  background: #fee;
  transform: scale(1.1);
}

.isla-global-dark-mode .wishlist-btn:hover {
  background: var(--isla-dark-border) !important;
}

.wishlist-btn .fa-heart.active {
  color: var(--red);
}

.product-info {
  padding: 25px;
}

.product-name {
  font-size: 1.2rem;
  color: var(--text-dark);
  margin-bottom: 8px;
  font-weight: 600;
}

.isla-global-dark-mode .product-name {
  color: var(--isla-dark-text) !important;
}

.product-description {
  color: var(--text-light);
  font-size: 0.9rem;
  margin-bottom: 15px;
  line-height: 1.4;
}

.isla-global-dark-mode .product-description {
  color: var(--isla-dark-text) !important;
  opacity: 0.8;
}

.product-price {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--primary-brown);
  margin-bottom: 10px;
}

.isla-global-dark-mode .product-price {
  color: var(--isla-dark-text) !important;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.product-rating .fa-star {
  color: #e0e0e0;
}

.product-rating .fa-star.filled {
  color: var(--gold);
}

.product-rating span {
  color: var(--text-light);
  font-size: 0.9rem;
}

.isla-global-dark-mode .product-rating span {
  color: var(--isla-dark-text) !important;
  opacity: 0.8;
}

.add-to-cart-btn {
  width: 100%;
  background: var(--primary-brown);
  color: var(--white);
  border: none;
  padding: 12px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 4px 10px rgba(136, 89, 46, 0.2);
}

.add-to-cart-btn:hover {
  background: var(--dark-brown);
}

/* Newsletter */
.newsletter-section {
  background: var(--beige);
  border-radius: 20px;
  padding: 60px 40px;
  text-align: center;
  margin: 40px 0;
  border: 1px solid rgba(0,0,0,0.05);
  box-shadow: 0 10px 30px rgba(136, 89, 46, 0.1);
}

.isla-global-dark-mode .newsletter-section {
  background: var(--isla-dark-card) !important;
  color: var(--isla-dark-text) !important;
  border: 1px solid var(--isla-dark-border);
}

.newsletter-content h2 {
  color: var(--primary-brown);
  margin-bottom: 15px;
  font-size: 2rem;
  font-weight: 600;
}

.isla-global-dark-mode .newsletter-content h2 {
  color: var(--isla-dark-text) !important;
}

.newsletter-content p {
  color: var(--text-dark);
  margin-bottom: 30px;
  font-size: 1.1rem;
}

.isla-global-dark-mode .newsletter-content p {
  color: var(--isla-dark-text) !important;
  opacity: 0.9;
}

.newsletter-form {
  display: flex;
  max-width: 400px;
  margin: 0 auto;
  gap: 10px;
}

.newsletter-form input {
  flex: 1;
  padding: 12px 15px;
  border: 2px solid var(--dark-beige);
  border-radius: 8px;
  font-size: 1rem;
  background: var(--white);
  color: var(--text-dark);
}

.isla-global-dark-mode .newsletter-form input {
  background: var(--isla-dark-input) !important;
  border-color: var(--isla-dark-border) !important;
  color: var(--isla-dark-text) !important;
}

.newsletter-form input:focus {
  outline: none;
  border-color: var(--primary-brown);
}

.newsletter-form input::placeholder {
  color: var(--text-light);
}

.isla-global-dark-mode .newsletter-form input::placeholder {
  color: var(--isla-dark-text) !important;
  opacity: 0.6;
}

.newsletter-form button {
  background: var(--primary-brown);
  color: var(--white);
  border: none;
  padding: 12px 25px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  box-shadow: 0 4px 10px rgba(136, 89, 46, 0.2);
}

.newsletter-form button:hover {
  background: var(--dark-brown);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .products-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 1024px) {
  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .slider-container {
    height: 350px;
  }
}

@media (max-width: 900px) {
  .products-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .home-main {
    padding: 70px 15px 0 15px;
  }

  .hero-section {
    grid-template-columns: 1fr;
    text-align: center;
    padding: 20px 0;
  }

  .hero-content {
    padding-left: 0;
  }

  .hero-title {
    font-size: 2.5rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .section-header {
    flex-direction: column;
    gap: 20px;
    text-align: center;
  }

  .newsletter-form {
    flex-direction: column;
  }

  .categories-section,
  .products-section {
    padding: 40px 0;
  }
  
  .categories-grid {
    grid-template-columns: 1fr;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .slider-container {
    height: 300px;
  }
  
  .slide-content {
    padding: 20px;
  }
  
  .slide-content h3 {
    font-size: 1.5rem;
  }
  
  .slider-nav {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 480px) {
  .categories-section,
  .products-section {
    padding: 30px 0;
  }

  .hero-title {
    font-size: 2rem;
  }

  .category-card {
    padding: 30px 20px;
  }
  
  .slider-container {
    height: 250px;
  }
  
  .slide-content h3 {
    font-size: 1.3rem;
  }
  
  .slide-content p {
    font-size: 1rem;
  }
}
</style>