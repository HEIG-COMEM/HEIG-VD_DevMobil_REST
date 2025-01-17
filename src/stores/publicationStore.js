import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useNotificationsStore } from './notificationsStore';
import { useFetchApi } from '@/composables/useFetchApi';

export const usePublicationStore = defineStore('publication', () => {
  const userStore = useUserStore();
  const notificationsStore = useNotificationsStore();
  const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
    Authorization: `Bearer ${userStore.getToken}`,
  });

  const publicationId = ref(null);
  const publication = ref(null);
  const owner = ref(null);
  const comments = ref([]);

  const fetchPublication = async () => {
    try {
      const { data } = await fetchApi({
        url: `/publications/${publicationId.value}`,
      });
      const { data: ownerData } = await fetchApi({
        url: `/users/${data.user}`,
      });
      publication.value = data;
      owner.value = ownerData;
    } catch (error) {
      notificationsStore.addMessage({ message: 'Failed to fetch publication', type: 'error' });
      console.error('Failed to fetch publication:', error);
      publication.value = null;
    }
  };

  const fetchComments = async () => {
    try {
      const { data } = await fetchApi({
        url: `/publications/${publicationId.value}/comments`,
      });
      comments.value = data;
    } catch (error) {
      notificationsStore.addMessage({ message: 'Failed to fetch comments', type: 'error' });
      console.error('Failed to fetch comments:', error);
      comments.value = [];
    }
  };

  const postNewComment = async (content, parentCommentId = null) => {
    try {
      await fetchApi({
        url: `/publications/${publicationId.value}/comments`,
        method: 'POST',
        data: { content, parentComment: parentCommentId },
      });
      fetchComments();
    } catch (error) {
      notificationsStore.addMessage({ message: 'Failed to post comment', type: 'error' });
      console.error('Failed to post comment:', error);
    }
  }

  const deleteComment = async (commentId) => {
    try {
      await fetchApi({
        url: `/publications/${publicationId.value}/comments/${commentId}`,
        method: 'DELETE',
      });
      fetchComments();
    } catch (error) {
      notificationsStore.addMessage({ message: 'Failed to delete comment', type: 'error' });
      console.error('Failed to delete comment:', error);
    }
  }

  const setPublicationId = (id) => {
    publicationId.value = id
    fetchPublication();
    fetchComments();
  }

  const getPublication = computed(() => publication.value);
  const getOwner = computed(() => owner.value);
  const getComments = computed(() => comments.value);

  const $reset = () => {
    publicationId.value = null;
    publication.value = null;
    owner.value = null;
    comments.value = [];
  }

  return {
    getPublication,
    getOwner,
    getComments,
    setPublicationId,
    postNewComment,
    deleteComment,
    $reset,
  };
});
