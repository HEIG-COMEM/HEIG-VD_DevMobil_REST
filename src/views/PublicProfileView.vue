<script setup>
import { ref, watchEffect, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetchApi } from '@/composables/useFetchApi';
import { useUserStore } from '@/stores/userStore';
import AppPublicProfile from '@/components/AppPublicProfile.vue';
import BaseToast from '@/components/BaseToast.vue';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const id = route.params.id;
const profile = ref(null);
const stats = ref(null);
const lastPublications = ref(null);
const isFriend = computed(() => profile.value?.isFriend);

const error = ref(null);
const success = ref(null);

const resetStatus = () => {
  error.value = null;
  success.value = null;
};

watchEffect(() => {
  if (!userStore.getUser) return;
  if (userStore.getUser.id === id) router.push('/profile');
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
    console.log(err);
    error.value =
      'Une erreur est survenue lors de la récupération des publications';
  }
};

const fetchProfileAndStats = async () => {
  resetStatus();
  try {
    const [profileResponse, statsResponse] = await Promise.all([
      fetchApi({ url: `/users/${id}` }),
      fetchApi({ url: `/users/${id}/stats` }),
    ]);

    profile.value = profileResponse.data;
    stats.value = statsResponse.data;
  } catch (err) {
    console.log(err);
    error.value = 'Une erreur est survenue lors de la récupération du profil';
  }

  if (profile.value.isFriend) getLastPublications();
};
fetchProfileAndStats();

const askFriend = async () => {
  resetStatus();
  try {
    await fetchApi({
      url: `/friends`,
      method: 'POST',
      data: { friendId: id },
    });
    success.value = "La demande d'ami a bien été envoyée";
  } catch (err) {
    console.log(err);
    error.value = "Une erreur est survenue lors de l'ajout de l'ami";
  }
};
</script>

<template>
  <main class="max-h-screen overflow-y-scroll pb-40 pt-6">
    <BaseToast v-if="error" :message="error" type="error" />
    <BaseToast v-if="success" :message="success" type="success" />

    <AppPublicProfile :profile :stats />
    <p class="mt-12 text-xl font-bold">BeReal récents :</p>
    <template v-if="isFriend">
      <div v-if="!lastPublications" class="mt-6 flex flex-row gap-4">
        <div class="skeleton aspect-[9/16] flex-grow"></div>
        <div class="skeleton aspect-[9/16] flex-grow"></div>
        <div class="skeleton aspect-[9/16] flex-grow"></div>
      </div>
      <div v-else class="show-case mt-6 flex flex-row gap-4">
        <RouterLink
          v-for="(publication, index) in lastPublications"
          :key="index"
          :to="publication ? `/publications/${publication._id}` : `#`"
          class="aspect-[9/16] rounded-2xl"
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
      <div class="skeleton aspect-[9/16] flex-grow"></div>
      <div class="skeleton aspect-[9/16] flex-grow"></div>
      <div class="skeleton aspect-[9/16] flex-grow"></div>
      <div
        class="absolute left-0 top-0 flex h-full w-full items-center justify-center rounded-2xl bg-white/10 backdrop-blur-md"
      >
        <button @click="askFriend()" class="btn btn-primary">
          Ajouter en ami
        </button>
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
