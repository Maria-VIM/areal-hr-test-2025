import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import 'primeicons/primeicons.css';
import './assests/style.css';
import { router } from '@/router';
import { setupAuthRouter } from '@/modules/auth/router-setup.ts';

const pinia = createPinia();
const app = createApp(App);
app.use(router);
app.use(pinia);

setupAuthRouter();

app.mount('#app');
