<template>
  <div class="organization-info" v-if="props.id">
    <div class="header" @click="toggleCollapse">
      <h4>{{ organization?.name ?? 'Loading...' }}</h4>
    </div>
    <div v-if="!collapsed && organization" class="content">
      <div class="info-item">
        <span class="label">Name:</span>
        <span class="value">{{ organization.name }}</span>
      </div>
      <div class="info-item">
        <span class="label">Comment:</span>
        <span class="value">{{ organization.comment }}</span>
      </div>
      <div class="info-item">
        <span class="label">Status:</span>
        <span class="value" :class="{ deleted: organization.deleted_at }">
          {{ organization.deleted_at ? 'Deleted' : 'Active' }}
        </span>
      </div>
      <div class="info-item">
        <span class="label">Created:</span>
        <span class="value">{{ formatDate(organization.created_at) }}</span>
      </div>
      <div class="info-item" v-if="organization.updated_at">
        <span class="label">Updated:</span>
        <span class="value">{{ formatDate(organization.updated_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, defineProps } from 'vue';
import { useOrganizationStore } from '../store';
import { useGeneralStore } from '@/store';
import type { Organization } from '../types/Organization.ts';

const props = defineProps<{
  id?: number | null;
}>();

const store = useOrganizationStore();
const generalStore = useGeneralStore();
const organization = ref<Organization | null>(null);
const collapsed = ref(false);

async function loadOrganization() {
  if (!props.id) {
    organization.value = null;
    return;
  }
  organization.value = await store.getOrganizationById(props.id);
}

const formatDate = generalStore.formatDate;

function toggleCollapse() {
  collapsed.value = !collapsed.value;
}

watch(
  () => props.id,
  (newId) => {
    if (newId != null) {
      loadOrganization();
    } else {
      organization.value = null;
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.organization-info {
  background: #ffffff;
  border-radius: 4px;
  transition: all 0.2s ease;
  overflow: hidden;
}

.organization-info:hover {
  background: #f8f8f8;
  border-color: #e0e0e0;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.header:hover {
  background: #f5f5f5;
}

h4 {
  font-weight: 400;
  color: #424242;
  font-size: 14px;
  margin: 0;
  transition: color 0.2s ease;
}

.header:hover h4 {
  color: #6d6875;
}

.content {
  padding: 0 20px 16px 20px;
  border-top: 1px solid #f0f0f0;
}

.info-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f8f8f8;
}

.info-item:last-child {
  border-bottom: none;
}

.label {
  font-weight: 500;
  color: #6d6875;
  font-size: 13px;
  min-width: 80px;
  flex-shrink: 0;
}

.value {
  color: #424242;
  font-size: 13px;
  flex: 1;
}

.value.deleted {
  color: #b5838d;
}

.content {
  animation: fadeIn 0.2s ease;
}

.organization-info.deleted {
  background: #f7f7f7;
  color: #8d8d8d;
}

.organization-info.deleted .value {
  color: #8d8d8d;
}
</style>
