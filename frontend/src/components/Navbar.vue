<template>
  <header class="navbar">
    <div class="nav-content">
      <h2 class="current-page">{{ currentPageTitle }}</h2>

      <div class="nav-actions">
        <button class="icon-btn">🔔</button>
        <button class="logout-btn" @click="logout">Sign Out</button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  computed: {
    currentPageTitle() {
      const path = this.$route.path.replace('/', '') || 'Dashboard';
      return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
    }
  },
  methods: {
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    }
  }
}
</script>

<style scoped>
.navbar {
  padding: 0 2rem;
  display: flex;
  align-items: center;
}

.nav-content {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.current-page {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-main);
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 8px;
  border-radius: 50%;
  transition: background 0.2s;
}
.icon-btn:hover {
  background: #f3f4f6;
}

.logout-btn {
  padding: 8px 16px;
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  color: var(--text-muted);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  border-color: #fecaca;
  color: #ef4444;
  background-color: #fef2f2;
}
</style>
