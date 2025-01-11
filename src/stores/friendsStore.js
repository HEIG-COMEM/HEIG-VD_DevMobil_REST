import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useFetchApi } from '@/composables/useFetchApi';

export const useFriendsStore = defineStore('friends', () => {

  const userStore = useUserStore();
  const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
    Authorization: `Bearer ${userStore.getToken}`,
  });

  const acceptedPage = ref(1);
  const pendingPage = ref(1);

  const acceptedFriends = ref({
    data: [],
    metas: null,
  });
  const pendingFriends = ref({
    data: [],
    metas: null,
  });

  const fetchFriends = async (status, pageSize = 5) => {
    const page = status === 'accepted' ? acceptedPage.value : pendingPage.value
    const { data, headers } = await fetchApi({
      url: `/friends?page=${page}&pageSize=${pageSize}&status=${status}`,
    });

    if (status === 'accepted') {
      acceptedFriends.value = {
        data: [...acceptedFriends.value.data, ...data],
        metas: headers
      };
    }

    if (status === 'pending') {
      pendingFriends.value = {
        data: [...pendingFriends.value.data, ...data],
        metas: headers
      };
    }
  }

  const loadMoreFriends = async (status) => {
    if (status === 'accepted') {
      acceptedPage.value += 1;
      await fetchFriends(status);
    }

    if (status === 'pending') {
      pendingPage.value += 1;
      await fetchFriends(status);
    }
  }

  const getAcceptedFriends = computed(() => {
    if (acceptedFriends.value.data.length === 0) fetchFriends('accepted')
    return acceptedFriends
  });
  const getPendingFriends = computed(() => {
    if (pendingFriends.value.data.length === 0) fetchFriends('pending')
    return pendingFriends
  });

  const deleteFriend = async (friendshipId) => {
    await fetchApi({
      url: `/friends/${friendshipId}`,
      method: 'DELETE',
    });
    fetchFriends('accepted');
  };

  const updateFriendStatus = async (friendshipId, status) => {
    await fetchApi({
      url: `/friends/${friendshipId}`,
      method: 'PATCH',
      data: { status },
    });
    fetchFriends('pending');
  };

  const acceptFriend = async (friendshipId) => await updateFriendStatus(friendshipId, 'accepted');
  const declineFriend = async (friendshipId) => await updateFriendStatus(friendshipId, 'denied');

  const hasMoreFriends = (status) => {
    const metas = status === 'accepted' ? acceptedFriends.value.metas : pendingFriends.value.metas;
    return metas && metas['pagination-total-pages'] > metas['pagination-page'];
  };

  const hasMoreAcceptedFriends = computed(() => hasMoreFriends('accepted'));
  const hasMorePendingFriends = computed(() => hasMoreFriends('pending'));

  return {
    getAcceptedFriends,
    getPendingFriends,
    hasMoreAcceptedFriends,
    hasMorePendingFriends,
    loadMoreFriends,
    deleteFriend,
    acceptFriend,
    declineFriend,
  };
});
