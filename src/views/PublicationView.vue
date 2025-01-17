<script setup>
import { useRoute } from 'vue-router';
import { formatDateLong } from '@/utils/date';
import AppPublicationView from '@/components/AppPublicationView.vue';
import { usePublicationStore } from '@/stores/publicationStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';

const route = useRoute();
const publicationStore = usePublicationStore();

publicationStore.setPublicationId(route.params.id);
</script>

<template>
  <main class="max-h-screen overflow-y-scroll px-4 pb-44 pt-6">
    <div
      v-if="publicationStore.getOwner"
      class="flex flex-row items-center justify-between gap-2 p-2"
    >
      <button @click="$router.back()">
        <FontAwesomeIcon class="h-6 w-6 drop-shadow-lg" :icon="faChevronLeft" />
      </button>
      <div class="flex flex-col items-center">
        <p>BeReal de {{ publicationStore.getOwner.name }}</p>
        <p class="text-xs text-gray-500">
          {{ formatDateLong(publicationStore.getPublication.createdAt) }}
        </p>
      </div>
      <div></div>
    </div>
    <AppPublicationView
      v-if="publicationStore.getPublication"
      :publication="publicationStore.getPublication"
    />
  </main>
</template>
<style></style>
