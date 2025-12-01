<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useOrganizationStore } from '@/modules/organization/store';
import DropdownSearch from '@/components/DropdownSearch.vue';

interface DropdownOption {
  value: number;
  label: string;
}
interface Props {
  modelValue?: number | null;
}
const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
});
const emit = defineEmits<{
  'update:model-value': [value: number | null];
}>();
const store = useOrganizationStore();
const selectedOrganization = ref<DropdownOption | null>(null);
const organizationOptions = ref<DropdownOption[]>([]);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue === null) {
      selectedOrganization.value = null;
      return;
    }
    const option = organizationOptions.value.find((opt) => opt.value === newValue);
    selectedOrganization.value = option || null;
  },
);
onMounted(async () => {
  await store.fetchActiveOrganizations();
  organizationOptions.value = store.organizations.map((org) => ({
    value: org.id,
    label: org.name,
  }));
  if (props.modelValue) {
    const option = organizationOptions.value.find((opt) => opt.value === props.modelValue);
    selectedOrganization.value = option || null;
  }
});

watch(selectedOrganization, (newValue) => {
  emit('update:model-value', newValue?.value ?? null);
});
</script>
<template>
  <DropdownSearch
    v-model="selectedOrganization"
    :options="organizationOptions"
    placeholder="Выберите организацию..."
  />
</template>
<style scoped></style>
