<script setup lang="ts">
import TBoxBase from '@/components/TBoxBase.vue';
import BtnBase from '@/components/BtnBase.vue';
import { ref } from 'vue';
import type { LoginForm } from '@/modules/auth/types/LoginForm.ts';
import { useAuthStore } from '@/modules/auth/store';
import { router } from '@/router';

const form = ref<LoginForm>({ login: '', password: '' });
const store = useAuthStore();
const error = ref<null | string>(null);
async function handleLogin() {
  const success = await store.login(form.value);
  if (success) {
    await router.push('/organization');
  } else {
    error.value = 'Ошибка авторизации, пожалуйста обратитесь к администратору';
  }
}
</script>

<template>
  <div class="modal">
    <div class="modal-content">
      <h3>Войти в приложение</h3>
      <div class="form-group">
        <label>Логин:</label>
        <TBoxBase v-model="form.login" placeholder="Введите логин" class="input-field" />
      </div>
      <div class="form-group">
        <label>Пароль:</label>
        <TBoxBase
          type="password"
          v-model="form.password"
          placeholder="Введите пароль"
          class="input-field"
        />
      </div>
      <div v-if="error" class="error-message">{{ error }}</div>
      <BtnBase @click="handleLogin" class="search-base-btn" content="Войти" />
    </div>
  </div>
</template>

<style scoped>
.modal {
  background: #4b4453;
}
</style>
