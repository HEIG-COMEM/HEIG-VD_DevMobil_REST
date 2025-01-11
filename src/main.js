import './assets/styles/main.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import OneSignalVuePlugin from '@onesignal/onesignal-vue3'

import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(OneSignalVuePlugin, {
  appId: import.meta.env.VITE_ONESIGNAL_APP_ID,
  notifyButton: {
    enable: true,
  },
});

app.mount('#app');
