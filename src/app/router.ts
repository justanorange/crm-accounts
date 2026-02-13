import { createWebHistory, createRouter } from 'vue-router';

import HomePage from '@/pages/home/ui/HomePage.vue';

const routes = [
  { path: '/', component: HomePage },
];

export default createRouter({
  history: createWebHistory(import.meta.env.VITE_BASE_PATH),
  routes,
});
