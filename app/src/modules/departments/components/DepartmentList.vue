<script setup lang="ts">
import { ref, computed, watchEffect, watch } from 'vue';
import type { Department } from '@/modules/departments/types/Department.ts';
import { useDepartmentStore } from '@/modules/departments/store';
import DepartmentTree from '@/modules/departments/components/DepartmentTree.vue';
import BtnBase from '@/components/BtnBase.vue';
import DepartmentModal from '@/modules/departments/components/DepartmentModal.vue';

const props = defineProps<{ id: number; role: number }>();

const store = useDepartmentStore();

const departments = ref<Department[]>([]);
const isModalOpen = ref(false);
const modalMode = ref<'create' | 'edit'>('create');
const treeKey = ref(0);

function openCreateModal() {
  modalMode.value = 'create';
  isModalOpen.value = true;
}
function closeModal() {
  isModalOpen.value = false;
}
async function handleSaved() {
  await loadDepartments();
  closeModal();
}

const rootDepartments = computed(() => departments.value);

const isDeletedForRoot = (department: Department) => !!department.deleted_at;

async function loadDepartments() {
  if (!props.id) {
    departments.value = [];
    return;
  }
  try {
    await store.fetchDepartments(props.id);
    departments.value = store.buildTree(store.departments);
  } catch (err: any) {
    departments.value = [];
  }
}

function handleDepartmentUpdate() {
  loadDepartments().then(() => treeKey.value++);
}

watchEffect(() => {
  if (props.id) {
    loadDepartments();
  }
});

watch(
  () => store.version,
  () => {
    if (props.id) {
      loadDepartments();
    }
  },
);
</script>

<template>
  <div class="department-item">
    <BtnBase content="Добавить отдел" @click="openCreateModal" v-if="props.role == 1" />
    <DepartmentModal
      v-if="isModalOpen"
      :organization_id="props.id"
      :IsEdit="false"
      @close="closeModal"
      @saved="handleSaved"
    />
    <ul v-if="rootDepartments.length > 0" :key="treeKey">
      <DepartmentTree
        v-for="dept in rootDepartments"
        :key="dept.id"
        :department="dept"
        :level="0"
        :is-deleted="isDeletedForRoot(dept)"
        :is-parent-deleted="false"
        :role="props.role"
        @departmentUpdated="handleDepartmentUpdate"
      />
    </ul>
    <div v-else>Нет отделов</div>
  </div>
</template>

<style scoped>
ul {
  margin: 10px;
  padding: 0;
}
div {
  margin: 10px;
}
</style>
