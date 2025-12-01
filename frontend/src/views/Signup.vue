<template>
  <div class="auth-container">
    <div class="left-panel">
      <h1 class="title">Create<br>Your Account</h1>
    </div>

    <div class="right-panel">
      <div class="auth-card">
        <h2>Sign Up</h2>
        <p class="sub">Join the Workspace Dashboard</p>

        <input type="text" v-model="name" placeholder="Full Name" />
        <input type="email" v-model="email" placeholder="student@example.com" />
        <input type="password" v-model="password" placeholder="Create password" />

        <button @click="signup">Create Account</button>

        <p class="small">
          Already have an account?
          <router-link to="/login">Login</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

const name = ref("");
const email = ref("");
const password = ref("");

const signup = () => {
  console.log("Signing up:", name.value, email.value, password.value);
};
</script>

<style>
/* Exact same styling as Login.vue */
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
  background: #10b981;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  cursor: pointer;
}

button:hover {
  background: #0d946b;
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
