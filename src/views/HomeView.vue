<script setup>
import AppPublicationCard from '@/components/AppPublicationCard.vue';
import { useFetchApiCrud } from '@/composables/useFetchApiCrud';
import { ref } from 'vue';

const { readAll } = useFetchApiCrud(
  '/publications',
  import.meta.env.VITE_API_URL,
);

const authorizationHeader = {
  Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzYwNWQ5MmFhOTI5ZDY0ODNkZDBhZjEiLCJleHAiOjE3MzQ5NzM0NjYsInNjb3BlIjoiYWRtaW4iLCJpYXQiOjE3MzQzNjg2NjZ9.SVYDwOQUfZGvqtIT6fdmyqflTa73GxlrOZtQc0cVYtk`,
};

const { data, error, loading } = readAll(null, authorizationHeader);

const publications = ref([]);

const fetchPublications = async () => {
  publications.value = await readAll(null, authorizationHeader);
};

fetchPublications();
</script>

<template>
  <main class="max-h-screen overflow-y-scroll">
    <div>BeReal - Home</div>
    <!-- 720x1080 -->
    <!-- {{ publications.data[0]._id }} -->
    <AppPublicationCard
      v-for="publication in publications.data"
      :key="publication._id"
      :publication="publication"
    />
  </main>
</template>
<style>
* {
  color: white;
}
</style>
