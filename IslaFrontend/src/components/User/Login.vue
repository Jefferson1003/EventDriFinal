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
                <img src="/images/logo.png" alt="ISLA CAFE Logo" class="login-logo">
                <h1 class="login-title">ISLA CAFE</h1>
                <p class="login-subtitle">Please sign in to your account</p>
              </div>

              <!-- Fast Login - Gmail Only -->
              <div class="fast-login">
                <button type="button" class="gmail-btn" @click="fastLogin('gmail')">
                  <svg class="gmail-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43-.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
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
                <img src="/images/logo.png" alt="ISLA CAFE Logo" class="login-logo">
                <h1 class="login-title">ISLA CAFE</h1>
                <p class="login-subtitle">Create your account</p>
              </div>

              <!-- Fast Register - Gmail Only -->
              <div class="fast-login">
                <button type="button" class="gmail-btn" @click="fastRegister('gmail')">
                  <svg class="gmail-icon" viewBox="0 0 24 24" width="16" height="16">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43-.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
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

        console.log('✅ Login successful, user data:', response.user);
        
        // FIXED: Redirect based on user role
        this.redirectBasedOnRole(response.user);
        
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

        console.log('✅ Registration successful, user data:', response.user);
        
        // FIXED: Redirect based on user role after registration
        this.redirectBasedOnRole(response.user);
        
      } catch (err) {
        this.error = err.message || 'Registration failed. Please try again.';
        console.error('Register error:', err);
      } finally {
        this.loading = false;
      }
    },

    // FIXED: New method to handle role-based redirection
    redirectBasedOnRole(user) {
      if (!user) {
        console.warn('No user data available for redirection');
        this.router.push('/');
        return;
      }

      console.log(`🔄 Redirecting user with role: ${user.role}`);
      
      switch (user.role) {
        case 'admin':
        case 'superadmin':
          this.router.push('/admin/dashboard');
          break;
        case 'staff':
          this.router.push('/staff/dashboard');
          break;
        case 'user':
        default:
          this.router.push('/user/account');
          break;
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
      const user = authService.getUser();
      if (user) {
        this.redirectBasedOnRole(user);
      } else {
        this.router.push('/');
      }
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
    url('/images/bg.png') center/cover no-repeat,
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
  max-width: 400px;
  height: 540px;
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
  padding: 25px 30px;
  border-radius: 20px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  width: 100%;
  height: 100%;
  border: 1px solid rgba(232, 224, 216, 0.9);
  backdrop-filter: blur(10px);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* FIXED: Larger logo and title with better spacing */
.login-header {
  text-align: center;
  margin-bottom: 10px;
  flex-shrink: 0;
}

.login-logo {
  height: 65px;
  margin: 0 auto 8px;
  display: block;
  object-fit: contain;
}

.login-title {
  color: #8B7355;
  font-size: 24px;
  font-weight: 800;
  margin-bottom: 4px;
  letter-spacing: -0.5px;
}

.login-subtitle {
  color: #8a7860;
  font-size: 13px;
  font-weight: 500;
  margin-bottom: 5px;
}

/* Fast Login Styles */
.fast-login {
  margin-bottom: 10px;
  flex-shrink: 0;
}

.gmail-btn {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 18px;
  border: 1.5px solid #e0e0e0;
  border-radius: 10px;
  background: white;
  color: #5a5a5a;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
  font-weight: 600;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.gmail-btn:hover {
  background: #f8f9fa;
  border-color: #dadce0;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.gmail-icon {
  flex-shrink: 0;
}

.login-form {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  gap: 6px;
}

.form-group {
  margin-bottom: 6px;
}

/* FIXED: Reduced sizes for register form */
.compact-group {
  margin-bottom: 5px;
}

.compact-input {
  padding: 6px 8px !important;
  font-size: 12px !important;
  border-radius: 5px !important;
  height: 34px !important;
}

.compact-btn {
  padding: 8px !important;
  font-size: 12px !important;
  border-radius: 6px !important;
  margin-top: 3px !important;
  height: 36px !important;
}

/* Label on top left of input */
.label-input-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
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
  padding: 10px 12px;
  border: 2px solid #e8e0d8;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: rgba(252, 250, 247, 0.9);
  font-family: inherit;
  box-sizing: border-box;
  height: 42px;
}

.form-input:focus {
  outline: none;
  border-color: #8B7355;
  background-color: white;
  box-shadow: 0 0 0 3px rgba(139, 115, 85, 0.15);
}

.form-input::placeholder {
  color: #a8a8a8;
  font-size: 13px;
}

/* FIXED: More compact spacing for register form */
.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 6px;
  font-size: 12px;
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
  font-weight: 600;
  transition: color 0.3s ease;
  font-size: 11px;
}

.forgot-link:hover {
  color: #6b5a45;
  text-decoration: underline;
}

/* FIXED: Adjusted button spacing for better fit */
.login-btn {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #8B7355 0%, #a08a6e 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  letter-spacing: 0.5px;
  flex-shrink: 0;
  margin-top: 8px;
  height: 44px;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(139, 115, 85, 0.4);
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

.register-link, .login-link {
  text-align: center;
  margin-top: 8px;
  color: #5a5a5a;
  font-size: 11px;
  flex-shrink: 0;
}

.register-link-text, .login-link-text {
  color: #8B7355;
  text-decoration: none;
  font-weight: 700;
  transition: color 0.3s ease;
  font-size: 11px;
  cursor: pointer;
}

.register-link-text:hover, .login-link-text:hover {
  color: #6b5a45;
  text-decoration: underline;
}

.error-message {
  margin-top: 6px;
  padding: 6px;
  background-color: rgba(254, 242, 242, 0.9);
  border: 1px solid #fecaca;
  border-radius: 5px;
  color: #dc2626;
  text-align: center;
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
}

.checkbox-container input[type="checkbox"] {
  appearance: none;
  -webkit-appearance: none;
  width: 13px;
  height: 13px;
  border: 2px solid #ddd;
  border-radius: 3px;
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
  font-size: 9px;
  font-weight: bold;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

/* FIXED: Specific smaller styles for register form to ensure everything fits */
.flip-card-back .login-card {
  padding: 20px 20px;
}

.flip-card-back .login-header {
  margin-bottom: 4px;
}

.flip-card-back .login-logo {
  height: 45px;
  margin-bottom: 4px;
}

.flip-card-back .login-title {
  font-size: 18px;
  margin-bottom: 2px;
}

.flip-card-back .login-subtitle {
  font-size: 10px;
  margin-bottom: 3px;
}

.flip-card-back .fast-login {
  margin-bottom: 6px;
}

.flip-card-back .login-form {
  gap: 3px;
}

.flip-card-back .form-group {
  margin-bottom: 10px;
}

.flip-card-back .login-btn {
   margin-top: 10px;
  height: 36px;
  padding: 8px;
  font-size: 12px;
}

.flip-card-back .register-link {
  margin-top: 4px;
  font-size: 12px;
}

.flip-card-back .register-link-text {
  font-size: 12px;
}

.flip-card-back .form-label {
  font-size: 10px;
}

.flip-card-back .form-input {
  padding: 6px 8px;
  font-size: 12px;
  height: 34px;
  border-radius: 5px;
}

.flip-card-back .gmail-btn {
  padding: 8px 12px;
  font-size: 12px;
}

.flip-card-back .error-message {
  margin-top: 4px;
  padding: 4px;
  font-size: 10px;
}

@media (max-width: 480px) {
  .flip-card {
    max-width: 350px;
    height: 520px;
  }
  
  .login-card {
    padding: 20px 25px;
  }
  
  .login-title {
    font-size: 22px;
  }
  
  .login-logo {
    height: 60px;
  }
  
  .form-options {
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
  }
  
  .login-btn {
    margin-top: 6px;
  }
  
  /* Mobile specific fixes for register form */
  .flip-card-back .login-card {
    padding: 12px 16px;
  }
  
  .flip-card-back .login-logo {
    height: 40px;
  }
  
  .flip-card-back .login-title {
    font-size: 16px;
  }
  
  .flip-card-back .compact-input {
    padding: 5px 7px !important;
    font-size: 11px !important;
    height: 32px !important;
  }
  
  .flip-card-back .login-btn {
    height: 34px;
    padding: 7px;
    font-size: 11px;
  }
}
</style>