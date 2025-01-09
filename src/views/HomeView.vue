<script setup>
import AppPublicationCard from '@/components/AppPublicationCard.vue';
import BaseToast from '@/components/BaseToast.vue';
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

    <BaseToast v-if="alert" :message="alert" type="success" />

    <AppPublicationCard
      v-for="publication in publications.data"
      :key="publication._id"
      :publication="publication"
    />
  </main>
</template>
<style></style>
