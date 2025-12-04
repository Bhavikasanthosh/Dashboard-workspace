<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="logo-icon">⚡</div>
      <span class="brand-text">Workspace</span>
    </div>

    <nav class="nav-menu">
      <router-link to="/" class="nav-item" active-class="active">
        <span class="icon">📊</span> Dashboard
      </router-link>
      <router-link to="/tasks" class="nav-item" active-class="active">
        <span class="icon">✅</span> Tasks
      </router-link>
      <router-link to="/notes" class="nav-item" active-class="active">
        <span class="icon">📝</span> Notes
      </router-link>
      <router-link to="/focus-timer" class="nav-item" active-class="active">
        <span class="icon">⏱</span> Focus Timer
      </router-link>
      <router-link to="/analytics" class="nav-item" active-class="active">
        <span class="icon">📈</span> Analytics
      </router-link>
    </nav>

    <div class="user-profile">
      <div class="avatar">U</div>
      <div class="user-info">
        <span class="name">User</span>
        <span class="status">Pro Plan</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 1.5rem 1rem;
  background-color: #ffffff;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 12px;
  margin-bottom: 2.5rem;
}

.logo-icon {
  width: 32px;
  height: 32px;
  background: var(--primary);
  color: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 18px;
}

.brand-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-main);
  letter-spacing: -0.5px;
}

.nav-menu {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  color: var(--text-muted);
  font-weight: 500;
  font-size: 0.95rem;
  transition: all 0.2s ease;
}

.nav-item:hover {
  background-color: #f3f4f6;
  color: var(--text-main);
}

.nav-item.active {
  background-color: #eef2ff; /* Light Indigo */
  color: var(--primary);
}

.icon {
  font-size: 1.1rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-top: 1px solid var(--border-color);
  margin-top: auto;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #e5e7eb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: #6b7280;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-main);
}

.status {
  font-size: 0.75rem;
  color: var(--primary);
  font-weight: 500;
}
</style>
