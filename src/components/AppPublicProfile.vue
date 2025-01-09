<script setup>
defineProps({
  profile: Object,
  stats: Object,
});

const formattedDate = date => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(date).toLocaleDateString('fr-FR', options);
};
</script>

<template>
  <template v-if="profile && stats">
    <div class="flex flex-col items-center justify-center gap-12 pt-6">
      <div class="flex flex-col items-center gap-4">
        <div class="avatar">
          <div
            class="w-24 rounded-full ring ring-primary ring-offset-2 ring-offset-base-100"
          >
            <img :src="profile.profilePicture.url" />
          </div>
        </div>
        <h1 class="text-2xl font-bold">{{ profile.name }}</h1>
        <p class="text-sm text-gray-500">
          Membre depuis le {{ formattedDate(profile.createdAt) }}
        </p>
      </div>
      <div class="stats stats-vertical shadow lg:stats-horizontal">
        <div class="stat">
          <div class="stat-title">Publications</div>
          <div class="stat-value">{{ stats.publications }}</div>
          <!-- <div class="stat-desc">Jan 1st - Feb 1st</div> -->
        </div>

        <div class="stat">
          <div class="stat-title">Commentaires</div>
          <div class="stat-value">{{ stats.comments }}</div>
          <!-- <div class="stat-desc">↗︎ 400 (22%)</div> -->
        </div>

        <div class="stat">
          <div class="stat-title">Amis</div>
          <div class="stat-value">{{ stats.friendships }}</div>
          <!-- <div class="stat-desc">↘︎ 90 (14%)</div> -->
        </div>
      </div>
    </div>
  </template>
</template>

<style scoped>
.stat-title {
  width: 13ch;
}
</style>
