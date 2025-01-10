<script setup>
import { ref, watch, onMounted } from 'vue';
import { debounce } from '@/utils/debounce';
import { useFetchApi } from '@/composables/useFetchApi';
import { useUserStore } from '@/stores/userStore';
import AppFriendCard from '@/components/AppFriendCard.vue';
import AppSearchBar from '@/components/AppSearchBar.vue';
import AppFriendList from '@/components/AppFriendList.vue';

const userStore = useUserStore();

const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
  Authorization: `Bearer ${userStore.getToken}`,
});

const content = ref(0);
const search = ref('');
const searchResults = ref([]);
const pendingFriendsCount = ref(0);

const fetchSearch = async query => {
  if (!query) {
    content.value = 0;
    searchResults.value = [];
    return;
  }
  content.value = 2;
  const { data } = await fetchApi({
    url: `/users?search=${query}`,
  });
  searchResults.value = data;
};

watch(search, debounce(fetchSearch, 500));

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

    <AppFriendList v-if="content === 0" friendshipsStatus="accepted" />
    <AppFriendList
      v-if="content === 1"
      friendshipsStatus="pending"
      @count="pendingFriendsCount = $event"
    />

    <template v-if="content === 2">
      <p class="mb-2 text-sm uppercase text-neutral-content">
        Rechercher des amis
      </p>
      <div class="flex flex-col gap-2" v-if="searchResults?.length">
        <AppFriendCard
          v-for="user in searchResults"
          :key="user._id"
          :friend="user"
          :options="['none']"
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
        >Amis</a
      >
      <a
        role="tab"
        class="tab"
        :class="{
          'tab-active': content === 1,
        }"
        @click="content = 1"
        >Demandes
        <div v-if="pendingFriendsCount" class="badge badge-secondary ml-1">
          {{ pendingFriendsCount }}
        </div></a
      >
    </div>
  </main>
</template>

<style scoped></style>
