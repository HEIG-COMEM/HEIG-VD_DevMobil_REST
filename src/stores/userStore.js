import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useFetchApi } from '@/composables/useFetchApi';

const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL);

export const useUserStore = defineStore('user', () => {
  const user = ref(null);
  const token = ref(null);

  const getUser = computed(() => user.value);
  const getToken = computed(() => token.value);

  function setToken(newToken) {
    token.value = newToken;
    user.value = null;

    fetchApi({
      url: '/auth/user',
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })
    .then(response => {
      console.log(response);
      console.log(response.email);

      user.value = {
        email: response.email,
        name: response.name,
        role: response.role,
        profilePictureUrl: response.profilePictureUrl,
      };
    })
    .catch(error => {
      console.error(error);
    });
  };

  function logout() {
    user.value = null;
    token.value = null;
  };

  return {
    user,
    token,
    setToken,
    getUser,
    getToken,
    logout,
  };
});
