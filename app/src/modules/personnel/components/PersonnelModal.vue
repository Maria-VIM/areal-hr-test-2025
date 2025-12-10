<script setup lang="ts">
import { ref, watch } from 'vue';
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

const errors = ref<{
  job?: string;
  department?: string;
  salary?: string;
  employment_date?: string;
}>({});

const selectedOrganization = ref<number | null>(null);
const selectedDepartment = ref<number | null>(null);
const selectedJob = ref<number | null>(null);

const store = usePersonnelStore();
const isEdit = ref(false);

function validate() {
  errors.value = {};
  let isValid = true;
  if (!form.value.job_id) {
    errors.value.job = 'Пожалуйста, выберите должность';
    isValid = false;
  }
  if (!form.value.department_id) {
    errors.value.department = 'Пожалуйста, выберите департамент';
    isValid = false;
  }
  if (!form.value.salary) {
    errors.value.salary = 'Пожалуйста, введите зарплату';
    isValid = false;
  }
  if (!form.value.employment_date) {
    errors.value.employment_date = 'Пожалуйста, выберите дату выхода на работу';
    isValid = false;
  }
  return isValid;
}

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
  errors.value = {};
  emit('close');
}
async function handleSave() {
  if (!validate()) return;
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
          class="input-field"
          :class="{ 'input-error': errors.department }"
        />
        <div v-if="errors.department" class="error-message">{{ errors.department }}</div>
      </div>

      <div class="form-group">
        <label>Должность</label>
        <JobDropdown
          :model-value="selectedJob"
          @update:model-value="selectedJob = $event"
          class="input-field"
          :class="{ 'input-error': errors.job }"
        />
        <div v-if="errors.job" class="error-message">{{ errors.job }}</div>
      </div>

      <div class="form-group">
        <label>Зарплата</label>
        <TBoxBase
          v-model="form.salary"
          placeholder="Введите зарплату"
          class="input-field"
          :class="{ 'input-error': errors.salary }"
        />
        <div v-if="errors.salary" class="error-message">{{ errors.salary }}</div>
      </div>
      <div class="form-group" v-if="!isEdit">
        <label>Дата трудоустройства</label>
        <DateBase
          v-model="form.employment_date!"
          type="date"
          class="input-field"
          :class="{ 'input-error': errors.employment_date }"
        />
        <div v-if="errors.employment_date" class="error-message">{{ errors.employment_date }}</div>
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
.input-error {
  border: 1px solid #731919;
}
</style>
