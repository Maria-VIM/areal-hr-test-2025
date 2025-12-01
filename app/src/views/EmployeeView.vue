<script setup lang="ts">
import { ref, computed } from 'vue';
import { OrganizationDropdown } from '@/modules/organization';
import BaseHeader from '@/layouts/BaseHeader.vue';
import BtnBase from '@/components/BtnBase.vue';
import { DepartmentDropdown } from '@/modules/departments';
import RadioBtn from '@/components/RadioBtn.vue';
import { EmployeeList } from '@/modules/employee';

const selectedOption = ref<string | null>(null);
const selectedOrgId = ref<number | null>(null);
const selectedDeptId = ref<number | null>(null);

const searchParams = ref({
  orgId: null as number | null,
  deptId: null as number | null,
  option: null as string | null,
});

const onOrgSelected = (orgId: number | null) => {
  if (orgId !== null && selectedOption.value !== null) {
    selectedOption.value = null;
  }
  selectedOrgId.value = orgId;
};

const onOptionSelected = (option: string | null) => {
  if (option !== null && selectedOrgId.value !== null) {
    selectedOrgId.value = null;
    selectedDeptId.value = null;
  }
  selectedOption.value = option;
};

const onDeptSelected = (deptId: number | null) => {
  selectedDeptId.value = deptId;
};

const handleSearch = () => {
  searchParams.value = {
    orgId: selectedOrgId.value,
    deptId: selectedDeptId.value,
    option: selectedOption.value,
  };
};

const employeeParams = computed(() => searchParams.value);
</script>

<template>
  <div class="page">
    <base-header />
    <div class="filter-container">
      <organization-dropdown :model-value="selectedOrgId" @update:model-value="onOrgSelected" />
      <department-dropdown
        :model-value="selectedDeptId"
        @update:model-value="onDeptSelected"
        v-if="selectedOrgId"
        :organization_id="selectedOrgId"
      />
      <div class="radio-group">
        <radio-btn
          text="Стажеры"
          value="trainees"
          :model-value="selectedOption"
          @update:model-value="onOptionSelected"
        />
        <radio-btn
          text="Уволенные сотрудники/стажеры"
          value="deleted"
          :model-value="selectedOption"
          @update:model-value="onOptionSelected"
        />
      </div>
      <btn-base content="Найти" class="search-btn" @click="handleSearch" />
      <employee-list :params="employeeParams" />
    </div>
  </div>
</template>

<style scoped>
.filter-container {
  display: grid;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 8px;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.search-btn {
  width: 100%;
}
</style>
