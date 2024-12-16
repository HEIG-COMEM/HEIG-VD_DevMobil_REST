<script setup>
import { useFetchApiCrud } from '@/composables/useFetchApiCrud';

import { useRoute, onBeforeRouteUpdate } from 'vue-router';

const route = useRoute();

const { read } = useFetchApiCrud(import.meta.env.VITE_API_URL);

const { data, error, loading } = read(`/publications/${route.params.id}`, {
  Authorization:
    'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzYwNWQ5MmFhOTI5ZDY0ODNkZDBhZjEiLCJleHAiOjE3MzQ5NzM0NjYsInNjb3BlIjoiYWRtaW4iLCJpYXQiOjE3MzQzNjg2NjZ9.SVYDwOQUfZGvqtIT6fdmyqflTa73GxlrOZtQc0cVYtk',
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
