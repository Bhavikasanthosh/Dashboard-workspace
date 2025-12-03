<template>
  <div class="app-container">

    <header class="top-bar">
      <h1 class="app-title">Notes</h1>
      <div class="search-wrapper">
        <span class="icon">🔍</span>
        <input type="text" placeholder="Search..." class="search-input" />
      </div>
    </header>

    <section class="input-area">
      <div class="note-editor">
        <input
          v-model="title"
          placeholder="Title"
          class="editor-title"
        />
        <textarea
          v-model="content"
          placeholder="Take a note..."
          class="editor-content"
        ></textarea>

        <div class="editor-footer">
          <div class="tags-row">
            <select v-model="selectedTag" class="tag-pill-selector">
              <option disabled value="">Tag</option>
              <option value="Work">💼 Work</option>
              <option value="Personal">🏠 Personal</option>
              <option value="Study">📚 Study</option>
            </select>
          </div>
          <button @click="addNote" class="save-btn">Save Note</button>
        </div>
      </div>
    </section>

    <div class="masonry-wrapper">
      <div
        v-for="note in sortedNotes"
        :key="note._id"
        class="note-brick"
        :class="getBrickClass(note.tag)"
      >
        <div class="brick-header">
          <h3>{{ note.title }}</h3>
          <button
            class="pin-toggle"
            :class="{ pinned: note.pinned }"
            @click="togglePin(note)"
          >
            📌
          </button>
        </div>

        <p class="brick-text">{{ note.content }}</p>

        <div class="brick-footer">
          <span class="brick-tag">{{ note.tag || 'General' }}</span>
          <span class="brick-date">{{ formatDate(note.date) }}</span>
        </div>

        <div class="brick-overlay">
          <button class="delete-icon" @click="deleteNote(note._id)">🗑</button>
        </div>
      </div>
    </div>

    <div v-if="notes.length === 0" class="empty-canvas">
      <p>Your mind is empty. Write something!</p>
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
      } catch (err) { console.error(err); }
    },
    async addNote() {
      if (!this.title.trim() && !this.content.trim()) return;

      const payload = {
        title: this.title,
        content: this.content,
        tag: this.selectedTag || "General",
        pinned: false
      };

      try {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          this.notes.unshift(await res.json());
          this.title = "";
          this.content = "";
          this.selectedTag = "";
        }
      } catch (err) { console.error(err); }
    },
    async deleteNote(id) {
      if (!confirm("Delete note?")) return;
      try {
        const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
        if (res.ok) this.notes = this.notes.filter(n => n._id !== id);
      } catch (err) { console.error(err); }
    },
    async togglePin(note) {
      const old = note.pinned;
      note.pinned = !old;
      try {
        await fetch(`/api/notes/${note._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pinned: note.pinned }),
        });
      } catch (err) { note.pinned = old; }
    },
    formatDate(d) {
      if (!d) return "";
      return new Date(d).toLocaleDateString("en-GB", { month: "short", day: "numeric" });
    },
    getBrickClass(tag) {
      return `border-${(tag || 'general').toLowerCase()}`;
    }
  },
  mounted() {
    this.fetchNotes();
  },
};
</script>

<style scoped>
/* Main Full-Screen Layout */
.app-container {
  min-height: 100vh;
  background-color: #f3f4f6; /* Soft gray */
  padding: 20px 40px;
  font-family: 'Segoe UI', sans-serif;
}

/* Header */
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 40px;
}

.app-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0;
}

.search-wrapper {
  background: white;
  border-radius: 8px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  width: 300px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.05);
}
.search-input {
  border: none;
  outline: none;
  margin-left: 8px;
  width: 100%;
  font-size: 0.95rem;
}

/* Input Section */
.input-area {
  display: flex;
  justify-content: center;
  margin-bottom: 50px;
}

.note-editor {
  background: white;
  width: 100%;
  max-width: 600px;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
  padding: 20px;
  transition: box-shadow 0.2s;
}

.note-editor:focus-within {
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05);
}

.editor-title {
  width: 100%;
  border: none;
  outline: none;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 10px;
  color: #111827;
}

.editor-content {
  width: 100%;
  border: none;
  outline: none;
  resize: none;
  font-size: 1rem;
  color: #374151;
  min-height: 50px;
  font-family: inherit;
}

.editor-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid #e5e7eb;
}

.tag-pill-selector {
  border: none;
  background: #f3f4f6;
  padding: 6px 12px;
  border-radius: 20px;
  color: #4b5563;
  font-size: 0.85rem;
  cursor: pointer;
}

.save-btn {
  background: #2563eb; /* Royal Blue */
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}
.save-btn:hover { background: #1d4ed8; }

/* MASONRY LAYOUT - THE MAGIC PART */
.masonry-wrapper {
  column-count: 1; /* Mobile default */
  column-gap: 20px;
}

/* Responsive Columns */
@media (min-width: 640px) { .masonry-wrapper { column-count: 2; } }
@media (min-width: 1024px) { .masonry-wrapper { column-count: 3; } }
@media (min-width: 1400px) { .masonry-wrapper { column-count: 4; } }

.note-brick {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px; /* Space between items vertically */
  break-inside: avoid; /* Prevents card from splitting across columns */
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  position: relative;
  transition: transform 0.2s, box-shadow 0.2s;
  border: 1px solid transparent;
  display: inline-block; /* Essential for masonry spacing */
  width: 100%;
}

.note-brick:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  z-index: 10;
}

/* Color Coding Borders */
.border-work { border-top: 4px solid #3b82f6; }
.border-personal { border-top: 4px solid #8b5cf6; }
.border-study { border-top: 4px solid #10b981; }
.border-general { border-top: 4px solid #9ca3af; }

.brick-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
}

.brick-header h3 {
  font-size: 1.1rem;
  margin: 0;
  font-weight: 700;
  color: #111827;
  line-height: 1.4;
}

.pin-toggle {
  background: none;
  border: none;
  cursor: pointer;
  color: #d1d5db;
  font-size: 1.2rem;
  transition: color 0.2s;
}
.pin-toggle.pinned, .pin-toggle:hover { color: #2563eb; }

.brick-text {
  font-size: 0.95rem;
  color: #4b5563;
  line-height: 1.6;
  white-space: pre-wrap;
  margin-bottom: 20px;
}

.brick-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.brick-tag {
  background: #f3f4f6;
  padding: 4px 10px;
  border-radius: 4px;
  color: #6b7280;
  font-weight: 600;
  text-transform: uppercase;
}

.brick-date { color: #9ca3af; }

.brick-overlay {
  position: absolute;
  top: 15px;
  right: 15px;
  opacity: 0;
  transition: opacity 0.2s;
}
.note-brick:hover .brick-overlay { opacity: 1; }

.delete-icon {
  background: white;
  border: 1px solid #fee2e2;
  color: #ef4444;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
}
.delete-icon:hover { background: #fecaca; }

.empty-canvas { text-align: center; color: #9ca3af; margin-top: 60px; font-size: 1.2rem; }
</style>
