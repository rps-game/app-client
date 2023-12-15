<script setup lang="ts">
import BInput from '@/components/base/BInput/BInput.vue';
import { reactive } from 'vue';
import router from '@/router';
import { AXIOS } from '@/utils';
import { useUserStore } from '@/stores/user';
import type { IUser } from '@/stores/user';
import { useVfm } from 'vue-final-modal';
import BModal from '@/components/base/BModal/BModal.vue';
import { computed } from 'vue';
import { Icon } from '@iconify/vue';

const props = defineProps<{
  modalId: symbol | string;
}>();

const store = useUserStore();
const vfm = useVfm();

const state = reactive({
  code: null,
});

const disableSubmitCode = computed(() => state.code == null || String(state.code).length < 5 || isNaN(Number(state.code)));

async function submitCode() {
  const user = store.user;

  if (user == null) {
    vfm.close(props.modalId);
    return router.push({ name: 'login' });
  }

  if (disableSubmitCode.value) {
    return;
  }

  await AXIOS.post<IUser, IUser>('/code', {
    tglogin: user.tglogin,
    passcode: String(state.code),
  });

  store.setAuth(true);
  vfm.close(props.modalId);
  return router.push({ name: 'profile' });
}
</script>

<template>
  <BModal
    title="Введите код который прислал бот"
    :modal-id="props.modalId">
    <form
      v-if="store.user"
      class="grid grid-cols-4 grid-rows-1 place-items-stretch w-full gap-0.5 p-3"
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
  </BModal>
</template>
