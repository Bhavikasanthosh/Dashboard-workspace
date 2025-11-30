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
      <button @click="addTask">Add</button>
    </div>

    <!-- Task List -->
    <div class="task-list">
      <div
        v-for="(task, index) in tasks"
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

        <button class="delete-btn" @click="deleteTask(index)">✖</button>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: "TasksView",

  data() {
    return {
      newTask: "",
      newTaskDate: "",
      tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
    };
  },

  computed: {
    completedTasks() {
      return this.tasks.filter((t) => t.done).length;
    },
    progressPercent() {
      if (this.tasks.length === 0) return 0;
      return Math.round((this.completedTasks / this.tasks.length) * 100);
    }
  },

  methods: {
    addTask() {
      if (!this.newTask.trim()) return;

      this.tasks.push({
        text: this.newTask,
        done: false,
        date: this.newTaskDate || null,
      });

      this.newTask = "";
      this.newTaskDate = "";
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
  },

  watch: {
    tasks: {
      handler() {
        this.saveTasks();
      },
      deep: true,
    },
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

.task-input button {
  background: #6366f1;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  border: none;
  font-size: 16px;
  cursor: pointer;
}

.task-input button:hover {
  background: #4f46e5;
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
</style>
