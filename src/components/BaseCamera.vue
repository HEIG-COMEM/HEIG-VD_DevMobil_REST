<script setup>
import { onMounted, onUnmounted, ref, defineProps, defineExpose, computed } from 'vue';

const props = defineProps({
  resolution: {
    width: Number,
    height: Number,
  },
  facingMode: {
    type: String,
    default: 'user',
    validator: value => ['user', 'environment'].includes(value),
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
  playsinline: {
    type: Boolean,
    default: true,
  },
  constraints: {
    type: Object,
    required: false,
  },
});

const emit = defineEmits([
  'loading',
  'started',
  'stopped',
  'paused',
  'resumed',
  'camera-change',
  'snapshot',
  'error',
]);

onMounted(() => {
  if (!navigator.mediaDevices) throw new Error('Media devices not available');

  const videoElement = document.getElementById('video');

  if (props.playsinline && videoElement) {
    videoElement.setAttribute('playsinline', '');
  }

  if (props.autoplay) start();
});

onUnmounted(() => stop());

const video = ref(null);
const canvas = ref(null);
const stream = ref(null);

const constraints = props.constraints || {
  video: {
    width: { ideal: props.resolution.height },
    height: { ideal: props.resolution.width },
    aspectRatio: props.resolution.height / props.resolution.width,
    resizeMode: 'crop-and-scale',
    facingMode: props.facingMode,
    deviceId: {},
  },
  audio: false,
};

const ratio = computed(() => props.resolution.width / props.resolution.height);

const devices = async (kinds = ['videoinput']) => {
  const devices = await navigator.mediaDevices.enumerateDevices();
  return devices.filter(device => kinds.includes(device.kind));
};

const currentDeviceID = () => {
  if (!stream.value) return;

  const tracks = stream.value
    .getVideoTracks()
    .map(track => track.getSettings().deviceId);

  if (tracks.length > 0) return tracks[0];
};

const start = async () => {
  emit('loading');

  try {
    stream.value = await navigator.mediaDevices.getUserMedia(constraints);

    if (!video.value) throw new Error('Video ref is null');

    video.value.srcObject = stream.value;

    emit('started');
  } catch (err) {
    emit('error', err);
  }
};

const snapshot = (
  resolution = props.resolution,
  type = 'image/png',
  quality,
) => {
  if (!video.value) throw new Error('Video ref is null');
  if (!canvas.value) throw new Error('Canvas ref is null');

  const { width, height } = resolution;

  // Définir les dimensions du canvas selon la résolution cible
  canvas.value.width = width;
  canvas.value.height = height;

  const videoWidth = video.value.videoWidth;
  const videoHeight = video.value.videoHeight;

  // Calculer le ratio cible et celui de la vidéo
  const targetRatio = width / height;
  const videoRatio = videoWidth / videoHeight;

  let cropWidth, cropHeight, offsetX, offsetY;

  if (videoRatio > targetRatio) {
    // La vidéo est plus large que le ratio cible, on coupe sur la largeur
    cropHeight = videoHeight;
    cropWidth = videoHeight * targetRatio;
    offsetX = (videoWidth - cropWidth) / 2;
    offsetY = 0;
  } else {
    // La vidéo est plus haute que le ratio cible, on coupe sur la hauteur
    cropWidth = videoWidth;
    cropHeight = videoWidth / targetRatio;
    offsetX = 0;
    offsetY = (videoHeight - cropHeight) / 2;
  }

  // Dessiner la partie croppée de la vidéo dans le canvas
  canvas.value
    .getContext('2d')
    ?.drawImage(
      video.value,
      offsetX,
      offsetY,
      cropWidth,
      cropHeight,
      0,
      0,
      width,
      height,
    );

  return new Promise(resolve => {
    canvas.value?.toBlob(
      blob => {
        emit('snapshot', blob);
        resolve(blob);
      },
      type,
      quality,
    );
  });
};

const changeCamera = async deviceID => {
  stop();
  constraints.video.deviceId.exact = deviceID;
  await start();
  emit('camera-change', deviceID);
};

const changeFacingMode = async facingMode => {
  stop();
  constraints.video.facingMode = facingMode;
  await start();
};

const resume = () => {
  video.value?.play();
  emit('resumed');
};

const pause = () => {
  video.value?.pause();
  emit('paused');
};

const stop = () => {
  stream.value?.getTracks().forEach(track => track.stop());
  emit('stopped');
};

defineExpose({
  start,
  stop,
  video,
  snapshot,
  canvas,
  devices,
  currentDeviceID,
  pause,
  resume,
  changeCamera,
  changeFacingMode,
  stream,
});
</script>

<template>
  <div id="camera-container" class="relative aspect-[3/4] h-auto mx-auto min-h-20">
    <video
      autoplay
      ref="video"
      id="video"
      class="rounded-[1.75rem]"
      :class="props.facingMode === 'user' ? 'transform scale-x-[-1]' : ''"
    ></video>
    <div id="slot-container">
      <slot></slot>
    </div>
  </div>
  <canvas ref="canvas" id="canvas"></canvas>
</template>

<style scoped>
#camera-container {
}

#video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

#slot-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

#canvas {
  display: none;
}
</style>
