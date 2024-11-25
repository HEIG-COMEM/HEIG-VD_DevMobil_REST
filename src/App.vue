<script setup>
import { RouterLink, RouterView } from 'vue-router';
import { useUserStore } from '@/stores/userStore';

import MobileLayout from '@/layouts/MobileLayout.vue';

const userStore = useUserStore();
</script>

<template>
  <MobileLayout>
    <RouterView />
  </MobileLayout>
</template>

<style scoped></style>
