<template>
  <li class="department-item">
    <ul v-if="rootDepartments.length > 0" :key="treeKey">
      <DepartmentTree
        v-for="dept in rootDepartments"
        :key="dept.id"
        :department="dept"
        :level="0"
        :is-deleted="isDeletedForRoot(dept)"
        :is-parent-deleted="false"
        @departmentUpdated="handleDepartmentUpdate"
      />
    </ul>
    <div v-else-if="!error">Нет отделов</div>
    <div v-else class="error">{{ error }}</div>
  </li>
</template>

<script setup lang="ts">
import { computed, defineProps, watch, ref, onMounted } from 'vue';
import type { Department } from '@/modules/departments/types/Department.ts';
import { useDepartmentStore } from '@/modules/departments/store';
import DepartmentTree from '@/modules/departments/components/DepartmentTree.vue';

const props = defineProps<{
  id: number;
}>();
const isDeletedForRoot = (department: Department) => {
  return !!department.deleted_at;
};
const departments = ref<Department[]>([]);
const error = ref<string | null>(null);

const store = useDepartmentStore();
const buildTree = store.buildTree;

const rootDepartments = computed(() => departments.value);

const treeKey = ref(0);
function handleDepartmentUpdate() {
  loadDepartments().then(() => {
    treeKey.value++;
  });
}

async function loadDepartments() {
  if (!props.id) {
    departments.value = [];
    return;
  }
  await store.fetchDepartments(props.id);
  departments.value = buildTree(store.departments);
}

onMounted(() => {
  loadDepartments();
});

watch(() => props.id, loadDepartments);
</script>

<style scoped>
ul {
  margin: 10px;
  padding: 0;
}
div {
  margin: 10px;
}
.error {
  padding: 20px;
  text-align: center;
  color: #d32f2f;
  background-color: #ffebee;
  border-radius: 4px;
  border: 1px solid #f5c6cb;
}
</style>
