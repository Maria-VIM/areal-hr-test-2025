<script setup lang="ts">
import { useHistoryStore } from '@/modules/history/store';
import { watch } from 'vue';
import BtnBase from '@/components/BtnBase.vue';
import { useGeneralStore } from '@/store';

function safeParse(value: any) {
  if (typeof value === 'object') {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch (e) {
    console.log('Не удалось распарсить JSON:', value);
    return {};
  }
}

function formatChanges(oldValues: any, newValues: any) {
  const oldObj = safeParse(oldValues);
  const newObj = safeParse(newValues);

  return Object.keys(newObj).map((key) => ({
    field: key,
    old: oldObj[key] ?? '—',
    new: newObj[key] ?? '—',
  }));
}
const props = defineProps<{
  visible: boolean;
  entity: string;
  id: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

function cancel() {
  store.history = [];
  emit('close');
}
const store = useHistoryStore();
const generalStore = useGeneralStore();
const formatDate = generalStore.formatDate;

watch(
  () => [props.entity, props.id],
  () => {
    store.fetchHistory(props.entity, props.id);
  },
  { immediate: true },
);

watch(
  () => props.visible && props.id > 0,
  (shouldLoad) => {
    if (shouldLoad) {
      store.fetchHistory(props.entity, props.id);
    }
  },
  { immediate: true },
);
</script>

<template>
  <div class="modal" v-if="props.visible">
    <div class="modal-content-history">
      <div v-for="history in store.history" :key="history.id" class="row">
        <div class="name">
          <div class="changes">
            <div
              v-for="change in formatChanges(history.old_values, history.new_values)"
              :key="change.field"
            >
              <strong>{{ change.field }}: </strong>
              <span class="old">{{ change.old }}</span>
              :
              <span class="new">{{ change.new }}</span>
            </div>
          </div>
          <p>{{ history.fio }}</p>
          <p>Дата изменения: {{ formatDate(history.created_at) }}</p>
        </div>
      </div>
      <div v-if="store.history.length == 0">
        <div class="placeholder">Элемент не изменялся</div>
      </div>
      <div class="buttons">
        <BtnBase content="Закрыть" @click="cancel" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.old {
  color: #999;
  text-decoration: line-through;
}

.new {
  color: #407840;
  font-weight: 500;
}
</style>
