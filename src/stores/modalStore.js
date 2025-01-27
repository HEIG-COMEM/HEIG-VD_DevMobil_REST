import { defineStore } from "pinia";
import { ref } from "vue";

export const useModalStore = defineStore("modalStore", () => {
  const modal = ref(null);

  const openModal = (modalName) => {
    modal.value = modalName;
  };

  const closeModal = () => {
    modal.value = null;
  };

  const $reset = () => {
    modal.value = null;
  };

  return {
    modal,
    openModal,
    closeModal,
    $reset,
  };
});
