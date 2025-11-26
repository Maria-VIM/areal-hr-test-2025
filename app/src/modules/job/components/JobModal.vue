<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <h3>{{ isEdit ? 'Редактировать должность' : 'Создать должность' }}</h3>
      <TBoxBase v-model="form.name" placeholder="Job title" />
      <div class="buttons">
        <BtnBase @click="handleSubmit" :content="isEdit ? 'Изменить' : 'Добавить'" />
        <BtnBase @click="closeModal" content="Отмена" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useJobStore } from '../store/index.ts';
import type { JobForm } from '../types/JobForm';
import BtnBase from '@/components/BtnBase.vue';
import TBoxBase from '@/components/TBoxBase.vue';

const props = defineProps<{
  id?: number | null;
  name?: string | null;
  visible: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const store = useJobStore();
const form = ref<JobForm>({ name: '' });
const isEdit = ref(false);

async function loadJobs(id: number) {
  await store.getJobById(id);
  if (store.job) {
    form.value = {
      name: store.job.name || '',
    };
  }
}
watch(
  () => props.id,
  async (newId) => {
    if (newId != null) {
      isEdit.value = true;
      await loadJobs(newId);
    } else {
      isEdit.value = false;
      form.value = { name: '' };
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  try {
    const name = form.value.name.trim();

    if (name.length < 3) {
      alert('Пожалуйста, введите корректное значение для названия');
      return;
    }
    const search = props.name ?? '';
    if (isEdit.value && props.id != null) {
      await store.updateJob(props.id, search, form.value);
    } else {
      const targetName = props.name === undefined ? name : search;
      await store.createJob(targetName, form.value);
    }

    closeModal();
  } catch (error) {
    console.error('Ошибка при выполнении действия:', error);
  }
}

function closeModal() {
  form.value = { name: '' };
  emit('close');
}
</script>

<style scoped>
.modal {
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: #fefefe;
  padding: 12px;
  width: 100%;
}

.modal-content h3 {
  color: #636363;
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 20px;
  text-align: center;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.buttons {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 12px;
}

.buttons button:first-child {
  background: #949495;
  color: white;
}

.buttons button:last-child {
  background: transparent;
  color: #8a8a8a;
  border: 1px solid #d8d6e3;
}
</style>
