<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import BtnBase from '@/components/BtnBase.vue';
import { useAuthStore } from '@/modules/auth/store';
const router = useRouter();
const route = useRoute();
const store = useAuthStore();
async function logOut() {
  await store.logout();
  await router.push('/auth');
}
const navigateTo = (path: string) => {
  router.push(path);
};

const isActive = (path: string) => route.path === path;
</script>

<template>
  <header>
    <nav>
      <div class="nav-brand">HR App</div>
      <ul class="nav-list">
        <li>
          <BtnBase
            class="nav-link"
            :class="{ active: isActive('/') }"
            @click="navigateTo('/organization')"
            content="Организации"
          />
        </li>
        <li>
          <BtnBase
            class="nav-link"
            :class="{ active: isActive('/job') }"
            @click="navigateTo('/job')"
            content="Должности"
          />
        </li>
        <li>
          <BtnBase
            class="nav-link"
            :class="{ active: isActive('/employees') }"
            @click="navigateTo('/employees')"
            content="Работники"
          />
        </li>
        <li>
          <BtnBase
            class="nav-link"
            :class="{ active: isActive('/users') }"
            @click="navigateTo('/users')"
            content="Пользователи"
          />
        </li>
        <li>
          <BtnBase class="nav-link-out" content="Выйти" @click="logOut" />
        </li>
      </ul>
    </nav>
  </header>
</template>
<style scoped>
header {
  background: #ffffff;
  border-bottom: 1px solid #eaeaea;
  position: sticky;
  top: 0;
  z-index: 100;
}

nav {
  max-width: 1200px;
  height: 64px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-brand {
  font-size: 18px;
  font-weight: 600;
  color: #424242;
}

.nav-list {
  list-style: none;
  display: flex;
  gap: 8px;
  padding: 0;
  margin: 0;
}

.nav-link-out {
  background: #2c2c33;
  font-weight: 500;
  color: #d9d3e1;
}

.nav-link.active {
  background: #e7e7ee;
  border-color: #bfbfbf;
  font-weight: 500;
  color: #4b4453;
}

.nav-link.active:hover {
  background: #e1e1e8;
}
</style>
