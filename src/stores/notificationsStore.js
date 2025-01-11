import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { useUserStore } from '@/stores/userStore';

const handleSocketMessage = (data) => {
  const message = JSON.parse(data);

  /**
   * Possible messages types = ['commentCreated', 'friendRequestUpdate', 'publicationCreated'];
  **/

  console.log(message);


  let toast = null;

  switch (message.type) {
    case 'commentCreated':
      toast = "Un commentaire a été ajouté à une publication";
      break;
    case 'friendRequestUpdate':
      toast = `Une demande d'ami a été ${message.data.status === 'accepted' ? 'acceptée' : 'refusée'}`;
      break;
    case 'publicationCreated':
      toast = "Une publication a été postée";
      break;
    case 'friendRequestReceived':
      toast = "Vous avez reçu une demande d'ami";
      break;
    default:
      console.warn('Unknown message type', toast.type);
  };

  return toast;
};


export const useNotificationsStore = defineStore('Notifications', () => {

  const socket = new WebSocket(import.meta.env.VITE_WS_URL, [`Bearer`, `${useUserStore().getToken}`]);

  const SERVER_MESSAGE_PATTERN = /^\[Server\]/;

  const isConnected = ref(false);
  const messages = ref([]);

  // Connection opened
  socket.addEventListener("open", () => isConnected.value = true);

  // Listen for messages
  socket.addEventListener("message", (event) => {
    if (SERVER_MESSAGE_PATTERN.test(event.data)) return;

    const message = handleSocketMessage(event.data);
    messages.value.push({ message, type: 'info' });
  });

  socket.addEventListener("close", (event) => {
    console.log("Connection closed", event);
    isConnected.value = false;
  });

  const addMessage = ({ message, type } = {
    type: 'info',
  }) => {
    messages.value.push({ message, type });
  };

  const getMessages = computed(() => messages.value);
  const isSocketConnected = computed(() => isConnected.value);
  return {
    getMessages,
    isSocketConnected,
    addMessage,
  };
});
