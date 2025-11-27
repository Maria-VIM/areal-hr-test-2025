<template>
  <li class="department-item">
    <div class="department-header">
      <BtnBase class="btn" v-if="hasChildren" :content="isExpanded ? '−' : '+'" @click="toggle" />
      <span class="department-name">{{ department.name }}</span>
      <BtnIcon :class="[isVisible ? 'pi pi-eye-slash' : 'pi pi-eye']" @click="toggleInfo" />
    </div>
    <transition name="slide-fade">
      <div v-if="isVisible" class="department-info-wrapper">
        <DepartmentInfo
          :department_id="department.id"
          :is-parent-deleted="isParentDeleted"
          @departmentUpdated="handleDepartmentUpdate"
        />
      </div>
    </transition>
    <transition name="slide-fade">
      <ul v-if="hasChildren && isExpanded" class="department-children">
        <DepartmentTree
          v-for="child in department.children"
          :key="child.id"
          :department="child"
          :level="level + 1"
          :is-deleted="!!child.deleted_at || isDeleted"
          :is-parent-deleted="isDeleted"
          :has-children="child.children && child.children.length > 0"
        />
      </ul>
    </transition>
  </li>
</template>
<script setup lang="ts">
import { defineProps, ref, computed, defineEmits } from 'vue';
import DepartmentTree from '@/modules/departments/components/DepartmentTree.vue';
import BtnBase from '@/components/BtnBase.vue';
import BtnIcon from '@/components/BtnIcon.vue';
import DepartmentInfo from '@/modules/departments/components/DepartmentInfo.vue';
import type { Department } from '@/modules/departments/types/Department.ts';

const props = defineProps<{
  department: Department;
  level: number;
  isDeleted?: boolean;
  isParentDeleted?: boolean;
}>();

const emit = defineEmits(['departmentUpdated']);
const isVisible = ref(false);
const isExpanded = ref(false);
const hasChildren = computed(
  () => props.department.children && props.department.children.length > 0,
);
const isDeleted = computed(() => !!props.isDeleted);
const isParentDeleted = computed(() => !!props.isParentDeleted);
function handleDepartmentUpdate() {
  emit('departmentUpdated');
}
function toggleInfo() {
  isVisible.value = !isVisible.value;
}

function toggle() {
  isExpanded.value = !isExpanded.value;
}
</script>

<style scoped>
.department-item {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  list-style: none;
  margin: 4px 0;
}

.btn {
  margin: 0 5px;
  padding: 5px 15px;
}

.department-header {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
  background-color: #f8f8f8;
  border: 1px solid #e0e0e0;
}

.department-header:hover {
  background-color: #e0e0e0;
}

.department-name {
  font-weight: 500;
  color: #444;
  flex-grow: 1;
}

.department-children {
  list-style: none;
  padding-left: 16px;
  margin-top: 4px;
  border-left: 1px solid #f0f0f0;
}
</style>
