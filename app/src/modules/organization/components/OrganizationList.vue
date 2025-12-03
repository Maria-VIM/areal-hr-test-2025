<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
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

watch(
  () => store.version,
  () => {
    store.fetchOrganizations();
  },
);

onMounted(() => {
  store.fetchOrganizations();
});
</script>

<template>
  <div class="container">
    <BtnIcon class="btn-add pi pi-plus" @click="openModal()" />
    <div
      v-for="org in store.organizations"
      :key="org.id"
      @click="emit('select', org.id)"
      class="row"
      :class="{ deleted: org.deleted_at !== null }"
    >
      <div class="name">
        {{ org.name }}
      </div>
      <div class="actions" v-if="org.deleted_at === null">
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

<style scoped></style>
