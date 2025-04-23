import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/stocks',
      name: 'stocks',
      component: () => import('../views/StocksView.vue'),
    },
    {
      path: '/stocks/:ticker',
      name: 'stock-detail',
      component: () => import('../views/StockDetailView.vue'),
      props: true,
    },
    {
      path: '/recommendations',
      name: 'recommendations',
      component: () => import('../views/RecommendationsView.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
