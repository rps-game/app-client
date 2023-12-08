<script setup lang="ts">
import BInput from '@/components/base/BInput/BInput.vue';
import { reactive } from 'vue';
import router from '@/router';
import { AXIOS } from '@/utils';
import { useUserStore } from '@/stores/user';
import type { IUser } from '@/stores/user';

const state = reactive({
  name: '',
  tglogin: '',
  code: '',
});

const store = useUserStore();

async function submitForm() {
  const res = await AXIOS.post<IUser>('/login', { name: state.name, tglogin: state.tglogin });
  console.log(res.data);
  store.setUser(res.data);
}

async function submitCode() {
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
      Авторизация
    </h1>
    <p>
      Перейдите в
      <a
        href="https://t.me/rps_auth_bot"
        target="_blank">
        бота
      </a>
      а затем заполните форму и нажмите "Получить код"
    </p>
    <form
      class="flex flex-col items-center"
      @submit.prevent="submitForm">
      <b-input
        v-model="state.tglogin"
        label="TG username" />
      <b-input
        v-model="state.name"
        label="Имя" />
      <button
        type="submit">
        Получить код
      </button>
    </form>
    <template v-if="store.user">
      <h2>
        Введите код
      </h2>
      <form>
        <form
          class="flex flex-col items-center"
          @submit.prevent="submitCode">
          <b-input
            v-model="state.code"
            label="Код" />
          <button type="submit">
            Отправить код
          </button>
        </form>
      </form>
    </template>
  </main>
</template>
