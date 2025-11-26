<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <h3>{{ isEdit ? 'Редактировать организацию' : 'Создать организацию' }}</h3>
      <TBoxBase v-model="form.name" placeholder="Organization name" />
      <TAreaBase v-model="form.comment" placeholder="Organization comment" />
      <div class="buttons">
        <BtnBase @click="handleSubmit" :content="isEdit ? 'Изменить' : 'Добавить'" />
        <BtnBase @click="closeModal" content="Отмена" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useOrganizationStore } from '../store/index.ts';
import type { OrganizationForm } from '@/modules/organization/types/OrganizationForm.ts';
import BtnBase from '@/components/BtnBase.vue';
import TBoxBase from '@/components/TBoxBase.vue';
import TAreaBase from '@/components/TAreaBase.vue';

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

.buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.buttons button:first-child {
  background: #6b708d;
  color: white;
}

.buttons button:last-child {
  background: transparent;
  color: #6b708d;
  border: 1px solid #d8d6e3;
}
</style>
