<script setup lang="ts">
import { defineProps, watch, ref } from 'vue';
import { useJobStore } from '@/modules/job/store';
import type { Job } from '@/modules/job/types/Job.ts';
import JobModal from '@/modules/job/components/JobModal.vue';
import JobInfo from '@/modules/job/components/JobInfo.vue';
import BtnBase from '@/components/BtnBase.vue';
import BtnIcon from '@/components/BtnIcon.vue';

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
  await store.restoreJob(id);
  await loadJobs();
}

async function deleteJob(id: number) {
  if (!props.name) return;
  await store.deleteJob(id);
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
  <BtnBase content="Добавить" @click="openModal()" class="add-base-btn" />

  <JobModal
    :visible="showModal"
    :id="selectedId"
    :name="props.name?.toString()"
    @close="handleClose"
  />

  <JobInfo :visible="showInfo" :id="selectedId" @close="handleClose" />

  <div class="container">
    <div v-for="j in job" :key="j.id" class="row" :class="{ deleted: j.deleted_at }">
      <div class="name" @click="openInfo(j.id)">{{ j.name }}</div>

      <div class="actions" v-if="!j.deleted_at">
        <BtnIcon
          class="pi pi-pencil action-edit"
          style="cursor: pointer; font-size: 14px"
          @click="openModal(j.id)"
        />
        <BtnIcon
          class="pi pi-trash action-delete"
          style="cursor: pointer; font-size: 14px"
          @click="deleteJob(j.id)"
        />
      </div>
      <BtnIcon
        v-else
        class="pi pi-refresh action-restore"
        style="cursor: pointer; font-size: 14px"
        @click="restoreJob(j.id)"
      />
    </div>
  </div>
</template>

<style scoped></style>
