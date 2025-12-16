import { router } from '@/router';
import { useAuthStore } from './store';

export function setupAuthRouter() {
  router.beforeEach(async (to, from, next) => {
    const authStore = useAuthStore();
    if (!authStore.user) {
      await authStore.checkAuth();
    }
    if (to.meta.requiresAuth && !authStore.isAuthenticated) {
      next('/auth');
    } else if (to.path === '/auth' && authStore.isAuthenticated) {
      next('/organization');
    } else {
      next();
    }
  });
}
