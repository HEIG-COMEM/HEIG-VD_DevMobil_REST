<script setup>
import { ref, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useFriendsStore } from '@/stores/friendsStore';
import AppFriendCard from '@/components/AppFriendCard.vue';

const friendsStore = useFriendsStore();

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

const { getAcceptedFriends, getPendingFriends } = storeToRefs(friendsStore);

const friendships = computed(() => {
  return props.friendshipsStatus === 'accepted'
    ? getAcceptedFriends.value.data
    : getPendingFriends.value.data;
});

const metas = computed(() => {
  return props.friendshipsStatus === 'accepted'
    ? getAcceptedFriends.value.metas
    : getPendingFriends.value.metas;
});

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

const { fetchFriends, deleteFriend, acceptFriend, declineFriend } =
  friendsStore;

const changePage = direction => {
  page.value += direction;
  fetchFriends(props.friendshipsStatus, page.value, pageSize.value);
};

const nextPage = () => changePage(1);
const hasNextPage = computed(() => page.value < pageTotal.value);

const prevPage = () => changePage(-1);
const hasPrevPage = computed(() => page.value > 1);
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
