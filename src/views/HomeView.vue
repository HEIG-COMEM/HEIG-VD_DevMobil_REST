<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePublicationsStore } from '@/stores/publicationsStore';
import AppPublicationCard from '@/components/AppPublicationCard.vue';
import BaseToast from '@/components/BaseToast.vue';
import BaseSentinel from '@/components/BaseSentinel.vue';

const router = useRouter();
const publicationsStore = usePublicationsStore();

const alert = ref('');
if (router.currentRoute.value.query.loggedIn) {
  alert.value = 'Connexion réussie';
  router.replace({ query: {} });
}
if (router.currentRoute.value.query.registered) {
  alert.value = 'Inscription réussie';
  router.replace({ query: {} });
}
</script>

<template>
  <main class="max-h-screen overflow-y-scroll pb-40 pt-6">
    <BaseToast v-if="alert" :message="alert" type="success" />
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
