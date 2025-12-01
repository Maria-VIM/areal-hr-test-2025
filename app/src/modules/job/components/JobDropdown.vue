<script setup lang="ts">
import { ref, defineEmits, onMounted } from 'vue';
import { useJobStore } from '@/modules/job/store';
import DropdownSearch from '@/components/DropdownSearch.vue';

const store = useJobStore();
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
const selectedJob = ref<DropdownOption | null>(null);
const jobOptions = ref<DropdownOption[]>([]);

onMounted(async () => {
  await store.fetchJobs();
  jobOptions.value = store.jobs.map((job: any) => ({
    value: job.id,
    label: job.name,
  }));
});
</script>

<template>
  <dropdown-search :options="jobOptions" v-model="selectedJob" placeholder="Выберите должность" />
</template>

<style scoped></style>
