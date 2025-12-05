<script setup>
import {
  Zap,
  CheckSquare,
  Lightbulb,
  Hourglass,
  BarChart3,
  Sparkles
} from 'lucide-vue-next'



const menuItems = [
  { name: 'Dashboard', icon: Zap, path: '/' },
  { name: 'My Tasks', icon: CheckSquare, path: '/tasks' },
  { name: 'Ideas', icon: Lightbulb, path: '/notes' },
  { name: 'Focus', icon: Hourglass, path: '/focus-timer' },
  { name: 'Analytics', icon: BarChart3, path: '/analytics' },
]
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="logo-shape">
        <Sparkles size="20" color="white" />
      </div>
    </div>

    <nav class="menu">
      <p class="menu-label">MAIN</p>

      <router-link
        v-for="item in menuItems"
        :key="item.name"
        :to="item.path"
        class="nav-link"
        active-class="active"
      >
        <component
          :is="item.icon"
          :size="20"
          stroke-width="2.5"
          class="icon"
        />
        <span>{{ item.name }}</span>
      </router-link>
    </nav>
  </aside>
</template>

<style scoped>

:root {
  --primary-brown: #795548;
  --dark-brown: #3E2723;
  --light-cream: #F5F0E6;
  --text-main: #2c2420;
}

.sidebar {
  width: 260px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #f0eadd;
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  font-family: 'Segoe UI', sans-serif;
}


.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 3rem;
  padding-left: 10px;
}
.logo-shape {
  width: 42px; height: 42px;

  background: linear-gradient(135deg, #8D6E63 0%, #4E342E 100%);
  border-radius: 12px;
  display: flex;
  align-items: center; justify-content: center;
  box-shadow: 0 8px 15px -3px rgba(121, 85, 72, 0.3);
}
.brand-name {
  font-size: 1.6rem;
  font-weight: 800;
  color: #3E2723; /* Dark Coffee Text */
  letter-spacing: -0.5px;
}

/* Menu */
.menu-label {
  font-size: 0.75rem;
  font-weight: 800;
  color: #a1887f; /* Light Brown Text */
  letter-spacing: 1px;
  margin-bottom: 15px;
  padding-left: 12px;
}

/* NAV LINK STYLES */
.nav-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  border-radius: 14px;
  cursor: pointer;
  text-decoration: none; /* Remove underline from links */


  color: #5d4037;
  font-weight: 700;

  transition: all 0.2s ease;
  margin-bottom: 6px;
}

.nav-link:hover {
  background: #fff8e1; /* Very light cream hover */
  color: #3e2723;
  transform: translateX(3px);
}


.nav-link.active {
  background: #efebe9; /* Latte background */
  color: #5d4037;      /* Strong Brown Text */
}

.icon { opacity: 0.8; transition: 0.2s; }
.nav-link.active .icon { opacity: 1; color: #3e2723; }

</style>
