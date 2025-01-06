<script setup>
import { ref, computed, watch } from 'vue';
import { debounce } from '@/utils/debounce';
import { useFetchApiCrud } from '@/composables/useFetchApiCrud';
import { useUserStore } from '@/stores/userStore';
import AppFriendCard from '@/components/AppFriendCard.vue';
import AppSearchBar from '@/components/AppSearchBar.vue';
import { onMounted } from 'vue';

const userStore = useUserStore();

const { readAll, del, update } = useFetchApiCrud(
  '/friends',
  import.meta.env.VITE_API_URL,
);

const { readAll: readAllUsers } = useFetchApiCrud(
  '/users',
  import.meta.env.VITE_API_URL,
);

const authorisationHeader = {
  Authorization: `Bearer ${userStore.getToken}`,
};

const content = ref(0);
const search = ref(''); //TODO: Implement search functionality
const searchResults = ref([]);

const page = ref([1, 1]);
const pageSize = ref([5, 5]);

const friendships = ref([]);
const pendingFriendships = ref([]);

const respHeaders = ref([null, null]);
const pageTotal = computed(() => [
  +respHeaders.value[0]?.['pagination-total-pages'],
  +respHeaders.value[1]?.['pagination-total-pages'],
]);
const totalFriends = computed(() => [
  +respHeaders.value[0]?.['pagination-total-count'],
  +respHeaders.value[1]?.['pagination-total-count'],
]);

const fetchFriends = () => {
  const response = readAll(
    `page=${page.value[0]}&pageSize=${pageSize.value[0]}&status=accepted`,
    authorisationHeader,
  );
  watch(response.data, v => (friendships.value = v));
  watch(response.headers, v => (respHeaders.value[0] = v));
};

const fetchPendingFriends = () => {
  const response = readAll(
    `page=${page.value[1]}&pageSize=${pageSize.value[1]}&status=pending`,
    authorisationHeader,
  );
  watch(response.data, v => (pendingFriendships.value = v));
  watch(response.headers, v => (respHeaders.value[1] = v));
};

const fetchSearchUsers = query => {
  if (!query) {
    content.value = 0;
    searchResults.value = [];
    return;
  }
  const response = readAllUsers(`search=${query}`, authorisationHeader);
  watch(response.data, v => (searchResults.value = v));
};

watch(search, debounce(fetchSearchUsers, 500));

const deleteFriend = friendshipId => {
  const response = del(friendshipId, authorisationHeader);
  watch(response.headers, () => fetchFriends());
};

const updateFriendStatus = (friendshipId, status) => {
  const response = update(friendshipId, { status }, authorisationHeader);
  watch(response.headers, () => fetchPendingFriends());
};

const acceptFriend = friendshipId =>
  updateFriendStatus(friendshipId, 'accepted');
const declineFriend = friendshipId =>
  updateFriendStatus(friendshipId, 'denied');

const nextPage = content => {
  page.value[content] += 1;
  fetchFriends();
};
const hasNextPage = computed(() => [
  page.value[0] < pageTotal.value[0],
  page.value[1] < pageTotal.value[1],
]);

const prevPage = content => {
  page.value[content] -= 1;
  fetchFriends();
};
const hasPrevPage = computed(() => [page.value[0] > 1, page.value[1] > 1]);

fetchFriends();
fetchPendingFriends();

onMounted(() => {
  const searchInput = document.querySelector('#search input');

  searchInput.addEventListener('focus', () => (content.value = 2));
});
</script>

<template>
  <main class="h-screen overflow-y-scroll">
    <AppSearchBar
      placeholder="Ajouter ou rechercher des amis"
      class="mb-8"
      v-model="search"
      id="search"
    />
    <template v-if="content === 0">
      <p class="mb-2 text-sm uppercase text-neutral-content">
        Mes amis ({{ totalFriends[0] }})
      </p>
      <div class="flex flex-col gap-2" v-if="friendships?.length">
        <AppFriendCard
          v-for="friendship in friendships"
          :key="friendship._id"
          :friend="friendship.friend"
          :friendshipId="friendship._id"
          :options="['delete']"
          @delete="deleteFriend($event)"
        />
      </div>
      <p v-else class="my-12 text-center text-sm text-neutral-content">
        Vous n'avez pas encore d'amis. Ajoutez-en en recherchant leur nom
        ci-dessus.
      </p>
      <div
        class="flex flex-row justify-center gap-2"
        v-if="hasNextPage[0] || hasPrevPage[0]"
      >
        <button class="btn" @click="prevPage(0)" v-if="hasPrevPage[0]">
          Previous
        </button>
        <button class="btn" @click="nextPage(0)" v-if="hasNextPage[0]">
          Next
        </button>
      </div>
    </template>
    <template v-if="content === 1">
      <p class="mb-2 text-sm uppercase text-neutral-content">
        Demandes d'amis ({{ totalFriends[1] }})
      </p>
      <div class="flex flex-col gap-2" v-if="pendingFriendships?.length">
        <AppFriendCard
          v-for="friendship in pendingFriendships"
          :key="friendship._id"
          :friend="friendship.friend"
          :friendshipId="friendship._id"
          :options="['accept', 'decline']"
          @accept="acceptFriend($event)"
          @decline="declineFriend($event)"
        />
      </div>
      <p v-else class="my-12 text-center text-sm text-neutral-content">
        Vous n'avez pas de demandes d'amis en attente.
      </p>
    </template>
    <template v-if="content === 2">
      <p class="mb-2 text-sm uppercase text-neutral-content">
        Rechercher des amis
      </p>
      <div class="flex flex-col gap-2" v-if="searchResults?.length">
        <AppFriendCard
          v-for="user in searchResults"
          :key="user._id"
          :friend="user"
        />
      </div>
      <p v-else class="my-12 text-center text-sm text-neutral-content">
        Aucun utilisateur trouvé.
      </p>
    </template>

    <div
      role="tablist"
      class="tabs-boxed tabs tabs-md absolute bottom-24 left-0 right-0 mx-16"
    >
      <a
        role="tab"
        class="tab"
        :class="{
          'tab-active': content === 0,
        }"
        @click="content = 0"
        >Connexions</a
      >
      <a
        role="tab"
        class="tab"
        :class="{
          'tab-active': content === 1,
        }"
        @click="content = 1"
        >Demandes
        <div v-if="totalFriends[1]" class="badge badge-secondary ml-1">
          {{ totalFriends[1] }}
        </div></a
      >
    </div>
  </main>
</template>

<style scoped></style>
