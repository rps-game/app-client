<script setup lang="ts">
</script>

<template>
  <main class="flex flex-col items-center mt-36">
    <nav class="flex flex-row justify-between w-full">
      <router-link
        :to="{name: 'sign-in'}"
        active-class="border border-b-0 border-black"
        class="px-3 py-2">
        Войти
      </router-link>
      <router-link
        :to="{name: 'sign-up'}"
        active-class="border border-b-0 border-black"
        class="px-3 py-2">
        Зарегестрироваться
      </router-link>
    </nav>
    <router-view />
  </main>
</template>
