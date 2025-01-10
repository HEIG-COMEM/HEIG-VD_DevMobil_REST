<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import TheApiStatusIndicator from '@/components/TheApiStatusIndicator.vue';
</script>

<template>
  <div
    class="flex flex-row items-center justify-between gap-5 rounded-b-3xl bg-base-100 p-5"
  >
    <TheApiStatusIndicator />
    BeReal - Copy
    <RouterLink to="/profile">
      <FontAwesomeIcon :icon="faUser" class="cursor-pointer" />
    </RouterLink>
  </div>
</template>

<style scoped></style>
