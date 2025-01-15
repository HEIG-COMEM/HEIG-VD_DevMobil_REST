<script setup>
import { useFetchApi } from '@/composables/useFetchApi';
import { useUserStore } from '@/stores/userStore';
import { computed, ref, useTemplateRef } from 'vue';

const props = defineProps({
  publicationId: {
    type: String,
    required: true,
  },
});

const userStore = useUserStore();

const comments = ref([]);
const commentInput = useTemplateRef('commentInput');
const newComment = ref('');
const loading = ref(false);
const canSend = computed(() => newComment.value.trim() && !loading.value);
const replyTo = ref(null);

const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
  Authorization: `Bearer ${userStore.getToken}`,
});

const fetchComments = async () => {
  try {
    const response = await fetchApi({
      url: `/publications/${props.publicationId}/comments`,
    });
    comments.value = response.data;
  } catch (error) {
    console.error(error);
  }
};

fetchComments();

const topLevelComments = computed(() =>
  comments.value.filter(comment => !comment.parentComment),
);

const childComments = computed(() =>
  comments.value.filter(comment => comment.parentComment),
);

const allComments = computed(() => {
  const allComments = [];
  topLevelComments.value.forEach(comment => {
    allComments.push(comment);
    childComments.value.forEach(childComment => {
      if (childComment.parentComment._id === comment._id) {
        allComments.push(childComment);
      }
    });
  });
  return allComments;
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
  try {
    loading.value = true;
    const payload = {
      content: newComment.value.trim(),
      parentComment: replyTo.value ? replyTo.value._id : null,
    };

    await fetchApi({
      url: `/publications/${props.publicationId}/comments`,
      method: 'POST',
      data: payload,
    });

    newComment.value = '';
    replyTo.value = null;
    fetchComments();
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>
<template>
  <div v-if="comments.length" class="pb-52">
    <div
      v-for="(comment, index) in allComments"
      class="chat chat-start mb-2"
      :key="comment._id"
    >
      <div class="avatar chat-image">
        <div class="w-10 rounded-full">
          <img alt="" :src="comment.user.profilePicture.url" />
        </div>
      </div>
      <div class="chat-header">
        {{ comment.user.name }}
        <time class="text-xs opacity-50">{{ comment.createdAt }}</time>
      </div>
      <p class="chat-bubble" v-if="!comment.parentComment">
        {{ comment.content }}
      </p>
      <div class="chat-bubble" v-else>
        <div>
          <RouterLink
            :to="`/users/${allComments[index - 1].user._id}`"
            class="link link-primary mr-1"
            >@{{ allComments[index - 1].user.name }}</RouterLink
          >{{ comment.content }}
        </div>
      </div>
      <button class="chat-footer opacity-50" @click="handleReply(comment)">
        Répondre
      </button>
    </div>
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

.chat-reply {
  padding-left: 50px;
}
</style>
