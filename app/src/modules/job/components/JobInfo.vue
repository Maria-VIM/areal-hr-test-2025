<script setup lang="ts">
import { defineProps, defineEmits, ref, watch } from 'vue';
import { useJobStore } from '@/modules/job/store';
import { useGeneralStore } from '@/store';
import type { Job } from '@/modules/job/types/Job.ts';
import BtnIcon from '@/components/BtnIcon.vue';
const props = defineProps<{
  id?: number | null;
  visible: boolean;
}>();
const store = useJobStore();
const generalStore = useGeneralStore();
const job = ref<Job | null>(null);
const open = ref(false);

async function loadJob() {
  if (!props.id) {
    job.value = null;
    return;
  }
  job.value = await store.getJobById(props.id);
}

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function closeInfo() {
  emit('close');
}

watch(
  () => props.id,
  (newId) => {
    if (newId != null) {
      loadJob();
    } else {
      job.value = null;
    }
  },
  { immediate: true },
);

const formatDate = generalStore.formatDate;
</script>

<template>
  <div v-if="props.visible">
    <div class="header">
      <h4>{{ job?.name ?? 'Loading...' }}</h4>
      <BtnIcon class="pi pi-times close-btn" @click="closeInfo" />
    </div>
    <div v-if="!open && job" class="content">
      <div class="info-item">
        <span class="label">Name:</span>
        <span class="value">{{ job.name }}</span>
      </div>
      <div class="info-item">
        <span class="label">Status:</span>
        <span class="value" :class="{ deleted: job.deleted_at }">
          {{ job.deleted_at ? 'Deleted' : 'Active' }}
        </span>
      </div>
      <div class="info-item">
        <span class="label">Created:</span>
        <span class="value">{{ formatDate(job.created_at) }}</span>
      </div>
      <div class="info-item" v-if="job.updated_at">
        <span class="label">Updated:</span>
        <span class="value">{{ formatDate(job.updated_at) }}</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.header:hover {
  background: #f5f5f5;
}

h4 {
  font-weight: 400;
  color: #424242;
  font-size: 14px;
  margin: 0;
  transition: color 0.2s ease;
}

.header:hover h4 {
  color: #6d6875;
}

.content {
  padding: 0 20px 16px 20px;
  border-top: 1px solid #f0f0f0;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f8f8;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #6d6875;
  font-size: 13px;
  min-width: 80px;
  flex-shrink: 0;
}

.value {
  color: #424242;
  font-size: 13px;
  flex: 1;
}

.value.deleted {
  color: #b5838d;
}

.content {
  animation: fadeIn 0.2s ease;
}
.organization-info.deleted .value {
  color: #8d8d8d;
}
</style>
