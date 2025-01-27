<script setup>
import { ref, watchEffect, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetchApi } from '@/composables/useFetchApi';
import { useUserStore } from '@/stores/userStore';
import { useNotificationsStore } from '@/stores/notificationsStore';
import AppPublicProfile from '@/components/AppPublicProfile.vue';

const userStore = useUserStore();
const notificationsStore = useNotificationsStore();
const router = useRouter();
const route = useRoute();

const id = route.params.id;
const profile = ref(null);
const stats = ref(null);
const lastPublications = ref(null);
const isFriend = computed(() => profile.value?.isFriend);

watchEffect(() => {
  if (!userStore.getUser) return;
  if (userStore.getUser.id === id) router.replace('/profile');
});

const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
  Authorization: `Bearer ${userStore.getToken}`,
});

const getLastPublications = async () => {
  try {
    const { data } = await fetchApi({
      url: `/publications?page=1&limit=3&userId=${id}`,
      method: 'GET',
    });
    lastPublications.value = data;
    if (data.length < 3) {
      lastPublications.value = [...data, ...Array(3 - data.length).fill(null)];
    }
  } catch (err) {
    console.error(err);
    notificationsStore.addMessage({
      message:
        'Une erreur est survenue lors de la récupération des publications',
      type: 'error',
    });
  }
};

const fetchProfileAndStats = async () => {
  try {
    const [profileResponse, statsResponse] = await Promise.all([
      fetchApi({ url: `/users/${id}` }),
      fetchApi({ url: `/users/${id}/stats` }),
    ]);

    profile.value = profileResponse.data;
    stats.value = statsResponse.data;
  } catch (err) {
    console.error(err);
    notificationsStore.addMessage({
      message: 'Une erreur est survenue lors de la récupération du profil',
      type: 'error',
    });
  }

  if (profile.value.isFriend) getLastPublications();
};
fetchProfileAndStats();

const askFriend = async () => {
  try {
    await fetchApi({
      url: `/friends`,
      method: 'POST',
      data: { friendId: id },
    });
    notificationsStore.addMessage({
      message: "La demande d'ami a bien été envoyée",
      type: 'success',
    });
  } catch (err) {
    console.error(err);
    notificationsStore.addMessage({
      message: "Une erreur est survenue lors de l'ajout de l'ami",
      type: 'error',
    });
  } finally {
    fetchProfileAndStats();
  }
};
</script>

<template>
  <main class="max-h-screen overflow-y-scroll px-4 pb-44 pt-6">
    <AppPublicProfile :profile :stats />
    <p class="mt-12 text-xl font-bold">BeReal récents :</p>
    <template v-if="isFriend === 1">
      <div v-if="!lastPublications" class="mt-6 flex flex-row gap-4">
        <div class="skeleton aspect-3/4 flex-grow"></div>
        <div class="skeleton aspect-3/4 flex-grow"></div>
        <div class="skeleton aspect-3/4 flex-grow"></div>
      </div>
      <div v-else class="show-case mt-6 flex flex-row gap-4">
        <RouterLink
          v-for="(publication, index) in lastPublications"
          :key="index"
          :to="publication ? `/publications/${publication._id}` : `#`"
          class="aspect-3/4 rounded-2xl"
          :class="{ 'cursor-pointer': publication }"
        >
          <img
            v-if="publication"
            :src="publication.backCamera.url"
            class="h-full w-full rounded-2xl object-cover"
            alt=""
          />
        </RouterLink>
      </div>
    </template>

    <div v-else class="relative mt-6 flex flex-row gap-4">
      <div class="skeleton aspect-3/4 flex-grow"></div>
      <div class="skeleton aspect-3/4 flex-grow"></div>
      <div class="skeleton aspect-3/4 flex-grow"></div>
      <div
        class="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md"
      >
        <button
          @click="askFriend()"
          class="btn btn-primary"
          v-if="isFriend < 0"
        >
          Ajouter en ami
        </button>
        <span v-else>Demande envoyée</span>
      </div>
    </div>
  </main>
</template>

<style scoped>
.show-case > * {
  width: calc(1 / 3 * 100%);
  background-color: var(--fallback-b3, oklch(var(--b3) / var(--tw-bg-opacity)));
}
</style>
