<script setup>
import { ref, onMounted } from 'vue';
import BaseCamera from '@/components/BaseCamera.vue';

const camera = ref(null);

onMounted(async () => {
  const devices = await camera.value?.devices();
  console.log(devices);
});

const snapshot = async () => {
  const blob = await camera.value?.snapshot();
  const url = URL.createObjectURL(blob);
  console.log(url);
};
</script>

<template>
  <BaseCamera
    :resolution="{ width: 1080, height: 1920 }"
    ref="camera"
    autoplay
  />
  <button id="take-picture" @click="snapshot">📸</button>
</template>

<style scoped>
#take-picture {
  position: absolute;
  z-index: 99;
  bottom: 20px;
  left: 50%;
  background-color: white;
  border: 1px solid black;
  border-radius: 50%;
  font-size: 2rem;
  padding: 10px;
  height: 60px;
  width: 60px;

  transform: translateX(-50%);
}
</style>
