import { createRouter, createWebHistory } from 'vue-router'
import type { NavigationGuardWithThis } from 'vue-router'
import HomeView from '@/views/HomeView.vue'

import { useLoginStore } from '@stores/login'
import { useAdministratorsStore } from '@/stores/administrators'

const requireLogged: NavigationGuardWithThis<undefined> = async (to, from, next) => {
  const useLogin = useLoginStore()
  const useAdmin = useAdministratorsStore()

  await useAdmin.getAdministratorMe()

  if (useLogin.isLogged) {
    next()
  } else {
    next('/login')
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
      beforeEnter: requireLogged
    },
    {
      path: '/petitions',
      name: 'petitions',
      component: () => import('@views/PetitionsView.vue'),
      beforeEnter: requireLogged
    },
    {
      path: '/templates',
      name: 'templates',
      component: () => import('@views/TemplatesView.vue'),
      beforeEnter: requireLogged
    },
    {
      path: '/events',
      name: 'events',
      component: () => import('@views/EventsView.vue'),
      beforeEnter: requireLogged
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/LoginView.vue')
    },
    // Catch-all path redirecting to /.
    {
      path: '/:pathMatch(.*)*', // Catches all undefined paths
      redirect: '/'
    }
  ]
})

export default router
