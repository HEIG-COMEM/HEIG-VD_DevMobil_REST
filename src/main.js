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
  promptOptions: {
    slidedown: {
      enabled: true,
      autoPrompt: true,
      actionMessage: 'Recevez les notification pour réaliser votre BeReal.',
      acceptButtonText: 'Accepter',
      cancelButtonText: 'Non merci',
      delay: {
        pageViews: 3,
        timeDelay: 30
      }
    }
  }
});

app.mount('#app');
