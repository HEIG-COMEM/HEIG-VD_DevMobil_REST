<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    validator: value => ['info', 'success', 'error'].includes(value),
  },
});

const toast = ref(null);

const classe = computed(() => {
  return {
    'alert-info': props.type === 'info',
    'alert-success': props.type === 'success',
    'alert-error': props.type === 'error',
  };
});

setTimeout(() => {
  toast.value.remove();
}, 5000);
</script>

<template>
  <div class="alert" :class="classe" ref="toast">
    <span>{{ message }}</span>
  </div>
</template>

<style scoped></style>
