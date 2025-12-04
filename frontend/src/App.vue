<template>
  <div v-if="isAuthPage" class="auth-layout">
    <div class="auth-background-shape"></div>
    <router-view />
  </div>

  <div v-else class="dashboard-layout">
    <Sidebar class="app-sidebar" />

    <div class="main-content">
      <Navbar class="app-header" />

      <main class="page-view">
        <div class="container">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Sidebar from './components/Sidebar.vue';
import Navbar from './components/Navbar.vue';

const route = useRoute();
const isAuthPage = computed(() => ['/login', '/signup'].includes(route.path));
</script>

<style scoped>
/* --- Auth Layout --- */
.auth-layout {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8fafc;
  position: relative;
  overflow: hidden;
}

/* Aesthetic background blob for login */
.auth-background-shape {
  position: absolute;
  top: -20%;
  right: -10%;
  width: 600px;
  height: 600px;
  background: radial-gradient(circle, rgba(79, 70, 229, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
  z-index: 0;
  pointer-events: none;
}

/* --- Dashboard Layout --- */
.dashboard-layout {
  display: flex;
  height: 100vh;
  overflow: hidden;
}

.app-sidebar {
  width: var(--sidebar-width);
  flex-shrink: 0;
  border-right: 1px solid var(--border-color);
  background: var(--bg-card);
  z-index: 20;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0; /* Prevents flex overflow issues */
}

.app-header {
  height: var(--header-height);
  border-bottom: 1px solid var(--border-color);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(8px); /* Glass effect */
  z-index: 10;
}

.page-view {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  background: var(--bg-body);
}

.container {
  max-width: 1400px;
  margin: 0 auto;
}

/* Page Transition Animation */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
