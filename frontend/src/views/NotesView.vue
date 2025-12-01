<template>
  <div class="container">
    <h1 class="page-title">My Notes</h1>

    <div class="create-section">
      <div class="input-wrapper">
        <input
          v-model="title"
          class="note-title-input"
          type="text"
          placeholder="Title"
        />
        <textarea
          v-model="content"
          class="note-content-input"
          placeholder="Take a note..."
        ></textarea>

        <div class="form-actions">
          <select v-model="selectedTag" class="tag-select">
            <option disabled value="">Select Tag</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Study">Study</option>
          </select>
          <button @click="addNote" class="btn-primary">Add Note</button>
        </div>
      </div>
    </div>

    <div class="notes-grid">
      <div
        v-for="note in sortedNotes"
        :key="note._id"
        class="note-card"
      >
        <div class="card-top">
          <h3 class="card-title">{{ note.title }}</h3>
          <button
            class="pin-icon"
            :class="{ pinned: note.pinned }"
            @click="togglePin(note)"
          >
            <span v-if="note.pinned">★</span>
            <span v-else>☆</span>
          </button>
        </div>

        <p class="card-content">{{ note.content }}</p>

        <div class="card-bottom">
          <span class="badge" :class="getTagClass(note.tag)">
            {{ note.tag || 'General' }}
          </span>
          <span class="date">{{ formatDate(note.date) }}</span>
        </div>

        <button class="delete-btn" @click="deleteNote(note._id)">Delete</button>
      </div>
    </div>

    <div v-if="notes.length === 0" class="empty-msg">
      No notes found. Create one to get started.
    </div>
  </div>
</template>

<script>
export default {
  name: "NotesView",
  data() {
    return {
      title: "",
      content: "",
      selectedTag: "",
      notes: [],
    };
  },
  computed: {
    sortedNotes() {
      return [...this.notes].sort((a, b) => {
        if (a.pinned === b.pinned) {
          return new Date(b.date) - new Date(a.date);
        }
        return a.pinned ? -1 : 1;
      });
    },
  },
  methods: {
    async fetchNotes() {
      try {
        const res = await fetch("/api/notes");
        if (res.ok) this.notes = await res.json();
      } catch (err) {
        console.error(err);
      }
    },
    async addNote() {
      if (!this.title.trim() || !this.content.trim()) return;

      const payload = {
        title: this.title,
        content: this.content,
        tag: this.selectedTag || "General",
        pinned: false,
      };

      try {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const newNote = await res.json();
          this.notes.unshift(newNote);
          this.title = "";
          this.content = "";
          this.selectedTag = "";
        }
      } catch (err) {
        console.error(err);
      }
    },
    async deleteNote(id) {
      try {
        const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
        if (res.ok) {
          this.notes = this.notes.filter(n => n._id !== id);
        }
      } catch (err) {
        console.error(err);
      }
    },
    async togglePin(note) {
      const originalState = note.pinned;
      note.pinned = !originalState;

      try {
        await fetch(`/api/notes/${note._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pinned: note.pinned }),
        });
      } catch (err) {
        note.pinned = originalState;
      }
    },
    formatDate(dateStr) {
      if (!dateStr) return "";
      return new Date(dateStr).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      });
    },
    getTagClass(tag) {
      if (!tag) return "bg-blue";
      const map = {
        Work: "bg-dark-blue",
        Personal: "bg-ocean",
        Study: "bg-sky",
      };
      return map[tag] || "bg-blue";
    }
  },
  mounted() {
    this.fetchNotes();
  },
};
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 20px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  color: #1e293b;
}

.page-title {
  text-align: center;
  color: #1e3a8a; /* Dark Blue */
  margin-bottom: 40px;
  font-weight: 700;
}

/* Form Styles */
.create-section {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
}

.input-wrapper {
  background: #ffffff;
  border: 1px solid #bfdbfe; /* Light Blue Border */
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 4px 6px -1px rgba(59, 130, 246, 0.1);
}

.note-title-input {
  width: 100%;
  border: none;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 10px;
  outline: none;
  color: #1e3a8a;
}

.note-content-input {
  width: 100%;
  border: none;
  resize: none;
  font-size: 0.95rem;
  min-height: 60px;
  outline: none;
  color: #334155;
  font-family: inherit;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #f1f5f9;
}

.tag-select {
  border: 1px solid #cbd5e1;
  border-radius: 4px;
  padding: 5px 10px;
  font-size: 0.85rem;
  color: #475569;
  background: white;
}

.btn-primary {
  background-color: #2563eb; /* Royal Blue */
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #1d4ed8;
}

/* Grid Styles */
.notes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
}

.note-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  position: relative;
}

.note-card:hover {
  border-color: #93c5fd;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: #0f172a;
}

.pin-icon {
  background: none;
  border: none;
  font-size: 1.2rem;
  cursor: pointer;
  color: #cbd5e1;
  padding: 0;
}

.pin-icon.pinned {
  color: #2563eb; /* Blue star */
}

.card-content {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.5;
  margin-bottom: 20px;
  flex-grow: 1;
  white-space: pre-wrap;
}

.card-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
}

.date {
  font-size: 0.75rem;
  color: #94a3b8;
}

.delete-btn {
  margin-top: 15px;
  background: none;
  border: 1px solid #ef4444;
  color: #ef4444;
  padding: 6px;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  width: 100%;
  text-align: center;
}

.delete-btn:hover {
  background: #fef2f2;
}

.empty-msg {
  text-align: center;
  color: #64748b;
  margin-top: 40px;
}

/* Badges */
.badge {
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
}

.bg-blue { background: #e0f2fe; color: #0369a1; }
.bg-dark-blue { background: #dbeafe; color: #1e40af; } /* Work */
.bg-ocean { background: #cffafe; color: #155e75; } /* Personal */
.bg-sky { background: #e0e7ff; color: #3730a3; } /* Study */
</style>
