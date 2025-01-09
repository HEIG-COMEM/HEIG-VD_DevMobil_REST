<script setup>
import AppPublicationComments from '@/components/AppPublicationComments.vue';
import { useFetchApiCrud } from '@/composables/useFetchApiCrud';
import { useUserStore } from '@/stores/userStore';
import { useRoute, onBeforeRouteUpdate } from 'vue-router';

const route = useRoute();
const userStore = useUserStore();

const { read } = useFetchApiCrud(import.meta.env.VITE_API_URL);

const { data, error, loading } = read(`/publications/${route.params.id}`, {
  Authorization: `Bearer ${userStore.getToken}`,
});

onBeforeRouteUpdate(async (to, from) => {
  console.log('onBeforeRouteUpdate', to.params.id);
});
</script>

<template>
  <main class="max-h-screen overflow-y-scroll">
    <div>BeReal - Home</div>

    <AppPublicationComments :publication="data" />

    <div class="bg-red-700">-</div>
    {{ data }}
    <div class="bg-red-700">-</div>
  </main>
</template>
<style>
* {
  color: white;
}
</style>
