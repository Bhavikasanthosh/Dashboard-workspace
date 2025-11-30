import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import FocusTimerView from '../views/FocusTimerView.vue'
import TasksView from '../views/TasksView.vue'
import NotesView from '../views/NotesView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'

const routes = [
  {
    path: '/',
    name: 'dashboard',
    component: DashboardView,     // 👈 DEFAULT LANDING PAGE
  },
  {
    path: '/focus-timer',
    name: 'focus-timer',
    component: FocusTimerView,
  },
  {
    path: '/tasks',
    name: 'tasks',
    component: TasksView,
  },
  {
    path: '/notes',
    name: 'notes',
    component: NotesView,
  },
  {
    path: '/analytics',
    name: 'analytics',
    component: AnalyticsView,
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
