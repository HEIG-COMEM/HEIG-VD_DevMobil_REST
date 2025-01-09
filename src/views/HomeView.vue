<script setup>
import AppPublicationCard from '@/components/AppPublicationCard.vue';
import { useFetchApiCrud } from '@/composables/useFetchApiCrud';
import { useUserStore } from '@/stores/userStore';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const alert = ref('');
if (router.currentRoute.value.query.loggedIn) {
  alert.value = 'Connexion réussie';
  router.replace({ query: {} });
}
if (router.currentRoute.value.query.registered) {
  alert.value = 'Inscription réussie';
  router.replace({ query: {} });
}

const userStore = useUserStore();

const { readAll } = useFetchApiCrud(
  '/publications',
  import.meta.env.VITE_API_URL,
);

const authorizationHeader = {
  Authorization: `Bearer ${userStore.getToken}`,
};

const { data, error, loading } = readAll(null, authorizationHeader);

const publications = ref([]);

const fetchPublications = async () => {
  publications.value = await readAll(null, authorizationHeader);
};

fetchPublications();

if (alert.value) {
  setTimeout(() => {
    alert.value = '';
  }, 2000);
}
</script>

<template>
  <main class="max-h-screen overflow-y-scroll">
    <div>BeReal - Home</div>

    <div role="alert" v-if="alert" class="alert alert-success">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ alert }}</span>
    </div>

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
