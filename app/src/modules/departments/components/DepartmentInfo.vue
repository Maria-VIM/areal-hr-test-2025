<template>
  <div v-if="department">
    <DepartmentModal
      v-if="isModalOpen"
      :id="modalId"
      :department_id="department.id"
      :organization_id="department.organization_id"
      :IsEdit="modalMode"
      @close="closeModal"
      @saved="handleSaved"
    />
    <div v-else class="info">
      <div class="info-item">
        <span class="label">Name:</span>
        <span class="value">{{ department.name }}</span>
      </div>
      <div class="info-item">
        <span class="label">Comment:</span>
        <span class="value">{{ department.comment || '-' }}</span>
      </div>
      <div class="info-item">
        <span class="label">Status:</span>
        <span class="value">{{ department.deleted_at ? 'Deleted' : 'Active' }}</span>
      </div>
      <div class="info-item">
        <span class="label">Created:</span>
        <span class="value">{{ formatDate(department.created_at) }}</span>
      </div>
      <div class="info-item">
        <span class="label">Updated:</span>
        <span class="value">{{ formatDate(department.updated_at) }}</span>
      </div>
      <div v-if="props.role == 1">
        <div class="info-item actions">
          <div v-if="department.deleted_at === null">
            <BtnIcon class="pi pi-trash" @click="deleteDepartment(department.id)" />
            <BtnIcon class="pi pi-pencil" @click="openEditModal" />
            <BtnIcon class="pi pi-plus-circle" @click="openCreateModal" />
          </div>
          <div v-else-if="!props.isParentDeleted">
            <BtnIcon class="pi pi-refresh" @click="restoreDepartment(department.id)" />
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else class="loading">Loading department data...</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useDepartmentStore } from '@/modules/departments/store';
import DepartmentModal from '@/modules/departments/components/DepartmentModal.vue';
import BtnIcon from '@/components/BtnIcon.vue';
import type { Department } from '@/modules/departments/types/Department.ts';
import { useGeneralStore } from '@/store';

const props = defineProps<{
  department_id: number;
  isParentDeleted?: boolean;
  role: number;
}>();
const emit = defineEmits(['departmentUpdated']);

const store = useDepartmentStore();
const generalStore = useGeneralStore();

const department = ref<Department | null>(null);
const isModalOpen = ref(false);
const modalMode = ref<boolean>(false);
const modalId = ref<number | null>(null);

const formatDate = generalStore.formatDate;

async function loadDepartment() {
  if (!props.department_id) {
    department.value = null;
    return;
  }
  try {
    department.value = await store.getDepartmentById(props.department_id);
  } catch (err: any) {
    department.value = null;
    console.error('Ошибка загрузки департамента:', err.message || err);
  }
}

function openEditModal() {
  modalMode.value = true;
  modalId.value = props.department_id;
  isModalOpen.value = true;
}
function openCreateModal() {
  modalMode.value = false;
  modalId.value = null;
  isModalOpen.value = true;
}
function closeModal() {
  isModalOpen.value = false;
  modalId.value = null;
}
async function handleSaved() {
  await loadDepartment();
  closeModal();
}

async function deleteDepartment(id: number) {
  await store.deleteDepartment(id);
  await loadDepartment();
}

async function restoreDepartment(id: number) {
  await store.restoreDepartment(id);
  await loadDepartment();
}

onMounted(() => loadDepartment());

watch(
  () => props.department_id,
  async (newId, oldId) => {
    if (newId !== oldId) {
      await loadDepartment();
    }
  },
);
watch(
  () => store.version,
  () => {
    if (props.department_id) {
      loadDepartment();
    }
  },
);
</script>

<style scoped></style>
