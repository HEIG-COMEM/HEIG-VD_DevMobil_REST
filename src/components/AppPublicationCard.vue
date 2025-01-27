<script setup>
import { computed, ref } from 'vue';
import { formatDateLong } from '@/utils/date';
import { reverseGeocoding } from '@/utils/reverse-geocoding';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faComment, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import AppProfilePicture from './AppProfilePicture.vue';
import { usePublicationStore } from '@/stores/publicationStore';
import { onMounted } from 'vue';
import { RouterLink } from 'vue-router';

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

const publicationStore = usePublicationStore();
const arePubVisible = ref(false);
onMounted(async () => {
  arePubVisible.value = await publicationStore.hasAlreadyPost();
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
        class="absolute z-[1] ml-4 mt-4 aspect-3/4 h-[30%] cursor-pointer overflow-hidden rounded-lg bg-white shadow-lg"
        @click="toggleCamera()"
      >
        <img
          class="h-full w-full rounded-lg border-2 border-black object-cover"
          :class="arePubVisible ? '' : 'blur-md brightness-75'"
          :src="smallCamera"
          alt="publication"
        />
      </div>
      <div
        class="aspect-3/4 w-full overflow-hidden rounded-[1.25rem]"
        @click="toggleCamera()"
      >
        <img
          class="w-full rounded-[1.25rem] object-cover"
          :class="arePubVisible ? '' : 'blur-xl brightness-75'"
          :src="bigCamera"
          alt="publication"
        />
      </div>
      <RouterLink :to="`/publications/${publication._id}`" v-if="arePubVisible">
        <FontAwesomeIcon
          class="absolute bottom-4 right-4 h-6 w-6 rounded-full text-white drop-shadow-lg"
          :icon="faComment"
        />
      </RouterLink>
      <div
        class="absolute right-0 top-0 z-10 flex h-full w-full flex-col items-center justify-center gap-4 bg-none text-white"
        v-if="!arePubVisible"
      >
        <FontAwesomeIcon class="mx-auto text-4xl" :icon="faEyeSlash" />
        <div class="text-center">
          <p><strong>Poste pour voir</strong></p>
          <p>Pour voir les BeReal de tes amis, poste le tien.</p>
        </div>
        <RouterLink to="/camera" class="btn btn-wide">
          Poste un BeReal.
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
