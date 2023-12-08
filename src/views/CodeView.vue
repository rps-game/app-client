<script setup lang="ts">
import BInput from '@/components/base/BInput/BInput.vue';
import { reactive } from 'vue';
import router from '@/router';
import { AXIOS } from '@/utils';
import { useUserStore } from '@/stores/user';
import type { IUser } from '@/stores/user';

const state = reactive({
  code: '',
});

const store = useUserStore();

async function submitForm() {
  const user = store.user;

  if (user == null) {
    return router.push({ name: 'login' });
  }

  if (state.code.length < 5 || isNaN(Number(state.code))) {
    return;
  }

  await AXIOS.post<IUser, IUser>('/code', {
    name: user.name,
    tglogin: user.tglogin,
    passcode: Number(state.code),
  });

  store.setAuth(true);

  return router.push({ name: 'profile' });
}
</script>

<template>
  <main class="flex flex-col items-center">
    <h1>
      Введите код который прислал бот
    </h1>
    <form
      class="flex flex-col items-center"
      @submit.prevent="submitForm">
      <b-input
        v-model="state.code"
        label="Код" />
      <button type="submit">
        Отправить код
      </button>
    </form>
  </main>
</template>
