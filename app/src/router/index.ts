import { createRouter, createWebHistory } from 'vue-router';
import OrganizationView from '@/views/OrganizationView.vue';
import JobView from '@/views/JobView.vue';
import EmployeeView from '@/views/EmployeeView.vue';
import UserView from '@/views/UserView.vue';

const routes = [
  { path: '/', component: OrganizationView },
  { path: '/job', component: JobView },
  { path: '/employees', component: EmployeeView },
  { path: '/users', component: UserView },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
