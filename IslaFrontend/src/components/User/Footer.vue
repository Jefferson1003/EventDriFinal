<template>
  <footer class="footer" :class="{ 'dark-mode': isDarkMode }">
    <div class="footer-content">
      <div class="footer-section">
        <h3>ISLA CAFE</h3>
        <p>Your favorite coffee shop serving the finest beverages and pastries since 2025.</p>
        <div class="social-links">
          <a href="#"><i class="fab fa-facebook"></i></a>
          <a href="#"><i class="fab fa-instagram"></i></a>
          <a href="#"><i class="fab fa-twitter"></i></a>
        </div>
      </div>
      
      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><router-link to="/user/home">Home</router-link></li>
          <li><router-link to="/user/account">My Account</router-link></li>
          <li><a href="#products">Products</a></li>
          <li><a href="#">About Us</a></li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4>Contact Info</h4>
        <ul>
          <li><i class="fas fa-map-marker-alt"></i> Ilaya, Bonifacio Street, Calapan</li>
          <li><i class="fas fa-phone"></i> +63 946 643 3064</li>
          <li><i class="fas fa-envelope"></i> islacafecalapan@gmail.com</li>
        </ul>
      </div>
      
      <div class="footer-section">
        <h4>Opening Hours</h4>
        <ul>
          <li>Monday - Friday: 7:00 AM - 10:00 PM</li>
          <li>Saturday - Sunday: 8:00 AM - 11:00 PM</li>
        </ul>
      </div>
    </div>
    
    <div class="footer-bottom">
      <p>&copy; 2025 ISLA CAFE. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  data() {
    return {
      isDarkMode: false
    }
  },
  mounted() {
    // Check for dark mode from localStorage
    this.checkDarkMode();
    
    // Listen for dark mode changes from parent components
    this.$root.$on('dark-mode-toggled', this.handleDarkModeChange);
    
    // Listen for custom event from UserHome
    window.addEventListener('dark-mode-changed', this.handleDarkModeEvent);
    
    // Also listen for storage changes
    window.addEventListener('storage', this.handleStorageChange);
    
    // Set up interval to check for dark mode changes (fallback)
    this.darkModeCheckInterval = setInterval(() => {
      this.checkDarkMode();
    }, 1000);
  },
  beforeDestroy() {
    // Clean up event listeners
    this.$root.$off('dark-mode-toggled', this.handleDarkModeChange);
    window.removeEventListener('dark-mode-changed', this.handleDarkModeEvent);
    window.removeEventListener('storage', this.handleStorageChange);
    
    if (this.darkModeCheckInterval) {
      clearInterval(this.darkModeCheckInterval);
    }
  },
  methods: {
    checkDarkMode() {
      try {
        // Check localStorage first
        const savedDarkMode = localStorage.getItem('islaDarkMode');
        if (savedDarkMode !== null) {
          this.isDarkMode = JSON.parse(savedDarkMode);
          return;
        }
        
        // Check body class as fallback
        const hasDarkClass = document.body.classList.contains('isla-global-dark-mode');
        if (hasDarkClass) {
          this.isDarkMode = true;
          return;
        }
        
        // Check for dark mode class on main container
        const mainContainer = document.querySelector('.user-home-container');
        if (mainContainer && mainContainer.classList.contains('isla-global-dark-mode')) {
          this.isDarkMode = true;
          return;
        }
        
        this.isDarkMode = false;
      } catch (error) {
        console.error('Error checking dark mode:', error);
        this.isDarkMode = false;
      }
    },
    
    handleDarkModeChange(isDark) {
      this.isDarkMode = isDark;
    },
    
    handleDarkModeEvent(event) {
      if (event.detail && typeof event.detail.isDark !== 'undefined') {
        this.isDarkMode = event.detail.isDark;
      }
    },
    
    handleStorageChange(event) {
      if (event.key === 'islaDarkMode') {
        try {
          this.isDarkMode = JSON.parse(event.newValue);
        } catch (error) {
          console.error('Error parsing dark mode from storage:', error);
        }
      }
    }
  },
  watch: {
    isDarkMode(newVal) {
      // Update local storage
      localStorage.setItem('islaDarkMode', newVal);
      
      // Emit event for other components
      this.$root.$emit('footer-dark-mode-changed', newVal);
      
      // Dispatch custom event
      window.dispatchEvent(new CustomEvent('footer-dark-mode-updated', {
        detail: { isDark: newVal }
      }));
    }
  }
}
</script>

<style scoped>
.footer {
  background: linear-gradient(135deg, #88592e 0%, #6b451e 100%);
  color: white;
  margin-top: 80px;
  transition: all 0.3s ease;
}

.footer.dark-mode {
  background: linear-gradient(135deg, #3a2c1e 0%, #2a1f15 100%);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
}

.footer-section h3 {
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 1.5rem;
  font-weight: 700;
}

.footer-section h4 {
  color: #ffffff;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 600;
}

.footer-section p {
  color: rgba(255, 255, 255, 0.85);
  line-height: 1.6;
  margin-bottom: 20px;
  font-size: 0.95rem;
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 12px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 0.95rem;
  line-height: 1.4;
}

.footer-section ul li a {
  color: rgba(255, 255, 255, 0.85);
  text-decoration: none;
  transition: all 0.3s ease;
  display: inline-block;
}

.footer-section ul li a:hover {
  color: #ffffff;
  transform: translateX(5px);
}

.footer-section ul li i {
  margin-right: 10px;
  color: #ffffff;
  width: 16px;
  text-align: center;
}

.social-links {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.social-links a {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.3rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
}

.social-links a:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 25px 20px;
  text-align: center;
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.9rem;
}

/* Dark mode specific styles - Subtle changes */
.footer.dark-mode .footer-section h3,
.footer.dark-mode .footer-section h4 {
  color: #ffffff;
}

.footer.dark-mode .footer-section p {
  color: rgba(255, 255, 255, 0.9);
}

.footer.dark-mode .footer-section ul li {
  color: rgba(255, 255, 255, 0.9);
}

.footer.dark-mode .footer-section ul li a {
  color: rgba(255, 255, 255, 0.9);
}

.footer.dark-mode .footer-section ul li a:hover {
  color: #ffffff;
}

.footer.dark-mode .footer-section ul li i {
  color: #ffffff;
}

.footer.dark-mode .social-links a {
  color: rgba(255, 255, 255, 0.9);
  background: rgba(255, 255, 255, 0.2);
}

.footer.dark-mode .social-links a:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.3);
}

.footer.dark-mode .footer-bottom {
  border-top-color: rgba(255, 255, 255, 0.15);
  color: rgba(255, 255, 255, 0.9);
}

/* Responsive Design */
@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 30px;
    text-align: center;
    padding: 40px 20px;
  }

  .social-links {
    justify-content: center;
  }

  .footer-section ul li a:hover {
    transform: none;
  }
}

@media (max-width: 480px) {
  .footer-content {
    padding: 30px 15px;
    gap: 25px;
  }

  .footer-section h3 {
    font-size: 1.3rem;
  }

  .footer-section h4 {
    font-size: 1.1rem;
  }

  .footer-section p,
  .footer-section ul li {
    font-size: 0.9rem;
  }

  .social-links a {
    width: 35px;
    height: 35px;
    font-size: 1.1rem;
  }

  .footer-bottom {
    padding: 20px 15px;
    font-size: 0.85rem;
  }
}
</style>