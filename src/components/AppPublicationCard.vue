<script setup>
import AppProfilePicture from './AppProfilePicture.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import { computed, ref, onMounted } from 'vue';

const props = defineProps({
  publication: Object,
});

const formatedDate = computed(() => {
  const date = new Date(props.publication.createdAt);

  return date.toDateString() === new Date().toDateString()
    ? `Aujourd'hui à ${date.toLocaleTimeString()}`
    : `Il y a ${Math.floor(
        (new Date() - date) / (1000 * 60 * 60 * 24),
      )} jours à ${date.toLocaleTimeString()}`;
});

const locality = ref('');
const getFormatedLocation = () => {
  const lat = props.publication.location.coordinates[1];
  const long = props.publication.location.coordinates[0];
  const url = `https://api-bdc.net/data/reverse-geocode-client?latitude=${lat}&longitude=${long}&localityLanguage=fr`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      locality.value = data.locality;
    });
};

onMounted(() => {
  getFormatedLocation();
});

const showFrontCamera = ref(true);
const toggleCamera = () => {
  showFrontCamera.value = !showFrontCamera.value;
};

const bigCamera = computed(() => {
  return showFrontCamera.value
    ? props.publication.frontCamera.url
    : props.publication.backCamera.url;
});

const smallCamera = computed(() => {
  return showFrontCamera.value
    ? props.publication.backCamera.url
    : props.publication.frontCamera.url;
});
</script>

<template>
  <div class="px-8 pb-8">
    <div
      class="flex flex-row content-center items-center justify-between gap-2 p-2"
    >
      <RouterLink
        :to="`/users/${publication.user._id}`"
        class="text-sm font-bold"
        ><AppProfilePicture :photo="publication.user.profilePicture.url"
      /></RouterLink>
      <div class="flex-grow">
        <RouterLink
          :to="`/users/${publication.user._id}`"
          class="text-sm font-bold"
          >{{ publication.user.name }}</RouterLink
        >
        <p class="text-xs text-gray-500">{{ locality }}, {{ formatedDate }}</p>
      </div>
    </div>
    <div class="relative">
      <div
        class="absolute ml-4 mt-4 h-36 cursor-pointer rounded-lg bg-white shadow-lg"
        @click="toggleCamera()"
      >
        <img
          class="h-full w-full rounded-lg border border-black object-cover"
          :src="smallCamera"
          alt="publication"
        />
      </div>
      <img
        class="w-full rounded-lg object-cover"
        :src="bigCamera"
        alt="publication"
      />

      <RouterLink :to="`/publications/${publication._id}`">
        <FontAwesomeIcon
          class="absolute bottom-4 right-4 h-6 w-6 rounded-full text-white drop-shadow-lg"
          :icon="faComment"
        />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
