<script setup lang="ts">
import { AXIOS } from '@/utils';
import { reactive, onBeforeUnmount, computed, watch } from 'vue';
import type { ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const store = useUserStore();

export interface IPlayer {
  id: string
  name: string;
  isWinner?: boolean;
  delta?: number;
  choice?: number;
}

enum Results {
  TIE='tie',
  WIN='win',
  LOSE='lose',
  STALEMATE='stalemate',
}

enum RPSLS {
  ROCK = 1,
  PAPER = 2,
  SCISSORS = 3,
  LIZARD = 4,
  SPOCK = 5
}

const hasSelect: ComputedRef<RPSLS | undefined> = computed(() => state.game.members.find(m => m.id === store.user?.id)?.choice);
const noWinner: ComputedRef<boolean> = computed(() => {
  if (!state.game.result?.value) {
    return false;
  }

  return state.game.result.value === Results.STALEMATE ||
      state.game.result.value === Results.TIE;
});

export interface IGame {
  id: string;
  members: IPlayer[];
  result?: {
    value: Results,
    choice: number | number[]
  };
}
const state = reactive<{game: IGame, select: RPSLS | null, error: string}>({
  game: {
    id: '',
    members: [],
  },
  select: null,
  error: '',
});

let interval: any;
watch(route, (r) => {
  if (!r) {
    return;
  }

  if (typeof r.params.id === 'string') {
    if (interval != null) {
      clearInterval(interval);
    }
    interval = setInterval(getData.bind(this, r.params.id), 3000);
    getData(r.params.id);
  }
}, { immediate:true });

async function getData(gameId: string) {
  const game = await AXIOS.get<IGame>(`/games/${gameId}`);
  state.game = game.data;
  if (game.data.members.every(el => !!el.choice)) {
    clearInterval(interval);
  }
}

const map = {
  [RPSLS.ROCK]: { emoji: '🗿', text: 'ROCK' },
  [RPSLS.PAPER]: { emoji: '🧻', text: 'PAPER' },
  [RPSLS.SCISSORS]: { emoji: '✂️', text: 'SCISSORS' },
  [RPSLS.LIZARD]: { emoji: '🦎', text: 'LIZARD' },
  [RPSLS.SPOCK]: { emoji: '🖖', text: 'SPOCK' },
};

onBeforeUnmount(() => {
  clearInterval(interval);
});

function getUserState(v?: RPSLS, delta?: number) {
  if (state.game.result && v) {
    if (state.game.result.value === Results.WIN) {
      return v === state.game.result.choice ? `${map[v].emoji} +${delta} 👑` : `${map[v!].emoji} -${delta} 🤡`;
    } else {
      return `🤡 - ${map[v].emoji}`;
    }
  } else {
    return v ? '✅' : '🎲';
  }
}

async function upGame(v: RPSLS, gameId: string) {
  const game = await AXIOS.put<IGame>(`/games/${gameId}`, { choice: v });
  state.game = game.data;
  state.select = v;
}

async function replay() {
  try {
    const res = await AXIOS.post<IGame>('/games', {
      members: state.game.members.map(({ id }) => ({ id })),
      notRaise: true,
    });

    await router.push({ name: 'game', params: { id: res.data.id }});
  } catch (e: any) {
    if (typeof e.response?.data.message === 'string') {
      state.error = e.response?.data.message;
    }
    console.error(e);
  }
}
</script>

<template>
  <div>
<!--    <button-->
<!--      @click="router.back()">-->
<!--      back-->
<!--    </button>-->
    <template v-if="state.game.id">
      <ul>
        <li
          v-for="u in state.game.members"
          :key="`${u.id}-user`">
          {{ u.name }} {{ getUserState(u.choice, u.delta) }}
        </li>
      </ul>
      <div class="flex flex-col">
        <button
          v-for="(v,k) in map"
          :key="`${k}-rpsls`"
          :disabled="Boolean(hasSelect || state.game.result)"
          @click="upGame(k, state.game.id)">
          {{ v.text }} {{ v.emoji }}
        </button>
      </div>
    </template>
    <div v-if="noWinner">
      <button @click="replay">
        Replay
      </button>
    </div>
  </div>
</template>
