<template>
  <div class="login-wrapper">
    <div class="background-fullscreen"></div>
    <div class="login-container">
      <div class="flip-card" :class="{ 'flipped': isRegister }">
        <!-- Front Side - Login -->
        <div class="flip-card-inner">
          <div class="flip-card-front">
            <div class="login-card">
              <div class="login-header">
                <img src="/images/logo1.png" alt="ISLA CAFE Logo" class="login-logo">
                <h1 class="login-title">ISLA CAFE</h1>
                <p class="login-subtitle">Please sign in to your account</p>
              </div>

              <!-- Fast Login - Gmail Only -->
              <div class="fast-login">
                <button type="button" class="gmail-btn" @click="fastLogin('gmail')">
                  <svg class="gmail-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Login with Gmail
                </button>
              </div>

              <form @submit.prevent="handleLogin" class="login-form">
                <div class="form-group">
                  <div class="label-input-group">
                    <label for="email" class="form-label">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      v-model="form.email"
                      class="form-input"
                      placeholder="Enter your email"
                      required
                    >
                  </div>
                </div>

                <div class="form-group">
                  <div class="label-input-group">
                    <label for="password" class="form-label">Password</label>
                    <input
                      type="password"
                      id="password"
                      v-model="form.password"
                      class="form-input"
                      placeholder="Enter your password"
                      required
                    >
                  </div>
                </div>

                <div class="form-options">
                  <label class="checkbox-container">
                    <input type="checkbox" v-model="form.remember">
                    <span class="checkmark"></span>
                    Remember me
                  </label>
                  <a href="#" class="forgot-link">Forgot Password?</a>
                </div>

                <button type="submit" class="login-btn" :disabled="loading">
                  {{ loading ? 'Signing in...' : 'Sign In' }}
                </button>

                <div class="register-link">
                  <p>Don't have an account? 
                    <a href="#" class="register-link-text" @click.prevent="toggleForm">Sign up here</a>
                  </p>
                </div>
              </form>

              <div v-if="error" class="error-message">
                {{ error }}
              </div>
            </div>
          </div>

          <!-- Back Side - Register -->
          <div class="flip-card-back">
            <div class="login-card">
              <div class="login-header">
                <img src="/images/logo1.png" alt="ISLA CAFE Logo" class="login-logo">
                <h1 class="login-title">ISLA CAFE</h1>
                <p class="login-subtitle">Create your account</p>
              </div>

              <!-- Fast Register - Gmail Only -->
              <div class="fast-login">
                <button type="button" class="gmail-btn" @click="fastRegister('gmail')">
                  <svg class="gmail-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Sign up with Gmail
                </button>
              </div>

              <form @submit.prevent="handleRegister" class="login-form">
                <div class="form-group compact-group">
                  <div class="label-input-group">
                    <label for="reg-username" class="form-label">Username</label>
                    <input
                      type="text"
                      id="reg-username"
                      v-model="registerForm.username"
                      class="form-input compact-input"
                      placeholder="Choose username"
                      required
                    >
                  </div>
                </div>

                <div class="form-group compact-group">
                  <div class="label-input-group">
                    <label for="reg-email" class="form-label">Email Address</label>
                    <input
                      type="email"
                      id="reg-email"
                      v-model="registerForm.email"
                      class="form-input compact-input"
                      placeholder="Enter your email"
                      required
                    >
                  </div>
                </div>

                <div class="form-group compact-group">
                  <div class="label-input-group">
                    <label for="reg-password" class="form-label">Password</label>
                    <input
                      type="password"
                      id="reg-password"
                      v-model="registerForm.password"
                      class="form-input compact-input"
                      placeholder="Create password"
                      required
                    >
                  </div>
                </div>

                <div class="form-group compact-group">
                  <div class="label-input-group">
                    <label for="reg-confirm" class="form-label">Confirm Password</label>
                    <input
                      type="password"
                      id="reg-confirm"
                      v-model="registerForm.confirmPassword"
                      class="form-input compact-input"
                      placeholder="Confirm password"
                      required
                    >
                  </div>
                </div>

                <button type="submit" class="login-btn compact-btn" :disabled="loading">
                  {{ loading ? 'Creating Account...' : 'Create Account' }}
                </button>

                <div class="login-link">
                  <p>Already have an account? 
                    <a href="#" class="login-link-text" @click.prevent="toggleForm">Log in</a>
                  </p>
                </div>
              </form>

              <div v-if="error" class="error-message">
                {{ error }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import authService from '../../services/auth';
import { useRouter } from 'vue-router';

export default {
  name: 'UserLogin',
  data() {
    return {
      isRegister: false,
      form: {
        email: '',
        password: '',
        remember: false
      },
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        password_confirmation: '' // Laravel expects this field
      },
      loading: false,
      error: ''
    }
  },
  setup() {
    const router = useRouter();
    return { router };
  },
 methods: {
  async handleLogin() {
    this.loading = true;
    this.error = '';

    try {
      if (!this.form.email || !this.form.password) {
        throw new Error('Please fill in all fields');
      }

      const response = await authService.login({
        email: this.form.email,
        password: this.form.password
      });

      // Success - redirect to dashboard
      this.router.push('/dashboard');
      
    } catch (err) {
      this.error = err.message || 'Invalid email or password';
      console.error('Login error:', err);
    } finally {
      this.loading = false;
    }
  },

  async handleRegister() {
    this.loading = true;
    this.error = '';

    try {
      if (!this.registerForm.username || !this.registerForm.email || 
          !this.registerForm.password || !this.registerForm.confirmPassword) {
        throw new Error('Please fill in all fields');
      }

      if (this.registerForm.password !== this.registerForm.confirmPassword) {
        throw new Error('Passwords do not match');
      }

      if (this.registerForm.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      const userData = {
        name: this.registerForm.username,
        email: this.registerForm.email,
        password: this.registerForm.password,
        password_confirmation: this.registerForm.confirmPassword
      };

      const response = await authService.register(userData);

      // Show success message and redirect to dashboard
      this.router.push('/dashboard');
      
    } catch (err) {
      this.error = err.message || 'Registration failed. Please try again.';
      console.error('Register error:', err);
    } finally {
      this.loading = false;
    }
  },
  

    async handleRegister() {
      this.loading = true;
      this.error = '';

      try {
        if (!this.registerForm.username || !this.registerForm.email || 
            !this.registerForm.password || !this.registerForm.confirmPassword) {
          throw new Error('Please fill in all fields');
        }

        if (this.registerForm.password !== this.registerForm.confirmPassword) {
          throw new Error('Passwords do not match');
        }

        if (this.registerForm.password.length < 6) {
          throw new Error('Password must be at least 6 characters');
        }

        const userData = {
          name: this.registerForm.username,
          email: this.registerForm.email,
          password: this.registerForm.password,
          password_confirmation: this.registerForm.confirmPassword
        };

        const response = await authService.register(userData);

        // Show success message and redirect to login
        this.error = 'Registration successful! Please login with your credentials.';
        this.isRegister = false;
        
        // Reset register form
        this.registerForm.username = '';
        this.registerForm.email = '';
        this.registerForm.password = '';
        this.registerForm.confirmPassword = '';
        
      } catch (err) {
        this.error = err.message || 'Registration failed. Please try again.';
        console.error('Register error:', err);
      } finally {
        this.loading = false;
      }
    },

    toggleForm() {
      this.isRegister = !this.isRegister;
      this.error = '';
      // Reset forms when toggling
      this.form.email = '';
      this.form.password = '';
      this.registerForm.username = '';
      this.registerForm.email = '';
      this.registerForm.password = '';
      this.registerForm.confirmPassword = '';
    },

    fastLogin(provider) {
      // Implement social login logic here
      this.loading = true;
      setTimeout(() => {
        alert(`Fast login with ${provider} would be implemented here`);
        this.loading = false;
      }, 1000);
    },

    fastRegister(provider) {
      // Implement social registration logic here
      this.loading = true;
      setTimeout(() => {
        alert(`Fast registration with ${provider} would be implemented here`);
        this.loading = false;
      }, 1000);
    }
  },
  mounted() {
    // Check if user is already logged in
    if (authService.isAuthenticated()) {
      this.router.push('/dashboard');
    }
  }
}
</script>

<style scoped>
.login-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.background-fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: 
    url('/images/bg1.jpeg') center/cover no-repeat,
    linear-gradient(135deg, #8B7355 0%, #a08a6e 100%);
  z-index: -1;
}

.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  position: relative;
  z-index: 1;
}

