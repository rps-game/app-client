<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import type { IUser } from '@/stores/user';
import { AXIOS } from '@/utils';
import { reactive } from 'vue';

const store = useUserStore();
const state = reactive<{data: IUser | null}>({
  data: null,
});

async function getData() {
  const res = await AXIOS.get(`/users/${store.userId}`);
  state.data = res.data;
}

getData();
</script>

<template>
  <main>
    <div>
      #{{ state.data?.id }} {{ state.data?.name }}
      <button @click="getData">
        🔄
      </button>
    </div>
    <div>
      {{ state.data?.rating }}
    </div>
    <nav class="nav">
      <router-link :to="{name: 'play'}">
        Играть
      </router-link>
      <router-link :to="{name: 'pending-games'}">
        Мои запросы
      </router-link>
      <router-link :to="{name: 'history'}">
        История
      </router-link>
    </nav>
    <router-view />
  </main>
</template>

<style scoped>
.nav {
  display: flex;
  justify-content: space-between;
}
</style>
