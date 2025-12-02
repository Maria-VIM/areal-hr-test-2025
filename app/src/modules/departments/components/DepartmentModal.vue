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
  IsEdit: 'create' | 'edit';
}>();

const store = useDepartmentStore();
const isLoading = ref(false);

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
    if (props.IsEdit === 'edit' && newId) {
      await loadDepartment(newId);
    } else {
      resetForm();
    }
  },
  { immediate: true },
);

async function saveDepartment() {
  if (!form.value.name.trim()) {
    alert('Please enter department name');
    return;
  }
  if (props.IsEdit === 'edit' && props.id) {
    const updateData = {
      name: form.value.name,
      comment: form.value.comment,
    };
    await store.update(props.id, updateData);
  } else {
    await store.create(form.value);
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
  isLoading.value = true;
  try {
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
  } catch (error) {
    console.error('Error loading department:', error);
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="department-modal">
    <div v-if="!isLoading" class="form-content">
      <div class="form-fields">
        <TBoxBase class="tbox" v-model="form.name" placeholder="Название отдела" />
        <TAreaBase v-model="form.comment" placeholder="Комментарий к отделу" />
      </div>
      <div class="buttons">
        <BtnBase
          @click="saveDepartment"
          :content="props.IsEdit ? 'Сохранить' : 'Создать'"
          class="btn-save"
          :disabled="isLoading"
        />
        <BtnBase @click="cancel" content="Отмена" class="btn-cancel" :disabled="isLoading" />
      </div>
    </div>
    <div v-else class="loading">Загрузка...</div>
  </div>
</template>

<style scoped>
.department-modal {
  margin: 10px;
}
.tbox {
  margin-bottom: 10px;
}
</style>
