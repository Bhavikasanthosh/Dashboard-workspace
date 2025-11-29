<template>
  <aside class="sidebar">
    <ul>
      <li>Focus Timer </li>
      <li>Tasks </li>
      <li>Notes </li>
      <li>Analytics </li>
    </ul>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 220px;
  background: #6b5353;
  height: 100vh;
  padding: 20px;
  color: rgb(25, 1, 1);
}
.sidebar ul {
  list-style: none;
  padding: 0;
}
.sidebar li {
  padding: 12px 0;
  cursor: pointer;
  font-size: 18px;
}
.sidebar li:hover {
  opacity: 0.7;
}
</style>
