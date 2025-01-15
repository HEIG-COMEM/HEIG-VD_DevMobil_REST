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

const replyToComment = comment => {
  replyToUser.value = comment.user._id;
  newComment.value = `@${comment.user.name} `;
  toggleSendButton();
};

// dynamic auto suggestion for user names when writting "@" in the comment field text
const autoSuggestUser = () => {
  const comment = newComment.value;
  const atSignIndex = comment.lastIndexOf('@');
  if (atSignIndex === -1) {
    return;
  }
  const search = comment.slice(atSignIndex + 1);
  const user = allComments.value.find(comment =>
    comment.user.name.toLowerCase().startsWith(search.toLowerCase()),
  );
  if (user) {
    replyToUser.value = user.user._id;
  }
};

const handleInput = () => {
  toggleSendButton();
  autoSuggestUser();
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
      <button class="chat-footer opacity-50">Répondre</button>
    </div>
    <div
      class="absolute bottom-16 left-0 flex w-full items-center justify-between gap-2 bg-black px-2 pb-5 pt-2"
    >
      <input
        class="w-full border-none bg-transparent text-white"
        type="text"
        placeholder="Écrivez un commentaire"
        v-model="newComment"
        @input="handleInput"
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
