<template>
  <div class="layout">
    <!-- FULL-WIDTH NAVBAR AT THE TOP -->
    <Navbar class="top-nav" />

    <div class="main-wrapper">
      <!-- LEFT SIDEBAR -->
      <Sidebar />

      <!-- MAIN CONTENT -->
      <main class="page-area">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from './components/Sidebar.vue'
import Navbar from './components/Navbar.vue'
</script>

<style>
/* FULL PAGE CONTAINER */
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* NAVBAR FULL WIDTH */
.top-nav {
  width: 100%;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  padding: 15px 40px;
  position: sticky;
  top: 0;
  z-index: 100;
}

/* SIDEBAR + CONTENT LAYOUT */
.main-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

/* SIDEBAR stays LEFT */
main-wrapper > Sidebar {
  flex-shrink: 0;
}

/* MAIN CONTENT AREA (EXPANDS FULLY) */
.page-area {
  flex: 1;
  padding: 30px 40px;
}
</style>
