<script setup lang="ts">
import { AXIOS, emojiRPSLS, RPSLS } from '@/utils';
import type { Sign, Stats } from '@/utils';
import type { IUser } from '@/stores/user';
import { reactive, onBeforeUnmount } from 'vue';

const state = reactive<{
  stats: Stats | null,
  data: Array<IUser>
}>({
  stats: null,
  data: [],
});

const
  interval = setInterval(() => {
    void getUsers();
    void getStats();
  }, 10000);

async function getUsers() {
  const res = await AXIOS.get<IUser[]>('/users', { params: {
    limit: 50,
  }});

  state.data = res.data;
}

async function getStats() {
  const res = await AXIOS.get<Stats>('/games/stats');

  state.stats = res.data;
  console.log(state.stats);
}
onBeforeUnmount(() => {
  clearInterval(interval);
});

function getSign(v: RPSLS): Sign {
  if (state.stats == null) {
    throw Error('No stats');
  }

  return state.stats.signs.find(el => el._id == v) ?? {
    _id: v,
    count: 0,
    countWin: 0,
    winRate: 0,
  };
}

void getUsers();
void getStats();
</script>

<template>
  <div class="flex gap-2 w-full">
    <table
      v-if="state.data.length > 0"
      class="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <td class="px-3 py-2 text-center">
            #
          </td>
          <td class="px-3 py-2 text-center">
            id
          </td>
          <td class="px-3 py-2 w-[300px]">
            name
          </td>
          <td class="px-3 py-2 w-[80px]">
            rating
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(el, idx) in state.data.slice(0, 25)"
          :key="`${el.id}-list`"
          class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
          <td class="px-3 py-2 text-center">
            {{ idx + 1 }}
          </td>
          <td class="px-3 py-2 text-center">
            {{ el.id }}
          </td>
          <td class="px-3 py-2 whitespace-nowrap text-ellipsis overflow-hidden max-w-[300px]">
            {{ el.name }}
          </td>
          <td class="px-3 py-2">
            {{ el.rating }}
          </td>
        </tr>
      </tbody>
    </table>
    <table
      v-if="state.data.length > 25"
      class="text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <td class="px-3 py-2 text-center">
            #
          </td>
          <td class="px-3 py-2 text-center">
            id
          </td>
          <td class="px-3 py-2 w-[300px]">
            name
          </td>
          <td class="px-3 py-2 w-[80px]">
            rating
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(el, idx) in state.data.slice(25, 50)"
          :key="`${el.id}-list`"
          class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
          <td class="px-3 py-2 text-center">
            {{ idx + 25 }}
          </td>
          <td class="px-3 py-2 text-center">
            {{ el.id }}
          </td>
          <td class="px-3 py-2 whitespace-nowrap text-ellipsis overflow-hidden max-w-[300px]">
            {{ el.name }}
          </td>
          <td class="px-3 py-2">
            {{ el.rating }}
          </td>
        </tr>
      </tbody>
    </table>
    <div
      class="flex-auto"
      v-if="state.stats">
      <div class="grid grid-rows-2 grid-cols-3 border border-black">
        <div class="border-r border-b border-black text-center p-2 font-thin text-3xl">
          Игр сыграно
        </div>
        <div class="border-r border-b border-black text-center p-2 font-thin text-3xl">
          Победных
        </div>
        <div class="border-b border-black text-center p-2 font-thin text-3xl">
          Ничей
        </div>
        <div class="border-r border-black text-center p-2 font-thin text-3xl">
          {{ state.stats.winCount + state.stats.tieCount }}
        </div>
        <div class="border-r border-black text-center p-2 font-thin text-3xl">
          {{ state.stats.winCount }}
        </div>
        <div class="text-center p-2 font-thin text-3xl">
          {{ state.stats.tieCount }}
        </div>
      </div>
      <div class="grid grid-cols-10 col-span-12 gap-2 mt-3">
        <div
          v-for="(v, k) in emojiRPSLS"
          :key="k"
          class="grid grid-cols-2 grid-rows-3 col-span-2 border border-black text-center">
          <div
            class="row-span-2 col-span-2 text-6xl p-3 border-b border-black">
            {{ v.emoji }}
          </div>
          <div class="font-thin text-xl border-r border-black flex items-center justify-center">
            {{ getSign(k).count }}
          </div>
          <div class="font-thin text-xl flex items-center justify-center">
            {{ getSign(k).winRate }}%
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
