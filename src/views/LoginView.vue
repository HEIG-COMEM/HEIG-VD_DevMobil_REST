<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/stores/userStore';
import { useNotificationsStore } from '@/stores/notificationsStore';
import { useFetchApi } from '@/composables/useFetchApi';

const router = useRouter();

const userStore = useUserStore();
userStore.getToken ? userStore.logout() : null;
const notificationsStore = useNotificationsStore();

const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL);

const email = ref('');
const password = ref('');

const isLoading = ref(false);

const login = () => {
  isLoading.value = true;
  fetchApi({
    url: '/auth/login',
    method: 'POST',
    data: { email: email.value, password: password.value },
  })
    .then(response => {
      const res = userStore.setToken(response.data.token);
      if (res) {
        router.replace({ name: 'home', query: { loggedIn: true } });
      }
    })
    .catch(() => {
      notificationsStore.addMessage({
        message: 'Email ou mot de passe incorrect',
        type: 'error',
      });
    })
    .finally(() => (isLoading.value = false));
};
</script>

<template>
  <form
    @submit.prevent="login()"
    class="flex h-[80vh] flex-col justify-center gap-12 px-4"
  >
    <h1 class="text-center text-4xl font-bold">Connexion</h1>
    <div class="flex flex-col gap-4">
      <label class="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
          />
          <path
            d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
          />
        </svg>
        <input type="email" class="grow" placeholder="Email" v-model="email" />
      </label>
      <label class="input input-bordered flex items-center gap-2">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          fill="currentColor"
          class="h-4 w-4 opacity-70"
        >
          <path
            fill-rule="evenodd"
            d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
            clip-rule="evenodd"
          />
        </svg>
        <input
          type="password"
          class="grow"
          v-model="password"
          placeholder="Mot de passe"
        />
      </label>
    </div>
    <button class="btn btn-primary" type="submit" :disabled="isLoading">
      {{ isLoading ? 'Chargement...' : 'Connexion' }}
    </button>
  </form>

  <p class="w-full text-center">
    Vous n'avez pas de compte ?
    <router-link class="link link-accent" to="/register"
      >Inscrivez-vous</router-link
    >
  </p>
</template>

<style scoped></style>
