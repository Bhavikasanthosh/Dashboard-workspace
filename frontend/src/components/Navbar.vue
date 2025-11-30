<template>
  <nav class="navbar">
    <h1 class="logo">Digital Workspace</h1>

    <div class="links">
      <a href="#">Home</a>
      <a href="#">Features</a>
      <a href="#">Tools</a>
      <a href="#">Pages</a>
      <a href="#">About</a>
      <span class="search">🔍</span>
    </div>
  </nav>
</template>

<style>
.navbar {
  height: 70px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 30px;
  border-bottom: 1px solid #e5e7eb;
}

.logo {
  font-size: 20px;
  font-weight: 700;
}

.links {
  display: flex;
  gap: 25px;
  align-items: center;
}

.links a {
  text-decoration: none;
  color: #1e293b;
  font-size: 15px;
}

.links a:hover {
  color: #6366f1;
  text-decoration: underline;
}

.search {
  font-size: 18px;
  cursor: pointer;
}
</style>
