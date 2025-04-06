import { createRouter, createWebHistory } from 'vue-router'
import Cookies from 'js-cookie'
import HomeView from '../views/HomeView.vue'
import { verifyEmail } from '@/api/auth'  // Import the verifyEmail function from your API module

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '/members/dashboard',
      name: 'dashboard',
      component: () => import('../views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/members/profile/',
      name: 'profile',
      component: () => import('../views/UserProfileView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/events/:id',
      name: 'Event',
      component: () => import('../views/EventView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/verify-email',
      name: 'VerifyEmail',
      beforeEnter: async (to, from, next) => {
        try {
          const response = await verifyEmail(to.query.token);
          return next({ name: 'login', query: { status: 'verification-success' } });
        } catch (error) {
          return next({ name: 'login', query: { status: 'verification-failure' } });

        }
      },
    },
  ],
})

router.beforeEach((to, from, next) => {
  const jwt = Cookies.get('jwt'); // Check if the JWT cookie is set

  // Redirect logged-in users away from public pages
  if (jwt && (to.path === '/' || to.path === '/login' || to.path === '/signup')) {
    return next({ name: 'dashboard' }); // Redirect to the dashboard or another protected page
  }

  // Redirect unauthenticated users trying to access protected pages
  if (to.meta.requiresAuth && !jwt) {
    return next({ name: 'login' }); // Redirect to login
  }

  next(); // Proceed to the requested route
});

export default router