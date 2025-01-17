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

  const _fetchFriends = async (status, page = 1, pageSize = 5) => {
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
  };

  const refreshFriends = async (status) => {
    const page = status === 'accepted' ? acceptedPage.value : pendingPage.value;
    if (status === 'accepted') acceptedFriends.value = { data: [], metas: null };
    if (status === 'pending') pendingFriends.value = { data: [], metas: null };
    for (let i = 1; i <= page; i++) {
      await _fetchFriends(status, i);
    }
  };

  const loadCurrentFriends = async (status) => {
    const page = status === 'accepted' ? acceptedPage.value : pendingPage.value;
    await _fetchFriends(status, page);
  }

  const loadMoreFriends = async (status) => {
    if (status === 'accepted') {
      acceptedPage.value += 1;
      await loadCurrentFriends(status);
    }

    if (status === 'pending') {
      pendingPage.value += 1;
      await loadCurrentFriends(status);
    }
  }

  const getAcceptedFriends = computed(() => {
    if (acceptedFriends.value.data.length === 0) loadCurrentFriends('accepted')
    return acceptedFriends
  });
  const getPendingFriends = computed(() => {
    if (pendingFriends.value.data.length === 0) loadCurrentFriends('pending')
    return pendingFriends
  });

  const deleteFriend = async (friendshipId) => {
    await fetchApi({
      url: `/friends/${friendshipId}`,
      method: 'DELETE',
    });
    refreshFriends('accepted');
  };

  const updateFriendStatus = async (friendshipId, status) => {
    await fetchApi({
      url: `/friends/${friendshipId}`,
      method: 'PATCH',
      data: { status },
    });
    refreshFriends('pending');
  };

  const acceptFriend = async (friendshipId) => await updateFriendStatus(friendshipId, 'accepted');
  const declineFriend = async (friendshipId) => await updateFriendStatus(friendshipId, 'denied');

  const hasMoreAcceptedFriends = computed(() => {
    const metas = acceptedFriends.value.metas;
    return metas && +metas['pagination-total-pages'] > +metas['pagination-page'];
  });

  const hasMorePendingFriends = computed(() => {
    const metas = pendingFriends.value.metas;
    return metas && +metas['pagination-total-pages'] > +metas['pagination-page'];
  });

  const $reset = () => {
    acceptedFriends.value = {
      data: [],
      metas: null,
    };
    pendingFriends.value = {
      data: [],
      metas: null,
    };
    acceptedPage.value = 1;
    pendingPage.value = 1;
  }

  return {
    getAcceptedFriends,
    getPendingFriends,
    hasMoreAcceptedFriends,
    hasMorePendingFriends,
    loadMoreFriends,
    deleteFriend,
    acceptFriend,
    declineFriend,
    $reset,
  };
});
