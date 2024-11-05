<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();
</script>

<template>
  <header>
    <div>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/login">Login</RouterLink>
        <RouterLink to="/register">Register</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

  <p>Logged in user email : {{ userStore.getUser.email ?? 'none' }}</p>
</template>

<style scoped></style>
