import { createRouter, createWebHistory } from 'vue-router'
import TimerView from '@/views/TimerView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'timer',
      component: TimerView,
    },
  ],
})

export default router
