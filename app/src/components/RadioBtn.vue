<script setup>
import { computed } from 'vue';
const props = defineProps({
  modelValue: { type: [String, Number, Boolean], default: '' },
  value: { type: [String, Number, Boolean], required: true },
  text: { type: String, default: '' },
});
const emit = defineEmits(['update:modelValue']);
const isChecked = computed(() => props.modelValue === props.value);
const handleChange = () => {
  emit('update:modelValue', props.value);
};
</script>

<template>
  <label class="static-radio">
    <input type="radio" :checked="isChecked" :value="value" @change="handleChange" />
    {{ text }}
  </label>
</template>

<style scoped>
.static-radio input {
  cursor: pointer;
  margin: 0;
}
</style>
