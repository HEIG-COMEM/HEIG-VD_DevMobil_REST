<script setup>
import TheNavbar from '@/components/TheNavbar.vue';
</script>

<template>
  <div class="relative h-dvh w-full max-w-screen-sm border border-red-500">
    <slot></slot>
    <TheNavbar class="absolute bottom-0 left-0 w-full" />
  </div>
</template>

<style scoped></style>
