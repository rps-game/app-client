<script setup lang="ts">
import router from '@/router';
</script>

<template>
  <button @click="router.push({name: 'new-game'})">
    Начать
  </button>
  <RouterView />
</template>
