<template>
  <div class="signup-card">
    <h1 class="title">Create Account</h1>
    <p class="subtitle">Join us to organize your tasks and notes.</p>

    <form @submit.prevent="handleSignup">
      <div class="input-group">
        <label>Email</label>
        <input v-model="email" type="email" placeholder="name@example.com" required />
      </div>

      <div class="input-group">
        <label>Password</label>
        <input v-model="password" type="password" placeholder="Create a password" required />
      </div>

      <button type="submit" class="signup-btn">Sign Up</button>
    </form>

    <p class="footer-text">
      Already have an account? <router-link to="/login">Log in</router-link>
    </p>
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
/* Reusing similar styles for consistency */
.signup-card {
  background: white;
  width: 100%;
  max-width: 400px;
  padding: 40px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  text-align: center;
  border: 1px solid #e2e8f0;
}
.title { margin-bottom: 10px; color: #1e293b; font-size: 24px; font-weight: 700; }
.subtitle { margin-bottom: 30px; color: #64748b; font-size: 14px; }
.input-group { margin-bottom: 20px; text-align: left; }
label { display: block; margin-bottom: 8px; font-size: 14px; font-weight: 600; color: #334155; }
input { width: 100%; padding: 12px; border: 1px solid #cbd5e1; border-radius: 8px; outline: none; font-size: 14px; }
input:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1); }
.signup-btn { width: 100%; padding: 12px; background-color: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 600; font-size: 16px; cursor: pointer; }
.signup-btn:hover { background-color: #1d4ed8; }
.footer-text { margin-top: 20px; font-size: 14px; color: #64748b; }
.footer-text a { color: #2563eb; text-decoration: none; font-weight: 600; }
</style>
