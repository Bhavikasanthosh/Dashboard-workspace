<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">Welcome Back</h1>
      <p class="auth-subtitle">Enter your details to access your workspace</p>

      <form @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="name@example.com" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Enter your password" required />
        </div>

        <button type="submit" class="auth-btn">Log In</button>
      </form>

      <p class="auth-footer">
        Don't have an account?
        <router-link to="/signup">Sign up</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "LoginView",
  data() {
    return { email: "", password: "" };
  },
  methods: {
    async handleLogin() {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        const data = await res.json();

        if (res.ok) {
          // Store token in Local Storage
          localStorage.setItem("token", data.token);
          // Redirect to Dashboard
          this.$router.push("/");
        } else {
          alert(data.message || "Invalid credentials");
        }
      } catch (err) {
        console.error(err);
        alert("Login failed");
      }
    },
  },
};
</script>

<style scoped>
/* Identical styling to SignupView for consistency */
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f1f5f9;
  font-family: 'Segoe UI', sans-serif;
}

.auth-card {
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.auth-title { margin-bottom: 5px; color: #1e293b; font-weight: 800; }
.auth-subtitle { color: #64748b; margin-bottom: 30px; font-size: 0.9rem; }

.auth-form { display: flex; flex-direction: column; gap: 20px; }

.form-group { text-align: left; }
.form-group label { display: block; margin-bottom: 8px; font-size: 0.9rem; color: #334155; font-weight: 600; }
.form-group input {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}
.form-group input:focus { border-color: #2563eb; }

.auth-btn {
  background: #2563eb;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.auth-btn:hover { background: #1d4ed8; }

.auth-footer { margin-top: 20px; font-size: 0.9rem; color: #64748b; }
.auth-footer a { color: #2563eb; text-decoration: none; font-weight: 600; }
</style>
