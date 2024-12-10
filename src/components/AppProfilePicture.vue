<script setup>
import { defineProps } from 'vue';
const props = defineProps({
  photo: String,
});

const defaultPhoto = 'https://picsum.photos/200/200';

</script>

<template>
    <div class="aspect-square h-8 self-center rounded-full bg-red">
        <img
        class="h-full w-full rounded-full object-cover"
        :src="photo || defaultPhoto"
        alt="profile picture"
        />
    </div>

</template>

<style scoped></style>
