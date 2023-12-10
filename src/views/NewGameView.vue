<script setup lang="ts">
import { reactive, computed } from 'vue';
import BInput from '@/components/base/BInput/BInput.vue';
import router from '@/router';
import { AXIOS } from '@/utils';
import type { IUser } from '@/stores/user';
import { debounce } from 'lodash-es';
import type { IGame } from '@/views/GameView.vue';

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
  try {
    if (state.selected.length > MAX || state.selected.length < MIN) {
      return;
    }

    const res = await AXIOS.post<IGame>('/games', {
      members: state.selected.map(({ id }) => ({ id })),
    });

    void router.push({ name: 'game', params: { id: res.data.id }});
  } catch (e: any) {
    if (typeof e.response?.data.message === 'string') {
      state.error = e.response?.data.message;
    }

    console.error(e);
  }
}

const getUsers = debounce(async (v: string) => {
  try {
    if (v.length < 3 && v.length > 1) {
      return;
    }

    const res = await AXIOS.get<IUser[]>('/users', { params: {
      search: v,
    }});

    state.data = res.data;
  } catch (e: any) {
    if (typeof e.response?.data.message === 'string') {
      state.error = e;
    }
    console.error(e);
  }
}, 300);

void getUsers('');
</script>

<template>
  <b-input
    v-model="state.search"
    @input="getUsers" />
  <table v-if="state.data.length > 0">
    <thead>
      <tr>
        <td>id</td>
        <td>name</td>
        <td>rating</td>
        <td />
      </tr>
    </thead>
    <tbody>
      <tr
        v-for="el in state.data"
        :key="`${el.id}-list`">
        <td>{{ el.id }}</td>
        <td>{{ el.name }}</td>
        <td>{{ el.rating }}</td>
        <td>
          <button
            :disabled="!selectedIds.includes(el.id)"
            @click="remove(el.id)">
            -
          </button>
          <button
            :disabled="selectedIds.includes(el.id)"
            @click="add(el)">
            +
          </button>
        </td>
      </tr>
    </tbody>
  </table>
  <ul>
    <li
      v-for="el in state.selected"
      :key="`${el}-sel`">
      <button @click="remove(el.id)">
        -
      </button>
      <span>
        {{ el.name }}
      </span>
    </li>
  </ul>
  <button
    :disabled="state.selected.length > MAX || state.selected.length < MIN"
    @click="create">
    Создать
  </button>
  <div
    v-if="state.error"
    class="error">
    {{ state.error }}
  </div>
</template>

<style scoped>
.error {
  color: red;
}
</style>
