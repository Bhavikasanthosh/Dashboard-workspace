<template>
  <div class="layout">
    <Navbar />

    <div class="body-section">
      <Sidebar />
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Sidebar from "./components/Sidebar.vue"
import Navbar from "./components/Navbar.vue"
</script>

<style>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.body-section {
  display: flex;
  flex: 1;
}

.content {
  flex: 1;
  padding: 40px;
  background: #f8fafc;
  border-radius: 12px;
  margin: 20px;
}
</style>
