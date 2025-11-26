<template>
  <div class="user-menu-container">
    <!-- Navigation Bar -->
    <Navbar />
    
    <!-- Main Menu Content -->
    <main class="menu-main">
      <!-- Menu Header -->
      <section class="menu-header">
        <div class="header-content">
          <h1 class="page-title">Our Menu</h1>
          <p class="page-subtitle">Discover our delicious selection of coffee, tea, and pastries</p>
          
          <!-- Search and Filters -->
          <div class="menu-controls">
            <div class="search-box">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                placeholder="Search products..." 
                v-model="searchQuery"
                @input="filterProducts"
              >
            </div>
            
            <div class="filter-controls">
              <select v-model="selectedCategory" @change="filterProducts" class="category-filter">
                <option value="all">All Categories</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
              
              <select v-model="sortBy" @change="sortProducts" class="sort-filter">
                <option value="name">Sort by Name</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      <!-- Categories Navigation -->
      <section class="categories-nav">
        <div class="categories-scroll">
          <button 
            v-for="category in categories" 
            :key="category.id"
            :class="['category-btn', { active: activeCategory === category.id }]"
            @click="setActiveCategory(category.id)"
          >
            <i :class="category.icon"></i>
            {{ category.name }}
          </button>
        </div>
      </section>

      <!-- Products Grid -->
      <section class="products-section">
        <div class="container">
          <!-- Category Title -->
          <div class="category-title" v-if="activeCategory !== 'all'">
            <h2>{{ getCategoryName(activeCategory) }}</h2>
            <p>{{ getCategoryDescription(activeCategory) }}</p>
          </div>

          <!-- Products Grid -->
          <div class="products-grid">
            <div 
              class="product-card" 
              v-for="product in filteredProducts" 
              :key="product.id"
              :class="{ 'out-of-stock': !product.inStock }"
            >
              <div class="product-image">
                <img :src="product.image" :alt="product.name">
                
                <!-- Product Badges -->
                <div class="product-badges">
                  <span v-if="product.isNew" class="badge new">New</span>
                  <span v-if="product.isBestseller" class="badge bestseller">Bestseller</span>
                  <span v-if="!product.inStock" class="badge out-of-stock">Out of Stock</span>
                </div>

                <!-- Wishlist Button -->
                <button 
                  class="wishlist-btn" 
                  @click="toggleWishlistProduct(product)"
                  :class="{ active: product.isWishlisted }"
                >
                  <i class="fas fa-heart"></i>
                </button>

                <!-- Quick View -->
                <button class="quick-view-btn" @click="openQuickView(product)">
                  <i class="fas fa-eye"></i> Quick View
                </button>
              </div>

              <div class="product-info">
                <h3 class="product-name">{{ product.name }}</h3>
                <p class="product-description">{{ product.description }}</p>
                
                <div class="product-meta">
                  <div class="product-rating">
                    <div class="stars">
                      <i 
                        class="fas fa-star" 
                        v-for="star in 5" 
                        :key="star" 
                        :class="{ filled: star <= product.rating }"
                      ></i>
                    </div>
                    <span class="rating-count">({{ product.reviews }})</span>
                  </div>
                  
                  <div class="product-calories" v-if="product.calories">
                    <i class="fas fa-fire"></i>
                    {{ product.calories }} cal
                  </div>
                </div>

                <div class="product-footer">
                  <div class="product-price">
                    <span class="current-price">₱{{ product.price }}</span>
                    <span v-if="product.originalPrice" class="original-price">
                      ₱{{ product.originalPrice }}
                    </span>
                  </div>

                  <button 
                    class="add-to-cart-btn" 
                    @click="addToCart(product)"
                    :disabled="!product.inStock"
                    :class="{ disabled: !product.inStock }"
                  >
                    <i class="fas fa-shopping-cart"></i>
                    {{ product.inStock ? 'Add to Cart' : 'Out of Stock' }}
                  </button>
                </div>

                <!-- Customization Options (for coffee/tea) -->
                <div v-if="product.customizable" class="customization-options">
                  <div class="option-group">
                    <label>Size:</label>
                    <div class="size-options">
                      <button 
                        v-for="size in product.sizes" 
                        :key="size.name"
                        :class="['size-option', { active: product.selectedSize === size.name }]"
                        @click="selectSize(product, size)"
                      >
                        {{ size.name }}
                      </button>
                    </div>
                  </div>
                  
                  <div v-if="product.addons && product.addons.length > 0" class="option-group">
                    <label>Add-ons (+₱{{ getAddonsTotal(product) }}):</label>
                    <div class="addon-options">
                      <div 
                        v-for="addon in product.addons" 
                        :key="addon.name"
                        class="addon-option"
                      >
                        <input 
                          type="checkbox" 
                          :id="`addon-${product.id}-${addon.name}`"
                          v-model="addon.selected"
                          @change="updateAddon(product, addon)"
                        >
                        <label :for="`addon-${product.id}-${addon.name}`">
                          {{ addon.name }} (+₱{{ addon.price }})
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- No Results -->
          <div v-if="filteredProducts.length === 0" class="no-results">
            <i class="fas fa-search"></i>
            <h3>No products found</h3>
            <p>Try adjusting your search or filter criteria</p>
            <button @click="clearFilters" class="clear-filters-btn">
              Clear Filters
            </button>
          </div>
        </div>
      </section>

      <!-- Special Offers Banner -->
      <section class="offers-banner">
        <div class="banner-content">
          <h2>Special Combo Deals</h2>
          <p>Save more with our exclusive bundles</p>
          <router-link to="/user/specials" class="view-specials-btn">
            View All Specials
          </router-link>
        </div>
      </section>
    </main>

    <!-- Quick View Modal -->
    <div v-if="showQuickView" class="modal-overlay" @click="closeQuickView">
      <div class="modal quick-view-modal" @click.stop>
        <div class="modal-header">
          <h3>Product Details</h3>
          <button class="close-btn" @click="closeQuickView">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <div class="modal-body" v-if="selectedProduct">
          <div class="quick-view-content">
            <div class="product-image-large">
              <img :src="selectedProduct.image" :alt="selectedProduct.name">
            </div>
            <div class="product-details">
              <h2>{{ selectedProduct.name }}</h2>
              <p class="product-description">{{ selectedProduct.description }}</p>
              
              <div class="product-meta">
                <div class="rating-large">
                  <div class="stars">
                    <i 
                      class="fas fa-star" 
                      v-for="star in 5" 
                      :key="star" 
                      :class="{ filled: star <= selectedProduct.rating }"
                    ></i>
                  </div>
                  <span>({{ selectedProduct.reviews }} reviews)</span>
                </div>
                
                <div class="nutrition-info" v-if="selectedProduct.nutrition">
                  <h4>Nutrition Information</h4>
                  <div class="nutrition-grid">
                    <div v-for="(value, key) in selectedProduct.nutrition" :key="key" class="nutrition-item">
                      <span class="nutrition-label">{{ key }}:</span>
                      <span class="nutrition-value">{{ value }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="price-section">
                <div class="price-large">₱{{ selectedProduct.price }}</div>
                <div v-if="selectedProduct.originalPrice" class="original-price-large">
                  ₱{{ selectedProduct.originalPrice }}
                </div>
              </div>

              <div class="action-buttons">
                <button 
                  class="add-to-cart-large" 
                  @click="addToCart(selectedProduct)"
                  :disabled="!selectedProduct.inStock"
                >
                  <i class="fas fa-shopping-cart"></i>
                  {{ selectedProduct.inStock ? 'Add to Cart' : 'Out of Stock' }}
                </button>
                <button 
                  class="wishlist-btn-large" 
                  @click="toggleWishlistProduct(selectedProduct)"
                  :class="{ active: selectedProduct.isWishlisted }"
                >
                  <i class="fas fa-heart"></i>
                  {{ selectedProduct.isWishlisted ? 'In Wishlist' : 'Add to Wishlist' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <Footer />
  </div>
</template>

<script>
import Navbar from './Navbar.vue';
import Footer from './Footer.vue';

export default {
  name: 'UserMenu',
  components: {
    Navbar,
    Footer
  },
  data() {
    return {
      showQuickView: false,
      searchQuery: '',
      selectedCategory: 'all',
      activeCategory: 'all',
      sortBy: 'name',
      selectedProduct: null,
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
      products: [
        {
          id: 1,
          name: 'Espresso',
          description: 'Strong and rich single shot espresso',
          price: 120,
          originalPrice: null,
          image: '/images/espresso.jpg',
          category: 'coffee-based',
          rating: 4.5,
          reviews: 89,
          calories: 5,
          inStock: true,
          isNew: false,
          isBestseller: true,
          isWishlisted: false,
          customizable: true,
          sizes: [
            { name: 'Single', price: 120 },
            { name: 'Double', price: 180 }
          ],
          selectedSize: 'Single',
          addons: [
            { name: 'Extra Shot', price: 50, selected: false },
            { name: 'Vanilla Syrup', price: 20, selected: false },
            { name: 'Caramel Syrup', price: 20, selected: false }
          ],
          nutrition: {
            Calories: '5 cal',
            Fat: '0g',
            Carbs: '1g',
            Protein: '0g'
          }
        },
        {
          id: 2,
          name: 'Cappuccino',
          description: 'Perfect blend of espresso, steamed milk, and foam',
          price: 160,
          originalPrice: null,
          image: '/images/cappuccino.jpg',
          category: 'coffee-based',
          rating: 4.8,
          reviews: 156,
          calories: 120,
          inStock: true,
          isNew: false,
          isBestseller: true,
          isWishlisted: false,
          customizable: true,
          sizes: [
            { name: 'Regular', price: 160 },
            { name: 'Large', price: 190 }
          ],
          selectedSize: 'Regular',
          addons: [
            { name: 'Extra Shot', price: 50, selected: false },
            { name: 'Cinnamon', price: 10, selected: false },
            { name: 'Chocolate Powder', price: 15, selected: false }
          ]
        },
        {
          id: 3,
          name: 'Iced Caramel Macchiato',
          description: 'Chilled espresso with caramel and milk over ice',
          price: 180,
          originalPrice: 200,
          image: '/images/caramel-macchiato.jpg',
          category: 'coffee-based',
          rating: 4.9,
          reviews: 203,
          calories: 180,
          inStock: true,
          isNew: true,
          isBestseller: true,
          isWishlisted: false,
          customizable: true,
          sizes: [
            { name: 'Regular', price: 180 },
            { name: 'Large', price: 210 }
          ],
          selectedSize: 'Regular',
          addons: [
            { name: 'Extra Caramel', price: 25, selected: false },
            { name: 'Whipped Cream', price: 20, selected: false }
          ]
        },
        {
          id: 4,
          name: 'Mocha Frappe',
          description: 'Chocolatey coffee blended with ice',
          price: 190,
          originalPrice: null,
          image: '/images/mocha-frappe.jpg',
          category: 'blended-frappe',
          rating: 4.7,
          reviews: 145,
          calories: 280,
          inStock: true,
          isNew: false,
          isBestseller: true,
          isWishlisted: false,
          customizable: true,
          sizes: [
            { name: 'Regular', price: 190 },
            { name: 'Large', price: 220 }
          ],
          selectedSize: 'Regular',
          addons: [
            { name: 'Extra Whipped Cream', price: 20, selected: false },
            { name: 'Chocolate Drizzle', price: 15, selected: false }
          ]
        },
        {
          id: 5,
          name: 'Chocolate Chip Cookie',
          description: 'Classic cookie with chocolate chips',
          price: 65,
          originalPrice: null,
          image: '/images/chocolate-chip-cookie.jpg',
          category: 'cookies',
          rating: 4.6,
          reviews: 134,
          calories: 150,
          inStock: true,
          isNew: false,
          isBestseller: true,
          isWishlisted: false,
          customizable: false
        },
        {
          id: 6,
          name: 'Blueberry Muffin',
          description: 'Moist muffin packed with fresh blueberries',
          price: 95,
          originalPrice: null,
          image: '/images/blueberry-muffin.jpg',
          category: 'muffins',
          rating: 4.7,
          reviews: 98,
          calories: 320,
          inStock: false,
          isNew: false,
          isBestseller: false,
          isWishlisted: false,
          customizable: false
        },
        {
          id: 7,
          name: 'Chocolate Brownie',
          description: 'Rich and fudgy chocolate brownie',
          price: 85,
          originalPrice: null,
          image: '/images/chocolate-brownie.jpg',
          category: 'brownies',
          rating: 4.8,
          reviews: 112,
          calories: 280,
          inStock: true,
          isNew: false,
          isBestseller: true,
          isWishlisted: false,
          customizable: false
        },
        {
          id: 8,
          name: 'Chocolate Cake Slice',
          description: 'Decadent chocolate cake slice',
          price: 120,
          originalPrice: null,
          image: '/images/chocolate-cake.jpg',
          category: 'cake-slices',
          rating: 4.9,
          reviews: 89,
          calories: 350,
          inStock: true,
          isNew: true,
          isBestseller: false,
          isWishlisted: false,
          customizable: false
        }
      ]
    }
  },
  computed: {
    filteredProducts() {
      let filtered = this.products;

      if (this.searchQuery) {
        filtered = filtered.filter(product =>
          product.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(this.searchQuery.toLowerCase())
        );
      }

      if (this.activeCategory !== 'all') {
        filtered = filtered.filter(product => product.category === this.activeCategory);
      }

      switch (this.sortBy) {
        case 'price-low':
          filtered.sort((a, b) => a.price - b.price);
          break;
        case 'price-high':
          filtered.sort((a, b) => b.price - a.price);
          break;
        case 'rating':
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        case 'name':
        default:
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
      }

      return filtered;
    }
  },
  methods: {
    filterProducts() {
      this.activeCategory = this.selectedCategory;
    },
    sortProducts() {
      // Sorting is handled in computed property
    },
    setActiveCategory(categoryId) {
      this.activeCategory = categoryId;
      this.selectedCategory = categoryId;
    },
    clearFilters() {
      this.searchQuery = '';
      this.selectedCategory = 'all';
      this.activeCategory = 'all';
      this.sortBy = 'name';
    },
    getCategoryName(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.name : 'All Products';
    },
    getCategoryDescription(categoryId) {
      const category = this.categories.find(cat => cat.id === categoryId);
      return category ? category.description : 'Browse our complete menu';
    },
    addToCart(product) {
      // This would be handled by the Navbar component
      // You might want to emit an event to the parent or use a store
      this.$emit('add-to-cart', product);
    },
    toggleWishlistProduct(product) {
      const index = this.wishlistItems.findIndex(item => item.id === product.id);
      
      if (index > -1) {
        this.wishlistItems.splice(index, 1);
        product.isWishlisted = false;
        this.showNotification(`${product.name} removed from wishlist`, 'info');
      } else {
        this.wishlistItems.push({ ...product });
        product.isWishlisted = true;
        this.showNotification(`${product.name} added to wishlist`, 'success');
      }
    },
    selectSize(product, size) {
      product.selectedSize = size.name;
    },
    updateAddon(product, addon) {
      // Addon selection is already handled by v-model
    },
    getAddonsTotal(product) {
      if (!product.addons) return 0;
      return product.addons
        .filter(addon => addon.selected)
        .reduce((total, addon) => total + addon.price, 0);
    },
    openQuickView(product) {
      this.selectedProduct = JSON.parse(JSON.stringify(product));
      this.showQuickView = true;
    },
    closeQuickView() {
      this.showQuickView = false;
      this.selectedProduct = null;
    },
    showNotification(message, type = 'info') {
      alert(`${type.toUpperCase()}: ${message}`);
    }
  }
}
</script>

<style scoped>
/* Import Font Awesome */
@import url('https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css');

/* Main Menu Styles */
.user-menu-container {
  min-height: 100vh;
  background-color: #f8f5f2;
}

.menu-main {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.25rem;
}

/* Menu Header */
.menu-header {
  background: linear-gradient(135deg, #8B7355 0%, #6b5a45 100%);
  color: white;
  border-radius: 1.25rem;
  margin: 1.875rem 0;
  padding: 3.125rem 2.5rem;
  text-align: center;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.page-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 1.875rem;
  line-height: 1.5;
}

.menu-controls {
  display: flex;
  gap: 1.25rem;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
}

.search-box {
  position: relative;
  min-width: 300px;
}

.search-box i {
  position: absolute;
  left: 1rem;
  top: 50%;
  transform: translateY(-50%);
  color: #666;
  z-index: 1;
}

.search-box input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.75rem;
  border: none;
  border-radius: 0.625rem;
  font-size: 1rem;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.search-box input:focus {
  outline: none;
  box-shadow: 0 4px 15px rgba(139, 115, 85, 0.2);
}

.filter-controls {
  display: flex;
  gap: 0.9375rem;
}

.category-filter,
.sort-filter {
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.625rem;
  background: white;
  color: #333;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s ease;
}

.category-filter:focus,
.sort-filter:focus {
  outline: none;
  box-shadow: 0 4px 15px rgba(139, 115, 85, 0.2);
}

/* Categories Navigation */
.categories-nav {
  background: white;
  border-radius: 0.9375rem;
  padding: 1.25rem;
  margin-bottom: 1.875rem;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
}

.categories-scroll {
  display: flex;
  gap: 0.625rem;
  overflow-x: auto;
  padding-bottom: 0.625rem;
}

.categories-scroll::-webkit-scrollbar {
  height: 6px;
}

.categories-scroll::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.categories-scroll::-webkit-scrollbar-thumb {
  background: #8B7355;
  border-radius: 3px;
}

.category-btn {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  padding: 0.75rem 1.25rem;
  background: #f8f5f2;
  border: 2px solid transparent;
  border-radius: 0.625rem;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  font-weight: 500;
  font-size: 0.9rem;
}

.category-btn:hover {
  background: #8B7355;
  color: white;
  transform: translateY(-2px);
}

.category-btn.active {
  background: #8B7355;
  color: white;
  border-color: #6b5a45;
}

.category-btn i {
  font-size: 1.2rem;
}

/* Products Section */
.products-section {
  padding: 2.5rem 0;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.category-title {
  text-align: center;
  margin-bottom: 2.5rem;
}

.category-title h2 {
  font-size: 2.5rem;
  color: #8B7355;
  margin-bottom: 0.625rem;
  font-weight: 600;
}

.category-title p {
  color: #666;
  font-size: 1.1rem;
  line-height: 1.5;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.875rem;
  margin-bottom: 3.125rem;
}

.product-card {
  background: white;
  border-radius: 0.9375rem;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
  position: relative;
}

.product-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
}

.product-card.out-of-stock {
  opacity: 0.7;
}

.product-card.out-of-stock::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  z-index: 2;
}

/* Product Image */
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

/* Product Badges */
.product-badges {
  position: absolute;
  top: 0.9375rem;
  left: 0.9375rem;
  display: flex;
  flex-direction: column;
  gap: 0.3125rem;
}

.badge {
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
}

.badge.new {
  background: #4CAF50;
  color: white;
}

.badge.bestseller {
  background: #FF9800;
  color: white;
}

.badge.out-of-stock {
  background: #f44336;
  color: white;
}

/* Wishlist Button */
.wishlist-btn {
  position: absolute;
  top: 0.9375rem;
  right: 0.9375rem;
  background: white;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.wishlist-btn:hover {
  background: #fee;
  transform: scale(1.1);
}

.wishlist-btn.active {
  background: #e74c3c;
  color: white;
}

.wishlist-btn.active:hover {
  background: #c0392b;
}

/* Quick View Button */
.quick-view-btn {
  position: absolute;
  bottom: 0.9375rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(139, 115, 85, 0.9);
  color: white;
  border: none;
  padding: 0.5rem 0.9375rem;
  border-radius: 1.25rem;
  font-size: 0.8rem;
  cursor: pointer;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 3;
  font-weight: 500;
}

.product-card:hover .quick-view-btn {
  opacity: 1;
}

.quick-view-btn:hover {
  background: #8B7355;
}

/* Product Info */
.product-info {
  padding: 1.25rem;
}

.product-name {
  font-size: 1.2rem;
  color: #5a5a5a;
  margin-bottom: 0.5rem;
  font-weight: 600;
  line-height: 1.3;
}

.product-description {
  color: #888;
  font-size: 0.9rem;
  margin-bottom: 0.9375rem;
  line-height: 1.4;
}

.product-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.9375rem;
}

.product-rating {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  display: flex;
  gap: 0.125rem;
}

.stars .fa-star {
  color: #e0e0e0;
  font-size: 0.8rem;
}

.stars .fa-star.filled {
  color: #ffc107;
}

.rating-count {
  color: #888;
  font-size: 0.8rem;
}

.product-calories {
  display: flex;
  align-items: center;
  gap: 0.3125rem;
  color: #888;
  font-size: 0.8rem;
}

.product-calories i {
  color: #ff6b6b;
}

/* Product Footer */
.product-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.9375rem;
}

.product-price {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.current-price {
  font-size: 1.3rem;
  font-weight: 700;
  color: #8B7355;
}

.original-price {
  font-size: 1rem;
  color: #999;
  text-decoration: line-through;
}

.add-to-cart-btn {
  background: #8B7355;
  color: white;
  border: none;
  padding: 0.625rem 0.9375rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  min-width: 120px;
  justify-content: center;
}

.add-to-cart-btn:hover:not(.disabled) {
  background: #6b5a45;
  transform: translateY(-2px);
}

.add-to-cart-btn.disabled {
  background: #ccc;
  cursor: not-allowed;
}

/* Customization Options */
.customization-options {
  border-top: 1px solid #f0f0f0;
  padding-top: 0.9375rem;
  margin-top: 0.9375rem;
}

.option-group {
  margin-bottom: 0.9375rem;
}

.option-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: #5a5a5a;
  font-size: 0.9rem;
}

.size-options {
  display: flex;
  gap: 0.5rem;
}

.size-option {
  padding: 0.375rem 0.75rem;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.8rem;
  font-weight: 500;
}

.size-option:hover {
  border-color: #8B7355;
}

.size-option.active {
  background: #8B7355;
  color: white;
  border-color: #8B7355;
}

.addon-options {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.addon-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.addon-option input[type="checkbox"] {
  margin: 0;
  accent-color: #8B7355;
}

.addon-option label {
  margin: 0;
  font-weight: normal;
  font-size: 0.8rem;
  cursor: pointer;
  color: #666;
}

/* No Results */
.no-results {
  text-align: center;
  padding: 3.75rem 1.25rem;
  color: #666;
}

.no-results i {
  font-size: 4rem;
  color: #e0e0e0;
  margin-bottom: 1.25rem;
  display: block;
}

.no-results h3 {
  margin-bottom: 0.625rem;
  color: #5a5a5a;
  font-size: 1.5rem;
}

.no-results p {
  margin-bottom: 1.25rem;
  color: #888;
  font-size: 1rem;
}

.clear-filters-btn {
  background: #8B7355;
  color: white;
  border: none;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.3s ease;
}

.clear-filters-btn:hover {
  background: #6b5a45;
}

/* Offers Banner */
.offers-banner {
  background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  color: white;
  border-radius: 0.9375rem;
  padding: 2.5rem;
  text-align: center;
  margin: 2.5rem 0;
}

.banner-content h2 {
  font-size: 2rem;
  margin-bottom: 0.625rem;
  font-weight: 600;
}

.banner-content p {
  font-size: 1.1rem;
  margin-bottom: 1.25rem;
  opacity: 0.9;
}

.view-specials-btn {
  background: white;
  color: #ff6b6b;
  padding: 0.75rem 1.5625rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: 600;
  transition: transform 0.3s ease;
  display: inline-block;
}

.view-specials-btn:hover {
  transform: translateY(-2px);
}

/* Quick View Modal */
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
  padding: 1.25rem;
}

.modal {
  background: white;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
  background: #f8f5f2;
}

.modal-header h3 {
  margin: 0;
  color: #8B7355;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.125rem;
  cursor: pointer;
  color: #a8a8a8;
  transition: color 0.3s ease;
  padding: 0.5rem;
}

.close-btn:hover {
  color: #5a5a5a;
}

.modal-body {
  padding: 1.25rem;
  overflow-y: auto;
  flex: 1;
}

.quick-view-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.875rem;
}

.product-image-large {
  border-radius: 0.625rem;
  overflow: hidden;
  background: #f8f5f2;
}

.product-image-large img {
  width: 100%;
  height: 300px;
  object-fit: cover;
}

.product-details h2 {
  color: #8B7355;
  margin-bottom: 0.9375rem;
  font-size: 1.75rem;
}

.product-description {
  color: #666;
  margin-bottom: 1.25rem;
  line-height: 1.5;
}

.rating-large {
  display: flex;
  align-items: center;
  gap: 0.625rem;
  margin-bottom: 1.25rem;
}

.rating-large .stars .fa-star {
  font-size: 1rem;
}

.rating-large span {
  color: #666;
  font-size: 0.9rem;
}

.nutrition-info {
  margin: 1.25rem 0;
}

.nutrition-info h4 {
  margin-bottom: 0.625rem;
  color: #5a5a5a;
  font-size: 1.1rem;
}

.nutrition-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.625rem;
}

