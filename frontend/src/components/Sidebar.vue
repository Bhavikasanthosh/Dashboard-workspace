<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="logo-shape">✨</div>
      <span class="brand-name">Orbit</span>
    </div>

    <nav class="menu">
      <p class="menu-label">MAIN</p>

      <router-link to="/" class="nav-link" active-class="active">
        <span class="icon">⚡</span> Dashboard
      </router-link>

      <router-link to="/tasks" class="nav-link" active-class="active">
        <span class="icon">✅</span> My Tasks
      </router-link>

      <router-link to="/notes" class="nav-link" active-class="active">
        <span class="icon">💡</span> Ideas
      </router-link>

      <router-link to="/focus-timer" class="nav-link" active-class="active">
        <span class="icon">⏳</span> Focus
      </router-link>

      <p class="menu-label" style="margin-top: 20px;">DATA</p>
      <router-link to="/analytics" class="nav-link" active-class="active">
        <span class="icon">📊</span> Analytics
      </router-link>
    </nav>

  </aside>
</template>


<style scoped>
.sidebar {
  width: 250px; /* Fixed width if variable is missing */
  height: 100vh;
  background: #ffffff; /* Changed to pure white for cleaner look */
  border-right: 1px solid rgba(0,0,0,0.05);
  display: flex;
  flex-direction: column;
  padding: 2rem 1.5rem;
  box-shadow: 5px 0 30px rgba(0,0,0,0.02);
  z-index: 50;
}

/* Brand */
.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 3rem;
  padding-left: 10px;
}
.logo-shape {
  width: 40px; height: 40px;
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%); /* Purple gradient */
  border-radius: 12px;
  display: flex;
  align-items: center; justify-content: center;
  font-size: 1.2rem;
  color: white;
  box-shadow: 0 10px 20px -5px rgba(99, 102, 241, 0.4);
}
.brand-name {
  font-size: 1.5rem;
  font-weight: 800; /* Extra Bold */
  letter-spacing: -0.5px;
  color: #111827; /* Solid Black */
}

/* Menu */
.menu { flex: 1; }
.menu-label {
  font-size: 0.75rem;
  font-weight: 800; /* Bold */
  color: #9ca3af; /* Gray for labels is fine */
  letter-spacing: 1px;
  margin-bottom: 10px;
  padding-left: 12px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 16px;
  border-radius: 12px;

  /* --- CHANGED HERE: Black and Bold --- */
  color: #111827; /* Dark Black */
  font-weight: 700; /* Bold */

  transition: all 0.2s ease;
  margin-bottom: 4px;
  text-decoration: none;
}

/* Hover State */
.nav-link:hover {
  background: #f3f4f6; /* Light Gray */
  color: #000000;
  transform: translateX(3px);
}

/* --- CHANGED HERE: Active State (The Purple Fix) --- */
.nav-link.active {
  background: #eef2ff; /* Light Purple Background */
  color: #4f46e5;      /* Dark Purple Text (Visible!) */
  box-shadow: none;    /* Removed heavy shadow for cleaner look */
}

.nav-link.active .icon { opacity: 1; }
.icon { font-size: 1.1rem; opacity: 1; } /* Made icons fully visible */

</style>
