<script setup lang="ts">
import router from '@/router';
import { AXIOS } from '@/utils';
import { reactive } from 'vue';
import type { IUser } from '@/stores/user';
import { useRoute } from 'vue-router';

const route = useRoute();

const state = reactive<{data: Array<{id: string, members: IUser[]}>}>({
  data: [],
});

async function getData() {
  const res = await AXIOS.get('/games/pending');
  state.data = res.data;
}

getData();
</script>

<template>
  <div class="border-l border-black">
    <div class="border border-black border-l-0 rounded-2xl rounded-l-none p-3">
      <button @click="getData">
        🔄
      </button>
      <ul
        v-if="state.data.length > 0"
        class="flex flex-col gap-1">
        <template
          v-for="el in state.data"
          :key="`${el.id}-game`">
          <li
            class="flex flex-row flex-wrap gap-1 bg-sky-100 rounded-2xl px-3 py-2"
            :class="{'bg-sky-700': route.params?.id === el.id}"
            @click="router.push({name: 'game', params: {id: el.id}})">
            <span
              v-for="user in el.members"
              :key="`${user.id}-user`"
              class="px-4 py-1 bg-sky-200 rounded-2xl">
              {{ user.name }}
            </span>
          </li>
        </template>
      </ul>
      <div
        v-else
        class="flex flex-col justify-center text-center text-xl h-[20vh]">
        У вас нет незавершенных игр
      </div>
    </div>
    <RouterView />
  </div>
</template>
