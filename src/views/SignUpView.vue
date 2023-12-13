<script setup lang="ts">
import BInput from '@/components/base/BInput/BInput.vue';
import { reactive, computed } from 'vue';
import { IUser, useUserStore } from '@/stores/user';
import { AXIOS } from '@/utils';
import router from '@/router';

const state = reactive({
  name: '',
  tglogin: '',
  code: null,
});

const disableSubmitSignUp = computed(() => state.name === '' || state.tglogin === '');
const disableSubmitCode = computed(() => state.code == null || String(state.code).length < 5 || isNaN(Number(state.code)));

const store = useUserStore();

async function submitForm() {
  if (disableSubmitSignUp.value) {
    return;
  }
  const res = await AXIOS.post<IUser>('/sign-up', { name: state.name, tglogin: state.tglogin });
  console.log(res.data);
  store.setUser(res.data);
}

async function submitCode() {
  const user = store.user;

  if (user == null) {
    return router.push({ name: 'login' });
  }

  if (disableSubmitCode.value) {
    return;
  }

  await AXIOS.post<IUser, IUser>('/code', {
    tglogin: user.tglogin,
    passcode: Number(state.code),
  });

  store.setAuth(true);

  return router.push({ name: 'profile' });
}
</script>

<template>
  <div class="border-r border-black">
    <div class="border border-black border-r-0 p-2 rounded-2xl rounded-r-none flex flex-col items-center gap-1">
      <p class="text-center font-thin text-xl">
        Перейдите в бота, затем заполните форму и нажмите "Получить код"
      </p>
      <a
        href="https://t.me/rps_auth_bot"
        class="bg-transparent text-black py-2 px-4 border border-black disabled:bg-gray-300 disabled:border-transparent"
        target="_blank">
        Перейти в бота
      </a>
      <form
        class="flex flex-col items-center"
        @submit.prevent="submitForm">
        <b-input
          v-model.trim="state.tglogin"
          placeholder="Логин в telegram" />
        <b-input
          v-model.trim="state.name"
          class="mt-0.5"
          placeholder="Имя" />
        <button
          type="submit"
          class="bg-transparent text-black py-2 px-4 border border-black disabled:bg-gray-300 disabled:border-transparent mt-2"
          :class="{'disabled:bg-gray-300 disabled:text-gray-600': disableSubmitSignUp}"
          :disabled="disableSubmitSignUp">
          Получить код
        </button>
      </form>
    </div>
    <div
      v-if="store.user"
      class="border border-black border-r-0 p-2 rounded-2xl rounded-r-none w-full mt-2">
      <form>
        <form
          class="flex flex-col items-center"
          @submit.prevent="submitCode">
          <b-input
            v-model="state.code"
            type="number"
            placeholder="Код из бота" />
          <button
            type="submit"
            class="bg-transparent text-black py-2 px-4 border border-black disabled:bg-gray-300 disabled:border-transparent mt-2"
            :class="{'disabled:bg-gray-300 disabled:text-gray-600': disableSubmitCode}"
            :disabled="disableSubmitCode">
            Отправить код
          </button>
        </form>
      </form>
    </div>
  </div>
</template>

