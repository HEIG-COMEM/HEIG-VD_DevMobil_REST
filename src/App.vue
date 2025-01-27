<script setup>
import { RouterView } from 'vue-router';
import MobileLayout from '@/layouts/MobileLayout.vue';
import { useNotificationsStore } from '@/stores/notificationsStore';
import BaseToast from '@/components/BaseToast.vue';
import TheGlobalModal from '@/components/TheGlobalModal.vue';

const notificationsStore = useNotificationsStore();
</script>

<template>
  <MobileLayout>
    <TheGlobalModal />
    <div
      class="toast toast-center toast-top z-50 w-full whitespace-normal sm:max-w-screen-sm"
    >
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
