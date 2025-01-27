import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useModalStore } from '@/stores/modalStore';
import { usePublicationStore } from '@/stores/publicationStore';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import CameraView from '@/views/CameraView.vue';
import FriendsView from '@/views/FriendsView.vue';
import PublicationView from '@/views/PublicationView.vue';
import PublicProfileView from '@/views/PublicProfileView.vue';
import PrivateProfileView from '@/views/PrivateProfileView.vue';

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
      component: LoginView,
      meta: { hideNavbar: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
      meta: { hideNavbar: true },
    },
    {
      path: '/camera',
      name: 'camera',
      component: CameraView,
      meta: { hideNavbar: true },
    },
    {
      path: '/friends',
      name: 'friends',
      component: FriendsView,
    },
    {
      path: '/publications/:id',
      name: 'publication',
      component: PublicationView,
    },
    {
      path: '/users/:id',
      name: 'user',
      component: PublicProfileView,
    },
    {
      path: '/profile',
      name: 'profile',
      component: PrivateProfileView,
    }
  ],
});

/**
 * Middleware to check if the user is authenticated
 * before navigating to any route other than login and register
 */
router.beforeEach((to, from, next) => {
  const publicationStore = usePublicationStore();
  const modalStore = useModalStore();
  const userStore = useUserStore();

  if (to.name === 'camera' && userStore.isAuthenticated) {
    publicationStore.hasAlreadyPost().then((hasAlreadyPost) => {
      if (hasAlreadyPost) {
        modalStore.openModal('alreadyPosted');
        // Si url camera, redirige
        if (window.location.pathname === '/camera') {
          next({ name: 'home' });
        } else {
          next(false); // Bloque la navigation
        }
      } else {
        next(); // Continue vers /camera
      }
    });
  }

  // Authentification pour toutes les autres routes
  else if (to.name !== 'login' && to.name !== 'register' && !userStore.isAuthenticated) {
    next({ name: 'login' });
  }

  else {
    next(); // Continue la navigation
  }
});

export default router;
