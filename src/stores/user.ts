import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';

export interface IUser {
  id: string;
  name: string;
  tglogin: string;
  rating: number;
}

export const useUserStore = defineStore('user', () => {
  const userRef: Ref<IUser | null> = ref(null);

  const authorized = ref(false);

  const userId = computed(() => userRef.value && userRef.value.id);
  const user = computed(() => userRef.value);
  const isAuthorized = computed(() => authorized.value);

  const setUser = (data: IUser) => {
    userRef.value = data;
  };

  const setAuth = (auth: boolean) => {
    authorized.value = Boolean(auth && user.value);
  };

  return { user, userId, setUser, isAuthorized, setAuth };
});
