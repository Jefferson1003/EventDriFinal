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
        password_confirmation: ''
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
        
        // Simple role-based redirection - ADMIN or USER only
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
        
        // After registration, always redirect to user account
        console.log('👤 New user registered, redirecting to User Account');
        this.router.push('/user/account');
        
      } catch (err) {
        this.error = err.message || 'Registration failed. Please try again.';
        console.error('Register error:', err);
      } finally {
        this.loading = false;
      }
    },

    // Simple role-based redirection - ADMIN or USER only
    redirectBasedOnRole(user) {
      if (!user) {
        console.warn('No user data available for redirection');
        this.router.push('/');
        return;
      }

      const userRole = user.role?.toLowerCase();
      console.log(`🔄 Redirecting user with role: ${userRole}`);
      
      if (userRole === 'admin') {
        console.log('🚀 Redirecting to Admin Dashboard');
        this.router.push('/admin/dashboard');
      } else {
        // Default to user account for all other roles (including 'user')
        console.log('👤 Redirecting to User Account');
        this.router.push('/user/account');
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