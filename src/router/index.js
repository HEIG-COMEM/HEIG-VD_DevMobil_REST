import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '@/views/HomeView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';
import CameraView from '@/views/CameraView.vue';
import FriendsView from '@/views/FriendsView.vue';
import PublicationView from '@/views/PublicationView.vue';
import ProfileView from '@/views/ProfileView.vue';

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
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterView,
    },
    {
      path: '/camera',
      name: 'camera',
      component: CameraView,
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
      component: ProfileView,
    }
  ],
});

export default router;
