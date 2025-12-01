<template>
  <div class="tasks-page">

    <h1 class="heading">Tasks</h1>

    <div class="progress-container" v-if="tasks.length > 0">
      <p>{{ completedTasks }} / {{ tasks.length }} tasks completed</p>

      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{ width: progressPercent + '%' }"
        ></div>
      </div>
    </div>

    <div class="priority-chart-box" v-if="tasks.length > 0">
      <canvas id="priorityChart"></canvas>
    </div>

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

      <select v-model="newPriority" class="priority-select">
        <option disabled value="">Priority</option>
        <option value="high">High 🔴</option>
        <option value="medium">Medium 🟠</option>
        <option value="low">Low 🟢</option>
      </select>

      <button @click="addTask">Add</button>
    </div>

    <div class="task-list">
      <div
        v-for="(task, index) in sortedTasks"
        :key="task._id"
        class="task-card"
        :class="taskClasses(task)"
      >
        <div class="left">
          <input
            type="checkbox"
            v-model="task.done"
            @change="toggleTaskStatus(task)"
          />

          <div class="task-info">
            <span class="task-text">{{ task.text }}</span>

            <small v-if="task.date" class="due-date">
              Due: {{ formatDate(task.date) }}
            </small>
          </div>
        </div>

        <span class="priority-badge" :class="task.priority">
          {{ task.priority }}
        </span>

        <button class="delete-btn" @click="deleteTask(task._id)">✖</button>
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
      tasks: [], // Initialize empty, will fill from DB
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
        const priorityA = a.priority ? a.priority.toLowerCase() : 'medium';
        const priorityB = b.priority ? b.priority.toLowerCase() : 'medium';
        return (order[priorityA] || 4) - (order[priorityB] || 4);
      });
    },
  },

  methods: {
    // 1. GET TASKS
    async fetchTasks() {
      try {
        const res = await fetch("/api/tasks");
        if (!res.ok) throw new Error("Failed to fetch tasks");
        const data = await res.json();
        this.tasks = data;
        this.renderPriorityChart();
      } catch (err) {
        console.error(err);
      }
    },

    // 2. CREATE TASK
    async addTask() {
      if (!this.newTask.trim() || !this.newPriority) return;

      const payload = {
        text: this.newTask,
        done: false,
        date: this.newTaskDate || null,
        priority: this.newPriority,
      };

      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const createdTask = await res.json();
          this.tasks.push(createdTask); // Add to local list

          // Reset form
          this.newTask = "";
          this.newTaskDate = "";
          this.newPriority = "";
          this.renderPriorityChart();
        }
      } catch (err) {
        console.error("Error adding task:", err);
      }
    },

    // 3. DELETE TASK
    async deleteTask(id) {
      if (!confirm("Are you sure you want to delete this task?")) return;

      try {
        const res = await fetch(`/api/tasks/${id}`, {
          method: "DELETE",
        });

        if (res.ok) {
          // Remove locally using filter
          this.tasks = this.tasks.filter(t => t._id !== id);
          this.renderPriorityChart();
        }
      } catch (err) {
        console.error("Error deleting task:", err);
      }
    },

    // 4. UPDATE STATUS (Check/Uncheck)
    async toggleTaskStatus(task) {
      try {
        await fetch(`/api/tasks/${task._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done: task.done }),
        });
        // We don't need to do anything else as v-model already updated the UI
      } catch (err) {
        console.error("Error updating task:", err);
        // Revert UI if API fails
        task.done = !task.done;
      }
    },

    formatDate(date) {
      if (!date) return "";
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
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }

      if (this.tasks.length === 0) return;

      const counts = { high: 0, medium: 0, low: 0 };

      this.tasks.forEach(task => {
        // Safe check for lowercase to match your select values
        const p = task.priority ? task.priority.toLowerCase() : 'medium';
        if (counts[p] !== undefined) counts[p]++;
        else counts['medium']++; // Fallback
      });

      // Wait for next DOM update ensuring canvas exists
      this.$nextTick(() => {
        const canvas = document.getElementById("priorityChart");
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
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
      });
    },
  },

  watch: {
    // Removed deep watcher to prevent auto-saving every keystroke to DB.
    // Instead we save specifically on actions (add, delete, toggle).
    tasks() {
      // Re-render chart if tasks array changes length roughly
      // But we call renderPriorityChart manually in CRUD methods usually
    }
  },

  mounted() {
    this.fetchTasks();
  },
};
</script>

<style>
/* ... (Your existing styles remain exactly the same) ... */
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
