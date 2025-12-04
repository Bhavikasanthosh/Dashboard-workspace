<template>
  <div class="login-card">
    <h1 class="title">Welcome Back</h1>
    <p class="subtitle">Enter your credentials to access your workspace.</p>

    <form @submit.prevent="handleLogin">
      <div class="input-group">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="name@example.com" required />
      </div>

      <div class="input-group">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="••••••••" required />
      </div>

      <button type="submit" class="login-btn">Sign In</button>
    </form>

    <p class="footer-text">
      New here? <router-link to="/signup">Create an account</router-link>
    </p>
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
          localStorage.setItem("token", data.token);
          this.$router.push("/"); // Redirect to Dashboard
        } else {
          alert(data.message);
        }
      } catch (err) {
        console.error(err);
      }
    },
  },
};
</script>

<style scoped>
.login-card {
  background: white;
  width: 100%;
  max-width: 400px; /* Restricts width for readability */
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  border: 1px solid #e2e8f0;
}

.title {
  margin-bottom: 10px;
  color: #1e293b;
  font-size: 24px;
  font-weight: 700;
}

.subtitle {
  margin-bottom: 30px;
  color: #64748b;
  font-size: 14px;
}

.input-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #334155;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  transition: border-color 0.2s;
}

input:focus {
  border-color: #3b82f6; /* Focus Blue */
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #2563eb;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: #1d4ed8;
}

.footer-text {
  margin-top: 20px;
  font-size: 14px;
  color: #64748b;
}

.footer-text a {
  color: #2563eb;
  text-decoration: none;
  font-weight: 600;
}
</style>
