<script setup lang="ts">
import { RouterView } from 'vue-router';
import { ModalsContainer } from 'vue-final-modal';
</script>

<template>
  <ModalsContainer />
  <div class="flex flex-col justify-between h-full">
    <RouterView />
    <div class="text-gray-400 text-xs text-center w-full">
      Made with love by Maxim Givanyan ❤️
    </div>
  </div>
</template>
