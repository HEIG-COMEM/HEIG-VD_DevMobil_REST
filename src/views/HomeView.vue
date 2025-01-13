<script setup>
import { useRouter } from 'vue-router';
import { usePublicationsStore } from '@/stores/publicationsStore';
import { useNotificationsStore } from '@/stores/notificationsStore';
import AppPublicationCard from '@/components/AppPublicationCard.vue';
import BaseSentinel from '@/components/BaseSentinel.vue';

const router = useRouter();
const publicationsStore = usePublicationsStore();
const notificationsStore = useNotificationsStore();

if (router.currentRoute.value.query.loggedIn) {
  notificationsStore.addMessage({
    message: 'Connexion réussie',
    type: 'success',
  });
  router.replace({ query: {} });
}
if (router.currentRoute.value.query.registered) {
  notificationsStore.addMessage({
    message: 'Inscription réussie',
    type: 'success',
  });
  router.replace({ query: {} });
}
</script>

<template>
  <main class="max-h-screen overflow-y-scroll pb-40">
    <AppPublicationCard
      v-for="publication in publicationsStore.getPublications.data"
      :key="publication._id"
      :publication="publication"
    />
    <div
      v-show="publicationsStore.isLoading"
      class="flex flex-row justify-center"
    >
      <span class="loading loading-dots loading-lg"></span>
    </div>
    <BaseSentinel @inView="publicationsStore.loadMorePublications()" />
  </main>
</template>
<style></style>
