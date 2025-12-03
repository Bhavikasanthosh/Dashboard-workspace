<template>
  <div class="auth-page">
    <div class="auth-card">
      <h1 class="auth-title">Create Account</h1>
      <p class="auth-subtitle">Join your digital workspace</p>

      <form @submit.prevent="handleSignup" class="auth-form">
        <div class="form-group">
          <label>Email</label>
          <input v-model="email" type="email" placeholder="name@example.com" required />
        </div>

        <div class="form-group">
          <label>Password</label>
          <input v-model="password" type="password" placeholder="Create a password" required />
        </div>

        <button type="submit" class="auth-btn">Sign Up</button>
      </form>

      <p class="auth-footer">
        Already have an account?
        <router-link to="/login">Log in</router-link>
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "SignupView",
  data() {
    return { email: "", password: "" };
  },
  methods: {
    async handleSignup() {
      try {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: this.email, password: this.password }),
        });

        const data = await res.json();

        if (res.ok) {
          alert("Account created! Please log in.");
          this.$router.push("/login");
        } else {
          alert(data.message || "Signup failed");
        }
      } catch (err) {
        console.error(err);
        alert("Something went wrong");
      }
    },
  },
};
</script>

<style scoped>
/* Same styles as LoginView for consistency */
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
