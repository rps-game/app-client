import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createVfm } from 'vue-final-modal';
import App from './App.vue';
import router from './router';
import type { IUser } from '@/stores/user';
import { useUserStore } from '@/stores/user';
import { AXIOS } from '@/utils';

import 'vue-final-modal/style.css';
import '@/assets/index.css';

const app = createApp(App);
const vfm = createVfm();

app.use(createPinia());
app.use(vfm);

async function getData() {
  const store = useUserStore();
  try {
    const res = await AXIOS.get<IUser>('/me');
    store.setUser(res.data);
    store.setAuth(true);
  } catch (e) {
    console.error(e);
  }
}

getData().then(() => {
  app.use(router);
  app.mount('#app');
});
