<script setup>
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';
import { formatDateLong } from '@/utils/date';
import AppPublicationView from '@/components/AppPublicationView.vue';
import { useFetchApi } from '@/composables/useFetchApi';
import { useUserStore } from '@/stores/userStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const route = useRoute();
const userStore = useUserStore();

const publication = ref(null);
const user = ref(null);

const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
  Authorization: `Bearer ${userStore.getToken}`,
});

const fetchPublicationAndUser = async () => {
  try {
    const publicationResponse = await fetchApi({
      url: `/publications/${route.params.id}`,
    });
    publication.value = publicationResponse.data;
    const userResponse = await fetchApi({
      url: `/users/${publicationResponse.data.user}`,
    });
    user.value = userResponse.data;
  } catch (error) {
    console.error(error);
  }
};

const formatedDate = computed(() =>
  formatDateLong(publication.value?.createdAt),
);

fetchPublicationAndUser();
</script>

<template>
  <main class="max-h-screen overflow-y-scroll pb-44 pt-6">
    <div
      v-if="user"
      class="flex flex-row items-center justify-between gap-2 p-2"
    >
      <button @click="$router.back()">
        <FontAwesomeIcon class="h-6 w-6 drop-shadow-lg" :icon="faChevronLeft" />
      </button>
      <div class="flex flex-col items-center">
        <p>BeReal de {{ user.name }}</p>
        <p class="text-xs text-gray-500">{{ formatedDate }}</p>
      </div>
      <div></div>
    </div>
    <AppPublicationView v-if="publication" :publication />
  </main>
</template>
<style></style>
