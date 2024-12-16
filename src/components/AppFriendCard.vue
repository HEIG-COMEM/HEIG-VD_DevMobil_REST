<script setup>
import AppProfilePicture from '@/components/AppProfilePicture.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash, faX, faCheck } from '@fortawesome/free-solid-svg-icons';

const props = defineProps({
  friend: {
    type: Object,
    required: true,
  },
  options: {
    type: Array,
    default: () => ['none'],
    validator: v =>
      v.every(option =>
        ['accept', 'decline', 'delete', 'none'].includes(option),
      ),
    required: true,
  },
  friendshipId: {
    type: String,
    required: true,
  },
});

defineEmits(['accept', 'decline', 'delete']);
</script>

<template>
  <div class="flex flex-row items-center gap-5">
    <AppProfilePicture :photo="friend.profilePicture.url" class="!h-14" />
    <p class="flex-grow">{{ friend.name }}</p>
    <div class="flex flex-row gap-4" v-if="!options.includes('none')">
      <FontAwesomeIcon
        :icon="faCheck"
        @click="$emit('accept', props.friendshipId)"
        class="cursor-pointer"
        v-if="options.includes('accept')"
      />
      <FontAwesomeIcon
        :icon="faX"
        @click="$emit('decline', props.friendshipId)"
        class="cursor-pointer"
        v-if="options.includes('decline')"
      />
      <FontAwesomeIcon
        :icon="faTrash"
        @click="$emit('delete', props.friendshipId)"
        class="cursor-pointer"
        v-if="options.includes('delete')"
      />
    </div>
  </div>
</template>

<style scoped>
:deep(path) {
  @apply fill-gray-500;
}
</style>
