<script setup>
import { useNotificationsStore } from '@/stores/notificationsStore';
const notificationsStore = useNotificationsStore();
</script>

<template>
  <div
    class="badge badge-sm"
    :class="{
      'badge-success': notificationsStore.isSocketConnected,
      'badge-error': !notificationsStore.isSocketConnected,
    }"
  >
    WS
  </div>
</template>

<style scoped></style>
