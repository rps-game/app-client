<script setup lang="ts">
import { reactive, computed } from 'vue';
import BInput from '@/components/base/BInput/BInput.vue';
import router from '@/router';
import { AXIOS } from '@/utils';
import type { IGame } from '@/utils';
import type { IUser } from '@/stores/user';
import { debounce } from 'lodash-es';

const MAX = 4;
const MIN = 1;

const state = reactive<{search: string, data: Array<IUser>, selected: IUser[], error: string}>({
  search: '',
  data: [],
  selected: [],
  error: '',
});

const selectedIds = computed(() => state.selected.map(({ id }) => id));

function add(user: IUser) {
  if (selectedIds.value.includes(user.id) && state.selected.length === MAX) {
    return;
  }

  state.selected.push(user);
}

function remove(id: string) {
  if (!selectedIds.value.includes(id)) {
    return;
  }

  state.selected = state.selected.filter(e => e.id !== id);
}

async function create() {
  if (state.selected.length > MAX || state.selected.length < MIN) {
    return;
  }

  const res = await AXIOS.post<IGame>('/games', {
    members: state.selected.map(({ id }) => ({ id })),
  });

  void router.push({ name: 'game', params: { id: res.data.id }});
}

const getUsers = debounce(async (v: string) => {
  if (v.length < 3 && v.length > 1) {
    return;
  }

  const res = await AXIOS.get<IUser[]>('/users', { params: {
    search: v,
  }});

  state.data = res.data;
}, 300);

void getUsers('');
</script>

<template>
  <div class="border border-black p-2 rounded-2xl rounded-tl-none">
    <b-input
      v-model="state.search"
      placeholder="Имя или ID игрока"
      class="w-full py-1"
      @input="getUsers" />
    <table
      v-if="state.data.length > 0"
      class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
      <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
        <tr>
          <td class="px-3 py-2 text-center font-bold">
            -
          </td>
          <td class="px-3 py-2 text-center">
            id
          </td>
          <td class="px-3 py-2">
            name
          </td>
          <td class="px-3 py-2">
            rating
          </td>
          <td class="px-3 py-2 text-center font-bold">
            +
          </td>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="el in state.data"
          :key="`${el.id}-list`"
          class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
          <td class="px-3 py-2 text-center">
            <button
              :disabled="!selectedIds.includes(el.id)"
              class="bg-sky-400 text-white py-2 px-4 rounded-2xl font-bold disabled:bg-gray-400"
              @click="remove(el.id)">
              -
            </button>
          </td>
          <td class="px-3 py-2 text-center">
            {{ el.id }}
          </td>
          <td class="px-3 py-2">
            {{ el.name }}
          </td>
          <td class="px-3 py-2">
            {{ el.rating }}
          </td>
          <td class="px-3 py-2 text-center">
            <button
              :disabled="selectedIds.includes(el.id)"
              class="bg-sky-400 text-white py-2 px-4 rounded-2xl font-bold disabled:bg-gray-400"
              @click="add(el)">
              +
            </button>
          </td>
        </tr>
      </tbody>
    </table>
    <ul
      v-if="selectedIds.length > 0"
      class="mt-2 flex flex-row flex-wrap gap-1 bg-sky-100 rounded-3xl p-3">
      <li
        v-for="el in state.selected"
        :key="`${el}-sel`"
        class="bg-sky-200 rounded-2xl px-3 py-2">
        <button
          class="bg-sky-400 text-white py-1 px-3 rounded-xl mr-2 font-bold"
          @click="remove(el.id)">
          -
        </button>
        <span>
          {{ el.name }}
        </span>
      </li>
    </ul>
    <button
      :disabled="state.selected.length > MAX || state.selected.length < MIN"
      class="bg-red-400 text-white py-2 px-4 rounded-2xl mt-2"
      @click="create">
      Создать
    </button>
    <div
      v-if="state.error"
      class="text-red-500">
      {{ state.error }}
    </div>
  </div>
</template>
