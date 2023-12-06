import { ref, computed } from 'vue';
import type { Ref } from 'vue';
import { defineStore } from 'pinia';
import Cookies from 'js-cookie';

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
    if (auth && user.value) {
      authorized.value = true;
      Cookies.set('currentUser', JSON.stringify(user.value), { expires: 86400000 });
    } else {
      authorized.value = false;
      Cookies.remove('currentUser');
    }
  };

  return { user, userId, setUser, isAuthorized, setAuth };
});
