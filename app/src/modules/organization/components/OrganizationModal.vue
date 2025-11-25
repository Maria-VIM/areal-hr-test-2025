<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <h3>{{ isEdit ? 'Редактировать организацию' : 'Создать организацию' }}</h3>
      <input v-model="form.name" placeholder="Organization name" />
      <textarea v-model="form.comment" placeholder="Organization comment" />
      <div class="buttons">
        <button @click="handleSubmit">{{ isEdit ? 'Изменить' : 'Добавить' }}</button>
        <button @click="closeModal">Отмена</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useOrganizationStore } from '../store/index.ts';
import type { Organization } from '../types/organization.ts';

const props = defineProps<{
  id?: number | null;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const store = useOrganizationStore();
const form = ref<OrganizationForm>({ name: '', comment: '' });
const isEdit = ref(false);

async function loadOrganization(id: number) {
  await store.getOrganizationById(id);
  if (store.organization) {
    form.value = {
      name: store.organization.name || '',
      comment: store.organization.comment || '',
    };
  }
}
watch(
  () => props.id,
  async (newId) => {
    if (newId != null) {
      isEdit.value = true;
      await loadOrganization(newId);
    } else {
      isEdit.value = false;
      form.value = { name: '', comment: '' };
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  try {
    if (!form.value.name.trim() || form.value.name.length < 3) {
      alert('Пожалуста введите корректное значение для названия');
      return;
    } else if (!form.value.comment.trim() || form.value.comment.length < 5) {
      alert('Пожалуста введите корректное значение для комментария');
      return;
    }

    if (isEdit.value && props.id != null) {
      await store.updateOrganization(props.id, form.value);
    } else {
      await store.createOrganization(form.value);
    }
    closeModal();
  } catch (error) {
    console.error('Ошибка при попытке выполнить действие:', error);
  }
}

function closeModal() {
  form.value = { name: '', comment: '' };
  emit('close');
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(107, 112, 141, 0.4);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: #fefefe;
  padding: 32px;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(107, 112, 141, 0.15);
  border: 1px solid #e8e6e9;
  width: 90%;
  max-width: 480px;
}

.modal-content h3 {
  color: #6b708d;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 24px;
  text-align: center;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.modal-content input,
.modal-content textarea {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d8d6e3;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  background: #fcfcfd;
  transition: all 0.2s ease;
  color: #5a5a72;
  margin-bottom: 16px;
  box-sizing: border-box;
}

.modal-content input:focus,
.modal-content textarea:focus {
  outline: none;
  border-color: #a8a6b5;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(168, 166, 181, 0.1);
}

.modal-content input::placeholder,
.modal-content textarea::placeholder {
  color: #9c9ab3;
}

.modal-content textarea {
  min-height: 80px;
  resize: vertical;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.buttons button {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.buttons button:first-child {
  background: #6b708d;
  color: white;
}

.buttons button:first-child:hover {
  background: #5a5f7a;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(107, 112, 141, 0.3);
}

.buttons button:last-child {
  background: transparent;
  color: #6b708d;
  border: 1px solid #d8d6e3;
}

.buttons button:last-child:hover {
  background: #f8f7fa;
  border-color: #a8a6b5;
}
</style>
