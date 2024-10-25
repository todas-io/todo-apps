<template>
  <Suspense>
    <template #default>
      <Todos />
    </template>
    <template #fallback>
      loading...
    </template>
  </Suspense>
</template>

<script setup>
import Todos from '@/components/Todos.vue';
//
</script>

<route lang="json">{
  "meta": {
    "requiresAuth": true
  }
}</route>