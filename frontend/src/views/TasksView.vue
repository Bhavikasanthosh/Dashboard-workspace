<template>
  <div class="task-dashboard">
    <div class="content-container">

      <div class="dashboard-head">
        <h1 class="head-title">Tasks</h1>
        <div class="stats-pill" v-if="tasks.length > 0">
          <div class="pill-track">
            <div class="pill-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <span>{{ completedTasks }}/{{ tasks.length }} Done</span>
        </div>
      </div>

      <div class="dashboard-grid">

        <aside class="side-panel">

          <div class="panel-card create-card">
            <h3>New Task</h3>
            <input
              v-model="newTask"
              class="side-input"
              placeholder="What to do?"
              @keyup.enter="addTask"
            />
            <div class="side-options">
              <input v-model="newTaskDate" type="date" class="date-mini" />
              <select v-model="newPriority" class="prio-mini">
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button @click="addTask" class="side-add-btn">Add Task</button>
          </div>

          <div class="panel-card chart-card" v-if="tasks.length > 0">
            <canvas id="priorityChart"></canvas>
          </div>

        </aside>

        <main class="main-list-area">
          <div
            v-for="task in sortedTasks"
            :key="task._id"
            class="task-strip"
            :class="{ 'is-done': task.done }"
          >
            <div class="strip-left">
              <input
                type="checkbox"
                v-model="task.done"
                class="round-check"
                @change="toggleTaskStatus(task)"
              />
              <div class="strip-info">
                <span class="strip-text">{{ task.text }}</span>
                <span v-if="task.date" class="strip-date" :class="getDateClass(task.date)">
                  {{ formatDate(task.date) }}
                </span>
              </div>
            </div>

            <div class="strip-right">
              <span class="prio-dot" :class="task.priority"></span>
              <button class="del-btn" @click="deleteTask(task._id)">×</button>
            </div>
          </div>

          <div v-if="tasks.length === 0" class="zero-state">
            No tasks. Relax or add a new one!
          </div>
        </main>

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
      newPriority: "medium",
      tasks: [],
      chart: null,
    };
  },
  computed: {
    completedTasks() { return this.tasks.filter(t => t.done).length; },
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
          this.$nextTick(() => this.renderChart());
        }
      } catch (err) {}
    },
    async addTask() {
      if (!this.newTask.trim()) return;
      const payload = {
        text: this.newTask,
        done: false,
        date: this.newTaskDate || null,
        priority: this.newPriority || 'medium',
      };
      try {
        const res = await fetch("/api/tasks", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          this.tasks.push(await res.json());
          this.newTask = "";
          this.renderChart();
        }
      } catch (err) {}
    },
    async deleteTask(id) {
      if (!confirm("Delete?")) return;
      try {
        const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
        if (res.ok) {
          this.tasks = this.tasks.filter(t => t._id !== id);
          this.renderChart();
        }
      } catch (err) {}
    },
    async toggleTaskStatus(task) {
      // 1. UPDATE CHART IMMEDIATELY ON CLICK
      this.renderChart();

      try {
        await fetch(`/api/tasks/${task._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done: task.done }),
        });
      } catch (err) {
        task.done = !task.done;
        this.renderChart(); // Revert chart if API fails
      }
    },
    formatDate(d) {
      if (!d) return "";
      return new Date(d).toLocaleDateString("en-GB", { month: "short", day: "numeric" });
    },
    getDateClass(d) {
      const today = new Date().toISOString().split("T")[0];
      if (d < today) return "text-red";
      if (d === today) return "text-orange";
      return "";
    },
    renderChart() {
      if (this.chart) { this.chart.destroy(); this.chart = null; }

      // 2. FILTER: Only count tasks that are NOT done
      const activeTasks = this.tasks.filter(t => !t.done);

      // If no active tasks, we don't render or render empty
      if (activeTasks.length === 0) return;

      const counts = { high: 0, medium: 0, low: 0 };

      // Loop through ACTIVE tasks only
      activeTasks.forEach(t => {
        const p = t.priority ? t.priority.toLowerCase() : 'medium';
        if (counts[p] !== undefined) counts[p]++; else counts['medium']++;
      });

      const ctx = document.getElementById("priorityChart");
      if (!ctx) return;

      this.chart = new Chart(ctx, {
        type: "doughnut",
        data: {
          labels: ["High", "Medium", "Low"],
          datasets: [{
            data: [counts.high, counts.medium, counts.low],
            backgroundColor: ["#ef4444", "#f97316", "#10b981"],
            borderWidth: 0,
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          cutout: '70%',
        },
      });
    },
  },
  mounted() { this.fetchTasks(); },
};
</script>

<style scoped>
.task-dashboard {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 30px;
  font-family: 'Segoe UI', sans-serif;
}

.content-container {
  max-width: 1600px; /* Fluid but capped for super-wide screens */
  margin: 0 auto;
  width: 100%;
}

/* Header */
.dashboard-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}
.head-title { font-size: 2rem; font-weight: 800; color: #0f172a; margin: 0; }

.stats-pill {
  background: white;
  padding: 8px 16px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  gap: 10px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  font-weight: 600;
  color: #334155;
}
.pill-track {
  width: 100px;
  height: 6px;
  background: #e2e8f0;
  border-radius: 3px;
  overflow: hidden;
}
.pill-fill { height: 100%; background: #2563eb; transition: width 0.3s; }

/* Main Grid Layout */
.dashboard-grid {
  display: grid;
  grid-template-columns: 320px 1fr; /* Fixed Sidebar + Fluid Main */
  gap: 30px;
}

@media (max-width: 900px) {
  .dashboard-grid { grid-template-columns: 1fr; } /* Stack on mobile */
}

/* Side Panel */
.side-panel { display: flex; flex-direction: column; gap: 20px; }

.panel-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
}
.panel-card h3 { margin: 0 0 15px 0; font-size: 1.1rem; color: #1e293b; }

.side-input {
  width: 100%;
  padding: 10px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  margin-bottom: 10px;
  outline: none;
}
.side-options { display: flex; gap: 10px; margin-bottom: 15px; }
.date-mini, .prio-mini {
  flex: 1;
  padding: 8px;
  border: 1px solid #e2e8f0;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #64748b;
}
.side-add-btn {
  width: 100%;
  background: #2563eb;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
.side-add-btn:hover { background: #1d4ed8; }

.chart-card { height: 200px; display: flex; justify-content: center; }

/* Task List */
.main-list-area {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.task-strip {
  background: white;
  padding: 15px 20px;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
  border: 1px solid #f1f5f9;
  transition: transform 0.1s;
}
.task-strip:hover { transform: translateX(2px); border-color: #cbd5e1; }

.strip-left { display: flex; align-items: center; gap: 15px; }
.round-check { width: 20px; height: 20px; cursor: pointer; accent-color: #2563eb; }

.strip-info { display: flex; flex-direction: column; }
.strip-text { font-size: 1rem; color: #1e293b; font-weight: 500; }
.strip-date { font-size: 0.8rem; color: #94a3b8; }
.text-red { color: #ef4444; font-weight: 700; }
.text-orange { color: #f97316; font-weight: 700; }

.strip-right { display: flex; align-items: center; gap: 15px; }
.prio-dot { width: 10px; height: 10px; border-radius: 50%; display: inline-block; }
.prio-dot.high { background: #ef4444; box-shadow: 0 0 5px #fecaca; }
.prio-dot.medium { background: #f97316; }
.prio-dot.low { background: #10b981; }

.del-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #cbd5e1;
  cursor: pointer;
  line-height: 1;
}
.del-btn:hover { color: #ef4444; }

.is-done { opacity: 0.6; }
.is-done .strip-text { text-decoration: line-through; color: #94a3b8; }

.zero-state { text-align: center; margin-top: 50px; color: #94a3b8; }
</style>
