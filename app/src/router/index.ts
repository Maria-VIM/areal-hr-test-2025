import { createRouter, createWebHistory } from 'vue-router';
import OrganizationView from '@/views/OrganizationView.vue';
import JobView from '@/views/JobView.vue';
import EmployeeView from '@/views/EmployeeView.vue';
import UserView from '@/views/UserView.vue';
import LoginView from '@/views/LoginView.vue';

const routes = [
  {
    path: '/',
    redirect: '/organization',
  },
  { path: '/organization', component: OrganizationView, meta: { requiresAuth: true } },
  { path: '/job', component: JobView, meta: { requiresAuth: true } },
  { path: '/employees', component: EmployeeView, meta: { requiresAuth: true } },
  { path: '/users', component: UserView, meta: { requiresAuth: true } },
  { path: '/auth', component: LoginView, meta: { requiresAuth: false } },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
