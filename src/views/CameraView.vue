<script setup>
import { ref, onMounted, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faChevronDown,
  faPaperPlane,
  faRotate,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import BaseCamera from '@/components/BaseCamera.vue';
import { useUserStore } from '@/stores/userStore';
import { useFetchApi } from '@/composables/useFetchApi';
import { usePublicationStore } from '@/stores/publicationStore';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const publicationStore = usePublicationStore();
const router = useRouter();

const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
  Authorization: `Bearer ${userStore.getToken}`,
});

const facingMode = ref('user');

const camera = ref(null);
const frontCameraBlob = ref(null);
const backCameraBlob = ref(null);
const frontCameraBase64 = ref(null);
const backCameraBase64 = ref(null);

const cameras = ref([]);

const fisrtPictureSrc = ref(null);

const getLastNotificationTime = async () => {
  const { data } = await fetchApi({
    url: `/notifications?onlyLast=true`,
  });
  if (!data.length || !data[0].sentAt) {
    // If there are no notifications, return the current time
    return new Date().getTime();
  }
  return new Date(data[0].sentAt).getTime();
};
const lastBeRealTimer = ref(0);

onMounted(async () => {
  const devices = await camera.value?.devices();
  cameras.value = devices.filter(device => device.kind === 'videoinput');
  const lastNotificationTime = await getLastNotificationTime();
  lastBeRealTimer.value = Math.floor(
    (Date.now() - lastNotificationTime) / 1000,
  );
});

// const lastBeRealTimer = ref(0);
setInterval(() => {
  lastBeRealTimer.value++;
}, 1000);

//get timer value hh:mm:ss format (2 numbers)
const getLastBeRealTimer = computed(() => {
  const hours = Math.floor(lastBeRealTimer.value / 3600);
  const minutes = Math.floor((lastBeRealTimer.value % 3600) / 60);
  const seconds = lastBeRealTimer.value % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
});

const changeCamera = () => {
  facingMode.value = facingMode.value === 'user' ? 'environment' : 'user';
  camera.value.changeFacingMode(facingMode.value);
};

const snapshot = async () => {
  const blob = await camera.value?.snapshot();
  const base64 = await new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });

  if (facingMode.value === 'user') {
    frontCameraBlob.value = blob;
    frontCameraBase64.value = base64;
  } else {
    backCameraBlob.value = blob;
    backCameraBase64.value = base64;
  }

  if (frontCameraBase64.value && backCameraBase64.value) {
    camera.value.stop();
  } else {
    fisrtPictureSrc.value = facingMode.value;
    changeCamera();
  }
};

const secondShot = () => {
  if (
    (frontCameraBase64.value && !backCameraBase64.value) ||
    (!frontCameraBase64.value && backCameraBase64.value)
  ) {
    setTimeout(() => {
      snapshot();
    }, 800);
  }
};

const togglePicture = () => {
  if (frontCameraBase64.value && backCameraBase64.value) {
    fisrtPictureSrc.value =
      fisrtPictureSrc.value === 'user' ? 'environment' : 'user';
  }
};

const dump = () => {
  frontCameraBlob.value = null;
  frontCameraBase64.value = null;
  backCameraBlob.value = null;
  backCameraBase64.value = null;
  fisrtPictureSrc.value = null;
  camera.value.start();
};

const isSending = ref(false);
const getPosition = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  });
};

const sendPublication = async () => {
  // Empêche plusieurs appels simultanés
  if (isSending.value) {
    console.warn('A publication is already being sent');
    return;
  }
  isSending.value = true; // Verrouille l'état d'envoi

  try {
    // Étape 1 : Récupérer la position
    const position = await getPosition(); // Attend que la position soit résolue
    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    // Étape 2 : Vérification des coordonnées
    if (!lat || !lng) {
      throw new Error('Coordinates not found');
    }

    // Étape 3 : Inverser les images si nécessaire
    if (fisrtPictureSrc.value === 'user') {
      const tmp = frontCameraBlob.value;
      frontCameraBlob.value = backCameraBlob.value;
      backCameraBlob.value = tmp;
    }

    // Étape 4 : Envoyer la publication
    await publicationStore.postNewPublication({
      frontCameraBlob: frontCameraBlob.value,
      backCameraBlob: backCameraBlob.value,
      lat,
      lng,
    });

    // Étape 5 : Réinitialiser la caméra et rediriger
    dump();
    router.push('/');
  } catch (error) {
    console.error('Failed to send publication:', error.message);
  } finally {
    // Réinitialise toujours isSending, même en cas d'erreur
    isSending.value = false;
  }
};
</script>

