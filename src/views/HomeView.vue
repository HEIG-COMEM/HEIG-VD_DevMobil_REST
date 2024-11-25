<script setup>
import AppPublicationCard from '@/components/AppPublicationCard.vue';

const publication = {
  frontCamera: {
    path: 'https://picsum.photos/200/300?grayscale',
  },
  backCamera: {
    path: 'https://picsum.photos/200/300',
  },
  user: {
    name: 'Jérémie',
    email: 'zurfluh.jeremie@gmail.com',
    phone: '+41796707880',
    profilePictureUrl: 'default.jpg',
    created_at: {
      date: '2024-10-02T11:44:33.450Z',
    },
    updated_at: {
      date: '2024-10-02T11:44:33.450Z',
    },
  },
  createdAt: new Date(),
};
</script>

<template>
  <main class="max-h-screen overflow-y-scroll">
    evneo
    <AppPublicationCard :publication="publication" />
  </main>
</template>
<style>
* {
  color: white;
}
</style>
