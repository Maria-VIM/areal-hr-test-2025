<template>
  <button class="icon-btn" :class="icon" @click="emit('click')"></button>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  icon: {
    type: String,
    default: 'pi pi-pencil',
  },
});

const emit = defineEmits(['click']);
</script>

<style scoped>
.icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 6px;
}
</style>
