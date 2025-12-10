<script setup lang="ts">
import TBoxBase from '@/components/TBoxBase.vue';
import TAreaBase from '@/components/TAreaBase.vue';
import BtnBase from '@/components/BtnBase.vue';
import { ref, watch, onMounted } from 'vue';
import type { DepartmentForm } from '@/modules/departments/types/DepartmentForm.ts';
import { useDepartmentStore } from '@/modules/departments/store';

const props = defineProps<{
  id?: number | null;
  department_id?: number | null;
  organization_id: number;
  IsEdit: boolean;
}>();

const store = useDepartmentStore();
const isLoading = ref(false);
const errors = ref<{ name?: string; comment?: string }>({});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'saved'): void;
}>();

const form = ref<DepartmentForm>({
  name: '',
  comment: '',
  organization_id: props.organization_id,
  parent_id: props.department_id,
});

watch(
  () => props.id,
  async (newId) => {
    if (props.IsEdit && newId) {
      await loadDepartment(newId);
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

function validate() {
  errors.value = {};
  let isValid = true;
  if (!form.value.name.trim() || form.value.name.length < 2) {
    errors.value.name = 'Пожалуйста, введите корректное название (минимум 2 символа)';
    isValid = false;
  }
  if (!form.value.comment.trim() || form.value.comment.length < 5) {
    errors.value.comment = 'Комментарий должен содержать минимум 5 символов';
    isValid = false;
  }
  return isValid;
}

async function handleSubmit() {
  if (!validate()) return;
  if (props.IsEdit && props.id) {
    const updateData = {
      name: form.value.name,
      comment: form.value.comment,
    };
    await store.updateDepartment(props.id, updateData);
  } else {
    await store.createDepartment(form.value);
  }
  emit('saved');
  emit('close');
}

onMounted(() => {
  if (!props.IsEdit) {
    resetForm();
  }
});

function cancel() {
  errors.value = {};
  emit('close');
}

function resetForm() {
  form.value = {
    name: '',
    comment: '',
    organization_id: props.organization_id,
    parent_id: props.department_id,
  };
}

async function loadDepartment(id: number) {
  const department = await store.getDepartmentById(id);
  if (department) {
    form.value = {
      id: department.id,
      name: department.name,
      comment: department.comment || '',
      organization_id: department.organization_id,
      parent_id: department.parent_id,
    };
  }
}
</script>

<template>
  <div class="modal-plain">
    <div class="modal-content-plain">
      <h3>{{ IsEdit ? 'Редактирование отдела' : 'Создание отдела' }}</h3>
      <div v-if="!isLoading" class="form-content">
        <div class="form-fields">
          <TBoxBase
            v-model="form.name"
            placeholder="Название отдела"
            class="input-field"
            :class="{ 'input-error': errors.name }"
          />
          <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
          <TAreaBase
            v-model="form.comment"
            placeholder="Комментарий к отделу"
            class="input-field"
            :class="{ 'input-error': errors.comment }"
          />
          <div v-if="errors.comment" class="error-message">{{ errors.comment }}</div>
        </div>
        <div class="buttons">
          <BtnBase
            @click="handleSubmit"
            :content="IsEdit ? 'Сохранить' : 'Создать'"
            :disabled="isLoading"
          />
          <BtnBase @click="cancel" content="Отмена" :disabled="isLoading" />
        </div>
      </div>
      <div v-else class="loading">Загрузка...</div>
    </div>
  </div>
</template>

<style scoped>
.input-error {
  border: 1px solid #731919;
}
</style>
