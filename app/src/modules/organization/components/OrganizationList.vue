<template>
  <div class="container">
    <BtnIcon class="btn-add pi pi-plus" @click="openModal()" />
    <div
      v-for="org in store.organizations"
      :key="org.id"
      @click="emit('select', org.id)"
      class="org-row"
      :class="{ deleted: org.deleted_at !== null }"
    >
      <div class="org-name">
        {{ org.name }}
      </div>
      <div class="org-actions" v-if="org.deleted_at === null">
        <BtnIcon class="pi pi-pencil action-edit" @click="openModal(org.id)" />
        <BtnIcon class="pi pi-trash action-delete" @click="deleteOrg(org.id)" />
      </div>

      <BtnIcon v-else class="pi pi-refresh action-restore" @click="restoreOrg(org.id)" />
    </div>
    <OrganizationModal
      :id="selectedId"
      :visible="showModal"
      @close="
        showModal = false;
        selectedId = null;
      "
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useOrganizationStore } from '../store/index.ts';
import OrganizationModal from './OrganizationModal.vue';
import BtnIcon from '@/components/BtnIcon.vue';

const store = useOrganizationStore();
const showModal = ref(false);
const selectedId = ref<number | null>(null);
const emit = defineEmits<{
  (e: 'select', id: number): void;
}>();
function openModal(id?: number) {
  selectedId.value = id ?? null;
  showModal.value = true;
}

async function deleteOrg(id: number): Promise<void> {
  await store.deleteOrganization(id);
}

async function restoreOrg(id: number): Promise<void> {
  await store.restoreOrganization(id);
}

onMounted(() => {
  store.fetchOrganizations();
});
</script>

<style scoped>
.container {
  min-height: 100vh;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}

.btn-add {
  background: #ffffff;
  color: #6d6875;
  padding: 10px 24px;
  border: 1px solid #d8d8d8;
  font-weight: 500;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 5px;
}

.org-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  margin-top: 8px;
  background: #ffffff;
  border: 1px solid #f0f0f0;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.org-row:hover {
  background: #f8f8f8;
  border-color: #e0e0e0;
}

.org-row.deleted {
  background: #f7f7f7;
  color: #8d8d8d;
}

.org-name {
  font-weight: 400;
  cursor: pointer;
  color: #424242;
  font-size: 14px;
  transition: color 0.2s ease;
}

.org-name:hover {
  color: #6d6875;
}

.org-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.action-edit {
  color: #6d6875;
}

.action-delete {
  color: #b5838d;
}

.action-restore {
  color: #83b583;
}
</style>