.nutrition-item {
  display: flex;
  justify-content: space-between;
  padding: 0.3125rem 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 0.9rem;
}

.nutrition-label {
  font-weight: 600;
  color: #666;
}

.nutrition-value {
  color: #333;
}

.price-section {
  margin: 1.25rem 0;
  display: flex;
  align-items: center;
  gap: 0.625rem;
}

.price-large {
  font-size: 2rem;
  font-weight: 700;
  color: #8B7355;
}

.original-price-large {
  font-size: 1.2rem;
  color: #999;
  text-decoration: line-through;
}

.action-buttons {
  display: flex;
  gap: 0.9375rem;
  margin-top: 1.5625rem;
}

.add-to-cart-large,
.wishlist-btn-large {
  flex: 1;
  padding: 0.9375rem;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.add-to-cart-large {
  background: #8B7355;
  color: white;
}

.add-to-cart-large:hover:not(:disabled) {
  background: #6b5a45;
}

.add-to-cart-large:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.wishlist-btn-large {
  background: #f8f5f2;
  color: #5a5a5a;
  border: 2px solid #e0e0e0;
}

.wishlist-btn-large:hover {
  background: #fee;
  border-color: #e74c3c;
}

.wishlist-btn-large.active {
  background: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

/* Responsive Design */
@media (max-width: 768px) {
  .menu-controls {
    flex-direction: column;
    align-items: stretch;
  }

  .search-box {
    min-width: auto;
  }

  .filter-controls {
    flex-direction: column;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .quick-view-content {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .menu-main {
    padding: 0 0.9375rem;
  }

  .menu-header {
    padding: 1.875rem 1.25rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .categories-scroll {
    gap: 0.3125rem;
  }

  .category-btn {
    padding: 0.625rem 0.9375rem;
    font-size: 0.9rem;
  }
}
</style>