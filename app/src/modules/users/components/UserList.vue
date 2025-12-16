<script setup lang="ts">
import BtnIcon from '@/components/BtnIcon.vue';
import { computed, onMounted, ref, watch } from 'vue';
import { useUsersStore } from '@/modules/users/store';
import BtnBase from '@/components/BtnBase.vue';
import UserModal from '@/modules/users/components/UserModal.vue';

const props = defineProps<{
  role: number;
}>();
const store = useUsersStore();
const showModal = ref(false);
const selectedId = ref<number | null>(null);

const adminUsers = computed(() => {
  return store.users.filter((user) => user.name === 'Администратор');
});

const managerUsers = computed(() => {
  return store.users.filter((user) => user.name === 'Менеджер по персоналу');
});

async function deleteUser(id: number) {
  await store.delete(id);
}

async function activationUserProfile(id: number) {
  await store.activation(id);
}

async function deactivationUserProfile(id: number) {
  await store.deactivation(id);
}

function openModal(id?: number) {
  selectedId.value = id ?? null;
  showModal.value = true;
}
watch(
  () => store.version,
  () => {
    store.fetchUsers();
  },
);

onMounted(() => {
  store.fetchUsers();
});
</script>

<template>
  <div class="container">
    <BtnBase content="Добавить" class="add-base-btn" @click="openModal" v-if="props.role == 1" />
    <div class="columns-container">
      <div class="column">
        <h3>Администраторы</h3>
        <div
          v-for="user in adminUsers"
          :key="user.id"
          class="row"
          :class="{
            deleted: user.deleted_at !== null,
            activation: user.is_active && user.deleted_at === null,
            deactivation: !user.is_active && user.deleted_at === null,
          }"
        >
          <div class="name">
            <p>Имя: {{ user.full_name }}</p>
            <p>Логин: {{ user.login }}</p>
          </div>
          <div class="actions" v-if="user.deleted_at === null && props.role == 1">
            <BtnIcon class="pi pi-pencil action-edit" @click="openModal(user.id)" />
            <BtnIcon class="pi pi-trash action-delete" @click="deleteUser(user.id)" />
            <BtnIcon
              class="pi pi-power-off action-delete"
              @click="deactivationUserProfile(user.id)"
              v-if="user.is_active"
            />
            <BtnIcon
              class="pi pi-power-off action-add"
              @click="activationUserProfile(user.id)"
              v-if="!user.is_active"
            />
          </div>
        </div>
      </div>
      <div class="column">
        <h3>Менеджеры</h3>
        <div
          v-for="user in managerUsers"
          :key="user.id"
          class="row"
          :class="{
            deleted: user.deleted_at !== null,
            activation: user.is_active && user.deleted_at === null,
            deactivation: !user.is_active && user.deleted_at === null,
          }"
        >
          <div class="name">
            <p>Имя: {{ user.full_name }}</p>
            <p>Логин: {{ user.login }}</p>
          </div>
          <div class="actions" v-if="user.deleted_at === null && props.role == 1">
            <BtnIcon class="pi pi-pencil action-edit" @click="openModal(user.id)" />
            <BtnIcon class="pi pi-trash action-delete" @click="deleteUser(user.id)" />
            <BtnIcon
              class="pi pi-power-off action-delete"
              @click="deactivationUserProfile(user.id)"
              v-if="user.is_active"
            />
            <BtnIcon
              class="pi pi-power-off action-add"
              @click="activationUserProfile(user.id)"
              v-if="!user.is_active"
            />
          </div>
        </div>
      </div>
    </div>
    <user-modal
      :id="selectedId"
      :visible="showModal"
      @close="
        showModal = false;
        selectedId = null;
      "
    />
  </div>
</template>

<style scoped>
.columns-container {
  display: flex;
  gap: 20px;
}
.column {
  flex: 1;
  min-width: 0;
}

h3 {
  text-align: center;
  color: #424242;
}
</style>
