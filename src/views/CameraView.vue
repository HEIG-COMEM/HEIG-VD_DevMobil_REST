<script setup>
import { ref, onMounted, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronDown, faPaperPlane, faRotate, faXmark } from '@fortawesome/free-solid-svg-icons';
import BaseCamera from '@/components/BaseCamera.vue';
import { useUserStore } from '@/stores/userStore';
import { useFetchApi } from '@/composables/useFetchApi';

const userStore = useUserStore();

const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
  Authorization: `Bearer ${userStore.getToken}`,
});

const facingMode = ref('user');

const camera = ref(null);
const frontCameraBase64 = ref(null);
const backCameraBase64 = ref(null);

const cameras = ref([]);

// const displayTakenPicture = computed(
//   () => !frontCameraBase64.value || !backCameraBase64.value,
// );
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
  console.log(cameras.value.length);
  const lastNotificationTime = await getLastNotificationTime();
  lastBeRealTimer.value = Math.floor((Date.now() - lastNotificationTime) / 1000);
});

// const lastBeRealTimer = ref(0);
setInterval(() => {
  lastBeRealTimer.value++;
  console.log(lastBeRealTimer.value);
}, 1000);

//get timer value hh:mm:ss format (2 numbers)
const getLastBeRealTimer = computed(() => {
  const hours = Math.floor(lastBeRealTimer.value / 3600);
  const minutes = Math.floor((lastBeRealTimer.value % 3600) / 60);
  const seconds = lastBeRealTimer.value % 60;

  return `${hours.toString().padStart(2, '0')}:${minutes.toString()
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
    frontCameraBase64.value = base64;
  } else {
    backCameraBase64.value = base64;
  }

  if(frontCameraBase64.value && backCameraBase64.value) {
    camera.value.stop();
  } else {
    fisrtPictureSrc.value = facingMode.value;
    changeCamera();
  }
};

const secondShot = () => {
  if (frontCameraBase64.value && !backCameraBase64.value || !frontCameraBase64.value && backCameraBase64.value) {
    setTimeout(() => {
      snapshot();
    }, 800);
  }
};

const togglePicture = () => {
  if (frontCameraBase64.value && backCameraBase64.value) {
    fisrtPictureSrc.value = fisrtPictureSrc.value === 'user' ? 'environment' : 'user';
  }
};

const dump = () => {
  frontCameraBase64.value = null;
  backCameraBase64.value = null;
  fisrtPictureSrc.value = null;
  camera.value.start();
};

const sendPublication = () => {
  // Send the base64 images to the server
  // ...
};

</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <header class="flex flex-col justify-center items-center relative my-2">
      <button class="absolute left-1 top-1 p-0.5 btn btn-square bg-transparent border-0 text-lg">
        <RouterLink to="/"><FontAwesomeIcon class="text-white justify-self-start" :icon="faChevronDown" /></RouterLink>
      </button>
      <h1 class="text-3xl font-bold mb-2 text-white">BeReal.</h1>
      <p class="text-2xl font-bold text-white">{{ getLastBeRealTimer }}</p>
    </header>
    <main class="overflow-hidden flex flex-col justify-between">
      <BaseCamera
        :resolution="{ width: 1500, height: 2000 }"
        :facingMode="cameras.length > 1 ? facingMode : 'user'"
        ref="camera"
        class="relative"
        autoplay
        @started="secondShot()"
      >
        <div
          class="cursor-pointer aspect-3/4 absolute top-0 left-0 z-10 ml-4 mt-4 h-[30%] rounded-lg bg-white shadow-lg"
          v-if="fisrtPictureSrc"
          @click="togglePicture()"
        >
          <img
            class="h-full w-full transform rounded-lg object-cover border border-black"
            :class="fisrtPictureSrc === 'user' || cameras.length < 2 ? 'scale-x-[-1]' : ''"
            :src="fisrtPictureSrc === 'user' ? frontCameraBase64 : backCameraBase64"
          />
        </div>
        <img
          class="w-full rounded-[1.75rem] object-cover aspect-3/4 absolute top-0 left-0 border border-black"
          :class="fisrtPictureSrc !== 'user' || cameras.length < 2 ? 'scale-x-[-1]' : ''"
          :src="fisrtPictureSrc !== 'user' ? frontCameraBase64 : backCameraBase64"
          v-if="frontCameraBase64 && backCameraBase64"
        />
        <button
          class="btn btn-circle absolute top-0 right-0 z-10 mr-4 mt-4 opacity-75"
          v-if="frontCameraBase64 && backCameraBase64"
          @click="dump()"
        >
          <FontAwesomeIcon class="text-white text-2xl" :icon="faXmark" />
        </button>
      </BaseCamera>
    </main>
    <footer class="flex h-20 justify-evenly font-normal text-white  items-center my-4">
        <div v-if="!frontCameraBase64 && !backCameraBase64" class="p-0.5 btn-square" ></div>
        <button
          v-if="!frontCameraBase64 && !backCameraBase64"
          class="btn btn-circle btn-outline text-white border-4 h-20 w-20"
          @click="snapshot()"
        ></button>
        <button
          class="p-0.5 btn btn-square bg-transparent border-0 text-lg" id="change-camera"
          v-if="!frontCameraBase64 && !backCameraBase64"
          @click="changeCamera()"
        >
          <FontAwesomeIcon class="text-white text-4xl" :icon="faRotate" />
        </button>
        <button
          v-if="frontCameraBase64 && backCameraBase64"
          class="btn btn-link no-underline text-4xl text-white"
          @click="sendPublication()"
        >
          Envoyer
          <FontAwesomeIcon class="text-white text-4xl ml-1" :icon="faPaperPlane" />
        </button>
    </footer>
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
