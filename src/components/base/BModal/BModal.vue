<script setup lang="ts">
import { Icon } from  '@iconify/vue';
import { useVfm, VueFinalModal } from 'vue-final-modal';

const props = defineProps<{
  title?: string;
  modalId: symbol | string;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: boolean): void;
}>();

const vfm = useVfm();

function onCloseClick() {
  emit('update:modelValue', false);
  vfm.close(props.modalId);
}

</script>

<template>
  <VueFinalModal
    :modal-id="modalId"
    class="flex justify-center items-center"
    content-class="flex flex-col p-4 bg-white rounded border border-gray-100"
    @update:model-value="val => emit('update:modelValue', val)">
    <div class="flex items-center h-10">
      <h1
        v-if="title"
        class="text-xl">
        {{ title }}
      </h1>
      <button
        class="ml-auto"
        @click="onCloseClick">
        <Icon
          icon="clarity:window-close-line"
          class="w-10 h-10" />
      </button>
    </div>
    <slot />
  </VueFinalModal>
</template>
