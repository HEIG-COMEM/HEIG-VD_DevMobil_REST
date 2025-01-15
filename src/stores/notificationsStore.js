import { defineStore } from 'pinia';
import { computed, ref, watch } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useFetchApi } from '@/composables/useFetchApi';

const handleSocketMessage = (data) => {
  const message = JSON.parse(data);

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

  const userStore = useUserStore();
  const { fetchApi } = useFetchApi(import.meta.env.VITE_API_URL, {
    Authorization: `Bearer ${userStore.getToken}`,
  });

  const SERVER_MESSAGE_PATTERN = /^\[Server\]/;

  const socket = ref(null);
  const isConnected = ref(false);
  const messages = ref([]);

  const initSocket = () => {

    // Close the socket if there is no token
    if (!useUserStore().getToken) {
      socket.value?.close();
      return;
    };

    socket.value = new WebSocket(import.meta.env.VITE_WS_URL, [`Bearer`, `${useUserStore().getToken}`]);

    // Connection opened
    socket.value.addEventListener("open", () => isConnected.value = true);

    // Listen for messages
    socket.value.addEventListener("message", (event) => {
      if (SERVER_MESSAGE_PATTERN.test(event.data)) return;

      const message = handleSocketMessage(event.data);
      messages.value.push({ message, type: 'info' });
    });

    socket.value.addEventListener("close", (event) => {
      console.log("Connection closed", event);
      isConnected.value = false;
    });
  };
  initSocket();
  watch(() => useUserStore().getToken, () => initSocket());

  const addMessage = ({ message, type } = {
    type: 'info',
  }) => {
    messages.value.push({ message, type });
  };

  const sendBeRealNotfication = async () => {
    if (!useUserStore().isAdmin) return;
    try {
      await fetchApi({
        url: '/notifications',
        method: 'POST'
      });

      addMessage({ message: 'Notification envoyée', type: 'success' });
    } catch (error) {
      addMessage({ message: error.data.message, type: 'error' });
    }
  }

  const getMessages = computed(() => messages.value);
  const isSocketConnected = computed(() => isConnected.value);
  return {
    getMessages,
    isSocketConnected,
    sendBeRealNotfication,
    addMessage,
  };
});
