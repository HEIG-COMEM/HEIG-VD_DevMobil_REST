<template>
  <dialog id="global-modal" class="modal" v-if="modalStore.modal" open>
    <div class="modal-box">
      <!-- Modal pour l'accès caméra -->
      <template v-if="modalStore.modal === 'alreadyPosted'">
        <h3 class="text-lg font-bold">Vous avez déjà poster votre BeReal.</h3>
        <p class="py-4">Attendez la prochaine notification pour poster à nouveau.</p>
      </template>

      <!-- Exemple d'une autre modal -->
      <template v-else-if="modalStore.modal === 'otherModal'">
        <h3 class="text-lg font-bold">Autre modal</h3>
        <p class="py-4">Ceci est une autre modal pour des usages différents.</p>
      </template>

      <!-- Actions pour fermer la modal -->
      <div class="modal-action">
        <button class="btn" @click="modalStore.closeModal()">Ok</button>
      </div>
    </div>
  </dialog>
</template>

<script setup>
import { useModalStore } from "@/stores/modalStore";
const modalStore = useModalStore();
</script>
