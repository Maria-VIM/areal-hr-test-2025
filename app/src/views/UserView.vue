<script setup lang="ts">
import BaseHeader from '@/layouts/BaseHeader.vue';
import { UserList } from '@/modules/users';
import { inject } from 'vue';

const userRole: number | undefined = inject('userRole');
</script>

<template>
  <div class="page">
    <base-header />
    <div class="layout">
      <user-list :role="userRole!" />
    </div>
  </div>
</template>

<style scoped></style>
