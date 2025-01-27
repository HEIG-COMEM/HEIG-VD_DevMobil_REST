<script setup>
import { computed, ref } from 'vue';
import { reverseGeocoding } from '@/utils/reverse-geocoding';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';
import AppPublicationComments from './AppPublicationComments.vue';

const props = defineProps({
  publication: Object,
});

const locality = ref('');
const getFormatedLocation = async () => {
  const lat = props.publication.location.coordinates[1];
  const long = props.publication.location.coordinates[0];
  locality.value = await reverseGeocoding(lat, long);
};
getFormatedLocation();

const showFrontCamera = ref(true);
const toggleCamera = () => (showFrontCamera.value = !showFrontCamera.value);

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
  <div class="flex flex-col items-center gap-4 p-1">
    <div class="relative flex w-1/2 flex-col items-center gap-2">
      <div
        class="absolute left-1 top-1 aspect-3/4 h-[30%] cursor-pointer rounded-xl bg-white shadow-lg"
        @click="toggleCamera()"
      >
        <img
          class="h-full w-full rounded-lg border border-black object-cover"
          :src="smallCamera"
          alt="publication"
        />
      </div>
      <img class="rounded-lg object-cover" :src="bigCamera" alt="publication" />
    </div>
    <div class="badge badge-neutral badge-lg gap-2">
      <FontAwesomeIcon class="h-4 w-4 drop-shadow-lg" :icon="faLocationArrow" />
      {{ locality }}
    </div>
    <AppPublicationComments />
  </div>
</template>

<style scoped></style>
