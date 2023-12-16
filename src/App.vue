<script setup lang="ts">
import { RouterView } from 'vue-router';
import Cookies from 'js-cookie';
import { useUserStore } from '@/stores/user';
import { ModalsContainer } from 'vue-final-modal';

const store = useUserStore();

const user = Cookies.get('currentUser');

if (user != null) {
  store.setUser(JSON.parse(user));
  store.setAuth(true);
}
</script>

<template>
  <ModalsContainer />
  <div class="flex flex-col justify-between h-full">
    <RouterView />
    <div class="text-gray-400 text-xs text-center w-full">
      Created with love by Maxim Givanyan ❤️
    </div>
  </div>
</template>
