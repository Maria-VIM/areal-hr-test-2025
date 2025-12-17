<script setup lang="ts">
import { watch, ref } from 'vue';
import { useJobStore } from '@/modules/job/store';
import type { Job } from '@/modules/job/types/Job.ts';
import JobModal from '@/modules/job/components/JobModal.vue';
import JobInfo from '@/modules/job/components/JobInfo.vue';
import BtnBase from '@/components/BtnBase.vue';
import BtnIcon from '@/components/BtnIcon.vue';
import { HistoryList } from '@/modules/history';

const props = defineProps<{
  name?: string | number | null;
}>();

const store = useJobStore();
const job = ref<Job[]>([]);
const showModal = ref(false);
const showInfo = ref(false);
const selectedId = ref<number | null>(null);
const currentPage = ref<number>(1);
const pageSize = ref<number>(10);
const totalPages = ref<number>(0);
const totalJobs = ref<number>(0);

const selectedIdForHistory = ref<number>(1);
const showHistory = ref(false);

function openModal(id?: number) {
  selectedId.value = id ?? null;
  showModal.value = true;
}

function openInfo(id: number) {
  selectedId.value = id;
  showInfo.value = true;
}

function openHistory(id: number) {
  selectedIdForHistory.value = id;
  showHistory.value = true;
}

function handleClose() {
  selectedId.value = null;
  showInfo.value = false;
  showModal.value = false;
  loadJobs();
}

async function loadJobs() {
  if (props.name === undefined || props.name === null || props.name === '') {
    await store.fetchAllJobs(currentPage.value, pageSize.value);
  } else {
    await store.getJobByName(String(props.name), currentPage.value, pageSize.value);
  }
  job.value = store.jobs;
  totalJobs.value = store.totalJobs;
  totalPages.value = store.totalPages;
}

async function restoreJob(id: number) {
  await store.restoreJob(id);
  await loadJobs();
}

async function deleteJob(id: number) {
  await store.deleteJob(id);
  await loadJobs();
}

async function loadPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  await loadJobs();
}
watch(
  () => props.name,
  () => {
    currentPage.value = 1;
    loadJobs();
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
  <HistoryList
    :id="selectedIdForHistory"
    :visible="showHistory"
    entity="Job_title"
    @close="showHistory = false"
  />
  <div class="container">
    <div>
      <div
        v-for="j in job"
        :key="j.id"
        class="row"
        :class="{ deleted: j.deleted_at }"
        @dblclick="openHistory(j.id)"
      >
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
  </div>
  <div v-if="totalPages > 1" class="pagination">
    <BtnBase content="назад" @click="loadPage(currentPage - 1)" :disabled="currentPage === 1" />
    <span class="page-info">
      Страница {{ currentPage }} из {{ totalPages }} (Всего: {{ totalJobs }})
    </span>
    <BtnBase
      content="вперед"
      @click="loadPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
    />
  </div>
</template>
<style scoped></style>
