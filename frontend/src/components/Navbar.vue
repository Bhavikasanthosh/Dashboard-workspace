<template>
  <div class="navbar">
    <h1 class="logo">Digital Workspace</h1>

    <div class="nav-right">
      <button @click="logout" class="logout-btn">Logout</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
  methods: {
    logout() {
      // 1. Remove token
      localStorage.removeItem("token");
      // 2. Redirect to Login
      this.$router.push("/login");
    }
  }
}
</script>

<style scoped>
.navbar {
  width: 100%;
  height: 70px;
  background: white;
  display: flex;
  align-items: center;
  justify-content: space-between; /* Pushes content to edges */
  padding: 0 40px; /* Use padding instead of padding-left */
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
}

.logout-btn {
  background-color: #fee2e2;
  color: #ef4444;
  border: 1px solid #fecaca;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.logout-btn:hover {
  background-color: #fecaca;
}
</style>
