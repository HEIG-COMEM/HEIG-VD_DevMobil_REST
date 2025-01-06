<script setup>
import { ref, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import { useFetchApiCrud } from '@/composables/useFetchApiCrud';
import { useUserStore } from '@/stores/userStore';
import AppPublicProfile from '@/components/AppPublicProfile.vue';
const userStore = useUserStore();

const route = useRoute();
const id = route.params.id;
const profile = ref(null);
const stats = ref(null);

const authorisationHeader = {
  Authorization: `Bearer ${userStore.getToken}`,
};

const { read } = useFetchApiCrud(`/users`, import.meta.env.VITE_API_URL);
const { readAll } = useFetchApiCrud(
  `/users/${id}/stats`,
  import.meta.env.VITE_API_URL,
);

const profileResponse = read(id, authorisationHeader);
const statsResponse = readAll(null, authorisationHeader);

watchEffect(() => {
  profile.value = profileResponse.data.value;
  stats.value = statsResponse.data.value;
});
</script>

<template>
  <AppPublicProfile :profile :stats />
</template>

<style scoped></style>
