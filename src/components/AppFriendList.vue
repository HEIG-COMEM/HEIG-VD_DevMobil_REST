<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useFetchApi } from '@/composables/useFetchApi';
import AppFriendCard from '@/components/AppFriendCard.vue';

const userStore = useUserStore();

const props = defineProps({
  friendshipsStatus: {
    type: String,
    default: 'accepted',
    validator: value => ['accepted', 'pending'].includes(value),
  },
});

const emits = defineEmits(['count']);

const title = computed(() => {
  return props.friendshipsStatus === 'accepted' ? 'Amis' : "Demandes d'amis";
});

const friendships = ref([]);
const metas = ref(null);

const page = ref(1);
const pageSize = ref(5);

const totalFriends = computed(() => {
  if (metas.value === null) return 0;
  emits('count', +metas.value['pagination-total-count'] || 0);
  return +metas.value['pagination-total-count'] || 0;
});

const pageTotal = computed(() => {
  if (metas.value === null) return 0;
  return +metas.value['pagination-total-pages'] || 0;
});

const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
  Authorization: `Bearer ${userStore.getToken}`,
});

const fetchFriends = async () => {
  const { data, headers } = await fetchApi({
    url: `/friends?page=${page.value}&pageSize=${pageSize.value}&status=${props.friendshipsStatus}`,
  });
  friendships.value = data;
  metas.value = headers;
};

const deleteFriend = async friendshipId => {
  await fetchApi({
    url: `/friends/${friendshipId}`,
    method: 'DELETE',
  });
  fetchFriends();
};

const updateFriendStatus = async (friendshipId, status) => {
  await fetchApi({
    url: `/friends/${friendshipId}`,
    method: 'PATCH',
    body: { status },
  });
  fetchFriends();
};

const acceptFriend = friendshipId =>
  updateFriendStatus(friendshipId, 'accepted');
const declineFriend = friendshipId =>
  updateFriendStatus(friendshipId, 'declined');

const nextPage = () => {
  page.value += 1;
  fetchFriends();
};
const hasNextPage = computed(() => page.value < pageTotal.value);

const prevPage = () => {
  page.value -= 1;
  fetchFriends();
};
const hasPrevPage = computed(() => page.value > 1);

fetchFriends();
</script>

<template>
  <p class="mb-2 text-sm uppercase text-neutral-content">
    {{ title }} ({{ totalFriends }})
  </p>
  <div class="flex flex-col gap-2" v-if="friendships?.length">
    <template v-if="friendshipsStatus === 'accepted'">
      <AppFriendCard
        v-for="friendship in friendships"
        :key="friendship._id"
        :friend="friendship.friend"
        :friendshipId="friendship._id"
        :options="['delete']"
        @delete="deleteFriend($event)"
      />
    </template>
    <template v-if="friendshipsStatus === 'pending'">
      <AppFriendCard
        v-for="friendship in friendships"
        :key="friendship._id"
        :friend="friendship.friend"
        :friendshipId="friendship._id"
        :options="['accept', 'decline']"
        @accept="acceptFriend($event)"
        @decline="declineFriend($event)"
      />
    </template>
  </div>
  <p v-else class="my-12 text-center text-sm text-neutral-content">
    Vous n'avez pas encore d'amis. Ajoutez-en en recherchant leur nom ci-dessus.
  </p>
  <div
    class="flex flex-row justify-center gap-2"
    v-if="hasNextPage || hasPrevPage"
  >
    <button class="btn" @click="prevPage()" v-if="hasPrevPage">Previous</button>
    <button class="btn" @click="nextPage()" v-if="hasNextPage">Next</button>
  </div>
</template>

<style scoped></style>
