<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'

const route = useRoute()

// Check if we are on the login or signup page
const isAuthPage = computed(() => {
  return ['/login', '/signup'].includes(route.path)
})
</script>

<template>
  <div class="app-container">

    <div v-if="isAuthPage" class="auth-layout">
      <router-view />
    </div>

    <div v-else class="dashboard-layout">
      <Sidebar />
      <main class="page-area">
        <router-view />
      </main>
    </div>

  </div>
</template>

<style>
/* Global Styles */
body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', sans-serif;
  background-color: #faf9f6;
}

.app-container {
  min-height: 100vh;
}

/* Centered Layout for Auth */
.auth-layout {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* Sidebar Layout for Dashboard */
.dashboard-layout {
  display: flex;
  min-height: 100vh;
}

.page-area {
  flex: 1;
  padding: 40px;
  overflow-y: auto;
  background-color: #faf9f6;
}
</style>
