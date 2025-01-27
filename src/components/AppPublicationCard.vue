<script setup>
import { computed, ref } from 'vue';
import { formatDateLong } from '@/utils/date';
import { reverseGeocoding } from '@/utils/reverse-geocoding';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faComment } from '@fortawesome/free-solid-svg-icons';
import AppProfilePicture from './AppProfilePicture.vue';

const props = defineProps({
  publication: Object,
});

const formatedDate = computed(() =>
  formatDateLong(props.publication.createdAt),
);

const locality = ref('');
const getFormatedLocation = async () => {
  const lat = props.publication.location.coordinates[1];
  const long = props.publication.location.coordinates[0];
  locality.value = await reverseGeocoding(lat, long);
};
getFormatedLocation();

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
  <div class="px-0 pb-8">
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
        class="absolute ml-4 mt-4 h-[30%] aspect-3/4 cursor-pointer rounded-lg bg-white shadow-lg"
        @click="toggleCamera()"
      >
        <img
          class="h-full w-full rounded-lg border-2 border-black object-cover"
          :src="smallCamera"
          alt="publication"
        />
      </div>
      <img
        class="w-full rounded-[1.25rem] object-cover"
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
