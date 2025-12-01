<script setup lang="ts">
import { onMounted, defineEmits, ref, watch } from 'vue';
import { useDepartmentStore } from '@/modules/departments/store';
import DropdownSearch from '@/components/DropdownSearch.vue';
const props = defineProps<{
  modelValue: number | null;
  organization_id: number;
}>();
const emit = defineEmits<{
  'update:model-value': [value: number | null];
}>();

const store = useDepartmentStore();
interface DropdownOption {
  value: number;
  label: string;
}
const selectedDepartment = ref<DropdownOption | null>(null);
const departmentOptions = ref<DropdownOption[]>([]);

onMounted(async () => {
  await store.fetchActiveDepartments(props.organization_id);

  departmentOptions.value = store.departments.map((d: any) => ({
    value: d.id,
    label: d.name,
  }));
  if (props.modelValue) {
    selectedDepartment.value =
      departmentOptions.value.find((o) => o.value === props.modelValue) || null;
  }
});

watch(selectedDepartment, (val) => {
  emit('update:model-value', val ? val.value : null);
});
</script>

<template>
  <DropdownSearch
    v-model="selectedDepartment"
    :options="departmentOptions"
    placeholder="Выберите департамент..."
  />
</template>

<style scoped></style>
