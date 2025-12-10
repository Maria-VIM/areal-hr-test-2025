<script setup lang="ts">
defineProps<{ modelValue: string }>();
const emit = defineEmits(['update:modelValue']);

function onInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <textarea class="tarea-base" :value="modelValue" @input="onInput" v-bind="$attrs" />
</template>

<style scoped>
.tarea-base {
  width: 100%;
  padding: 12px 16px;
  resize: vertical;
  border: 1px solid #d8d6e3;
  border-radius: 8px;
  font-size: 14px;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  transition: all 0.2s ease;
  color: #5a5a72;
  margin-bottom: 16px;
  box-sizing: border-box;
}
.tarea-base:focus {
  outline: none;
  border-color: #a8a6b5;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(168, 166, 181, 0.1);
}

.tarea::placeholder {
  color: #9c9ab3;
}
</style>
