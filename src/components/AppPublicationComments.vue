<script setup>
import AppProfilePicture from './AppProfilePicture.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faEllipsis } from '@fortawesome/free-solid-svg-icons';
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
  <div class="p-1">
    <div class="flex flex-row items-center justify-between gap-2 p-2">
      <button @click="$router.back()">
        <FontAwesomeIcon class="h-6 w-6 drop-shadow-lg" :icon="faChevronLeft" />
      </button>
      <div class="flex flex-col items-center">
        <div>BeReal de fhsoifhsoiefhso{{ publication.user.name }}</div>
        <p class="text-xs text-gray-500">{{ formatedDate }}</p>
      </div>
      <FontAwesomeIcon class="h-6 w-6 drop-shadow-lg" :icon="faEllipsis" />
    </div>
    <div class="flex flex-col items-center justify-center gap-6">
      <div>
        <div
          class="ml-4 mt-4 h-32 cursor-pointer rounded-lg bg-white shadow-lg"
          @click="toggleCamera()"
        >
          <img
            class="h-full w-full rounded-lg border border-black object-cover"
            :src="smallCamera"
            alt="publication"
          />
        </div>
        <img
          class="w-1/2 rounded-lg object-cover"
          :src="bigCamera"
          alt="publication"
        />
        <div
          class="flex items-center justify-center gap-2 rounded-full bg-gray-800 bg-opacity-70 p-2 text-xs"
        >
          <FontAwesomeIcon class="h-4 w-4 drop-shadow-lg" :icon="faEllipsis" />
          {{ locality }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
