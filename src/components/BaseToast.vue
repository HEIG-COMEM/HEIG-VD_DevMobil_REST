<script setup>
import { computed } from 'vue';

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

const classe = computed(() => {
  return {
    'alert-info': props.type === 'info',
    'alert-success': props.type === 'success',
    'alert-error': props.type === 'error',
  };
});

setTimeout(() => {
  document.querySelector('.toast').remove();
}, 5000);
</script>

<template>
  <div class="toast toast-center toast-top">
    <div class="alert" :class="classe">
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<style scoped></style>
