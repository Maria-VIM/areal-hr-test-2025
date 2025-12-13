<script setup lang="ts">
import BtnBase from '@/components/BtnBase.vue';
import { ref, watch } from 'vue';
import { EmployeeDropdown } from '@/modules/employee';
import RoleDropdown from '@/modules/users/components/RoleDropdown.vue';
import TBoxBase from '@/components/TBoxBase.vue';
import type { UserForm } from '@/modules/users/types/UserForm.ts';
import { useUsersStore } from '@/modules/users/store';

const props = defineProps<{
  id?: number | null;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'update:modelValue', value: any): void;
}>();

const form = ref<UserForm>({ role_id: 0, login: '', password: '' });
const errors = ref<{
  employee_id?: string;
  role_id?: string;
  login?: string;
  password?: string;
}>({});

const selectedEmployee = ref<number | null>(null);
const selectedRole = ref<number | null>(null);
const isEdit = ref(false);
const store = useUsersStore();

function resetForm() {
  form.value = {
    role_id: 0,
    login: '',
    password: '',
  };
  selectedEmployee.value = null;
  selectedRole.value = null;
  errors.value = {};
}

function closeModal() {
  resetForm();
  emit('close');
}

function validate(): boolean {
  errors.value = {};

  let isValid = true;

  if (!selectedEmployee.value && !isEdit.value) {
    isValid = false;
    errors.value.employee_id = 'Привяжите профиль к пользователю';
  }

  if (!selectedRole.value) {
    isValid = false;
    errors.value.role_id = 'Нельзя оставить пользователя без роли';
  }

  if (!form.value.login?.trim()) {
    isValid = false;
    errors.value.login = 'Логин обязателен';
  }

  if (!isEdit.value && !form.value.password) {
    isValid = false;
    errors.value.password = 'Пароль обязателен';
  }

  return isValid;
}

async function loadUser(id: number) {
  await store.getById(id);
  if (store.user) {
    form.value = {
      role_id: store.user.role_id,
      login: store.user.login,
      password: '',
    };
    selectedRole.value = store.user.role_id;
  }
}

async function handleSave() {
  let result;
  if (!validate()) return;
  const saveData = {
    ...form.value,
    role_id: selectedRole.value ?? 0,
  };
  if (!isEdit.value && !props.id) {
    result = await store.create(selectedEmployee.value!, saveData);
  } else if (props.id) {
    const updateData: {
      role_id: number;
      login: string;
      password?: string;
    } = {
      role_id: saveData.role_id,
      login: saveData.login,
    };
    if (saveData.password && saveData.password.trim() !== '') {
      updateData.password = saveData.password;
    }
    result = await store.update(props.id, updateData);
  }
  if (result?.error) {
    if (result.error.includes('логин уже занят')) {
      errors.value.login = result.error;
      return;
    }
  }
  closeModal();
}

function updateEmployee(value: number | null) {
  selectedEmployee.value = value;
  if (errors.value.employee_id) {
    errors.value.employee_id = undefined;
  }
}

function updateRole(value: number | null) {
  selectedRole.value = value;
  if (errors.value.role_id) {
    errors.value.role_id = undefined;
  }
}

function updateLogin(value: string) {
  form.value.login = value;
  if (errors.value.login) {
    errors.value.login = undefined;
  }
}

function updatePassword(value: string) {
  form.value.password = value;
  if (errors.value.password) {
    errors.value.password = undefined;
  }
}

watch(
  () => props.id,
  async (newId) => {
    if (newId) {
      isEdit.value = true;
      await loadUser(newId);
    } else {
      isEdit.value = false;
      resetForm();
    }
  },
  { immediate: true },
);

watch(
  () => props.visible,
  (visible) => {
    if (visible && !props.id) {
      resetForm();
    }
  },
);
</script>

<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <h3>{{ isEdit ? 'Редактировать профиль' : 'Создать профиль' }}</h3>
      <div class="form-group" v-if="!isEdit">
        <label>Работник: </label>
        <EmployeeDropdown
          :modelValue="selectedEmployee"
          @update:modelValue="updateEmployee"
          :class="{ 'input-error': errors.employee_id }"
        />
        <span v-if="errors.employee_id" class="error-message">{{ errors.employee_id }}</span>
      </div>
      <div class="form-group">
        <label>Роль: </label>
        <RoleDropdown
          :modelValue="selectedRole"
          @update:modelValue="updateRole"
          :class="{ 'input-error': errors.role_id }"
        />
        <span v-if="errors.role_id" class="error-message">{{ errors.role_id }}</span>
      </div>
      <div class="form-group">
        <label>Логин: </label>
        <TBoxBase
          :modelValue="form.login"
          @update:modelValue="updateLogin"
          :class="{ 'input-error': errors.login }"
        />
        <span v-if="errors.login" class="error-message">{{ errors.login }}</span>
      </div>
      <div class="form-group">
        <label>Пароль: </label>
        <TBoxBase
          type="password"
          :modelValue="form.password!"
          @update:modelValue="updatePassword"
          :class="{ 'input-error': errors.password }"
          :placeholder="isEdit ? 'Оставьте пустым, если не хотите менять' : ''"
        />
        <span v-if="errors.password" class="error-message">{{ errors.password }}</span>
      </div>
      <div class="buttons">
        <BtnBase @click="handleSave" :content="isEdit ? 'Изменить' : 'Добавить'" />
        <BtnBase @click="closeModal" content="Отмена" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-error {
  border: 1px solid #731919;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 14px;
  color: #555;
}
</style>
