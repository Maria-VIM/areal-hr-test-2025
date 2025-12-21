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
const errors = ref<{ name?: string; comment?: string }>({});

async function loadOrganization(id: number) {
  await store.getOrganizationById(id);
  if (store.organization) {
    form.value = {
      name: store.organization.name || '',
      comment: store.organization.comment || '',
    };
  }
}

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

function updateName() {
  if (errors.value.name) {
    errors.value.name = undefined;
  }
}

function updateComment() {
  if (errors.value.comment && form.value.comment.length > 4) {
    errors.value.comment = undefined;
  }
}

async function handleSubmit() {
  if (!validate()) return;
  try {
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
  errors.value = {};
  emit('close');
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
</script>

<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <h3>{{ isEdit ? 'Редактировать организацию' : 'Создать организацию' }}</h3>
      <TBoxBase
        v-model="form.name"
        :placeholder="'Наименование организации'"
        class="input-field"
        @update:model-value="updateName"
        :class="{ 'input-error': errors.name }"
      />
      <div v-if="errors.name" class="error-message">{{ errors.name }}</div>

      <TAreaBase
        v-model="form.comment"
        :placeholder="'Комментарий к организации'"
        class="input-field"
        @update:model-value="updateComment"
        :class="{ 'input-error': errors.comment }"
      />
      <div v-if="errors.comment" class="error-message">{{ errors.comment }}</div>

      <div class="buttons">
        <BtnBase @click="handleSubmit" :content="isEdit ? 'Изменить' : 'Добавить'" />
        <BtnBase @click="closeModal" content="Отмена" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-error {
  border: 1px solid #731919;
}
</style>
