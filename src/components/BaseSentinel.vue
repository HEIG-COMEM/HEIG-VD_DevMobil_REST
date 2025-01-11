<script setup>
import { onMounted, onUnmounted, ref, defineEmits } from 'vue';

const emit = defineEmits(['inView']);
const sentinel = ref(null);

const handleIntersection = entries => {
  if (entries[0].isIntersecting) {
    emit('inView');
  }
};

let observer;

onMounted(() => {
  observer = new IntersectionObserver(handleIntersection);
  if (sentinel.value) {
    observer.observe(sentinel.value);
  }
});

onUnmounted(() => {
  if (observer && sentinel.value) {
    observer.unobserve(sentinel.value);
  }
});
</script>

<template>
  <div ref="sentinel"></div>
</template>

<style scoped></style>
