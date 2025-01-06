<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';
import { useFetchApi } from '../composables/useFetchApi';

const router = useRouter();

const userStore = useUserStore();
userStore.logout();

const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL);

const name = ref('');
const email = ref('');
const password = ref('');

const error = ref('');
const isLoading = ref(false);

const register = () => {
  isLoading.value = true;
  error.value = '';
  fetchApi({
    url: '/auth/signup',
    method: 'POST',
    data: { name: name.value, email: email.value, password: password.value },
  })
    .then(data => {
      if (!data.email) return;

      fetchApi({
        url: '/auth/login',
        method: 'POST',
        data: { email: email.value, password: password.value },
      }).then(data => {
        const res = userStore.setToken(data.token);
        if (res) {
          router.push({ name: 'home' });
        }
      });
    })
    .catch(err => (error.value = err))
    .finally(() => (isLoading.value = false));
};
</script>

<template>
  <h1>Register</h1>
  <div v-if="error">{{ error.data.message }}</div>
  <div v-if="isLoading">Loading...</div>
  <form @submit.prevent="register()">
    <input type="text" v-model="name" placeholder="Name" />
    <input type="email" v-model="email" placeholder="Email" />
    <input type="password" v-model="password" placeholder="Password" />
    <button type="submit">Register</button>
  </form>

  <router-link to="/login">Login</router-link>
</template>

<style scoped></style>
