<script setup lang="ts">

defineProps<{ modelValue: string | number}>();
const emit = defineEmits(['update:modelValue']);

function onInput(e: Event) {
  const target = e.target as HTMLInputElement;
  emit('update:modelValue', target.value);
}
</script>

<template>
  <input type="text" class="tbox-base" :value="modelValue" @input="onInput" />
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
