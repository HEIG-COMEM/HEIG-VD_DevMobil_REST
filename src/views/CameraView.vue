<script setup>
import { ref, onMounted, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBolt, faChevronDown, faRotate } from '@fortawesome/free-solid-svg-icons';
import BaseCamera from '@/components/BaseCamera.vue';

const facingMode = ref('user');

const camera = ref(null);
const frontCameraBase64 = ref(null);
const backCameraBase64 = ref(null);

const cameras = ref([]);

const displayTakenPicture = computed(
  () => !frontCameraBase64.value || !backCameraBase64.value,
);

onMounted(async () => {
  const devices = await camera.value?.devices();
  cameras.value = devices.filter(device => device.kind === 'videoinput');
});

const lastBeRealTimer = ref(0);

setInterval(() => {
  lastBeRealTimer.value++;
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
    camera.value.pause();
    sendPublication();
  } else {
    changeCamera();
  }
};

const sendPublication = () => {
  // Send the base64 images to the server
  // ...
};

const secondShot = () => {
  if (frontCameraBase64.value && !backCameraBase64.value || !frontCameraBase64.value && backCameraBase64.value) {
    setTimeout(() => {
      snapshot();
    }, 800);
  }
};

</script>

<template>
  <div class="flex flex-col justify-between h-full">
    <header class="flex flex-col justify-center items-center relative py-2">
      <button class="absolute left-1 top-1 p-0.5 btn btn-square bg-transparent border-0 text-lg">
        <RouterLink to="/"><FontAwesomeIcon class="text-white justify-self-start" :icon="faChevronDown" /></RouterLink>
      </button>
      <h1 class="text-3xl font-bold mb-2 text-white">BeReal.</h1>
      <p class="text-2xl font-bold text-white">{{ getLastBeRealTimer }}</p>
    </header>
    <main class="shrink grow overflow-hidden flex flex-col justify-between">
      <div
        class="cursor-pointer aspect-3/4 absolute z-10 ml-4 mt-4 h-36 rounded-lg bg-white shadow-lg"
        v-if="frontCameraBase64"
      >
        <img
          class="h-full w-full scale-x-[-1] transform rounded-lg object-cover"
          :src="frontCameraBase64"
        />
      </div>
      <BaseCamera
        :resolution="{ width: 1500, height: 2000 }"
        :facingMode="facingMode"
        ref="camera"
        autoplay
        @started="secondShot()"
      />
      <div class="flex justify-evenly font-normal text-white  items-center py-4">
        <button
          class="p-0.5 btn btn-square bg-transparent border-0 text-lg"
          v-if="!frontCameraBase64"
        >
          <FontAwesomeIcon class="text-white text-4xl" :icon="faBolt" />
        </button>
        <button
          v-if="displayTakenPicture"
          class="btn btn-circle btn-outline text-white border-4 h-20 w-20"
          @click="snapshot()"
        ></button>
        <button
          class="p-0.5 btn btn-square bg-transparent border-0 text-lg" id="change-camera"
          v-if="!frontCameraBase64"
          @click="changeCamera()"
        >
          <FontAwesomeIcon class="text-white text-4xl" :icon="faRotate" />
        </button>
      </div>
    </main>
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
