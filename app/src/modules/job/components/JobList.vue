<script setup lang="ts">
import { defineProps, watch, ref } from 'vue';
import { useJobStore } from '@/modules/job/store';
import type { Job } from '@/modules/job/types/Job.ts';
import BtnIcon from '@/components/BtnIcon.vue';
import BtnBase from '@/components/BtnBase.vue';
import JobModal from '@/modules/job/components/JobModal.vue';
import JobInfo from '@/modules/job/components/JobInfo.vue';

const props = defineProps<{
  name?: string | number | null;
}>();

const store = useJobStore();
const job = ref<Job[]>([]);
const showModal = ref(false);
const showInfo = ref(false);
const selectedId = ref<number | null>(null);

function openModal(id?: number) {
  selectedId.value = id ?? null;
  showModal.value = true;
}

function openInfo(id: number) {
  selectedId.value = id;
  showInfo.value = true;
}

function handleClose() {
  selectedId.value = null;
  showInfo.value = false;
  showModal.value = false;
  loadJobs();
}

async function loadJobs() {
  if (!props.name) {
    job.value = [];
    return;
  }
  await store.getJobByName(props.name.toString());
  job.value = store.jobs;
}

async function restoreJob(id: number) {
  if (!props.name) return;
  await store.restoreJob(id, props.name.toString());
  await loadJobs();
}

async function deleteJob(id: number) {
  if (!props.name) return;
  await store.deleteJob(id, props.name.toString());
  await loadJobs();
}

watch(
  () => props.name,
  (newName) => {
    if (newName != null) {
      loadJobs();
    } else {
      job.value = [];
    }
  },
  { immediate: true },
);
</script>

<template>
  <BtnBase class="btn-add" @click="openModal()" content="Добавить должность" />
  <JobModal
    :visible="showModal"
    :id="selectedId"
    :name="props.name?.toString()"
    @close="handleClose"
  />
  <JobInfo :visible="showInfo" :id="selectedId" @close="handleClose" />
  <div class="job-container">
    <div
      v-for="j in job"
      :key="j.id"
      class="job-row"
      @click="openInfo(j.id)"
      :class="{ deleted: j.deleted_at }"
    >
      <div class="job-name">{{ j.name }}</div>
      <div class="job-actions" v-if="!j.deleted_at">
        <BtnIcon class="pi pi-pencil action-edit" @click="openModal(j.id)" />
        <BtnIcon class="pi pi-trash action-delete" @click="deleteJob(j.id)" />
      </div>
      <BtnIcon v-else class="pi pi-refresh action-restore" @click="restoreJob(j.id)" />
    </div>
  </div>
</template>

<style scoped>
.btn-add {
  width: 100%;
  font-weight: 500;
}
.job-container {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.job-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  margin: 5px;
  border-radius: 4px;
}

.job-row.deleted {
  background: #f4f4f4;
  color: #757575;
}

.job-name {
  font-size: 14px;
  color: #424242;
}

.job-actions {
  display: flex;
  gap: 8px;
}

.action-edit {
  color: #666;
}

.action-delete {
  color: #d32f2f;
}

.action-restore {
  color: #388e3c;
}
</style>
