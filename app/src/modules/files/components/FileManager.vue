<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { useFileStore } from '@/modules/files/store';
import BtnBase from '@/components/BtnBase.vue';
import BtnIcon from '@/components/BtnIcon.vue';
import TBoxBase from '@/components/TBoxBase.vue';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const props = defineProps<{
  employeeId: number;
  visible: boolean;
}>();
const fileStore = useFileStore();
const selectedFile = ref<File | null>(null);
const fileName = ref('');
const customName = ref('');
const errors = ref<{ name?: string }>({});
const loadFiles = async () => {
  if (props.employeeId) {
    await fileStore.fetchFiles(props.employeeId);
  }
};

onMounted(loadFiles);
watch(() => props.employeeId, loadFiles);

function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const files = target.files;
  if (!files || files.length === 0) return;
  const file = files[0];
  if (!file) return;
  if (file.type !== 'application/pdf') {
    alert('Можно загружать только PDF файлы');
    return;
  }
  selectedFile.value = file as File;
  fileName.value = file.name;
}

function validate() {
  errors.value = {};
  let isValid = true;
  if (!customName.value.trim() || customName.value.length < 3) {
    errors.value.name = 'Пожалуйста, введите корректное название для файла (минимум 3 символа)';
    isValid = false;
  }
  return isValid;
}

function updateCustomName() {
  if (errors.value.name && customName.value.length > 2) {
    errors.value.name = undefined;
  }
}

const handleUpload = async () => {
  if (!selectedFile.value) return;
  if (!validate()) return;
  const formData = new FormData();
  formData.append('file', selectedFile.value);
  formData.append('name', customName.value.trim());
  formData.append('employee_id', props.employeeId.toString());
  await fileStore.uploadFile(formData);
  selectedFile.value = null;
  fileName.value = '';
  customName.value = '';
  await loadFiles();
};
const handleDownload = async (file: any) => {
  await fileStore.downloadFile(file.id, file.name);
};

const handleDelete = async (file: any) => {
  if (confirm(`Do you want delete "${file.name}"?`)) {
    await fileStore.deleteFile(file.id);
    await loadFiles();
  }
};
const closeModal = () => {
  errors.value = {};
  emit('close');
};
</script>

<template>
  <div v-if="visible" class="modal">
    <div class="modal-content">
      <h3>Файлы сотрудника</h3>
      <div class="input-field">
        <input type="file" @change="handleFileSelect" accept="application/pdf" />
        <span v-if="fileName">{{ fileName }}</span>
      </div>
      <TBoxBase
        v-model="customName"
        placeholder="Введите имя файла"
        class="input-field"
        @update:model-value="updateCustomName"
        :class="{ 'input-error': errors.name }"
      />
      <div v-if="errors.name" class="error-message">{{ errors.name }}</div>
      <BtnBase
        content="Загрузить"
        @click="handleUpload"
        class="add-base-btn"
        :disabled="!selectedFile || fileStore.loading || !customName.trim()"
      />
      <div v-if="fileStore.loading">Загрузка...</div>
      <div v-else>
        <div v-for="file in fileStore.files" :key="file.id" class="row">
          <div>{{ file.name }}</div>
          <div class="actions">
            <BtnIcon @click="handleDownload(file)" class="pi pi-download" />
            <BtnIcon @click="handleDelete(file)" class="pi pi-eraser" />
          </div>
        </div>
      </div>
      <div class="buttons">
        <BtnBase content="Отмена" @click="closeModal" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.input-error {
  border: 1px solid #731919;
}
</style>
