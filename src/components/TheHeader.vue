<script setup>
import { onMounted } from 'vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faUser, faBell } from '@fortawesome/free-solid-svg-icons';
import { useUserStore } from '@/stores/userStore';
import { useNotificationsStore } from '@/stores/notificationsStore';
import TheApiStatusIndicator from '@/components/TheApiStatusIndicator.vue';
import TheWSStatusIndicator from './TheWSStatusIndicator.vue';

const userStore = useUserStore();
const notificationsStore = useNotificationsStore();

// set the width of the profile the same as the status
const setProfileWidth = () => {
  const status = document.querySelector('.status');
  const profile = document.querySelector('.profile');
  if (status && profile) {
    profile.style.width = `${status.offsetWidth}px`;
  }
};

onMounted(() => {
  setProfileWidth();
  window.addEventListener('resize', setProfileWidth);
});
</script>

<template>
  <div
    class="flex flex-row items-center justify-between gap-5 rounded-b-3xl bg-base-100 p-5"
  >
    <div class="status flex flex-col gap-2 md:flex-row">
      <TheApiStatusIndicator class="mr-2" />
      <TheWSStatusIndicator />
    </div>
    <div class="flex flex-row items-center justify-center gap-2">
      <span>HEIG-VD - BeReal - Copy</span>
      <FontAwesomeIcon
        :icon="faBell"
        class="cursor-pointer text-primary"
        v-if="userStore.isAdmin"
        @click="notificationsStore.sendBeRealNotfication()"
      />
    </div>
    <div class="profile flex flex-row items-center justify-center">
      <RouterLink to="/profile">
        <FontAwesomeIcon :icon="faUser" class="cursor-pointer" />
      </RouterLink>
    </div>
  </div>
</template>

<style scoped></style>
