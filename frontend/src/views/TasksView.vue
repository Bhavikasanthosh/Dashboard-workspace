<template>
  <div class="task-dashboard">
    <div class="content-container">

      <div class="dashboard-head">
        <div>
          <h1 class="head-title">My Tasks</h1>
          <p class="head-subtitle">Focus on what matters today.</p>
        </div>

        <div class="stats-pill" v-if="tasks.length > 0">
          <div class="pill-track">
            <div class="pill-fill" :style="{ width: progressPercent + '%' }"></div>
          </div>
          <span class="pill-text">{{ completedTasks }} / {{ tasks.length }} Done</span>
        </div>
      </div>

      <div class="dashboard-grid">

        <aside class="side-panel">

          <div class="panel-card create-card">
            <h3 class="card-title">New Entry</h3>

            <div class="input-group">
              <input
                v-model="newTask"
                class="modern-input"
                placeholder="Write a task..."
                @keyup.enter="addTask"
              />
            </div>

            <div class="options-row">
              <div class="input-wrapper">
                <label>Date</label>
                <input v-model="newTaskDate" type="date" class="modern-select" />
              </div>
              <div class="input-wrapper">
                <label>Priority</label>
                <select v-model="newPriority" class="modern-select">
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <button @click="addTask" class="primary-btn">
              <span>Add to List</span>
            </button>
          </div>

          <div class="panel-card chart-card" v-if="tasks.length > 0">
            <h3 class="card-title center-text">Status</h3>
            <div class="chart-container">
              <canvas id="priorityChart"></canvas>
            </div>
          </div>
        </aside>

        <main class="main-list-area">
          <transition-group name="list" tag="div">
            <div
              v-for="task in sortedTasks"
              :key="task._id"
              class="task-strip"
              :class="{ 'is-done': task.done }"
            >
              <div class="strip-left">
                <label class="custom-checkbox">
                  <input
                    type="checkbox"
                    v-model="task.done"
                    @change="toggleTaskStatus(task)"
                  />
                  <span class="checkmark"></span>
                </label>

                <div class="strip-info">
                  <span class="strip-text">{{ task.text }}</span>
                  <div class="strip-meta">
                    <span v-if="task.date" class="meta-tag date-tag">
                      {{ formatDate(task.date) }}
                    </span>
                    <span class="meta-tag prio-tag" :class="task.priority">
                      {{ task.priority }}
                    </span>
                  </div>
                </div>
              </div>

              <button class="icon-btn delete-btn" @click="deleteTask(task._id)">
                <Trash2 size="18" />
              </button>
            </div>
          </transition-group>

          <div v-if="tasks.length === 0" class="zero-state">
            <Coffee size="48" class="text-brown-light mb-4" />
            <h3>It's quiet here.</h3>
            <p>Time for a coffee break?</p>
          </div>
        </main>

      </div>
    </div>
  </div>
</template>

<script>
import { Chart } from "chart.js/auto";
import { Trash2, Coffee } from 'lucide-vue-next';

