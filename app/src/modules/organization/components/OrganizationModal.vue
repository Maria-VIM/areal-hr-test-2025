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
      <TBoxBase v-model="form.name" placeholder="Organization name" class="input-field" />
      <TAreaBase v-model="form.comment" placeholder="Organization comment" class="input-field" />
      <div class="buttons">
        <BtnBase @click="handleSubmit" :content="isEdit ? 'Изменить' : 'Добавить'" />
        <BtnBase @click="closeModal" content="Отмена" />
      </div>
    </div>
  </div>
</template>

<style scoped></style>
