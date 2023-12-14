<script setup lang="ts">
import router from '@/router';
import { AXIOS, Results } from '@/utils';
import type { IPlayer, IGame } from '@/utils';
import { reactive } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRoute } from 'vue-router';

const store = useUserStore();

const state = reactive<{data: Array<IGame>}>({
  data: [],
});

async function getData() {
  const res = await AXIOS.get('/games/history');
  state.data = res.data;
}

const route = useRoute();

function getDelta(game: IGame): string {
  const player = game.members.find((el: IPlayer) => el.id === store.userId)!;

  return player.isWinner ? `+${player.delta}` : `-${player.delta}`;
}

function isWinner(game: IGame): boolean {
  const player = game.members.find((el) => el.id === store.userId)!;

  return Boolean(player.isWinner);
}

getData();
</script>

<template>
  <div class="border-l border-black rounded-tl-2xl">
    <div class="border border-black border-l-0 rounded-2xl rounded-tr-none rounded-bl-none p-3">
      <button @click="getData">
        🔄
      </button>
      <ul
        v-if="state.data.length > 0"
        class="flex flex-col gap-1">
        <li
          v-for="game in state.data"
          :key="`${game.id}-game`"
          class="flex flex-row flex-wrap gap-1 bg-sky-100 rounded-2xl px-3 py-2"
          :class="{'bg-sky-700': route.params?.id === game.id}"
          @click="router.push({name: 'history-game', params: {id: game.id}})">
          <span
            v-for="player in game.members"
            :key="`${player.id}-player`"
            class="px-4 py-1 bg-sky-200 rounded-2xl"
            :class="{'bg-green-400': player.isWinner}">
            {{ player.name }}
          </span>
          <span
            v-if="game.result?.value === Results.WIN"
            class="px-4 py-1 rounded-2xl"
            :class="{'bg-red-400': !isWinner(game), 'bg-green-400': isWinner(game)}">
            {{ getDelta(game) }}
          </span>
        </li>
      </ul>
      <div
        v-else
        class="flex flex-col justify-center text-center text-xl h-[20vh]">
        У вас нет сыгранных игр
      </div>
    </div>
    <RouterView />
  </div>
</template>
