import { createRouter, createWebHistory } from 'vue-router';
import OrganizationView from '@/views/OrganizationView.vue';
import JobView from '@/views/JobView.vue';

const routes = [
  { path: '/', component: OrganizationView },
  { path: '/job', component: JobView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
