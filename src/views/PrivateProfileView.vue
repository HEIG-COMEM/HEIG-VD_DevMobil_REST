<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/stores/userStore';

const userStore = useUserStore();

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

const error = ref(null);
const success = ref(null);

const authorisationHeader = {
  Authorization: `Bearer ${userStore.getToken}`,
};

const handleFileUpload = event => {
  const file = event.target.files[0];
  if (file) {
    profilePicture.value = file;
  }
};

const updateAccount = () => {
  if (!name.value || !email.value) return;
  if (password.value && password.value !== passwordConfirmation.value) return;

  error.value = null;
  success.value = null;

  const formData = new FormData();
  formData.append('name', name.value);
  formData.append('email', email.value);
  if (profilePicture.value)
    formData.append('profilePicture', profilePicture.value);
  if (password.value) formData.append('password', password.value);

  fetch(`/api/users/${user.value._id}`, {
    method: 'PATCH',
    headers: {
      ...authorisationHeader,
    },
    body: formData,
  })
    .then(response => response.json())
    .then(data => {
      user.value = data;
      name.value = data.name;
      email.value = data.email;

      userStore.refreshUser();
      success.value = 'Votre compte a été mis à jour';

      password.value = null;
      passwordConfirmation.value = null;

      setTimeout(() => {
        success.value = null;
      }, 2000);
    })
    .catch(
      error =>
        (error.value =
          'Une erreur est survenue lors de la mise à jour de votre compte'),
    );
};

fetch(`/api/auth/user`, {
  headers: authorisationHeader,
})
  .then(response => response.json())
  .then(data => {
    user.value = data;
    name.value = data.name;
    email.value = data.email;
  });
</script>

<template>
  <main class="max-h-screen overflow-y-scroll">
    <!-- STATUS -->
    <div v-if="error" role="alert" class="alert alert-error mt-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ error }}</span>
    </div>
    <div v-if="success" role="alert" class="alert alert-success mt-6">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="h-6 w-6 shrink-0 stroke-current"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      <span>{{ success }}</span>
    </div>
    <!-- END STATUS -->

    <form
      @submit.prevent="updateAccount()"
      class="prose mt-12 flex h-[80vh] flex-col justify-center gap-12"
    >
      <div class="not-prose avatar justify-center">
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
      <h1 class="text-center">Bonjour {{ userStore.getUser?.name }}</h1>
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
      <button class="btn btn-primary" type="submit">Mettre à jour</button>
    </form>
  </main>
</template>

<style scoped></style>
