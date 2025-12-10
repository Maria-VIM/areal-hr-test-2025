<script setup lang="ts">
const emit = defineEmits(['click']);
const { content } = defineProps<{
  content: string;
}>();
</script>

<template>
  <button class="base-btn" @click="emit('click')">
    {{ content }}
  </button>
</template>

<style scoped>
.base-btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  margin-right: 5px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-family: 'Helvetica Neue', Arial, sans-serif;
}
.base-btn:hover {
  transform: translateY(-1px);
}
</style>
