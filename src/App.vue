<script setup>
import { RouterView } from 'vue-router';
import MobileLayout from '@/layouts/MobileLayout.vue';
import { useNotificationsStore } from '@/stores/notificationsStore';
import BaseToast from '@/components/BaseToast.vue';
import TheGlobalModal from '@/components/TheGlobalModal.vue';

const notificationsStore = useNotificationsStore();
</script>

<template>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <MobileLayout>
    <TheGlobalModal />
    <div class="toast toast-end toast-top z-50">
      <BaseToast
        v-for="(notification, index) in notificationsStore.getMessages"
        :key="index"
        :message="notification.message"
        :type="notification.type"
      />
    </div>
    <RouterView />
  </MobileLayout>
</template>

<style scoped></style>
