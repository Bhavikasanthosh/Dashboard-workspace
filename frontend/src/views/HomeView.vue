<template>
  <main style="padding: 20px;">
    <h1>Home Page</h1>
    <p style="font-size: 20px; margin-top: 20px;">{{ message }}</p>
  </main>
</template>

<script>
import API from "../services/api";

export default {
  data() {
    return {
      message: "",
    };
  },
  methods: {
    async getMessage() {
      try {
        const res = await API.get("/test");
        this.message = res.data.message;
      } catch (error) {
        console.error("Error fetching message:", error);
      }
    },
  },
  mounted() {
    this.getMessage();
  },
};
</script>
