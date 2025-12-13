<script setup lang="ts">
import { watch, ref, onMounted } from 'vue';
import { useEmployeesStore } from '@/modules/employee/store';
import BtnIcon from '@/components/BtnIcon.vue';
import EmployeeModal from '@/modules/employee/components/EmployeeModal.vue';
import { FileManager } from '@/modules/files/components';
import BtnBase from '@/components/BtnBase.vue';
import type { Employee } from '@/modules/employee/types/Employee.ts';

const props = defineProps<{
  params: {
    orgId: number | undefined;
    deptId: number | undefined;
    option: string | undefined;
    nameQuery?: string | undefined;
  };
}>();
const emit = defineEmits<{
  (e: 'select', id: number): void;
}>();

function openModal(id?: number) {
  selectedId.value = id;
  showModal.value = true;
  modalKey.value++;
}

function openFileModal(id: number) {
  selectedId.value = id;
  showFile.value = true;
  fileKey.value++;
}

async function firedTrainees(id: number) {
  await store.deleteEmployee(id);
}

async function loadPage(page: number) {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  await loadEmployees();
}

const employees = ref<Employee[]>([]);

const selectedId = ref<number>();
const showModal = ref(false);
const modalKey = ref(0);

const showFile = ref(false);
const fileKey = ref(0);
const pageSize = ref(10);
const currentPage = ref<number>(1);
const totalPages = ref<number>(0);
const totalEmployee = ref<number>(0);

const store = useEmployeesStore();

const loadEmployees = async () => {
  try {
    if (props.params.option === 'trainees') {
      await store.fetchTrainees({
        name: props.params.nameQuery,
        page: currentPage.value,
        pageSize: pageSize.value,
      });
    } else {
      let deleted = props.params.option === 'deleted' ? true : undefined;
      await store.fetchEmployees({
        organization_id: props.params.orgId,
        department_id: props.params.deptId,
        is_deleted: deleted,
        name: props.params.nameQuery,
        page: currentPage.value,
        pageSize: pageSize.value,
      });
    }

    employees.value = store.employees;
    totalPages.value = store.totalPages;
    totalEmployee.value = store.totalEmployee;
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  loadEmployees();
});

watch(
  () => props.params,
  () => {
    currentPage.value = 1;
    loadEmployees();
  },
);

watch(
  () => store.version,
  () => {
    loadEmployees();
  },
  { deep: true },
);
</script>

<template>
  <div class="employee-list-wrapper">
    <EmployeeModal
      :key="modalKey"
      :id="selectedId"
      :visible="showModal"
      @close="showModal = false"
      @submit="loadEmployees"
    />
    <FileManager
      :employee-id="selectedId!"
      :key="fileKey"
      :visible="showFile"
      @close="showFile = false"
    />
    <div class="container" v-if="employees.length > 0">
      <div
        v-for="employee in employees"
        @click="emit('select', employee.id)"
        :key="employee.id"
        class="row"
      >
        <p>{{ employee.first_name }} {{ employee.last_name }} {{ employee.middle_name }}</p>
        <div class="btn-actions" v-if="props.params.option != 'deleted'">
          <BtnIcon class="pi pi-address-book" @click="openModal(employee.id)" />
          <BtnIcon class="pi pi-paperclip" @click="openFileModal(employee.id)" />
          <BtnIcon
            class="pi pi-trash action-delete"
            v-if="props.params.option == 'trainees'"
            @click="firedTrainees(employee.id)"
          />
        </div>
      </div>
    </div>
    <div v-else class="placeholder">Нет данных для отображения</div>
  </div>
  <div v-if="totalPages > 1" class="pagination">
    <BtnBase content="назад" @click="loadPage(currentPage - 1)" :disabled="currentPage === 1" />
    <span class="page-info">
      Страница {{ currentPage }} из {{ totalPages }} (Всего: {{ totalEmployee }})
    </span>
    <BtnBase
      content="вперед"
      @click="loadPage(currentPage + 1)"
      :disabled="currentPage === totalPages"
    />
  </div>
</template>

<style scoped></style>
