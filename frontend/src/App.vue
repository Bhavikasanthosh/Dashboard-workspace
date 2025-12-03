<template>
  <div v-if="isAuthPage" class="auth-layout">
    <router-view />
  </div>

  <div v-else class="layout">
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

// Check if current page is Login or Signup
const isAuthPage = computed(() => {
  return ['/login', '/signup'].includes(route.path);
});
</script>

<style>
/* Main App Layout */
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.top-nav {
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  padding: 0 40px; /* Adjusted padding for better alignment */
  height: 70px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.main-wrapper {
  display: flex;
  flex: 1; /* Take remaining height */
  overflow: hidden; /* Prevent double scrollbars */
}

.page-area {
  flex: 1;
  padding: 30px 40px;
  overflow-y: auto; /* Allow content to scroll */
  background-color: #f8fafc;
}

/* Auth Layout */
.auth-layout {
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f1f5f9;
}
</style>
