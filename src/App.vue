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
  <RouterView />
</template>
