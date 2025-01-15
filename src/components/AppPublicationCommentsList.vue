<script setup>
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

defineEmits(['reply']);
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
        <time class="text-xs opacity-50">{{ comment.createdAt }}</time>
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
    />
  </template>
</template>

<style scoped></style>
