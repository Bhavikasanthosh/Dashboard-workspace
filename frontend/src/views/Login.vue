<template>
  <div class="auth-container">
    <div class="left-panel">
      <h1 class="title">Workspace<br>Dashboard</h1>
    </div>

    <div class="right-panel">
      <div class="auth-card">
        <h2>Welcome Back</h2>
        <p class="sub">Access your Workspace Dashboard</p>

        <input type="email" v-model="email" placeholder="student@example.com" />
        <input type="password" v-model="password" placeholder="••••••" />

        <button @click="login">Login</button>

        <p class="small">
          Don’t have an account?
          <router-link to="/signup">Create one</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const email = ref("");
const password = ref("");

const login = () => {
  console.log("Logging in:", email.value, password.value);
};
</script>

<style>
.auth-container {
  display: flex;
  height: 100vh;
}

.left-panel {
  flex: 1;
  background: #eef1f6;
  display: flex;
  justify-content: center;
  align-items: center;
}

.title {
  font-size: 50px;
  line-height: 1.1;
  font-weight: 700;
  color: #1e293b;
}

.right-panel {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.auth-card {
  width: 340px;
  background: white;
  padding: 35px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  text-align: center;
}

.auth-card h2 {
  font-size: 26px;
  margin-bottom: 8px;
}

.sub {
  margin-bottom: 25px;
  color: #6b7280;
}

input {
  width: 100%;
  padding: 12px;
  margin-bottom: 15px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 15px;
}

button {
  width: 100%;
  padding: 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background: #2563eb;
}

.small {
  margin-top: 15px;
  font-size: 14px;
}

.small a {
  color: #3b82f6;
  font-weight: 600;
}
</style>
