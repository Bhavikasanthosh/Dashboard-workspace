<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')

const handleSignup = () => {
  // validation!!
  if (!name.value || !email.value || !password.value) {
    alert("Please fill in all fields.")
    return
  }

  localStorage.setItem('storedName', name.value)
  localStorage.setItem('storedEmail', email.value)
  localStorage.setItem('storedPassword', password.value)


  alert('Account created successfully! Please sign in.')
  router.push('/login')
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <div class="auth-header">
        <h1 class="auth-title">Create Account</h1>
        <p class="auth-subtitle">Start your journey with Orbit today.</p>
      </div>

      <form @submit.prevent="handleSignup" class="auth-form">
        <div class="input-group">
          <label for="name">Full Name</label>
          <input
            type="text"
            id="name"
            v-model="name"
            class="modern-input"
            placeholder="John Doe"
            required
          />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            v-model="email"
            class="modern-input"
            placeholder="name@example.com"
            required
          />
        </div>

        <div class="input-group">
          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            v-model="password"
            class="modern-input"
            placeholder="••••••••"
            required
          />
        </div>

        <button type="submit" class="primary-btn">
          Sign Up
        </button>
      </form>

      <div class="auth-footer">
        <p>Already have an account? <router-link to="/login" class="link-text">Sign In</router-link></p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #faf9f6;
  padding: 20px;
  font-family: 'Segoe UI', sans-serif;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 24px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px -10px rgba(62, 39, 35, 0.1);
  border: 1px solid #efebe9;
  text-align: center;
}

.auth-header { margin-bottom: 30px; }
.auth-title {
  font-size: 2rem;
  font-weight: 800;
  color: #3e2723;
  margin: 0 0 10px 0;
}
.auth-subtitle { color: #8d6e63; font-size: 1rem; }

.auth-form {
  display: flex; flex-direction: column; gap: 20px; margin-bottom: 25px; text-align: left;
}

.input-group { display: flex; flex-direction: column; gap: 8px; }
.input-group label { font-size: 0.9rem; font-weight: 600; color: #5d4037; }

.modern-input {
  width: 100%; padding: 14px 16px;
  background: #fdfbf7; border: 1px solid #d7ccc8; border-radius: 12px;
  font-size: 1rem; color: #3e2723; transition: all 0.2s;
}
.modern-input:focus {
  background: white; border-color: #8d6e63; outline: none;
  box-shadow: 0 0 0 3px rgba(141, 110, 99, 0.1);
}

.primary-btn {
  background: #5d4037; color: white; border: none; padding: 16px; border-radius: 12px;
  font-weight: 700; font-size: 1.1rem; cursor: pointer;
  transition: transform 0.1s, background 0.2s; margin-top: 10px;
}
.primary-btn:hover { background: #4e342e; transform: translateY(-1px); }

.auth-footer p { color: #8d6e63; font-size: 0.95rem; }
.link-text { color: #e65100; font-weight: 700; text-decoration: none; }
.link-text:hover { color: #bf360c; }
</style>
