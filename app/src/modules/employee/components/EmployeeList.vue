<script setup lang="ts">
import { watch, ref, defineProps, computed } from 'vue';
import { useEmployeesStore } from '@/modules/employee/store';
import BtnIcon from '@/components/BtnIcon.vue';
import EmployeeModal from '@/modules/employee/components/EmployeeModal.vue';
import { FileManager } from '@/modules/files/components';

interface FilterParams {
  orgId: number | null;
  deptId: number | null;
  option: string | null;
  nameQuery: string | null;
}
const props = defineProps<{
  params: FilterParams;
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
  await fetchEmployees();
}

const selectedId = ref<number>();
const employees = computed(() => [...store.employees]);
const showModal = ref(false);
const modalKey = ref(0);

const showFile = ref(false);
const fileKey = ref(0);

const store = useEmployeesStore();

const fetchEmployees = async () => {
  const { orgId, deptId, option, nameQuery } = props.params;
  try {
    if (deptId != null) {
      await store.fetchEmployeeByDepartment(deptId);
    } else if (nameQuery != null) {
      await store.fetchEmployeeByName(nameQuery);
    } else if (orgId != null) {
      await store.fetchEmployeesByOrganization(orgId);
    } else if (option === 'trainees') {
      await store.fetchTrainees();
    } else if (option === 'deleted') {
      await store.fetchDeletedEmployee();
    } else {
      store.employees = [];
    }
  } catch (error) {
    console.error(error);
  }
};
watch(
  () => props.params,
  () => {
    fetchEmployees();
  },
  { deep: true },
);

watch(
  () => store.version,
  () => {
    fetchEmployees();
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
      @submit="fetchEmployees"
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
</template>

<style scoped></style>
