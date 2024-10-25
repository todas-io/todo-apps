<template>
  <Suspense>
    <template #default>
      <Login/>
    </template>
    <template #fallback>
      loading...
    </template>
  </Suspense>

</template>

<script setup>
</script>
