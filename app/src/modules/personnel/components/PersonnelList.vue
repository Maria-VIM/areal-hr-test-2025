<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { watch, ref } from 'vue';
import { usePersonnelStore } from '@/modules/personnel/store';
import BtnIcon from '@/components/BtnIcon.vue';
import PersonnelModal from '@/modules/personnel/components/PersonnelModal.vue';

const props = defineProps<{
  employee_id?: number;
}>();

const store = usePersonnelStore();
const { operations } = storeToRefs(store);

async function loadPersonnelList(employee_id?: number) {
  if (employee_id) {
    await store.fetchPersonnelList(employee_id);
  }
}
const showModal = ref(false);
const selectedId = ref<number | null>(null);
function openModal(id?: number) {
  selectedId.value = id ?? null;
  showModal.value = true;
}

async function deletePersonnel(id: number) {
  await store.deletePersonnelOperation(id);
}

watch(
  () => props.employee_id,
  (newId) => {
    if (newId !== undefined) {
      loadPersonnelList(newId);
    }
  },
);

watch(
  () => store.version,
  () => {
    loadPersonnelList(props.employee_id);
  },
  { deep: true },
);
</script>

<template>
  <div class="container">
    <div v-if="employee_id">
      <BtnIcon class="btn-add pi pi-plus" @click="openModal()" />
      <PersonnelModal
        :id="selectedId"
        :employee_id="employee_id"
        :visible="showModal"
        @close="
          showModal = false;
          selectedId = null;
        "
      />
      <div v-if="operations && operations.length > 0">
        <div
          v-for="operation in operations"
          :key="operation.id"
          class="row"
          :class="{ deleted: operation.dismissal_date !== null }"
        >
          <div class="name">
            <div>{{ operation.organization }}</div>
            <div>{{ operation.department }}</div>
            <div>{{ operation.job }}, {{ operation.salary }}</div>
          </div>
          <div class="actions" v-if="operation.dismissal_date == null">
            <BtnIcon class="pi pi-pencil action-edit" @click="openModal(operation.id)" />
            <BtnIcon class="pi pi-trash action-delete" @click="deletePersonnel(operation.id)" />
          </div>
        </div>
      </div>
      <div v-else class="placeholder">
        <p>No operations found</p>
      </div>
    </div>
    <div v-else class="placeholder">
      <p>Search empty</p>
    </div>
  </div>
</template>

<style scoped></style>
