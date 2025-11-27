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
    <div v-else class="department-info">
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
  <div v-else class="loading">Loading department data...</div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useDepartmentStore } from '@/modules/departments/store';
import DepartmentModal from '@/modules/departments/components/DepartmentModal.vue';
import BtnIcon from '@/components/BtnIcon.vue';
import type { Department } from '@/modules/departments/types/Department.ts';
import { useGeneralStore } from '@/store';

interface Props {
  department_id: number;
  isParentDeleted?: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits(['departmentUpdated']);

const store = useDepartmentStore();
const generalStore = useGeneralStore();
const department = ref<Department | null>(null);
const isModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const modalId = ref<number | null>(null);

const formatDate = generalStore.formatDate;

onMounted(() => {
  loadDepartment();
});

watch(() => props.department_id, loadDepartment);

async function loadDepartment() {
  try {
    department.value = await store.getDepartmentById(props.department_id);
  } catch (error) {
    console.error('Error loading department:', error);
  }
}

function openEditModal() {
  modalMode.value = 'edit';
  modalId.value = props.department_id;
  isModalOpen.value = true;
}

function openCreateModal() {
  modalMode.value = 'create';
  modalId.value = null;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  modalId.value = null;
}

async function handleSaved() {
  await loadDepartment();
  emit('departmentUpdated');
  closeModal();
}

async function deleteDepartment(id: number) {
  if (confirm('Are you sure you want to delete this department?')) {
    await store.delete(id);
    await loadDepartment();
    emit('departmentUpdated');
  }
}

async function restoreDepartment(id: number) {
  await store.restore(id);
  await loadDepartment();
  emit('departmentUpdated');
}
</script>

<style scoped>
.department-info {
  background: #ffffff;
  border-radius: 4px;
  transition: all 0.2s ease;
  overflow: hidden;
  padding: 0 20px 16px 20px;
  border-top: 1px solid #f0f0f0;
}
.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f8f8;
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
</style>
