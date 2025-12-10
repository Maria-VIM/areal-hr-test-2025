<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';
import { useJobStore } from '@/modules/job/store';
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

const store = useJobStore();
const jobOptions = ref<DropdownOption[]>([]);
const selectedJob = ref<DropdownOption | null>(null);

onMounted(async () => {
  await store.fetchJobs();
  jobOptions.value = store.jobs.map((job: any) => ({
    value: job.id,
    label: job.name,
  }));
  syncFromProps();
});

function syncFromProps() {
  if (!props.modelValue) {
    selectedJob.value = null;
  } else {
    selectedJob.value = jobOptions.value.find((j) => j.value === props.modelValue) || null;
  }
}

watch(() => props.modelValue, syncFromProps);

function onSelect(option: DropdownOption | null) {
  emit('update:model-value', option ? option.value : null);
}
</script>

<template>
  <dropdown-search
    :options="jobOptions"
    :model-value="selectedJob"
    @update:model-value="onSelect"
    placeholder="Выберите должность"
  />
</template>

<style scoped></style>
