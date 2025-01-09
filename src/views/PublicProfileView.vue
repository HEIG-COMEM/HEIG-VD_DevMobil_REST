<script setup>
import { ref, watchEffect, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useFetchApiCrud } from '@/composables/useFetchApiCrud';
import { useUserStore } from '@/stores/userStore';
import AppPublicProfile from '@/components/AppPublicProfile.vue';

const userStore = useUserStore();
const router = useRouter();
const route = useRoute();

const id = route.params.id;
const profile = ref(null);
const stats = ref(null);
const lastPublications = ref(null);
const isFriend = computed(() => profile.value?.isFriend);

watchEffect(() => {
  if (!userStore.getUser) return;
  if (userStore.getUser.id === id) router.push('/profile');
});

const authorisationHeader = {
  Authorization: `Bearer ${userStore.getToken}`,
};

const { read } = useFetchApiCrud(`/users`, import.meta.env.VITE_API_URL);
const { readAll } = useFetchApiCrud(
  `/users/${id}/stats`,
  import.meta.env.VITE_API_URL,
);
const getLastPublications = () => {
  fetch(
    `${import.meta.env.VITE_API_URL}/publications?page=1&limit=3&userId=${id}`,
    {
      headers: authorisationHeader,
    },
  )
    .then(response => response.json())
    .then(data => {
      lastPublications.value = data;
      if (data.length < 3) {
        lastPublications.value = [
          ...data,
          ...Array(3 - data.length).fill(null),
        ];
      }
    });
};

const profileResponse = read(id, authorisationHeader);
const statsResponse = readAll(null, authorisationHeader);

watchEffect(() => {
  profile.value = profileResponse.data.value;
  stats.value = statsResponse.data.value;

  if (profile.value && profile.value.isFriend) getLastPublications();
});

const askFriend = () => {
  fetch(`${import.meta.env.VITE_API_URL}/friends`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...authorisationHeader,
    },
    body: JSON.stringify({ friendId: id }),
  })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(error => {
      console.log(error);

      console.error(error);
    });
};
</script>

<template>
  <main class="max-h-screen overflow-y-scroll">
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
