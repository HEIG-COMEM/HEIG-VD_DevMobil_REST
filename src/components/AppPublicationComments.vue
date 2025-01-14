<script setup>
import { useFetchApi } from '@/composables/useFetchApi';
import { useUserStore } from '@/stores/userStore';
import { computed, ref } from 'vue';

const props = defineProps({
  publicationId: {
    type: String,
    required: true,
  },
});

const userStore = useUserStore();

const comments = ref([]);
const newComment = ref('');
const isSendEnabled = ref(false);
const replyToUser = ref('');

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

const toggleSendButton = () => {
  isSendEnabled.value = newComment.value.trim().length > 0;
};

const addReplyTag = username => {
  if (!newComment.value.includes(`@${username}`)) {
    newComment.value = `${newComment.value.trim()} @${username} `;
  }
};

const submitComment = async () => {
  try {
    const payload = {
      content: newComment.value.trim(),
      parentComment: replyToUser.value || null,
    };
    await fetchApi({
      url: `/publications/${props.publicationId}/comments`,
      method: 'POST',
      data: payload,
    });
    newComment.value = '';
    isSendEnabled.value = false;
    fetchComments();
  } catch (error) {
    console.error(error);
  }
};
</script>
<template>
  <div v-if="comments.length" class="pb-28">
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
      <button class="chat-footer opacity-50">Répondre</button>
    </div>
    <div class="bottom-0 mb-28 flex items-center space-x-2 border-t p-2">
      <input
        v-model="newComment"
        @input="toggleSendButton"
        type="text"
        class="input input-bordered flex-1"
        placeholder="Écrivez un commentaire..."
      />
      <button
        class="btn btn-primary"
        :disabled="!isSendEnabled"
        @click="submitComment"
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
