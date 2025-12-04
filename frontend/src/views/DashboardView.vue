<template>
  <div class="dashboard-container">

    <section class="welcome-banner">
      <div class="banner-content">
        <h1 class="greeting">Something interesting! </h1>
        <p class="sub-greeting">
          Track tasks, capture ideas, and stay focused.
        </p>
      </div>
      <div class="banner-decoration"></div>
    </section>

    <div class="stats-overview">
      <div class="stat-pill">
        <span class="icon">📅</span>
        <span>{{ dateDisplay }}</span>
      </div>
    </div>

    <h2 class="section-title">Explore your Tools</h2>
    <div class="features-grid">

      <router-link to="/tasks" class="feature-card task-card">
        <div class="card-icon">✅</div>
        <div class="card-info">
          <h3>Task Manager</h3>
          <p>Organize your tasks with priority!</p>
        </div>
        <span class="arrow">→</span>
      </router-link>

      <router-link to="/notes" class="feature-card note-card">
        <div class="card-icon">💡</div>
        <div class="card-info">
          <h3>Idea Notes</h3>
          <p> Put in your ideas!!</p>
        </div>
        <span class="arrow">→</span>
      </router-link>

      <router-link to="/focus-timer" class="feature-card focus-card">
        <div class="card-icon">⏳</div>
        <div class="card-info">
          <h3>Focus Mode</h3>
          <p>Time your sessions!</p>
        </div>
        <span class="arrow">→</span>
      </router-link>

      <router-link to="/analytics" class="feature-card analytics-card">
        <div class="card-icon">📊</div>
        <div class="card-info">
          <h3>Analytics</h3>
          <p>Visualize your productivity!</p>
        </div>
        <span class="arrow">→</span>
      </router-link>

    </div>
  </div>
</template>

<script>
export default {
  name: "DashboardView",
  computed: {
    dateDisplay() {
      const options = { weekday: 'long', month: 'long', day: 'numeric' };
      return new Date().toLocaleDateString('en-US', options);
    }
  }
};
</script>

<style scoped>
.dashboard-container {
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-banner {
  position: relative;
  background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
  border-radius: 24px;
  padding: 3rem;
  color: white;
  overflow: hidden;
  margin-bottom: 2rem;
  box-shadow: 0 20px 40px -10px rgba(99, 102, 241, 0.4);
}

.banner-content {
  position: relative;
  z-index: 2;
}

.greeting {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  letter-spacing: -1px;
}

.sub-greeting {
  font-size: 1.1rem;
  opacity: 0.9;
  max-width: 600px;
  line-height: 1.6;
}

.banner-decoration::after {
  content: "";
  position: absolute;
  bottom: -20%;
  left: -50%;
  width: 300px;
  height: 300px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
}

.stats-overview {
  display: flex;
  gap: 1rem;
  margin-bottom: 3rem;
}

.stat-pill {
  background: white;
  padding: 0.8rem 1.5rem;
  border-radius: 50px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
  color: #64748b;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
  border: 1px solid rgba(0,0,0,0.02);
}


.section-title {
  font-size: 1.5rem;
  color: #1e293b;
  font-weight: 700;
  margin-bottom: 1.5rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 220px;
  text-decoration: none;
  transition: all 0.3s ease;
  border: 1px solid transparent;
  box-shadow: 0 10px 30px -10px rgba(0,0,0,0.05);
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 40px -12px rgba(99, 102, 241, 0.2);
  border-color: #e0e7ff;
}

/* Card Content */
.card-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  background: #f8fafc;
  width: 60px;
  height: 60px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-info h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.card-info p {
  font-size: 0.95rem;
  color: #64748b;
  line-height: 1.5;
}

.arrow {
  position: absolute;
  bottom: 2rem;
  right: 2rem;
  font-size: 1.5rem;
  color: #6366f1; /* Primary Color */
  opacity: 0;
  transform: translateX(-10px);
  transition: all 0.3s ease;
}

.feature-card:hover .arrow {
  opacity: 1;
  transform: translateX(0);
}

/* Hover Accents (Subtle border colors) */
.task-card:hover { border-top: 4px solid #3b82f6; }
.note-card:hover { border-top: 4px solid #8b5cf6; }
.focus-card:hover { border-top: 4px solid #f59e0b; }
.analytics-card:hover { border-top: 4px solid #10b981; }
</style>
