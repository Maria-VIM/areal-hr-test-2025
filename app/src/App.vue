<script setup lang="ts">
import { provide, ref, watch } from 'vue';
import { useAuthStore } from '@/modules/auth/store';

const authStore = useAuthStore();
const userRole = ref(authStore.roleId);
watch(
  () => authStore.roleId,
  (newRole) => {
    userRole.value = newRole;
  },
);
provide('userRole', userRole);
</script>

<template>
  <router-view />
</template>

<style scoped></style>
