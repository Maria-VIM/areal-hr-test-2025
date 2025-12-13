<script setup lang="ts">
import BaseHeader from '@/layouts/BaseHeader.vue';
import { UserList } from '@/modules/users';
</script>

<template>
  <div class="page">
    <base-header />
    <div class="layout">
      <user-list />
    </div>
  </div>
</template>

<style scoped></style>
