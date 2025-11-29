<template>
  <div>
    <!-- If NOT on login page, show navbar + sidebar -->
    <div v-if="!isLoginPage" class="layout">
      <Navbar />
      <div class="main-section">
        <Sidebar />
        <router-view />
      </div>
    </div>

    <!-- If on /login, show ONLY login page -->
    <div v-else>
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";

import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";

const route = useRoute();

// Detect if current route is login page
const isLoginPage = computed(() => route.path === "/login");
</script>

<style>
.layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.main-section {
  display: flex;
  flex: 1;
}
</style>
