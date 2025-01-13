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

const data = ref([]);
const hasMore = ref(null);

const title = computed(() => {
  return props.friendshipsStatus === 'accepted' ? 'Amis' : "Demandes d'amis";
});

if (props.friendshipsStatus === 'accepted') {
  const { getAcceptedFriends, hasMoreAcceptedFriends } =
    storeToRefs(friendsStore);
  data.value = getAcceptedFriends;
  hasMore.value = hasMoreAcceptedFriends;
} else {
  const { getPendingFriends, hasMorePendingFriends } =
    storeToRefs(friendsStore);
  data.value = getPendingFriends;
  hasMore.value = hasMorePendingFriends;
}

const friendships = computed(() => data.value.value);
const metas = computed(() => friendships.value.metas);
const showLoadMore = computed(() => hasMore.value.value);

const totalFriends = computed(() => {
  if (metas.value === null) return 0;
  emits('count', +metas.value['pagination-total-count'] || 0);
  return +metas.value['pagination-total-count'] || 0;
});

const { loadMoreFriends, deleteFriend, acceptFriend, declineFriend } =
  friendsStore;

const loadMore = () => loadMoreFriends(props.friendshipsStatus);
</script>

<template>
  {{ hasMore }}
  <p class="mb-2 text-sm uppercase text-neutral-content">
    {{ title }} ({{ totalFriends }})
  </p>
  <div class="flex flex-col gap-2" v-if="friendships.data.length">
    <template v-if="friendshipsStatus === 'accepted'">
      <AppFriendCard
        v-for="friendship in friendships.data"
        :key="friendship._id"
        :friend="friendship.friend"
        :friendshipId="friendship._id"
        :options="['delete']"
        @delete="deleteFriend($event)"
      />
    </template>
    <template v-if="friendshipsStatus === 'pending'">
      <AppFriendCard
        v-for="friendship in friendships.data"
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
  <div class="flex flex-row justify-center gap-2" v-if="showLoadMore">
    <button class="btn" @click="loadMore()">Chargez plus</button>
  </div>
</template>

<style scoped></style>
