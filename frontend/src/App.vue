<template>
  <div v-if="isAuthPage" class="auth-layout">
    <router-view />
  </div>

  <div v-else class="dashboard-layout">
    <Navbar class="top-nav" />

    <div class="main-wrapper">
      <Sidebar />

      <main class="page-area">
        <router-view />
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

// Check if the current page is Login or Signup
const isAuthPage = computed(() => {
  return ['/login', '/signup'].includes(route.path);
});
</script>

<style>
/* RESET */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body {
  height: 100%;
  font-family: 'Segoe UI', sans-serif;
  background-color: #f8fafc;
}

/* --- AUTH LAYOUT --- */
.auth-layout {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f5f9;
}

/* --- DASHBOARD LAYOUT --- */
.dashboard-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Navbar Logic */
.top-nav {
  width: 100%;
  height: 64px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
  flex-shrink: 0;
  z-index: 50;
}

/* Wrapper for Sidebar + Content */
.main-wrapper {
  display: flex;
  flex: 1; /* Takes remaining height */
  overflow: hidden; /* Prevents double scrollbars */
}

/* Page Content */
.page-area {
  flex: 1;
  overflow-y: auto; /* Scroll only inside content area */
  padding: 30px;
  background-color: #f8fafc;
}
</style>
