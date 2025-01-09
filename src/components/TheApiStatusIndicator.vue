<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const isApiDown = ref(false);
const signal = ref(null);

onMounted(() => {
  const fetchApiStatus = async () => {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const response = await fetch(`${import.meta.env.VITE_API_URL}/status`, {
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      if (!response.ok) {
        throw new Error('API is down');
      }
      clearInterval(signal.value);
      isApiDown.value = false;
    } catch (error) {
      signal.value = setInterval(fetchApiStatus, 15000);
      isApiDown.value = true;
      console.error(error);
    }
  };
  fetchApiStatus();
});

onUnmounted(() => clearInterval(signal.value));
</script>

<template>
  <div
    class="badge badge-sm"
    :class="{
      'badge-success': !isApiDown,
      'badge-error': isApiDown,
    }"
  >
    API
  </div>
</template>

<style scoped></style>
