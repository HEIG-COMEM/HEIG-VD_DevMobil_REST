<script setup>
import { formatDate } from '@/utils/date';
import { useUserStore } from '@/stores/userStore';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
const userStore = useUserStore();

defineProps({
  comments: {
    type: Array,
    required: true,
  },
  parentComment: {
    type: Object,
    required: false,
  },
});

defineEmits(['reply', 'delete']);
</script>

<template>
  <template v-for="comment in comments" :key="comment._id">
    <div class="chat chat-start mb-2">
      <div class="avatar chat-image">
        <div class="w-10 rounded-full">
          <img alt="" :src="comment.user.profilePicture.url" />
        </div>
      </div>
      <div class="chat-header">
        {{ comment.user.name }}
        <time class="text-xs opacity-50">{{
          formatDate(comment.createdAt)
        }}</time>
        <button
          class="btn btn-ghost btn-sm"
          v-if="userStore.getUser.id === comment.user._id"
          @click="$emit('delete', comment._id)"
        >
          <FontAwesomeIcon :icon="faTrash" />
        </button>
      </div>
      <p class="chat-bubble" v-if="!parentComment">
        {{ comment.content }}
      </p>
      <div class="chat-bubble" v-else>
        <div>
          <RouterLink
            :to="`/users/${parentComment.user._id}`"
            class="link link-primary mr-1"
            >@{{ parentComment.user.name }}</RouterLink
          >{{ comment.content }}
        </div>
      </div>
      <button class="chat-footer opacity-50" @click="$emit('reply', comment)">
        Répondre
      </button>
    </div>
    <AppPublicationCommentsList
      v-if="comment.children.length"
      :comments="comment.children"
      :parentComment="comment"
      :key="comment._id"
      @reply="$emit('reply', $event)"
      @delete="$emit('delete', $event)"
    />
  </template>
</template>

<style scoped></style>
