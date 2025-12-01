<script setup lang="ts">
import { watch, ref, defineProps } from 'vue';
import { useEmployeesStore } from '@/modules/employee/store';
import type { Employee } from '@/modules/employee/types/Employee.ts';

interface FilterParams {
  orgId: number | null;
  deptId: number | null;
  option: string | null;
}
const props = defineProps<{
  params: FilterParams;
}>();

const employees = ref<Employee[]>([]);

const store = useEmployeesStore();

const fetchEmployees = async () => {
  const { orgId, deptId, option } = props.params;
  try {
    if (deptId != null) {
      await store.fetchEmployeeByDepartment(deptId);
    } else if (orgId != null) {
      await store.fetchEmployeesByOrganization(orgId);
    } else if (option === 'trainees') {
      await store.fetchTrainees();
    } else if (option === 'deleted') {
      await store.fetchDeletedEmployee();
    } else {
      store.employees = [];
    }
    employees.value = [...store.employees];
  } catch (error) {
    console.error(error);
    employees.value = [];
  }
};
watch(
  () => props.params,
  (newParams, oldParams) => {
    console.log(newParams);
    if (
      newParams.orgId !== oldParams?.orgId ||
      newParams.deptId !== oldParams?.deptId ||
      newParams.option !== oldParams?.option
    ) {
      fetchEmployees();
    }
  },
  { deep: true },
);
</script>

<template>
  <div v-if="employees.length > 0">
    <div v-for="employee in employees" :key="employee.id">
      <p>{{ employee.first_name }} {{ employee.last_name }} {{ employee.middle_name }}</p>
    </div>
  </div>
</template>

<style scoped></style>

<style scoped></style>
