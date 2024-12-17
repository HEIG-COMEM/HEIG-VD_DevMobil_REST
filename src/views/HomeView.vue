<script setup>
import AppPublicationCard from '@/components/AppPublicationCard.vue';
import { useFetchApiCrud } from '@/composables/useFetchApiCrud';
import { ref } from 'vue';

const { readAll } = useFetchApiCrud(
  '/publications',
  import.meta.env.VITE_API_URL,
);

/**
 * DEBUG: This is a mock authorisation header.
 */
const authorizationHeader = {
  Authorization: `Bearer ${import.meta.env.VITE_DEBUG_TOKEN}`,
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
