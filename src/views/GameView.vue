<script setup lang="ts">
import { AXIOS, emojiRPSLS, Results, RPSLS } from '@/utils';
import type { IGame } from '@/utils';
import { reactive, onBeforeUnmount, computed, watch, onMounted } from 'vue';
import type { ComputedRef } from 'vue';
import { useRoute } from 'vue-router';
import router from '@/router';
import { useUserStore } from '@/stores/user';
import BModal from '@/components/base/BModal/BModal.vue';
import { useVfm } from 'vue-final-modal';

const route = useRoute();
const store = useUserStore();
const modalId = Symbol('game-modal');
const vfm = useVfm();

const userSelect: ComputedRef<RPSLS | undefined> = computed(() => state.game.members.find(m => m.id === store.userId)?.choice);

const noWinner: ComputedRef<boolean> = computed(() => {
  if (!state.game.result?.value) {
    return false;
  }

  return state.game.result.value === Results.STALEMATE ||
      state.game.result.value === Results.TIE;
});

const state = reactive<{game: IGame, select: RPSLS | null, error: string}>({
  game: {
    id: '',
    members: [],
  },
  select: null,
  error: '',
});

let interval: any;

const onCloseRoute = computed(() => route.name === 'history-game' ? 'history' : 'pending-games');

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

onBeforeUnmount(() => {
  clearInterval(interval);
});

function getUserState(v?: RPSLS, delta?: number) {
  if (state.game.result && v) {
    if (state.game.result.value === Results.WIN) {
      return v === state.game.result.choice ? `${emojiRPSLS[v].emoji} +${delta} 👑` : `${emojiRPSLS[v!].emoji} -${delta} 🤡`;
    } else {
      return `🤡 - ${emojiRPSLS[v].emoji}`;
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
      members: state.game.members
        .filter(({ id }) => store.userId !== id)
        .map(({ id }) => ({ id })),
    });

    await router.push({ name: 'game', params: { id: res.data.id }});
  } catch (e: any) {
    if (typeof e.response?.data.message === 'string') {
      state.error = e.response?.data.message;
    }
    console.error(e);
  }
}

onMounted(() => {
  vfm.open(modalId);
});
</script>

<template>
  <BModal
    :display-directive="'visible'"
    :modal-id="modalId"
    @closed="router.push({name: onCloseRoute})">
    <template v-if="state.game.id">
      <ul class="flex flex-row gap-2 mb-3 flex-wrap">
        <li
          v-for="u in state.game.members"
          :key="`${u.id}-user`"
          class="bg-sky-100 rounded-2xl py-1 px-3.5">
          {{ u.name }} {{ getUserState(u.choice, u.delta) }}
        </li>
      </ul>
      <div class="flex flex-row flex-wrap gap-1">
        <button
          v-for="(v,k) in emojiRPSLS"
          :key="`${k}-rpsls`"
          class="bg-transparent text-black py-2 px-4 rounded-2xl border border-black disabled:bg-gray-300 disabled:border-transparent"
          :class="{'disabled:bg-red-200': k == userSelect}"
          :disabled="Boolean(userSelect || state.game.result)"
          @click="upGame(k, state.game.id)">
          {{ v.text }} {{ v.emoji }}
        </button>
      </div>
    </template>
    <div
      v-if="noWinner"
      class="mt-1">
      <button
        class="bg-red-400 text-white py-2 px-4 rounded-2xl"
        @click="replay">
        Replay
      </button>
    </div>
  </BModal>
</template>
