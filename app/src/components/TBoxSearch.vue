<script setup lang="ts">
import { ref } from 'vue';

const emit = defineEmits<{
  (e: 'search', value: string | null): void;
}>();
const search = ref('');
function doSearch() {
  emit('search', search.value || null);
}
</script>

<template>
  <input class="tbox-base" v-model="search" @input="doSearch" />
</template>

<style scoped>
.tbox-base {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #d8d6e3;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  transition: all 0.2s ease;
  color: #5a5a72;
  margin-bottom: 16px;
  box-sizing: border-box;
}
.tbox-base:focus {
  outline: none;
  border-color: #a8a6b5;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(168, 166, 181, 0.1);
}

.tbox-base::placeholder {
  color: #9c9ab3;
}
</style>
