// router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '../components/User/Login.vue'
import authService from '../services/auth'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: UserLogin,
    meta: { requiresAuth: false }
  },
  {
    path: '/login',
    name: 'Login2',
    component: UserLogin,
    meta: { requiresAuth: false }
  },
  {
    path: '/admin/dashboard',
    name: 'Dashboard',
    component: () => import('../components/Admin/Dashboard.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../components/Admin/Inventory.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/usermanagement',
    name: 'UserManagement',
    component: () => import('../components/Admin/UserManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/adminaccount',
    name: 'AdminAccount',
    component: () => import('../components/Admin/AdminAccount.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../components/Admin/Transactions.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/ordersmanagement',
    name: 'OrdersManagement',
    component: () => import('../components/Admin/OrdersManagement.vue'),
    meta: { requiresAuth: true, requiresAdmin: true }
  },
  {
    path: '/user/account',
    name: 'UserAccount',
    component: () => import('../components/User/UserAccount.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/home',
    name: 'UserHome',
    component: () => import('../components/User/Home.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/menu',
    name: 'UserMenu',
    component: () => import('../components/User/Menu.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/navbar',
    name: 'Navbar',
    component: () => import('../components/User/Navbar.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/about-us',
    name: 'AboutUs',
    component: () => import('../components/User/AboutUs.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/user/find-store',
    name: 'FindStore',
    component: () => import('../components/User/FindStore.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/admin',
    redirect: '/admin/dashboard'
  },
  {
    path: '/dashboard',
    redirect: '/admin/dashboard'
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Route guards
router.beforeEach((to, from, next) => {
  const isAuthenticated = authService.isAuthenticated()
  const user = authService.getUser()
  const userRole = user?.role?.toLowerCase()

  console.log(`🛡️ Route Guard: ${to.path}`, { 
    isAuthenticated, 
    userRole,
    requiresAuth: to.meta.requiresAuth,
    requiresAdmin: to.meta.requiresAdmin
  })

  // If route requires authentication but user is not authenticated
  if (to.meta.requiresAuth && !isAuthenticated) {
    console.log('🔒 Redirecting to login: Authentication required')
    next('/login')
    return
  }

  // If user is authenticated but tries to access login page
  if ((to.path === '/login' || to.path === '/') && isAuthenticated) {
    console.log('🔄 Already authenticated, redirecting based on role')
    // Redirect based on role - ADMIN or USER only
    if (userRole === 'admin') {
      next('/inventory')
    } else {
      next('/user/account')
    }
    return
  }

  // Check admin routes - only allow 'admin' role
  if (to.meta.requiresAdmin && userRole !== 'admin') {
    console.log('🚫 Access denied: Admin role required')
    // Redirect non-admin users to user account
    next('/user/account')
    return
  }

  next()
})

export default router