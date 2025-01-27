<script setup>
import { RouterLink } from 'vue-router';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import {
  faHouseChimney as faHouse,
  faCamera,
  faUserGroup,
} from '@fortawesome/free-solid-svg-icons';
</script>

<template>
  <nav class="rounded-t-3xl bg-onSurface px-11 py-3 backdrop-blur z-30">
    <ul class="flex flex-row items-center justify-around">
      <li>
        <RouterLink to="/"><FontAwesomeIcon :icon="faHouse" /></RouterLink>
      </li>
      <li id="camera">
        <RouterLink to="/camera"
          ><FontAwesomeIcon :icon="faCamera"
        /></RouterLink>
      </li>
      <li>
        <RouterLink to="/friends">
          <FontAwesomeIcon :icon="faUserGroup" />
        </RouterLink>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
#camera {
  background-color: white;
  aspect-ratio: 1;
  width: 50px;
  border-radius: 50%;
  padding: 10px;
  text-align: center;
  align-content: center;
}

#camera * {
  color: black;
}
</style>
