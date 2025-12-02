<script setup lang="ts">
import { ref } from 'vue';
import BaseHeader from '@/layouts/BaseHeader.vue';
import { JobList } from '@/modules/job';
import TBoxSearch from '@/components/TBoxSearch.vue';

const searchQuery = ref<string | null>('');

function onSearch(value: string | null) {
  searchQuery.value = value;
}
</script>

<template>
  <div class="page">
    <base-header />
    <div class="layout">
      <TBoxSearch class="search" @search="onSearch" />
      <job-list :name="searchQuery" />
    </div>
  </div>
</template>

<style scoped>
.layout {
  margin-top: 5px;
}

.search {
  margin: 5px;
}
</style>
