<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import TheNavbar from '@/components/TheNavbar.vue';
import TheHeader from '@/components/TheHeader.vue';

const route = useRoute();

const hideNavbar = ref(route.meta.hideNavbar || false);

// Mettre à jour hideNavbar à chaque changement de route
watch(
  () => route.meta.hideNavbar,
  newValue => {
    hideNavbar.value = newValue || false;
  },
  { immediate: true },
);
</script>

<template>
  <div class="relative flex flex-col h-dvh w-full max-w-screen-sm">
    <TheHeader v-if="!hideNavbar" />
    <div class="flex-grow overflow-y-auto overflow-x-hidden">
      <slot></slot>
    </div>
    <TheNavbar v-if="!hideNavbar" class="absolute bottom-0 w-full" />
  </div>
</template>

<style scoped></style>
