<script setup lang="ts">
import type { IUser } from '@/stores/user';
import { AXIOS } from '@/utils';
import { reactive } from 'vue';

const state = reactive<{data: IUser | null}>({
  data: null,
});

async function getData() {
  const res = await AXIOS.get('/me');
  state.data = res.data;
}

getData();
</script>

<template>
  <main>
    <div class="flex flex-col justify-center items-center my-2">
      <div class="text-5xl mb-1">
        #{{ state.data?.id }} {{ state.data?.name }}
        <button @click="getData">
          🔄
        </button>
      </div>
      <div class="text-5xl">
        {{ state.data?.rating }}
      </div>
    </div>
    <nav class="flex flex-row justify-between">
      <router-link
        :to="{name: 'play'}"
        active-class="border border-b-0 border-black"
        class="px-3 py-2">
        Играть
      </router-link>
      <router-link
        :to="{name: 'pending-games'}"
        active-class="border border-b-0 border-black"
        class="px-3 py-2">
        Мои запросы
      </router-link>
      <router-link
        :to="{name: 'history'}"
        active-class="border border-b-0 border-black"
        class="px-3 py-2">
        История
      </router-link>
    </nav>
    <router-view />
  </main>
</template>
