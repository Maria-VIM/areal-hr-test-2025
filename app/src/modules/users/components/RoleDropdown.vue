<script setup lang="ts">
import DropdownSearch from '@/components/DropdownSearch.vue';
import { useUsersStore } from '@/modules/users/store';
import type { DropdownOption } from '@/shared/types/Option.ts';
import { onMounted, ref, watch } from 'vue';
const props = defineProps<{
  modelValue: number | null;
}>();

const emit = defineEmits<{
  'update:model-value': [value: number | null];
}>();
const store = useUsersStore();
const selectedRole = ref<DropdownOption | null>(null);
const roleOptions = ref<DropdownOption[]>([]);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === null) {
      selectedRole.value = null;
      return;
    }
    const option = roleOptions.value.find((role) => role.value === newValue);
    selectedRole.value = option || null;
  },
);
onMounted(async () => {
  await store.fetchRoles();
  roleOptions.value = store.roles.map((role: any) => ({
    value: role.id,
    label: role.name,
  }));
  if (props.modelValue) {
    const option = roleOptions.value.find((role) => role.value === props.modelValue);
    selectedRole.value = option || null;
  }
});

watch(selectedRole, (newValue) => {
  emit('update:model-value', newValue?.value ?? null);
});
</script>

<template>
  <DropdownSearch v-model="selectedRole" :options="roleOptions" placeholder="Выберите роль..." />
</template>

<style scoped></style>