<template>
  <div class="relative flex h-full flex-col justify-between">
    <header class="relative my-2 flex flex-col items-center justify-center">
      <button
        class="btn btn-square absolute left-1 top-1 border-0 bg-transparent p-0.5 text-lg"
      >
        <RouterLink to="/"
          ><FontAwesomeIcon
            class="justify-self-start text-white"
            :icon="faChevronDown"
        /></RouterLink>
      </button>
      <h1 class="mb-2 text-3xl font-bold text-white">BeReal.</h1>
      <p class="text-2xl font-bold text-white">{{ getLastBeRealTimer }}</p>
    </header>
    <main class="flex flex-col justify-between overflow-hidden">
      <BaseCamera
        :resolution="{ width: 1500, height: 2000 }"
        :facingMode="cameras.length > 1 ? facingMode : 'user'"
        ref="camera"
        autoplay
        @started="secondShot()"
      >
        <div
          class="absolute left-0 top-0 z-10 ml-4 mt-4 aspect-3/4 h-[30%] cursor-pointer rounded-lg bg-white shadow-lg"
          v-if="fisrtPictureSrc"
          @click="togglePicture()"
        >
          <img
            class="h-full w-full transform rounded-lg border-2 border-black object-cover"
            :class="
              fisrtPictureSrc === 'user' || cameras.length < 2
                ? 'scale-x-[-1]'
                : ''
            "
            :src="
              fisrtPictureSrc === 'user' ? frontCameraBase64 : backCameraBase64
            "
          />
        </div>
        <img
          class="absolute left-0 top-0 aspect-3/4 w-full rounded-[1.25rem] border-2 border-black object-cover"
          :class="
            fisrtPictureSrc !== 'user' || cameras.length < 2
              ? 'scale-x-[-1]'
              : ''
          "
          :src="
            fisrtPictureSrc !== 'user' ? frontCameraBase64 : backCameraBase64
          "
          v-if="frontCameraBase64 && backCameraBase64"
        />
        <button
          class="btn btn-circle absolute right-0 top-0 z-10 mr-4 mt-4 opacity-75"
          v-if="frontCameraBase64 && backCameraBase64"
          @click="dump()"
        >
          <FontAwesomeIcon class="text-2xl text-white" :icon="faXmark" />
        </button>
      </BaseCamera>
    </main>
    <footer
      class="my-4 flex h-20 items-center justify-evenly font-normal text-white"
    >
      <div
        v-if="!frontCameraBase64 && !backCameraBase64"
        class="btn-square p-0.5"
      ></div>
      <button
        v-if="!frontCameraBase64 && !backCameraBase64"
        class="btn btn-circle btn-outline h-20 w-20 border-4 text-white"
        @click="snapshot()"
      ></button>
      <button
        class="btn btn-square border-0 bg-transparent p-0.5 text-lg"
        id="change-camera"
        v-if="!frontCameraBase64 && !backCameraBase64"
        @click="changeCamera()"
      >
        <FontAwesomeIcon class="text-4xl text-white" :icon="faRotate" />
      </button>
      <button
        v-if="frontCameraBase64 && backCameraBase64"
        class="btn btn-link text-4xl text-white no-underline"
        @click="sendPublication()"
      >
        Envoyer
        <FontAwesomeIcon
          class="ml-1 text-4xl text-white"
          :icon="faPaperPlane"
        />
      </button>
    </footer>
    <div
      class="absolute left-0 top-0 z-20 flex h-dvh w-dvw items-center justify-center bg-black bg-opacity-50"
      v-if="isSending"
    >
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  </div>
</template>

<style scoped>
#take-picture {
  position: absolute;
  z-index: 99;
  bottom: 10vh;
  left: 50%;

  transform: translateX(-50%);
}
</style>
