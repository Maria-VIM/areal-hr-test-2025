<script setup lang="ts">
import DropdownSearch from '@/components/DropdownSearch.vue';
import { onMounted, ref, watch } from 'vue';
import { useEmployeesStore } from '@/modules/employee/store';
import type { DropdownOption } from '@/shared/types/Option.ts';
const props = defineProps<{
  modelValue: number | null;
}>();

const emit = defineEmits<{
  'update:model-value': [value: number | null];
}>();

const store = useEmployeesStore();
const selectedEmployee = ref<DropdownOption | null>(null);
const employeeOptions = ref<DropdownOption[]>([]);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === null) {
      selectedEmployee.value = null;
      return;
    }
    const option = employeeOptions.value.find((emp) => emp.value === newValue);
    selectedEmployee.value = option || null;
  },
);
onMounted(async () => {
  await store.fetchActive();
  employeeOptions.value = store.employees.map((emp: any) => ({
    value: emp.id,
    label: emp.last_name + ' ' + emp.first_name + ' ' + emp.middle_name,
  }));
  if (props.modelValue) {
    const option = employeeOptions.value.find((emp) => emp.value === props.modelValue);
    selectedEmployee.value = option || null;
  }
});
watch(selectedEmployee, (newValue) => {
  emit('update:model-value', newValue?.value ?? null);
});
</script>

<template>
  <DropdownSearch
    v-model="selectedEmployee"
    :options="employeeOptions"
    placeholder="Выберите сотрудника..."
  />
</template>

<style scoped></style>
