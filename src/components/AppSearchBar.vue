<script setup>
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

defineProps({
  placeholder: {
    type: String,
    default: 'Search',
  },
});

const model = defineModel();
</script>

<template>
  <label class="input input-bordered flex items-center gap-2">
    <FontAwesomeIcon :icon="faSearch" class="h-4 w-4 opacity-70" />
    <input type="text" class="grow" :placeholder v-model="model" />
  </label>
</template>

<style scoped></style>
