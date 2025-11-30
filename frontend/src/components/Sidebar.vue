<template>
  <aside class="sidebar">
    <h2 class="title">Dashboard</h2>

    <router-link to="/tasks" class="menu-btn">
      📋 Tasks
    </router-link>

    <router-link to="/notes" class="menu-btn">
      📝 Notes
    </router-link>

    <router-link to="/focus-timer" class="menu-btn">
      ⏱️ Pomodoro
    </router-link>

    <router-link to="/analytics" class="menu-btn">
      📊 Analytics
    </router-link>
  </aside>
</template>

<style>
.sidebar {
  width: 260px;
  background: #1e1e1e;
  padding: 30px 20px;
  color: white;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.title {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 20px;
}

.menu-btn {
  background: #6366f1;
  padding: 12px 15px;
  border-radius: 8px;
  text-decoration: none;
  color: white;
  display: block;
  font-size: 16px;
}

.menu-btn:hover {
  background: #4f46e5;
}

.router-link-active {
  background: #4338ca !important;
}
</style>
