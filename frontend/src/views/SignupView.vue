<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="title">Create Account ✨</h2>
      <p class="subtitle">Register to get started</p>

      <form @submit.prevent="signup" class="form">
        <input
          v-model="email"
          type="email"
          placeholder="Email"
          required
          class="input"
        />

        <input
          v-model="password"
          type="password"
          placeholder="Password"
          required
          class="input"
        />

        <button type="submit" class="login-btn">
          Sign Up
        </button>
      </form>

      <p class="link">
        Already have an account?
        <router-link to="/login">Login</router-link>
      </p>

      <p v-if="error" class="error">{{ error }}</p>
    </div>
  </div>
</template>

<script>
import API from "../services/api";

export default {
  data() {
    return {
      email: "",
      password: "",
      error: ""
    };
  },

  methods: {
    async signup() {
      try {
        const res = await API.post("/auth/signup", {
          email: this.email,
          password: this.password
        });

        // Store token & redirect
        localStorage.setItem("token", res.data.token);
        this.$router.push("/");
      } catch (err) {
        this.error = "Error creating account";
      }
    }
  }
};
</script>

<style scoped>
/* USE THE SAME STYLES AS LOGIN PAGE */
.login-page {
  height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom right, #f7f3f3, #e7dede);
  display: flex;
  justify-content: center;
  align-items: center;
}

.login-card {
  width: 380px;
  background: #ffffff;
  padding: 35px;
  border-radius: 20px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.input {
  width: 100%;
  padding: 12px;
  margin: 12px 0;
  border-radius: 8px;
  border: 1px solid #d2bcbc;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background: #6a4a4a;
  color: white;
  border: none;
  border-radius: 8px;
  margin-top: 10px;
}

.error {
  color: red;
}

.link {
  margin-top: 10px;
  font-size: 14px;
}
</style>
