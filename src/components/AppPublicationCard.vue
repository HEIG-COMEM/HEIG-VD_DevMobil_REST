<script setup>
import { defineProps, computed, ref } from 'vue';
const props = defineProps({
  publication: Object,
});

const formatedDate = computed(() => {
  const date = new Date(props.publication.user.created_at.date);
  return date.toLocaleDateString();
});

const showFrontCamera = ref(true);
const toggleCamera = () => {
  showFrontCamera.value = !showFrontCamera.value;
};

const bigCamera = computed(() => {
  return showFrontCamera.value
    ? props.publication.frontCamera.path
    : props.publication.backCamera.path;
});

const smallCamera = computed(() => {
  return showFrontCamera.value
    ? props.publication.backCamera.path
    : props.publication.frontCamera.path;
});
</script>

<template>
  <div class="border border-blue-500 p-1">
    <div class="flex flex-row content-center justify-between gap-2 px-1">
      <div class="aspect-square h-10 self-center rounded-full bg-white"></div>
      <div class="flex-grow">
        <p>{{ publication.user.name }}</p>
        <p>{{ formatedDate }}</p>
      </div>
      <div class="self-center">...</div>
    </div>
    <div class="relative">
      <div
        class="absolute ml-4 mt-4 h-48 cursor-pointer rounded-lg bg-white shadow-lg"
        @click="toggleCamera()"
      >
        <img
          class="h-full w-full rounded-lg object-cover"
          :src="smallCamera"
          alt="publication"
        />
      </div>
      <img class="w-full object-cover" :src="bigCamera" alt="publication" />
    </div>
  </div>
</template>

<style scoped></style>
