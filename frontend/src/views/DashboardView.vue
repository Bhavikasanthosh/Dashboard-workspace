<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import {
  CheckSquare,
  Lightbulb,
  Hourglass,
  BarChart3,
  Calendar,
  ArrowRight
} from 'lucide-vue-next'

const router = useRouter()

// Dynamic Date
const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  year: 'numeric',
  month: 'long',
  day: 'numeric'
})

// Tools Configuration
const tools = [
  {
    id: 'tasks',
    title: 'Task Manager',
    desc: '-',
    icon: CheckSquare,
    path: '/tasks',
    color: 'text-brown'
  },
  {
    id: 'ideas',
    title: 'Idea Notes',
    desc: '-',
    icon: Lightbulb,
    path: '/notes',
    color: 'text-orange'
  },
  {
    id: 'focus',
    title: 'Focus Mode',
    desc: '-',
    icon: Hourglass,
    path: '/focus-timer',
    color: 'text-mocha'
  },
  {
    id: 'analytics',
    title: 'Analytics',
    desc: '-',
    icon: BarChart3,
    path: '/analytics',
    color: 'text-dark'
  }
]
</script>

<template>
  <div class="dashboard-container">

    <div class="welcome-banner">
      <div class="banner-content">
        <h1 class="banner-title">Wassupp?</h1>
        <p class="banner-subtitle">
          -
        </p>

        <div class="date-pill">
          <Calendar size="16" />
          <span>{{ today }}</span>
        </div>
      </div>

      <div class="banner-decoration"></div>
    </div>

    <div class="section-header">
      <h2>Explore your Tools</h2>
    </div>

    <div class="tools-grid">
      <div
        v-for="tool in tools"
        :key="tool.id"
        class="tool-card"
        @click="router.push(tool.path)"
      >
        <div class="icon-wrapper">
          <component :is="tool.icon" :size="28" :class="tool.color" />
        </div>

        <div class="card-text">
          <h3>{{ tool.title }}</h3>
          <p>{{ tool.desc }}</p>
        </div>

        <div class="hover-arrow">
          <ArrowRight size="20" />
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>

.dashboard-container {
  padding: 40px;
  background-color: #faf9f6;
  min-height: 100vh;
  font-family: 'Segoe UI', sans-serif;
  color: #3e2723;
}


.welcome-banner {

  background: linear-gradient(135deg, #6d4c41 0%, #3e2723 100%);
  border-radius: 24px;
  padding: 60px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 10px 30px -10px rgba(62, 39, 35, 0.3);
  margin-bottom: 50px;
}

.banner-content { position: relative; z-index: 2; }

.banner-title {
  font-size: 3rem;
  font-weight: 800;
  margin: 0 0 10px 0;
  letter-spacing: -1px;
}

.banner-subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 30px;
  font-weight: 400;
  max-width: 600px;
}


.banner-decoration {
  position: absolute;
  top: -50%; right: -10%;
  width: 500px; height: 500px;
  background: radial-gradient(circle, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 70%);
  border-radius: 50%;
  z-index: 1;
}


.date-pill {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  padding: 8px 16px;
  border-radius: 99px;
  font-size: 0.9rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
}


.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: #3e2723;
  margin-bottom: 25px;
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}


.tool-card {
  background: white;
  padding: 30px;
  border-radius: 20px;
  border: 1px solid #efebe9;
  box-shadow: 0 4px 6px rgba(62, 39, 35, 0.02);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
}

.tool-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px -5px rgba(62, 39, 35, 0.1);
  border-color: #d7ccc8;
}


.icon-wrapper {
  width: 60px; height: 60px;
  background: #fdfbf7;
  border-radius: 16px;
  display: flex; align-items: center; justify-content: center;
  transition: all 0.3s;
}

.tool-card:hover .icon-wrapper {
  background: #efebe9;
}


.text-brown { color: #5d4037; }
.text-orange { color: #e65100; }
.text-mocha { color: #8d6e63; }
.text-dark { color: #3e2723; }


.card-text h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #3e2723;
  margin: 0 0 5px 0;
}
.card-text p {
  font-size: 0.95rem;
  color: #8d6e63;
  line-height: 1.5;
}


.hover-arrow {
  position: absolute;
  bottom: 30px; right: 30px;
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
  color: #d7ccc8;
}

.tool-card:hover .hover-arrow {
  opacity: 1;
  transform: translateX(0);
  color: #5d4037;
}
</style>
