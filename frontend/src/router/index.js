import { createRouter, createWebHistory } from 'vue-router'

import DashboardView from '../views/DashboardView.vue'
import FocusTimerView from '../views/FocusTimerView.vue'
import TasksView from '../views/TasksView.vue'
import NotesView from '../views/NotesView.vue'
import AnalyticsView from '../views/AnalyticsView.vue'
import LoginView from '../views/LoginView.vue'
import SignupView from '../views/SignupView.vue'

const routes = [
  { path: '/', name: 'dashboard', component: DashboardView },
  { path: '/focus-timer', name: 'focus-timer', component: FocusTimerView },
  { path: '/tasks', name: 'tasks', component: TasksView },
  { path: '/notes', name: 'notes', component: NotesView },
  { path: '/analytics', name: 'analytics', component: AnalyticsView },

  // Auth Routes
  { path: '/login', name: 'login', component: LoginView },
  { path: '/signup', name: 'signup', component: SignupView }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// 🔒 GLOBAL GUARD: Redirect to Login if not authenticated
router.beforeEach((to, from, next) => {
  const publicPages = ['/login', '/signup'];
  const authRequired = !publicPages.includes(to.path);
  const loggedIn = localStorage.getItem('token');

  if (authRequired && !loggedIn) {
    return next('/login');
  }

  next();
});

export default router
