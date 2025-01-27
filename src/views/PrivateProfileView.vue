<script setup>
import { ref, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '@/stores/userStore';
import { useNotificationsStore } from '@/stores/notificationsStore';
import { useFetchApi } from '@/composables/useFetchApi';

const userStore = useUserStore();
const notificationsStore = useNotificationsStore();

const user = ref(null);
const name = ref(null);
const email = ref(null);
const password = ref(null);
const passwordConfirmation = ref(null);
const profilePicture = ref(null);
const profilePictureUrl = computed(() => {
  if (profilePicture.value) {
    return URL.createObjectURL(profilePicture.value);
  }
  return user.value?.profilePicture?.url;
});

const loading = ref(false);

const lastPublications = ref(null);

const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
  Authorization: `Bearer ${userStore.getToken}`,
});

const handleFileUpload = event => {
  const file = event.target.files[0];
  if (file) {
    profilePicture.value = file;
  }
};

const updateAccount = async () => {
  if (!name.value || !email.value) return;
  if (password.value && password.value !== passwordConfirmation.value) return;

  loading.value = true;

  const formData = new FormData();
  formData.append('name', name.value);
  formData.append('email', email.value);
  if (profilePicture.value)
    formData.append('profilePicture', profilePicture.value);
  if (password.value) formData.append('password', password.value);

  try {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/users/${user.value._id}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${userStore.getToken}`,
        },
        body: formData,
      },
    );

    if (!response.ok) throw new Error((await response.json()).message);

    notificationsStore.addMessage({
      message: 'Votre compte a été mis à jour',
      type: 'success',
    });
  } catch (err) {
    notificationsStore.addMessage({
      message: err.message,
      type: 'error',
    });
  } finally {
    password.value = null;
    passwordConfirmation.value = null;
    userStore.refreshUser();
    loading.value = false;
  }
};

const logout = () => {
  userStore.logout();
  notificationsStore.addMessage({
    message: 'Vous avez été déconnecté',
    type: 'success',
  });
};

const fetchLastPublications = async () => {
  const { data } = await fetchApi({
    url: `/publications?page=1&limit=3&userId=${userStore.getUser.id}`,
    method: 'GET',
  });

  if (data.length < 3) {
    lastPublications.value = [...data, ...Array(3 - data.length).fill(null)];
  } else {
    lastPublications.value = data;
  }
};

const fetchUser = async () => {
  const { data } = await fetchApi({ url: 'auth/user' });
  fetchLastPublications();

  user.value = data;
  name.value = data.name;
  email.value = data.email;
};
fetchUser();
</script>

<template>
  <main class="flex flex-col overflow-y-scroll px-4 pb-24 pt-24">
    <form
      @submit.prevent="updateAccount()"
      class="flex flex-col justify-center gap-4"
    >
      <div class="avatar justify-center">
        <div
          class="relative w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100"
        >
          <img :src="profilePictureUrl" class="cursor-pointer" />
          <input
            type="file"
            accept="image/png, image/jpeg, image/jpg"
            class="absolute inset-0 h-full w-full cursor-pointer opacity-0"
            @change="handleFileUpload($event)"
          />
        </div>
      </div>
      <div class="text-center">
        <h1 class="mb-2 text-2xl font-bold">
          Bonjour {{ userStore.getUser?.name }}
        </h1>
        <span @click="logout()" class="link cursor-pointer text-sm">
          Se déconnecter
          <FontAwesomeIcon :icon="faArrowRightFromBracket" />
        </span>
      </div>
      <div class="flex flex-col gap-4">
        <label class="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z"
            />
          </svg>
          <input
            type="text"
            class="grow"
            placeholder="Nom"
            v-model="name"
            required
          />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z"
            />
            <path
              d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z"
            />
          </svg>
          <input
            type="email"
            class="grow"
            placeholder="Email"
            v-model="email"
            required
          />
        </label>
        <label class="input input-bordered flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clip-rule="evenodd"
            />
          </svg>
          <input
            type="password"
            class="grow"
            v-model="password"
            placeholder="Mot de passe"
          />
        </label>
        <label
          class="input input-bordered flex items-center gap-2"
          v-show="!!password"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            class="h-4 w-4 opacity-70"
          >
            <path
              fill-rule="evenodd"
              d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
              clip-rule="evenodd"
            />
          </svg>
          <input
            type="password"
            class="grow"
            v-model="passwordConfirmation"
            placeholder="Confirmer le mot de passe"
            :required="!!password"
          />
        </label>
      </div>
      <button class="btn btn-primary" type="submit" :disabled="loading">
        {{ loading ? 'Chargement...' : 'Mettre à jour' }}
      </button>
    </form>
    <p class="mt-12 text-xl font-bold">Mes BeReal récents :</p>
    <div v-if="!lastPublications" class="mt-4 flex flex-col gap-2 md:flex-row">
      <div class="skeleton aspect-3/4 flex-grow"></div>
      <div class="skeleton aspect-3/4 flex-grow"></div>
      <div class="skeleton aspect-3/4 flex-grow"></div>
    </div>
    <div
      v-else
      class="show-case mt-4 flex flex-col items-center gap-2 md:flex-row"
    >
      <template v-for="(publication, index) in lastPublications" :key="index">
        <RouterLink
          v-if="publication"
          :to="publication ? `/publications/${publication._id}` : `#`"
          class="aspect-3/4 w-full rounded-lg md:w-[1/3]"
          :class="{ 'cursor-pointer': publication }"
        >
          <img
            v-if="publication"
            :src="publication.backCamera.url"
            class="h-full w-full rounded-lg object-cover"
            alt=""
          />
        </RouterLink>
        <div
          v-else
          class="skeleton aspect-3/4 w-full flex-grow md:w-[1/3]"
        ></div>
      </template>
    </div>
  </main>
</template>

<style scoped>
.show-case > * {
  background-color: var(--fallback-b3, oklch(var(--b3) / var(--tw-bg-opacity)));
}
</style>
