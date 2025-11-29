<template>
  <div class="login-page">
    <div class="login-card">
      <h2 class="title">Welcome Back 👋</h2>
      <p class="subtitle">Login to continue</p>

      <form @submit.prevent="login" class="form">
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

        <button type="submit" class="login-btn">Login</button>
      </form>

      <p class="signup-link">
        Don't have an account?
        <router-link to="/signup">Create one</router-link>
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

  mounted() {
    // Reset fields when entering login page
    this.email = "";
    this.password = "";
    this.error = "";
  },

  methods: {
    async login() {
      try {
        const res = await API.post("/auth/login", {
          email: this.email,
          password: this.password
        });

        // Store token
        localStorage.setItem("token", res.data.token);

        // Redirect to home
        this.$router.push("/");
      } catch (err) {
        this.error = "Invalid email or password";
      }
    }
  }
};
</script>

<style scoped>
/* FULL PAGE BACKGROUND */
.login-page {
  height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom right, #f7f3f3, #e7dede);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  margin: 0;
}

/* CARD */
.login-card {
  width: 380px;
  background: rgba(255, 255, 255, 0.85);
  padding: 35px;
  border-radius: 20px;
  backdrop-filter: blur(8px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.12);
  text-align: center;
  animation: fadeIn 0.7s ease-in-out;
}

/* TITLES */
.title {
  font-size: 26px;
  font-weight: 700;
  color: #3a2f2f;
  margin-bottom: 6px;
}

.subtitle {
  font-size: 14px;
  color: #7b6f6f;
  margin-bottom: 20px;
}

/* INPUT FIELDS */
.input {
  width: 100%;
  padding: 12px;
  margin-top: 12px;
  margin-bottom: 6px;
  border-radius: 8px;
  border: 1px solid #c9b8b8;
  outline: none;
  transition: 0.2s;
}

.input:focus {
  border-color: #855c5c;
  box-shadow: 0 0 5px rgba(133, 92, 92, 0.4);
}

/* BUTTON */
.login-btn {
  width: 100%;
  padding: 12px;
  background: #6a4a4a;
  color: white;
  border: none;
  border-radius: 8px;
  margin-top: 16px;
  cursor: pointer;
  font-size: 15px;
  transition: 0.2s;
}

.login-btn:hover {
  background: #553737;
}

/* SIGNUP LINK */
.signup-link {
  margin-top: 15px;
  font-size: 13px;
}

.signup-link a {
  color: #6a4a4a;
  font-weight: 600;
}

/* ERROR */
.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

/* ANIMATION */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
