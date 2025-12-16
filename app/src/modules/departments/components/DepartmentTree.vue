<script setup lang="ts">
import { ref, computed, watchEffect } from 'vue';
import DepartmentTree from '@/modules/departments/components/DepartmentTree.vue';
import BtnIcon from '@/components/BtnIcon.vue';
import DepartmentInfo from '@/modules/departments/components/DepartmentInfo.vue';
import type { Department } from '@/modules/departments/types/Department.ts';

const props = defineProps<{
  role: number;
  department: Department;
  level: number;
  isDeleted?: boolean;
  isParentDeleted?: boolean;
}>();

const emit = defineEmits(['departmentUpdated']);
const isVisible = ref(false);
const hasChildren = computed(
  () => props.department.children && props.department.children.length > 0,
);
const isDeleted = computed(() => props.isDeleted);
const isParentDeleted = computed(() => props.isParentDeleted);

function toggleInfo() {
  isVisible.value = !isVisible.value;
}

watchEffect(() => {}, { flush: 'post' });
</script>

<template>
  <li class="department-item">
    <div class="department-header">
      <span class="department-name">{{ department.name }}</span>
      <BtnIcon :class="[isVisible ? 'pi pi-eye-slash' : 'pi pi-eye']" @click="toggleInfo" />
    </div>
    <transition name="slide-fade">
      <div v-if="isVisible" class="department-info-wrapper">
        <DepartmentInfo
          :department_id="department.id"
          :is-parent-deleted="isParentDeleted"
          :role="props.role"
        />
      </div>
    </transition>
    <transition name="slide-fade">
      <ul v-if="hasChildren" class="department-children">
        <DepartmentTree
          v-for="child in department.children"
          :key="child.id"
          :department="child"
          :level="level + 1"
          :role="props.role"
          :is-deleted="!!child.deleted_at || isDeleted"
          :is-parent-deleted="isDeleted"
          :has-children="child.children && child.children.length > 0"
        />
      </ul>
    </transition>
  </li>
</template>

<style scoped>
.department-item {
  font-family: 'Inter', sans-serif;
  font-size: 14px;
  list-style: none;
  margin: 4px 0;
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
  padding-left: 25px;
  margin-top: 4px;
  border-left: 2px solid #f0f0f0;
}
</style>
