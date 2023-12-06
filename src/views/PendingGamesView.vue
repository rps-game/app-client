<script setup lang="ts">
import router from '@/router';
import { AXIOS } from '@/utils';
import { reactive } from 'vue';
import type { IUser } from '@/stores/user';

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
  <ol>
    <template
      v-for="el in state.data"
      :key="`${el.id}-game`">
      <li @click="router.push({name: 'game', params: {id: el.id}})">
        <span
          v-for="user in el.members"
          :key="`${user.id}-user`">
          {{ user.name }},&nbsp;
        </span>
      </li>
    </template>
  </ol>
</template>
