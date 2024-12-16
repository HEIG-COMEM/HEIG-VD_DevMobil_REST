<script setup>
import AppPublicationCard from '@/components/AppPublicationCard.vue';
import { useFetchApiCrud } from '@/composables/useFetchApiCrud';
import { ref } from 'vue';

const { readAll } = useFetchApiCrud('/publications', import.meta.env.VITE_API_URL);

const authorizationHeader = {
    Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NzYwMjM1YTdlMzRkZDU5MGU1Y2RmNWMiLCJleHAiOjE3MzQ5NTg2NjYsInNjb3BlIjoidXNlciIsImlhdCI6MTczNDM1Mzg2Nn0.5ec_9nwERk9Z7m1Si0Nq_62NMYT0xUG334xhU3KQsOg`,
};

const { data, error, loading } = readAll(authorizationHeader);

const publications = ref([]);

const fetchPublications = async () => {
  publications.value = await readAll(authorizationHeader);
};

fetchPublications();

</script>

<template>
  <main class="max-h-screen overflow-y-scroll">
    <div>BeReal - Home</div>
    <!-- 720x1080 -->
     <!-- {{ publications.data[0]._id }} -->
    <AppPublicationCard v-for="publication in publications.data" :key="publication._id" :publication="publication" />

     
  </main>
</template>
<style>
* {
  color: white;
}
</style>
