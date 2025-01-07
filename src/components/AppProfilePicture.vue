<script setup>
defineProps({
  photo: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="bg-red aspect-square h-8 self-center rounded-full">
    <img
      class="h-full w-full rounded-full object-cover"
      :src="photo"
      alt="profile picture"
    />
  </div>
</template>

<style scoped></style>
