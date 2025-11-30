<template>
  <div class="tasks-page">

    <h1 class="heading">Tasks</h1>

    <!-- Progress Bar -->
    <div class="progress-container" v-if="tasks.length > 0">
      <p>{{ completedTasks }} / {{ tasks.length }} tasks completed</p>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
    </div>

    <!-- Priority Pie Chart -->
    <div class="priority-chart-box" v-if="tasks.length > 0">
      <canvas id="priorityChart"></canvas>
    </div>

    <!-- Add New Task -->
    <div class="task-input">
      <input
        v-model="newTask"
        type="text"
        placeholder="Add a new task..."
        @keyup.enter="addTask"
      />

      <input
        v-model="newTaskDate"
        type="date"
        class="date-picker"
      />

      <!-- PRIORITY DROPDOWN -->
      <select v-model="newPriority" class="priority-select">
        <option disabled value="">Priority</option>
        <option value="high">High 🔴</option>
        <option value="medium">Medium 🟠</option>
        <option value="low">Low 🟢</option>
      </select>

      <button @click="addTask">Add</button>
    </div>

    <!-- Task List -->
    <div class="task-list">
      <div
        v-for="(task, index) in sortedTasks"
        :key="index"
        class="task-card"
        :class="taskClasses(task)"
      >
        <div class="left">
          <input type="checkbox" v-model="task.done" />

          <div class="task-info">
            <span class="task-text">{{ task.text }}</span>

            <small v-if="task.date" class="due-date">
              Due: {{ formatDate(task.date) }}
            </small>
          </div>
        </div>

        <!-- PRIORITY BADGE -->
        <span class="priority-badge" :class="task.priority">
          {{ task.priority }}
        </span>

        <button class="delete-btn" @click="deleteTask(index)">✖</button>
      </div>
    </div>

  </div>
</template>

<script>
import { Chart } from "chart.js/auto";

export default {
  name: "TasksView",

  data() {
    return {
      newTask: "",
      newTaskDate: "",
      newPriority: "",
      tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
      chart: null,
    };
  },

  computed: {
    completedTasks() {
      return this.tasks.filter((t) => t.done).length;
    },
    progressPercent() {
      if (this.tasks.length === 0) return 0;
      return Math.round((this.completedTasks / this.tasks.length) * 100);
    },

    // SORTING: High → Medium → Low
    sortedTasks() {
      const order = { high: 1, medium: 2, low: 3 };
      return [...this.tasks].sort((a, b) => {
        return (order[a.priority] || 4) - (order[b.priority] || 4);
      });
    },
  },

  methods: {
    addTask() {
      if (!this.newTask.trim() || !this.newPriority) return;

      this.tasks.push({
        text: this.newTask,
        done: false,
        date: this.newTaskDate || null,
        priority: this.newPriority,
      });

      this.newTask = "";
      this.newTaskDate = "";
      this.newPriority = "";
      this.saveTasks();
    },

    deleteTask(index) {
      this.tasks.splice(index, 1);
      this.saveTasks();
    },

    saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(this.tasks));
    },

    formatDate(date) {
      const d = new Date(date);
      return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },

    taskClasses(task) {
      if (task.done) return "completed";

      const today = new Date().toISOString().split("T")[0];

      if (task.date) {
        if (task.date < today) return "overdue";
        if (task.date === today) return "due-today";
      }

      return "";
    },

    // PIE CHART RENDER
    renderPriorityChart() {
      if (this.chart) this.chart.destroy();

      const counts = { high: 0, medium: 0, low: 0 };

      this.tasks.forEach(task => {
        if (task.priority === "high") counts.high++;
        else if (task.priority === "medium") counts.medium++;
        else if (task.priority === "low") counts.low++;
      });

      const ctx = document.getElementById("priorityChart");

      this.chart = new Chart(ctx, {
        type: "pie",
        data: {
          labels: ["High", "Medium", "Low"],
          datasets: [
            {
              data: [counts.high, counts.medium, counts.low],
              backgroundColor: ["#ef4444", "#f59e0b", "#10b981"],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
    },
  },

  watch: {
    tasks: {
      handler() {
        this.saveTasks();
        this.renderPriorityChart();
      },
      deep: true,
    },
  },

  mounted() {
    this.renderPriorityChart();
  },
};
</script>

<style>
.tasks-page {
  max-width: 750px;
  margin: 0 auto;
}

/* Heading */
.heading {
  font-size: 32px;
  margin-bottom: 20px;
  color: #1e293b;
}

/* Progress Section */
.progress-container {
  margin-bottom: 25px;
}

.progress-container p {
  margin-bottom: 10px;
  font-size: 16px;
  color: #334155;
}

.progress-bar {
  width: 100%;
  height: 14px;
  background: #e2e8f0;
  border-radius: 10px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #6366f1;
  transition: width 0.3s ease;
}

/* Pie chart container */
.priority-chart-box {
  max-width: 300px;
  margin: 25px auto;
}

/* Input section */
.task-input {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}

.task-input input[type="text"] {
  flex: 1;
  padding: 12px 15px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  font-size: 16px;
}

.date-picker {
  padding: 12px 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

.priority-select {
  padding: 12px 10px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
  background: white;
}

/* Task list */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  background: white;
  padding: 15px 18px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.task-card.completed .task-text {
  text-decoration: line-through;
  color: #94a3b8;
}

/* Highlight overdue tasks */
.task-card.overdue {
  border-color: #ef4444;
  background: #fee2e2;
}

/* Highlight today's tasks */
.task-card.due-today {
  border-color: #facc15;
  background: #fef9c3;
}

.left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.task-info {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.due-date {
  font-size: 12px;
  color: #475569;
}

/* Delete button */
.delete-btn {
  background: #ef4444;
  border: none;
  color: white;
  font-size: 16px;
  padding: 6px 10px;
  border-radius: 6px;
  cursor: pointer;
}

.delete-btn:hover {
  background: #dc2626;
}

/* PRIORITY BADGES */
.priority-badge {
  padding: 6px 10px;
  border-radius: 8px;
  font-size: 12px;
  text-transform: uppercase;
  color: white;
}

.priority-badge.high {
  background: #ef4444;
}
.priority-badge.medium {
  background: #f59e0b;
}
.priority-badge.low {
  background: #10b981;
}
</style>
