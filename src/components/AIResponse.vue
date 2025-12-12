<script setup lang="ts">
defineProps<{
  response: string
}>()
</script>

<template>
  <div class="box has-background-success-light mt-4">
    <div class="content has-text-left">
      <p>{{ response }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add any custom styles here if needed */
</style>
