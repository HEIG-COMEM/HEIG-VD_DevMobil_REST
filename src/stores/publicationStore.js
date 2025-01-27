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

  const postNewPublication = async ({
    frontCameraBlob,
    backCameraBlob,
    lat,
    lng,
  } = {}) => {
    // Validation des paramètres requis
    if (!frontCameraBlob || !backCameraBlob) {
      throw new Error('Some images are missing');
    }
    if (!lat || !lng) {
      throw new Error('Some coordinates are missing');
    }

    // Construction du FormData
    const formData = new FormData();
    formData.append('lat', lat);
    formData.append('lng', lng);
    formData.append('frontCamera', frontCameraBlob, 'front.png');
    formData.append('backCamera', backCameraBlob, 'back.png');

    try {
      // Appel direct avec fetch
      const response = await fetch(`${import.meta.env.VITE_API_URL}/publications`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userStore.getToken}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to post publication');
      }

      // Envoi d'une notification de succès
      notificationsStore.addMessage({ message: 'Publication posted', type: 'success' });

      return data; // Retourne les données si tout va bien
    } catch (error) {
      // Envoi d'une notification d'erreur
      notificationsStore.addMessage({ message: error.message || 'Failed to post publication', type: 'error' });
      console.error('Failed to post publication:', error);
      throw error; // Propagation de l'erreur pour que l'appelant puisse la gérer
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

  const getLastPublication = async () => {
    const currentUserId = userStore.getUser.id;
    try {
      const lastPublication = await fetchApi({
          url: `/publications?userId=${currentUserId}&onlyLast=true`,
      });
      return lastPublication.data;
    } catch (error) {
      if (error.status === 404) {
        console.log('No publication found');
        return null;
      }
      console.error('Failed to fetch last publication:', error);
      return null;
    }
  }


  // function to know if the user already post since the last notification
  const hasAlreadyPost = async () => {
    try{
      // Get the last notification date
      const lastNotification = await notificationsStore.getLastBeRealNotification();
      if (!lastNotification.sentAt) {
        throw new Error('Failed to fetch last notification date');
      }

      // Get the last user publication date
      const lastPublication = await getLastPublication();
      if (!lastPublication) {
        return false;
      }

      // Compare the two dates
      return new Date(lastPublication.createdAt) > new Date(lastNotification.sentAt);
    } catch (error) {
      console.error('Failed to check if user already post:', error);
      return false;
    }
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
    getLastPublication,
    hasAlreadyPost,
    postNewPublication,
    getOwner,
    getComments,
    setPublicationId,
    postNewComment,
    deleteComment,
    $reset,
  };
});
