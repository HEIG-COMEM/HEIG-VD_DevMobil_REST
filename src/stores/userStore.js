import { computed, ref } from 'vue';
import { defineStore, getActivePinia } from 'pinia';
import router from '@/router';
import { useFetchApi } from '@/composables/useFetchApi';

const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL);

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const token = ref(null);

  const fetchUserData = async () => {
    try {
      const response = await fetchApi({
        url: '/auth/user',
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      const data = response.data;

      user.value = {
        id: data._id,
        email: data.email,
        name: data.name,
        role: data.role,
        profilePictureUrl: data.profilePictureUrl,
      };
    } catch (error) {
      console.error('Failed to fetch user data:', error);
      if (error.status === 401) logout("Votre session a expiré, veuillez vous reconnecter");
    }
  };

  const setToken = async newToken => {
    token.value = newToken;
    user.value = null;

    localStorage.setItem('bereal_token', newToken);

    await fetchUserData();

    return true;
  };

  /**
   * On store initialization, check if there is a token in localStorage
   * If there is, set the token and fetch the user data
   * This way, the user will be logged in even after refreshing the page
   */
  if (localStorage.getItem('bereal_token')) {
    setToken(localStorage.getItem('bereal_token'));
  }

  const getToken = computed(() => token.value);
  const getUser = computed(() => user.value);

  const isAdmin = computed(() => user.value?.role === 'admin');
  const isAuthenticated = computed(() => !!token.value);

  const logout = (reason) => {
    getActivePinia()._s.forEach(store => store.$reset(reason ?? ''));
  };

  const refreshUser = async () => await fetchUserData();

  const $reset = () => {
    user.value = null;
    token.value = null;
    localStorage.removeItem('bereal_token');
    if (router.currentRoute.value.path !== '/login' && router.currentRoute.value.path !== '/register') router.push('/login');
  }

  return {
    setToken,
    getToken,
    refreshUser,
    getUser,
    isAuthenticated,
    isAdmin,
    logout,
    $reset,
  };
});
