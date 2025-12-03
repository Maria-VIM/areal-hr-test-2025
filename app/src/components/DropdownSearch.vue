<template>
  <div class="dropdown-search">
    <input
      v-model="searchText"
      @input="onInput"
      @focus="showDropdown = true"
      @blur="onBlur"
      type="text"
      class="dropdown-input"
      :placeholder="placeholder"
    />

    <div v-if="showDropdown && filteredOptions.length > 0" class="dropdown-list">
      <div
        v-for="option in filteredOptions"
        :key="option.value"
        @mousedown="selectOption(option)"
        class="dropdown-item"
      >
        {{ option.label }}
      </div>
    </div>

    <div v-if="showDropdown && filteredOptions.length === 0" class="dropdown-list">
      <div class="dropdown-item no-results">Ничего не найдено</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

const props = defineProps({
  options: {
    type: Array,
    required: true,
    default: () => [],
  },
  placeholder: {
    type: String,
    default: 'Выберите опцию...',
  },
  modelValue: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['update:modelValue', 'select']);

const searchText = ref('');
const showDropdown = ref(false);

watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      searchText.value = newValue.label;
    } else {
      searchText.value = '';
    }
  },
  { immediate: true },
);

const filteredOptions = computed(() => {
  if (!searchText.value) {
    return props.options;
  }

  const searchLower = searchText.value.toLowerCase();
  return props.options.filter((option) => option.label.toLowerCase().includes(searchLower));
});

const onInput = () => {
  showDropdown.value = true;
};

const onBlur = () => {
  setTimeout(() => {
    showDropdown.value = false;
  }, 200);
};

const selectOption = (option) => {
  searchText.value = option.label;
  showDropdown.value = false;
  emit('update:modelValue', option);
  emit('select', option);
};
</script>

<style scoped>
.dropdown-search {
  position: relative;
  width: 100%;
}

.dropdown-input {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
  box-sizing: border-box;
  outline: none;
}

.dropdown-list {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-height: 200px;
  overflow-y: auto;
  z-index: 1000;
}

.dropdown-item {
  padding: 8px 12px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background-color: #f5f5f5;
}

.dropdown-item.no-results {
  color: #999;
  cursor: default;
}

.dropdown-item.no-results:hover {
  background-color: transparent;
}
</style>
