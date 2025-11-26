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
    component: () => import('../components/Admin/Dashboard.vue') 
  },
 {
    path: '/inventory',
    name: 'Inventory',
    component: () => import('../components/Admin/Inventory.vue') 
  },
  {
    path: '/usermanagement',
    name: 'UserManagement',
    component: () => import('../components/Admin/UserManagement.vue') 
  },
   {
    path: '/adminaccount',
    name: 'AdminAccount',
    component: () => import('../components/Admin/AdminAccount.vue') 
  },
  {
    path: '/transactions',
    name: 'Transactions',
    component: () => import('../components/Admin/Transactions.vue') 
  },
{
    path: '/ordersmanagement',
    name: 'OrdersManagement',
    component: () => import('../components/Admin/OrdersManagement.vue') 
  },
  {
  path: '/user/account',
  name: 'UserAccount',
  component: () => import('../components/User/UserAccount.vue')
},
  {
    path: '/user/home',  // IDAGDAG ITO
    name: 'UserHome',
    component: () => import('../components/User/Home.vue')  // I-create mo ito
  },
  {
  path: '/user/menu',
  name: 'UserMenu',
  component: () => import('../components/User/Menu.vue')
},
{
  path: '/user/navbar',
  name: 'Navbar',
  component: () => import('../components/User/Navbar.vue')
},

{
  path: '/user/about-us',
  name: 'AboutUs',
  component: () => import('../components/User/AboutUs.vue')
},


{
  path: '/user/find-store',
  name: 'FindStore',
  component: () => import('../components/User/FindStore.vue')
},



]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router