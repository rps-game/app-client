<script setup lang="ts">
import BInput from '@/components/base/BInput/BInput.vue';
import { reactive, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import type { IUser } from '@/stores/user';
import { AXIOS } from '@/utils';
import router from '@/router';
import { Icon } from '@iconify/vue';

const state = reactive({
  tglogin: '',
  code: '',
});

const disableSubmitSignUp = computed(() => state.tglogin === '');
const disableSubmitCode = computed(() => state.code == null || String(state.code).length < 5 || isNaN(Number(state.code)));

const store = useUserStore();

async function submitForm() {
  const res = await AXIOS.post<IUser>('/login', { tglogin: state.tglogin });
  console.log(res.data);
  store.setUser(res.data);
}

async function submitCode() {
  const user = store.user;

  if (state.code.length < 5 || isNaN(Number(state.code)) || user == null) {
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
  <div class="border border-black p-2 rounded-2xl rounded-tl-none flex flex-col items-center gap-1 w-full px-4 py-6">
    <form
      class="grid grid-cols-4 grid-rows-1 place-items-stretch w-full gap-0.5"
      @submit.prevent="submitForm">
      <b-input
        v-model.trim="state.tglogin"
        class="flex items-stretch col-span-3"
        input-class="w-full"
        placeholder="Логин в telegram" />
      <button
        type="submit"
        class="flex justify-center bg-transparent text-black py-2 px-4 border border-black disabled:text-gray-600 disabled:bg-gray-300 disabled:border-gray-300"
        :disabled="disableSubmitSignUp">
        <Icon
          icon="mdi:send"
          class="w-6 h-6" />
      </button>
    </form>
    <form
      v-if="store.user"
      class="grid grid-cols-4 grid-rows-1 place-items-stretch w-full gap-0.5"
      @submit.prevent="submitCode">
      <b-input
        v-model.trim="state.code"
        class="flex items-stretch col-span-3"
        input-class="w-full"
        placeholder="Код" />
      <button
        type="submit"
        class="flex justify-center bg-transparent text-black py-2 px-4 border border-black disabled:bg-gray-300 disabled:border-gray-300 disabled:text-gray-600"
        :disabled="disableSubmitCode">
        <Icon
          icon="mdi:login"
          class="w-6 h-6" />
      </button>
    </form>
  </div>
</template>

