import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useFetchApi } from '@/composables/useFetchApi';

export const useFriendsStore = defineStore('friends', () => {

  const userStore = useUserStore();
  const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
    Authorization: `Bearer ${userStore.getToken}`,
  });

  const acceptedFriends = ref({
    data: [],
    metas: null,
  });
  const pendingFriends = ref({
    data: [],
    metas: null,
  });

  const fetchFriends = async (status, page = 1, pageSize = 5) => {
    const { data, headers } = await fetchApi({
      url: `/friends?page=${page}&pageSize=${pageSize}&status=${status}`,
    });

    if (status === 'accepted') {
      acceptedFriends.value = {
        data,
        metas: headers
      };
    }

    if (status === 'pending') {
      pendingFriends.value = {
        data,
        metas: headers
      };
    }
  }

  /**
   * Initially, fetch the friends
   */
  // fetchFriends('accepted');
  fetchFriends('pending');

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

  return {
    getAcceptedFriends,
    getPendingFriends,
    fetchFriends,
    deleteFriend,
    acceptFriend,
    declineFriend,
  };
});