/* Flip Card Container */
.flip-card {
  width: 100%;
  max-width: 380px;
  height: 520px; /* Slightly taller to fit everything */
  perspective: 1000px;
}

.flip-card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  text-align: center;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flip-card.flipped .flip-card-inner {
  transform: rotateY(180deg);
}

.flip-card-front,
.flip-card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  -webkit-backface-visibility: hidden;
  backface-visibility: hidden;
}

.flip-card-back {
  transform: rotateY(180deg);
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  padding: 15px 20px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  width: 100%;
  height: 100%;
  border: 1px solid rgba(232, 224, 216, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.login-header {
  text-align: center;
  margin-bottom: 12px;
  flex-shrink: 0;
}

.login-logo {
  height: 45px;
  margin: 0 auto 6px;
  display: block;
  object-fit: contain;
}

.login-title {
  color: #8B7355;
  font-size: 18px;
  font-weight: 700;
  margin-bottom: 3px;
  letter-spacing: -0.5px;
}

.login-subtitle {
  color: #8a7860;
  font-size: 11px;
  font-weight: 400;
}

/* Fast Login Styles */
.fast-login {
  margin-bottom: 12px;
  flex-shrink: 0;
}

.gmail-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: white;
  color: #5a5a5a;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
  font-weight: 500;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.gmail-btn:hover {
  background: #f8f9fa;
  border-color: #dadce0;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.gmail-icon {
  flex-shrink: 0;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.form-group {
  margin-bottom: 10px;
}

/* Compact styles for register form */
.compact-group {
  margin-bottom: 8px;
}

.compact-input {
  padding: 8px 10px !important;
  font-size: 12px !important;
  border-radius: 6px !important;
}

.compact-btn {
  padding: 8px !important;
  font-size: 12px !important;
  border-radius: 6px !important;
  margin-top: 8px !important;
}

/* Label on top left of input */
.label-input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 3px;
}

.form-label {
  color: #5a5a5a;
  font-weight: 600;
  font-size: 11px;
  text-align: left;
  width: 100%;
  margin-bottom: 1px;
}

.form-input {
  width: 100%;
  padding: 9px 10px;
  border: 2px solid #e8e0d8;
  border-radius: 6px;
  font-size: 12px;
  transition: all 0.3s ease;
  background-color: rgba(252, 250, 247, 0.8);
  font-family: inherit;
  box-sizing: border-box;
}

.form-input:focus {
  outline: none;
  border-color: #8B7355;
  background-color: white;
  box-shadow: 0 0 0 2px rgba(139, 115, 85, 0.1);
}

.form-input::placeholder {
  color: #a8a8a8;
  font-size: 11px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  font-size: 10px;
  flex-shrink: 0;
}

.checkbox-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #5a5a5a;
  font-weight: 500;
}

.checkbox-container input {
  margin-right: 5px;
}

.forgot-link {
  color: #8B7355;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
  font-size: 10px;
}

.forgot-link:hover {
  color: #6b5a45;
  text-decoration: underline;
}

.login-btn {
  width: 100%;
  padding: 9px;
  background: linear-gradient(135deg, #8B7355 0%, #a08a6e 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  margin-top: auto;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 3px 10px rgba(139, 115, 85, 0.3);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

/* FIXED: Better spacing for links */
.register-link, .login-link {
  text-align: center;
  margin-top: 12px;
  color: #5a5a5a;
  font-size: 10px;
  flex-shrink: 0;
}

.register-link-text, .login-link-text {
  color: #8B7355;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
  font-size: 10px;
  cursor: pointer;
}

.register-link-text:hover, .login-link-text:hover {
  color: #6b5a45;
  text-decoration: underline;
}

.error-message {
  margin-top: 8px;
  padding: 6px;
  background-color: rgba(254, 242, 242, 0.9);
  border: 1px solid #fecaca;
  border-radius: 4px;
  color: #dc2626;
  text-align: center;
  font-size: 10px;
  font-weight: 500;
  flex-shrink: 0;
}

/* Custom checkbox styles */
.checkbox-container input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 12px;
  height: 12px;
  border: 1.5px solid #ddd;
  border-radius: 2px;
  outline: none;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
}

.checkbox-container input[type="checkbox"]:hover {
  border-color: #8B7355;
}

.checkbox-container input[type="checkbox"]:checked {
  background-color: #8B7355;
  border-color: #8B7355;
}

.checkbox-container input[type="checkbox"]:checked::before {
  content: '✓';
  position: absolute;
  color: white;
  font-size: 8px;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* Responsive design */
@media (max-width: 480px) {
  .flip-card {
    max-width: 340px;
    height: 500px;
  }
  
  .login-card {
    padding: 12px 16px;
  }
  
  .login-title {
    font-size: 16px;
  }
  
  .login-logo {
    height: 40px;
  }
  
  .form-options {
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
  }
}
</style>