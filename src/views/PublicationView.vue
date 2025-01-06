<script setup>
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

    {{ data }}
  </main>
</template>
<style>
* {
  color: white;
}
</style>
