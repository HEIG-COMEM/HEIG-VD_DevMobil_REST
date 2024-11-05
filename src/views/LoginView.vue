<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useFetchApi } from '@/composables/useFetchApi';

const userStore = useUserStore();
const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL);

const email = ref('');
const password = ref('');

const error = ref('');
const isLoading = ref(false);

const login = () => {
  isLoading.value = true;
  error.value = '';
  fetchApi({
    url: '/auth/login',
    method: 'POST',
    data: { email: email.value, password: password.value },
  })
    .then(data => {
      userStore.setToken(data.token);
    })
    .catch(err => (error.value = err))
    .finally(() => (isLoading.value = false));
};
</script>

<template>
  <h1>Login</h1>
  <form @submit.prevent="login()">
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button type="submit">Login</button>
  </form>

  <router-link to="/register">Register</router-link>
</template>

<style scoped></style>
