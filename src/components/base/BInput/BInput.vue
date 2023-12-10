<script setup lang="ts">
import { withDefaults } from 'vue';
import { useModelWrapper } from '@/utils';
import type { BInputProps } from '@/components/base/BInput/interface';

const props = withDefaults(defineProps<BInputProps>(), {
  modelValue: '',
  type: 'text',
});

const id = props.id ?? String(Math.random());

const emit = defineEmits<{
  input: [value: string];
  'update:modelValue': [value: string];
}>();

function onInput(event: Event): void {
  emit('input', (<HTMLInputElement>event.target).value);
}

const modelValue = useModelWrapper(props, emit, 'modelValue');
</script>

<template>
  <div>
    <label
      v-if="props.label"
      class=""
      :for="id">
      {{ label }}
    </label>
    <input
      :id="id"
      v-model="modelValue"
      :type="type"
      v-bind="$attrs"
      @input="onInput">
  </div>
</template>


