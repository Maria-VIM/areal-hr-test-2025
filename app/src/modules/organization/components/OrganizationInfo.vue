<template>
  <div class="info" v-if="props.id">
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

watch(
  () => store.version,
  () => {
    if (props.id) {
      loadOrganization();
    }
  },
);
</script>

<style scoped></style>
