<script setup>
import { ref, onMounted, computed } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import BaseCamera from '@/components/BaseCamera.vue';

const camera = ref(null);
const frontCameraBase64 = ref(null);
const backCameraBase64 = ref(null);

const cameras = ref([]);

const getFacingMode = computed(() =>
  frontCameraBase64.value ? 'environment' : 'user',
);

const displayTakenPicture = computed(
  () => !frontCameraBase64.value || !backCameraBase64.value,
);

//reactive variable to store the phone's width and height
const phoneWidth = 1080; //ref(window.innerWidth * 2);
const phoneHeight = 1920; //ref(window.innerHeight * 2);
console.log("phoneWidth: ", phoneWidth.value);
console.log("phoneHeight: ", phoneHeight.value);

onMounted(async () => {
  const devices = await camera.value?.devices();
  cameras.value = devices.filter(device => device.kind === 'videoinput');
});

const snapshot = async () => {
  const blob = await camera.value?.snapshot();
  const base64 = await new Promise(resolve => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      resolve(reader.result);
    };
  });

  if (getFacingMode.value === 'user') {
    frontCameraBase64.value = base64;
    camera.value.changeFacingMode('environment');
  } else {
    backCameraBase64.value = base64;
    camera.value.pause();
    sendPublication();
  }
};

const sendPublication = () => {
  // Send the base64 images to the server
  // ...
};
</script>

<template>
  <main class="h-dvh overflow-hidden">
    <div
      class="aspect-9/16 absolute z-10 ml-4 mt-4 h-48 rounded-lg bg-white shadow-lg"
      v-if="frontCameraBase64"
    >
      <img
        class="h-full w-full scale-x-[-1] transform rounded-lg object-cover"
        :src="frontCameraBase64"
      />
    </div>
    <!-- <div
      class="w-full aspect-9/16 bg-red-500"
    >
      <BaseCamera
        :resolution="{ width: phoneWidth, height: phoneHeight }"
        :facingMode="getFacingMode"
        ref="camera"
        autoplay
      />
    </div> -->

    <BaseCamera
      :resolution="{ width: phoneWidth, height: phoneHeight }"
      :facingMode="getFacingMode"
      ref="camera"
      class="w-full aspect-9/16"
      autoplay
    />

    <button
      v-if="displayTakenPicture"
      id="take-picture"
      class="btn btn-circle btn-outline btn-lg"
      @click="snapshot()"
    >
      <FontAwesomeIcon :icon="faCamera" />
    </button>
  </main>
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
