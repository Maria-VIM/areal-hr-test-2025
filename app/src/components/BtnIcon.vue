<template>
  <button class="icon-btn" @click="emit('click')"></button>
</template>

<script setup>
import { defineEmits } from 'vue';

const emit = defineEmits(['click']);
</script>

<style scoped>
.icon-btn {
  background: transparent;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  opacity: 0.8;
}

.icon-btn:hover {
  opacity: 1;
  background: rgba(109, 104, 117, 0.08);
}
</style>
