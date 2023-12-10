<script setup lang="ts">
import router from '@/router';
import { AXIOS } from '@/utils';
import { reactive } from 'vue';
import type { IGame } from '@/views/GameView.vue';
import { useUserStore } from '@/stores/user';

const store = useUserStore();

const state = reactive<{data: Array<IGame>}>({
  data: [],
});

async function getData() {
  const res = await AXIOS.get('/games/history');
  state.data = res.data;
}

getData();
</script>

<template>
  <ol>
    <li
      v-for="game in state.data"
      :key="`${game.id}-game`">
      <component
        :is="player.isWinner ? 'strong' : 'span'"
        v-for="player in game.members"
        :key="`${player.id}-player`"
        @click="router.push({name: 'history-game', params: {id: game.id}})">
        {{ player.name }},&nbsp;
      </component>
    </li>
  </ol>
  <RouterView />
</template>
