<script setup lang="ts">
import BInput from '@/components/base/BInput/BInput.vue';
import { reactive, computed } from 'vue';
import { useUserStore } from '@/stores/user';
import type { IUser } from '@/stores/user';
import { AXIOS } from '@/utils';
import { Icon } from '@iconify/vue';
import { useVfm } from 'vue-final-modal';
import { modalId } from '@/components/modals/ModalLogin/const';

const state = reactive({
  tglogin: '',
  code: '',
});
const vfm = useVfm();

const disableSubmitSignUp = computed(() => state.tglogin === '');

const store = useUserStore();

async function submitForm() {
  const res = await AXIOS.post<IUser>('/login', { tglogin: state.tglogin });
  console.log(res.data);
  store.setUser(res.data);
  vfm.open(modalId);
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
  </div>
</template>
