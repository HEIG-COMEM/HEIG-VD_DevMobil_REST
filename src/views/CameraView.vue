<script setup>
import { ref, onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faCamera } from '@fortawesome/free-solid-svg-icons';
import BaseCamera from '@/components/BaseCamera.vue';

const camera = ref(null);
const frontCameraBase64 = ref(null);
const backCameraBase64 = ref(null);

const cameras = ref([]);

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

  if (camera.value?.facingMode === 'user') {
    frontCameraBase64.value = base64;
  } else {
    backCameraBase64.value = base64;
  }
};

const switchCamera = async deviceID => {
  const currentDeviceID = await camera.value?.currentDeviceID();
  console.log('Current device ID:', currentDeviceID);
  console.log('Switching to device ID:', deviceID);

  await camera.value?.changeCamera(deviceID);
};
</script>

<template>
  <main class="max-h-screen overflow-hidden">
    <select
      class="select select-bordered w-full max-w-xs"
      @change="switchCamera($event.target.value)"
    >
      <option
        v-for="camera in cameras"
        :key="camera.deviceId"
        :value="camera.deviceId"
      >
        {{ camera.label }}
      </option>
    </select>
    <BaseCamera
      :resolution="{ width: 1080, height: 1920 }"
      ref="camera"
      autoplay
    />
    <button
      id="take-picture"
      class="btn btn-lg btn-circle btn-outline"
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
<style></style>
