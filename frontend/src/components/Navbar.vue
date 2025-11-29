<template>
  <nav class="navbar">
    <div class="left">
      <h1 class="logo">Workspace Dashboard</h1>
    </div>

    <div class="right">
      <button class="theme-toggle">🌙</button>
      <button class="logout-btn" @click="logout">Logout</button>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    logout() {
      // Remove token from storage
      localStorage.removeItem("token");

      // Redirect to login page
      window.location.href = "/login";
    }
  }
};
</script>

<style scoped>
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 30px;
  background: #694a4a;
  color: white;
  font-size: 20px;
}

.left {
  display: flex;
  align-items: center;
}

.logo {
  font-weight: 600;
  margin: 0;
}

.right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.theme-toggle {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: white;
}

.logout-btn {
  background: transparent;
  border: 1px solid white;
  color: white;
  padding: 6px 14px;
  cursor: pointer;
  border-radius: 5px;
  font-size: 16px;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}
</style>
