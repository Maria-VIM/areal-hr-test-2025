<script setup lang="ts">
import { defineProps, ref, watch, defineEmits } from 'vue';
import BtnBase from '@/components/BtnBase.vue';
import TBoxBase from '@/components/TBoxBase.vue';
import type { PersonnelOperationForm } from '@/modules/personnel/types/PersonnelForm.ts';
import { OrganizationDropdown } from '@/modules/organization';
import { DepartmentDropdown } from '@/modules/departments';
import { JobDropdown } from '@/modules/job';
import { usePersonnelStore } from '@/modules/personnel/store';
import DateBase from '@/components/DateBase.vue';

const props = defineProps<{
  id?: number | null;
  visible: boolean;
  employee_id?: number;
}>();
const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void;
  (e: 'saved'): void;
  (e: 'close'): void;
}>();
const form = ref<PersonnelOperationForm>({
  employee_id: props.employee_id || 0,
  job_id: 0,
  department_id: 0,
  salary: 0,
  employment_date: '',
});

const selectedOrganization = ref<number | null>(null);
const selectedDepartment = ref<number | null>(null);
const selectedJob = ref<number | null>(null);

const store = usePersonnelStore();
const isEdit = ref(false);

async function loadPersonnelOperation(id: number) {
  await store.getPersonnelOperationById(id);
  if (store.operation) {
    form.value = {
      employee_id: store.operation.employee_id,
      job_id: store.operation.job_id,
      department_id: store.operation.department_id,
      salary: store.operation.salary,
      employment_date: store.operation.employment_date
        ? store.operation.employment_date.slice(0, 10)
        : '',
    };

    selectedOrganization.value = store.operation.organization_id ?? null;
    selectedDepartment.value = store.operation.department_id ?? null;
    selectedJob.value = store.operation.job_id ?? null;
  }
}
function resetForm() {
  form.value = {
    employee_id: props.employee_id || 0,
    job_id: 0,
    department_id: 0,
    salary: 0,
    employment_date: '',
  };
  selectedOrganization.value = null;
  selectedDepartment.value = null;
  selectedJob.value = null;
}
function closeModal() {
  resetForm();
  emit('close');
}
async function handleSave() {
  form.value.department_id = selectedDepartment.value ?? 0;
  form.value.job_id = selectedJob.value ?? 0;
  if (isEdit.value && props.id) {
    const { employee_id, employment_date, ...payload } = form.value;
    await store.updatePersonnelOperation(props.id, payload);
  } else {
    await store.createPersonnelOperation(form.value);
  }
  emit('saved');
  closeModal();
}
watch(
  () => props.id,
  async (newId) => {
    if (newId) {
      isEdit.value = true;
      await loadPersonnelOperation(newId);
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
    if (visible && !props.id) resetForm();
  },
);
</script>

<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <h3>{{ isEdit ? 'Редактировать кадровую операцию' : 'Создать кадровую операцию' }}</h3>
      <div class="form-group" v-if="!isEdit">
        <label>Организация</label>
        <OrganizationDropdown
          :model-value="selectedOrganization"
          @update:model-value="selectedOrganization = $event"
        />
      </div>

      <div class="form-group" v-if="selectedOrganization">
        <label>Отдел</label>
        <DepartmentDropdown
          :model-value="selectedDepartment"
          @update:model-value="selectedDepartment = $event"
          :organization_id="selectedOrganization"
        />
      </div>

      <div class="form-group">
        <label>Должность</label>
        <JobDropdown :model-value="selectedJob" @update:model-value="selectedJob = $event" />
      </div>

      <div class="form-group">
        <label>Зарплата</label>
        <TBoxBase v-model="form.salary" placeholder="Введите зарплату" class="input-field" />
      </div>
      <div class="form-group" v-if="!isEdit">
        <label>Дата трудоустройства</label>
        <DateBase v-model="form.employment_date!" type="date" class="input-field" />
      </div>
      <div class="buttons">
        <BtnBase @click="handleSave" :content="isEdit ? 'Изменить' : 'Добавить'" />
        <BtnBase @click="closeModal" content="Отмена" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #555;
}
</style>
