import { createRouter, createWebHistory } from 'vue-router'
import UserLogin from '../components/User/Login.vue'

const routes = [
  {
    path: '/',
    name: 'Login',
    component: UserLogin
  },
  {
    path: '/login',
    name: 'Login2',
    component: UserLogin
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('../components/Admin/Dashboard.vue') // You'll need to create this
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router