import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/store/user'

const routes = [
  {
    path: '/',
    redirect: '/conversations'
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Auth.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/Auth.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/register/complete/:token',
    name: 'RegisterComplete',
    component: () => import('@/pages/RegisterComplete.vue'),
    meta: { requiresGuest: true }
  },
  {
    path: '/auth/oauth/callback',
    name: 'OAuthCallback',
    component: () => import('@/pages/OAuthCallback.vue')
  },
  {
    path: '/auth/google/callback',
    redirect: '/auth/oauth/callback'
  },
  {
    path: '/auth/wechat/callback',
    redirect: '/auth/oauth/callback'
  },
  {
    path: '/google/complete-setup',
    name: 'GoogleCompleteSetup',
    component: () => import('@/pages/GoogleCompleteSetup.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/conversations',
    name: 'Conversations',
    component: () => import('@/pages/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/dashboard',
    redirect: '/conversations'
  },
  {
    path: '/conversations/:id',
    name: 'ConversationDetail',
    component: () => import('@/pages/ThreadlineDetail.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/threadlines/:id',
    redirect: to => `/conversations/${to.params.id}`
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('@/pages/Settings.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // If route requires authentication
  if (to.meta.requiresAuth) {
    // If not currently authenticated, try to check auth from token
    if (!userStore.isAuthenticated) {
      const isValid = await userStore.checkAuth()
      if (!isValid) {
        next('/login')
        return
      }
    }
    next()
  } else if (to.meta.requiresGuest && userStore.isAuthenticated) {
    next('/dashboard')
  } else {
    next()
  }
})

export default router