export default {
  name: "TasksView",
  components: { Trash2, Coffee },
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
    completedTasks() {
      return this.tasks.filter(t => t.done).length;
    },
    progressPercent() {
      if (this.tasks.length === 0) return 0;
      return Math.round((this.completedTasks / this.tasks.length) * 100);
    },
    sortedTasks() {
      const order = { high: 1, medium: 2, low: 3 };
      return [...this.tasks].sort((a, b) => {
        // Sort by done status (pending first), then by priority
        if (a.done !== b.done) return a.done ? 1 : -1;
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
      } catch (err) {
        console.error("Failed to fetch tasks");
      }
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
      } catch (err) {
        console.error("Error adding task");
      }
    },
    async deleteTask(id) {
      if (!confirm("Delete this task?")) return;
      try {
        const res = await fetch(`/api/tasks/${id}`, { method: "DELETE" });
        if (res.ok) {
          this.tasks = this.tasks.filter(t => t._id !== id);
          this.renderChart();
        }
      } catch (err) {
        console.error("Error deleting task");
      }
    },
    async toggleTaskStatus(task) {
      this.renderChart(); // Update chart immediately
      try {
        await fetch(`/api/tasks/${task._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ done: task.done }),
        });
      } catch (err) {
        // Revert if API fails
        task.done = !task.done;
        this.renderChart();
      }
    },
    formatDate(d) {
      if (!d) return "";
      return new Date(d).toLocaleDateString("en-GB", { month: "short", day: "numeric" });
    },
    renderChart() {
      if (this.chart) {
        this.chart.destroy();
        this.chart = null;
      }

      const activeTasks = this.tasks.filter(t => !t.done);
      if (activeTasks.length === 0) return;

      const counts = { high: 0, medium: 0, low: 0 };
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
            // --- UPDATED COLORS TO MATCH BROWN THEME ---
            backgroundColor: [
              "#3e2723",  // High: Dark Espresso
              "#8d6e63",  // Medium: Smooth Mocha
              "#d7ccc8"   // Low: Light Latte
            ],
            borderWidth: 0,
            hoverOffset: 4
          }],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          cutout: '75%',
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
/* BACKGROUND */
.task-dashboard {
  min-height: 100vh;
  background-color: #faf9f6; /* Off-white Paper color */
  padding: 40px;
  font-family: 'Segoe UI', sans-serif;
  color: #3e2723;
}

.content-container { max-width: 1200px; margin: 0 auto; }

/* HEADERS */
.dashboard-head { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 40px; }
.head-title { font-size: 2.5rem; font-weight: 800; color: #3e2723; margin: 0; }
.head-subtitle { color: #8d6e63; margin-top: 5px; font-size: 1.1rem; }

/* PILL */
.stats-pill {
  background: white;
  padding: 10px 20px;
  border-radius: 16px;
  display: flex; flex-direction: column; gap: 8px;
  box-shadow: 0 4px 10px -2px rgba(62, 39, 35, 0.05);
  border: 1px solid #efebe9;
}
.pill-track { width: 140px; height: 8px; background: #efebe9; border-radius: 4px; overflow: hidden; }
.pill-fill { height: 100%; background: linear-gradient(90deg, #8d6e63, #5d4037); transition: width 0.5s ease; }
.pill-text { font-size: 0.85rem; font-weight: 700; color: #5d4037; }

/* GRID */
.dashboard-grid { display: grid; grid-template-columns: 350px 1fr; gap: 40px; align-items: start; }
@media (max-width: 1000px) { .dashboard-grid { grid-template-columns: 1fr; } }

/* CARDS */
.panel-card {
  background: white; padding: 24px; border-radius: 20px;
  box-shadow: 0 10px 20px -5px rgba(62, 39, 35, 0.05);
  border: 1px solid #efebe9;
}
.card-title { font-size: 1.1rem; font-weight: 700; color: #3e2723; margin-bottom: 20px; }
.center-text { text-align: center; }

/* INPUTS */
.create-card { display: flex; flex-direction: column; gap: 16px; }
.modern-input, .modern-select {
  width: 100%; padding: 12px 16px;
  background: #fdfbf7;
  border: 1px solid #d7ccc8;
  border-radius: 12px;
  font-size: 0.95rem; color: #3e2723;
  transition: all 0.2s;
}
.modern-input:focus, .modern-select:focus {
  background: white; border-color: #8d6e63; outline: none;
  box-shadow: 0 0 0 3px rgba(141, 110, 99, 0.1);
}

.options-row { display: flex; gap: 12px; }
.input-wrapper { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.input-wrapper label { font-size: 0.75rem; font-weight: 700; color: #8d6e63; }

/* BUTTON */
.primary-btn {
  background: #5d4037;
  color: white; border: none; padding: 14px; border-radius: 12px;
  font-weight: 600; font-size: 1rem; cursor: pointer;
  transition: transform 0.1s, background 0.2s; margin-top: 10px;
}
.primary-btn:hover { background: #4e342e; transform: translateY(-1px); }

/* CHART */
.chart-container { height: 220px; position: relative; }

/* LIST */
.main-list-area { display: flex; flex-direction: column; gap: 16px; }
.task-strip {
  background: white; padding: 16px 24px; border-radius: 16px;
  display: flex; justify-content: space-between; align-items: center;
  box-shadow: 0 2px 5px rgba(62, 39, 35, 0.03);
  border: 1px solid #efebe9; transition: all 0.2s ease;
}
.task-strip:hover { transform: translateY(-2px); box-shadow: 0 8px 15px -3px rgba(62, 39, 35, 0.08); }

.strip-left { display: flex; align-items: flex-start; gap: 16px; }
.strip-info { display: flex; flex-direction: column; gap: 4px; }
.strip-text { font-size: 1.05rem; font-weight: 600; color: #3e2723; }

/* CHECKBOX */
.custom-checkbox { position: relative; display: inline-block; width: 22px; height: 22px; cursor: pointer; top: 2px;}
.custom-checkbox input { opacity: 0; width: 0; height: 0; }
.checkmark { position: absolute; top: 0; left: 0; height: 22px; width: 22px; background-color: #faf9f6; border-radius: 6px; border: 2px solid #a1887f; transition: all 0.2s; }
.custom-checkbox:hover input ~ .checkmark { background-color: #efebe9; }
.custom-checkbox input:checked ~ .checkmark { background-color: #5d4037; border-color: #5d4037; }
.checkmark:after { content: ""; position: absolute; display: none; }
.custom-checkbox input:checked ~ .checkmark:after { display: block; }
.custom-checkbox .checkmark:after { left: 7px; top: 3px; width: 5px; height: 10px; border: solid white; border-width: 0 2px 2px 0; transform: rotate(45deg); }

/* TAGS */
.strip-meta { display: flex; gap: 8px; align-items: center; }
.meta-tag { font-size: 0.75rem; font-weight: 600; padding: 2px 8px; border-radius: 6px; }
.date-tag { background: #efebe9; color: #5d4037; }

/* PRIORITY TAGS (Muted Brown Theme) */
.prio-tag.high { background: #ffccbc; color: #bf360c; }
.prio-tag.medium { background: #ffe0b2; color: #e65100; }
.prio-tag.low { background: #d7ccc8; color: #3e2723; }

/* DELETE BTN */
.icon-btn { background: transparent; border: none; padding: 8px; border-radius: 8px; color: #d7ccc8; cursor: pointer; transition: all 0.2s; display: flex; align-items: center; justify-content: center; }
.icon-btn:hover { background: #ffebee; color: #c62828; }

/* STATES */
.is-done { opacity: 0.5; background: #faf9f6; }
.is-done .strip-text { text-decoration: line-through; }
.text-brown-light { color: #d7ccc8; }
.zero-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 60px 0; text-align: center; color: #a1887f; }

/* ANIMATION */
.list-enter-active, .list-leave-active { transition: all 0.3s ease; }
.list-enter-from, .list-leave-to { opacity: 0; transform: translateX(20px); }
</style>
