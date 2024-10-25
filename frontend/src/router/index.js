/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'
import { useAppStore } from '@/stores/app'
import { useAuthFetch } from '@/composable/core'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    const store = useAppStore();
    if (store.username === "") {
      try {
        const { data, error, statusCode  } = await useAuthFetch("/api/login").get().json();
        if (statusCode.value === 200) {
          store.updateUsername(data.value.username);
        } else {
          window.location.href = `/login?redirect=${to.href}`;
          store.updateUsername("");
        }
        next();
      } catch (e) {
        window.location.href = `/login?redirect=${to.href}`;
      }
    } else {
        next();
    }
  } else {
    next();
  }
});

export default router
