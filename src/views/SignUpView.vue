<script setup lang="ts">
import BInput from '@/components/base/BInput/BInput.vue';
import { reactive, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import type { IUser } from '@/stores/user';
import { AXIOS } from '@/utils';
import { modalId } from '@/components/modals/ModalLogin/const';
import { useVfm } from 'vue-final-modal';

const state = reactive({
  name: '',
  tglogin: '',
  code: null,
});

const disableSubmitSignUp = computed(() => state.name === '' || state.tglogin === '');

const store = useUserStore();
const vfm = useVfm();

async function submitForm() {
  if (disableSubmitSignUp.value) {
    return;
  }
  const res = await AXIOS.post<IUser>('/sign-up', { name: state.name, tglogin: state.tglogin });
  console.log(res.data);
  store.setUser(res.data);
  vfm.open(modalId);
}
</script>

<template>
  <div class="border border-black p-2 rounded-2xl rounded-tr-none flex flex-col items-center w-full">
    <div class="flex flex-col items-center gap-1">
      <p class="text-center font-thin text-xl">
        Перейдите в бота, затем заполните форму и нажмите "Получить код"
      </p>
      <a
        href="https://t.me/rps_auth_bot"
        class="bg-transparent text-black py-2 px-4 border border-black disabled:bg-gray-300 disabled:border-transparent"
        target="_blank">
        Перейти в бота
      </a>
    </div>
    <hr class="border-b-0.5 border-black my-2 w-full">
    <form
      class="flex flex-col items-center w-full gap-1"
      @submit.prevent="submitForm">
      <b-input
        v-model.trim="state.tglogin"
        input-class="h-[42px]"
        placeholder="Логин в telegram" />
      <b-input
        v-model.trim="state.name"
        class="mt-0.5"
        input-class="h-[42px]"
        placeholder="Имя" />
      <button
        type="submit"
        class="bg-transparent text-black py-2 px-4 border border-black disabled:bg-gray-300 disabled:border-transparent"
        :class="{'disabled:bg-gray-300 disabled:text-gray-600': disableSubmitSignUp}"
        :disabled="disableSubmitSignUp">
        Получить код
      </button>
    </form>
  </div>
</template>
