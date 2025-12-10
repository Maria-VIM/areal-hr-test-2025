<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <h3>{{ isEdit ? 'Редактировать должность' : 'Создать должность' }}</h3>
      <TBoxBase
        v-model="form.name"
        placeholder="Наименование должности"
        class="input-field"
        :class="{ 'input-error': errors.name }"
      />
      <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
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
const errors = ref<{ name?: string }>({});

async function loadJobs(id: number) {
  await store.getJobById(id);
  if (store.job) {
    form.value = {
      name: store.job.name || '',
    };
  }
}

function validate() {
  errors.value = {};
  let isValid = true;
  if (!form.value.name.trim() || form.value.name.length < 3) {
    errors.value.name = 'Пожалуйста, введите корректное название должности (минимум 3 символа)';
    isValid = false;
  }
  return isValid;
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
    if (!validate()) return;
    if (isEdit.value && props.id != null) {
      await store.updateJob(props.id, form.value);
    } else {
      await store.createJob(form.value);
    }

    closeModal();
  } catch (error) {
    console.error('Ошибка при выполнении действия:', error);
  }
}

function closeModal() {
  form.value = { name: '' };
  errors.value = {};
  emit('close');
}
</script>

<style scoped>
.input-error {
  border: 1px solid #731919;
}
</style>
