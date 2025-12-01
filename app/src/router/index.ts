import { createRouter, createWebHistory } from 'vue-router';
import OrganizationView from '@/views/OrganizationView.vue';
import JobView from '@/views/JobView.vue';
import EmployeeView from '@/views/EmployeeView.vue';

const routes = [
  { path: '/', component: OrganizationView },
  { path: '/job', component: JobView },
  { path: '/employees', component: EmployeeView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
