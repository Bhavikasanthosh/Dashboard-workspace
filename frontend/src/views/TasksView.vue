<template>
  <div class="container">
    <h1 class="page-title">My Tasks</h1>

    <div v-if="tasks.length > 0" class="stats-container">
      <div class="progress-section">
        <div class="progress-info">
          <span>Progress</span>
          <span class="progress-text">{{ completedTasks }} / {{ tasks.length }} done</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: progressPercent + '%' }"></div>
        </div>
      </div>

      <div class="chart-box">
        <canvas id="priorityChart"></canvas>
      </div>
    </div>

    <div class="create-section">
      <div class="input-wrapper">
        <input
          v-model="newTask"
          type="text"
          class="task-input-field"
          placeholder="Add a new task..."
          @keyup.enter="addTask"
        />

        <div class="form-actions">
          <input
            v-model="newTaskDate"
            type="date"
            class="date-picker"
          />

          <select v-model="newPriority" class="priority-select">
            <option disabled value="">Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          <button @click="addTask" class="btn-primary">Add</button>
        </div>
      </div>
    </div>

    <div class="task-list">
      <div
        v-for="task in sortedTasks"
        :key="task._id"
        class="task-card"
        :class="{ completed: task.done }"
      >
        <div class="task-left">
          <label class="checkbox-wrapper">
            <input
              type="checkbox"
              v-model="task.done"
              @change="toggleTaskStatus(task)"
            />
            <span class="checkmark"></span>
          </label>

          <div class="task-details">
            <span class="task-text">{{ task.text }}</span>
            <small v-if="task.date" class="due-date" :class="getDateClass(task.date)">
              Due: {{ formatDate(task.date) }}
            </small>
          </div>
        </div>

        <div class="task-right">
          <span class="badge" :class="getPriorityClass(task.priority)">
            {{ task.priority }}
          </span>
          <button class="delete-btn" @click="deleteTask(task._id)">×</button>
        </div>
      </div>
    </div>

    <div v-if="tasks.length === 0" class="empty-msg">
      No tasks yet. Add one to get started.
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
      tasks: [],
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
    sortedTasks() {
      const order = { high: 1, medium: 2, low: 3 };
      return [...this.tasks].sort((a, b) => {
        const pA = a.priority ? a.priority.toLowerCase() : 'medium';
        const pB = b.priority ? b.priority.toLowerCase() : 'medium';
        return (order[pA] || 4) - (order[pB] || 4);
      });
    },
  },

  methods: {
    async fetchTasks() {
      try {
        const res = await fetch("/api/tasks");
        if (res.ok) {
          this.tasks = await res.json();
          this.$nextTick(() => this.renderPriorityChart());
        }
      } catch (err) {
        // Silent fail or UI notification
      }
    },

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
          this.tasks.push(createdTask);
          this.newTask = "";
          this.newTaskDate = "";
          this.newPriority = "";
          this.renderPriorityChart();
        }
      } catch (err) {
        // Handle error
      }
    },

    async deleteTask(id) {
      if (!confirm("Delete this task?")) return;

      try {
        const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
        if (res.ok) {
          this.tasks = this.tasks.filter((t) => t._id !== id);
          this.renderPriorityChart();
        }
      } catch (err) {
        // Handle error
      }
    },

    async toggleTaskStatus(task) {
      try {
        await fetch(`/api/tasks/${task._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done: task.done }),
        });
      } catch (err) {
        task.done = !task.done;
      }
    },

    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
    },

    getDateClass(date) {
      const today = new Date().toISOString().split("T")[0];
      if (date < today) return "text-red";
      if (date === today) return "text-orange";
      return "text-gray";
    },

    getPriorityClass(priority) {
      const map = {
        high: "bg-red",
        medium: "bg-orange",
        low: "bg-green",
      };
      return map[priority?.toLowerCase()] || "bg-gray";
    },

    renderPriorityChart() {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }

      if (this.tasks.length === 0) return;

      const counts = { high: 0, medium: 0, low: 0 };
      this.tasks.forEach((t) => {
        const p = t.priority ? t.priority.toLowerCase() : 'medium';
        if (counts[p] !== undefined) counts[p]++;
        else counts['medium']++;
      });

      const canvas = document.getElementById("priorityChart");
      if (!canvas) return;

      this.chart = new Chart(canvas, {
        type: "doughnut",
        data: {
          labels: ["High", "Medium", "Low"],
          datasets: [
            {
              data: [counts.high, counts.medium, counts.low],
              backgroundColor: ["#ef4444", "#f97316", "#10b981"],
              borderWidth: 0,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "right", labels: { boxWidth: 12, font: { size: 11 } } },
          },
        },
      });
    },
  },

  mounted() {
    this.fetchTasks();
  },
};
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  color: #1e293b;
}

.page-title {
  text-align: center;
  color: #1e3a8a;
  margin-bottom: 30px;
  font-weight: 700;
}

/* Stats Area */
.stats-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  margin-bottom: 30px;
  gap: 20px;
}

.progress-section {
  flex: 1;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  color: #334155;
}

.progress-track {
  width: 100%;
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #2563eb;
  transition: width 0.3s ease;
}

.chart-box {
  width: 180px;
  height: 90px;
  position: relative;
}

/* Input Form */
.create-section {
  display: flex;
  justify-content: center;
  margin-bottom: 40px;
}

.input-wrapper {
  background: white;
  border: 1px solid #bfdbfe;
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
}

.task-input-field {
  width: 100%;
  border: none;
  font-size: 1.1rem;
  padding: 8px 0;
  margin-bottom: 15px;
  outline: none;
  color: #1e3a8a;
  border-bottom: 1px solid #f1f5f9;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.date-picker, .priority-select {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #475569;
  background: white;
}

.btn-primary {
  margin-left: auto;
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

/* Task List */
.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 16px 20px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  transition: border-color 0.2s;
}

.task-card:hover {
  border-color: #93c5fd;
}

.task-card.completed .task-text {
  text-decoration: line-through;
  color: #94a3b8;
}

.task-left {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.checkbox-wrapper input {
  cursor: pointer;
  width: 18px;
  height: 18px;
}

.task-details {
  display: flex;
  flex-direction: column;
}

.task-text {
  font-size: 1rem;
  color: #0f172a;
}

.due-date {
  font-size: 0.75rem;
  margin-top: 2px;
}

.text-red { color: #ef4444; font-weight: 600; }
.text-orange { color: #f97316; font-weight: 600; }
.text-gray { color: #94a3b8; }

.task-right {
  display: flex;
  align-items: center;
  gap: 15px;
}

.badge {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  color: white;
}

.bg-red { background: #ef4444; }
.bg-orange { background: #f97316; }
.bg-green { background: #10b981; }
.bg-gray { background: #cbd5e1; }

.delete-btn {
  background: none;
  border: none;
  color: #cbd5e1;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 5px;
  line-height: 1;
}

.delete-btn:hover {
  color: #ef4444;
}

.empty-msg {
  text-align: center;
  color: #64748b;
  margin-top: 40px;
}
</style>
