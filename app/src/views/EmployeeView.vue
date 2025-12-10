<script setup lang="ts">
import { ref, computed } from 'vue';
import { OrganizationDropdown } from '@/modules/organization';
import BaseHeader from '@/layouts/BaseHeader.vue';
import BtnBase from '@/components/BtnBase.vue';
import { DepartmentDropdown } from '@/modules/departments';
import RadioBtn from '@/components/RadioBtn.vue';
import { EmployeeList, EmployeeModal } from '@/modules/employee';
import BtnIcon from '@/components/BtnIcon.vue';
import TBoxSearch from '@/components/TBoxSearch.vue';
import { PersonnelList } from '@/modules/personnel';

const selectedOption = ref<string | null>(null);
const selectedOrgId = ref<number | null>(null);
const selectedDeptId = ref<number | null>(null);
const searchQuery = ref<string | null>(null);
const selectedEmployeeId = ref<number>();
const showModal = ref(false);

const searchParams = ref({
  orgId: null as number | null,
  deptId: null as number | null,
  option: null as string | null,
  nameQuery: null as string | null,
});

const onOrgSelected = (orgId: number | null) => {
  selectedOrgId.value = orgId;
  selectedDeptId.value = null;
  searchQuery.value = null;
  selectedOption.value = null;
};

const onDeptSelected = (deptId: number | null) => {
  selectedDeptId.value = deptId;
  searchQuery.value = null;
  selectedOption.value = null;
};

const onSearch = (nameQuery: string | null) => {
  searchQuery.value = nameQuery;
  if (nameQuery && nameQuery.trim().length > 0) {
    selectedOption.value = null;
    selectedOrgId.value = null;
    selectedDeptId.value = null;
  } else if (nameQuery === null || nameQuery.trim() === '') {
    searchQuery.value = null;
  }
};

const onOptionSelected = (option: string | null) => {
  selectedOption.value = option;
  if (option !== null) {
    searchQuery.value = null;
    selectedOrgId.value = null;
    selectedDeptId.value = null;
  }
};

function onEmployeeSelected(employeeId: number) {
  selectedEmployeeId.value = employeeId;
}

const eraseSelectedDeptId = () => {
  selectedDeptId.value = null;
  searchQuery.value = null;
  selectedOption.value = null;
};

const handleSearch = () => {
  searchParams.value = {
    orgId: selectedOrgId.value || null,
    deptId: selectedDeptId.value || null,
    option: selectedOption.value || null,
    nameQuery: searchQuery.value?.trim() || null,
  };
};
const employeeParams = computed(() => searchParams.value);

function openModal() {
  showModal.value = true;
}
</script>

<template>
  <div class="page">
    <base-header />
    <div class="main-layout">
      <div class="main-content">
        <div class="filter-container">
          <TBoxSearch
            @search="onSearch"
            placeholder="Поиск по имени и фамилии"
            :value="searchQuery"
          />
          <organization-dropdown
            :model-value="selectedOrgId"
            @update:model-value="onOrgSelected"
            placeholder="Выберите организацию"
          />
          <div class="dept-combined">
            <department-dropdown
              v-if="selectedOrgId"
              :key="`dept-${selectedOrgId}-${selectedDeptId || 'null'}`"
              :model-value="selectedDeptId"
              @update:model-value="onDeptSelected"
              :organization_id="selectedOrgId"
              placeholder="Выберите отдел"
            />
            <BtnIcon
              v-if="selectedDeptId"
              class="pi pi-delete-left clear-btn-inline"
              @click="eraseSelectedDeptId"
              title="Очистить отдел"
            />
          </div>
          <div class="radio-group">
            <radio-btn
              text="Стажеры"
              value="trainees"
              :model-value="selectedOption || 'all'"
              @update:model-value="onOptionSelected"
            />
            <radio-btn
              text="Уволенные"
              value="deleted"
              :model-value="selectedOption || 'all'"
              @update:model-value="onOptionSelected"
            />
          </div>

          <div class="action-buttons">
            <btn-base content="Найти" class="search-base-btn" @click="handleSearch" />
            <btn-base content="Создать" class="add-base-btn" @click="openModal()" />
          </div>
        </div>
        <div class="employee-content">
          <employee-list
            @select="onEmployeeSelected"
            class="employee-list"
            :params="employeeParams"
          />
        </div>
      </div>
      <div class="operations-sidebar">
        <personnel-list :employee_id="selectedEmployeeId" />
      </div>
    </div>
    <employee-modal :visible="showModal" @close="showModal = false" />
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-layout {
  display: flex;
  flex: 1;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.filter-container {
  display: grid;
  gap: 16px;
  padding: 20px;
  margin: 10px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  flex-shrink: 0;
}

.dept-combined {
  position: relative;
  display: inline-block;
}

.clear-btn-inline {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  background: #f8f9fa;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.clear-btn-inline:hover {
  background: #e9ecef;
}

.radio-group {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.action-buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.employee-content {
  flex: 1;
  padding: 0 10px 10px 10px;
  min-height: 0;
}

.employee-list {
  height: 100%;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.operations-sidebar {
  min-width: 300px;
  background: #f8f9fa;
  border-left: 1px solid #e0e0e0;
  flex-shrink: 0;
  height: 100%;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.05);
}
</style>
