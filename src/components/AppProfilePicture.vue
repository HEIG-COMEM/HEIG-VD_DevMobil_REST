<script setup>
defineProps({
  photo: String,
});

const defaultPhoto = 'https://picsum.photos/200/200';
</script>

<template>
  <div class="bg-red aspect-square h-8 self-center rounded-full">
    <img
      class="h-full w-full rounded-full object-cover"
      :src="photo || defaultPhoto"
      alt="profile picture"
    />
  </div>
</template>

<style scoped></style>
