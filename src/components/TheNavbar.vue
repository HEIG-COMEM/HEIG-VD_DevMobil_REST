<script setup>
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="bg-onSurface rounded-t-3xl px-11 py-3 backdrop-blur">
    <ul class="flex flex-row justify-around">
      <li><RouterLink to="/">🏠</RouterLink></li>
      <li><RouterLink to="/">📸</RouterLink></li>
      <li><RouterLink to="/">📤</RouterLink></li>
    </ul>
  </nav>
</template>

<style scoped></style>
