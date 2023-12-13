import { createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/stores/user';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
      redirect: { name: 'sign-up' },
      meta: {
        allowAnonymous: true,
      },
      children: [
        {
          path: '/sign-up',
          name: 'sign-up',
          component: () => import('../views/SignUpView.vue'),
        },
        {
          path: '/sign-in',
          name: 'sign-in',
          component: () => import('../views/SignInView.vue'),
        },
      ],
      beforeEnter(to, from, next) {
        const store = useUserStore();

        if (store.user) {
          next({ name: 'play' });
        } else {
          next();
        }
      },
    },
    {
      path: '/code',
      name: 'code',
      component: () => import('../views/CodeView.vue'),
      meta: {
        allowAnonymous: true,
      },
      beforeEnter(to, from, next) {
        const store = useUserStore();
        if (store.user) {
          next({ name: 'play' });
        } else {
          next();
        }
      },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
      redirect: { name: 'play' },
      children: [
        {
          path: '/profile/play',
          name: 'play',
          component: () => import('../views/NewGameView.vue'),
        },
        {
          path: '/profile/pending-games',
          name: 'pending-games',
          component: () => import('../views/PendingGamesView.vue'),
          children: [
            {
              path: '/profile/game/:id',
              name: 'game',
              component: () => import('../views/GameView.vue'),
            },
          ],
        },
        {
          path: '/profile/history',
          name: 'history',
          component: () => import('../views/HistoryView.vue'),
          children: [
            {
              path: '/history/game/:id',
              name: 'history-game',
              component: () => import('../views/GameView.vue'),
            },
          ],
        },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: { name: 'login' }},
  ],
});

router.beforeEach((to, from, next) => {
  const store = useUserStore();

  if (!to.meta.allowAnonymous && !store.user) {
    next({ name: 'login' });
  } else {
    next();
  }
});

export default router;
