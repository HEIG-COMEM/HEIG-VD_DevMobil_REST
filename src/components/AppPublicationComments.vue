<script setup>
import { computed, ref, useTemplateRef } from 'vue';
import { usePublicationStore } from '@/stores/publicationStore';
import AppPublicationCommentsList from './AppPublicationCommentsList.vue';

const publicationStore = usePublicationStore();

const commentInput = useTemplateRef('commentInput');
const newComment = ref('');
const loading = ref(false);
const canSend = computed(() => newComment.value.trim() && !loading.value);
const replyTo = ref(null);

const nestedComments = computed(() => {
  const commentMap = new Map();
  const roots = [];

  publicationStore.getComments.forEach(comment => {
    commentMap.set(comment._id, { ...comment, children: [] });
  });

  commentMap.forEach(comment => {
    if (comment.parentComment) {
      const parent = commentMap.get(comment.parentComment._id);
      if (parent) {
        parent.children.push(comment);
      }
    } else {
      roots.push(comment);
    }
  });

  return roots;
});

const handleDelete = () => {
  if (!newComment.value.trim()) {
    replyTo.value = null;
  }
};

const handleReply = comment => {
  newComment.value = '';
  replyTo.value = comment;
  commentInput.value.focus();
};

const submitComment = async () => {
  loading.value = true;
  await publicationStore.postNewComment(
    newComment.value.trim(),
    replyTo.value ? replyTo.value._id : null,
  );
  newComment.value = '';
  replyTo.value = null;
  loading.value = false;
};

const deleteComment = async commentId => {
  loading.value = true;
  await publicationStore.deleteComment(commentId);
  loading.value = false;
};
</script>
<template>
  <div v-if="publicationStore.getComments.length" class="pb-12">
    <AppPublicationCommentsList
      :comments="nestedComments"
      @reply="handleReply($event)"
      @delete="deleteComment($event)"
    />
    <div
      class="absolute bottom-16 left-0 flex w-full items-center justify-between gap-2 bg-black px-2 pb-5 pt-2"
    >
      <label class="input input-bordered flex flex-grow items-center gap-2">
        {{ replyTo ? `@${replyTo.user.name}` : null }}
        <input
          class="w-full grow border-none bg-transparent text-white"
          type="text"
          placeholder="Écrivez un commentaire"
          v-model="newComment"
          ref="commentInput"
          @keydown.delete="handleDelete()"
          @keydown.enter="submitComment()"
        />
      </label>
      <button
        class="btn btn-primary"
        :disabled="!canSend"
        @click="submitComment()"
      >
        Envoyer
      </button>
    </div>
  </div>
</template>

<style scoped>
:deep(.chat-bubble::before) {
  content: none;
}
</style>
