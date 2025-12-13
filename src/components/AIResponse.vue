<script setup>
defineProps({
  response: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="box has-background-success-light">
    <div class="content has-text-left">
      <p>{{ response }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Optional: Add any custom styles here if needed */
</style>
