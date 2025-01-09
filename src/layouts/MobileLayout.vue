<script setup>
import TheNavbar from '@/components/TheNavbar.vue';
import { useRoute } from 'vue-router';
import { ref, watch } from 'vue';

const route = useRoute();

const hideNavbar = ref(route.meta.hideNavbar || false);

// Mettre à jour hideNavbar à chaque changement de route
watch(
  () => route.meta.hideNavbar,
  (newValue) => {
    hideNavbar.value = newValue || false;
  },
  { immediate: true }
);
</script>

<template>
  <div class="relative h-dvh w-full max-w-screen-sm">
    <slot></slot>
    <TheNavbar v-if="!hideNavbar" class="absolute bottom-0 left-0 w-full" />
  </div>
</template>

<style scoped></style>
