<script setup lang="ts">
import { OrganizationInfo, OrganizationList } from '@/modules/organization';
import { ref } from 'vue';
import BaseHeader from '@/layouts/BaseHeader.vue';

const selectedId = ref<number | null>(null);
</script>

<template>
  <div class="page">
    <base-header />
    <div class="layout">
      <aside class="sidebar">
        <organization-list @select="selectedId = $event" />
      </aside>
      <main class="content">
        <organization-info v-if="selectedId !== null" :id="selectedId" />
        <div v-else class="placeholder">Выберите организацию для просмотра информации</div>
      </main>
    </div>
  </div>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.layout {
  display: flex;
  flex: 1;
  min-height: 0;
}

.sidebar {
  max-width: 300px;
  min-width: 150px;
  background: #f8f9fa;
  border-right: 1px solid #e0e0e0;
  overflow-y: auto;
  flex-shrink: 0;
}

.content {
  flex: 1;
  background: #ffffff;
  overflow-y: auto;
  min-height: 0;
}

.placeholder {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #6c757d;
  font-size: 16px;
  text-align: center;
}
</style>
