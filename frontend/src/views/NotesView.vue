<template>
  <div>
    <h1 class="heading">Notes</h1>

    <div class="note-input">
      <input v-model="title" type="text" placeholder="Title" />
      <textarea v-model="content" placeholder="Write your note..."></textarea>

      <select v-model="selectedTag">
        <option disabled value="">Select Tag</option>
        <option value="Work">Work</option>
        <option value="Personal">Personal</option>
        <option value="Study">Study</option>
      </select>

      <button @click="addNote">Add Note</button>
    </div>

    <div class="notes-list">
      <div
        v-for="note in sortedNotes"
        :key="note._id"
        class="note-card"
      >
        <div class="note-header">
          <h3>{{ note.title }}</h3>

          <button class="pin-btn" @click="togglePin(note)">
            📌 {{ note.pinned ? 'Unpin' : 'Pin' }}
          </button>
        </div>

        <span class="tag" :class="note.tag ? note.tag.toLowerCase() : 'other'">
          {{ note.tag || 'Other' }}
        </span>

        <p class="content">{{ note.content }}</p>

        <small class="date">
          Created: {{ formatDate(note.date) }}
        </small>

        <button class="delete-btn" @click="deleteNote(note._id)">Delete</button>
      </div>
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
      return [...this.notes].sort((a, b) => (b.pinned === a.pinned ? 0 : b.pinned ? 1 : -1));
    },
  },

  methods: {
    async fetchNotes() {
      try {
        const res = await fetch("/api/notes");
        if (!res.ok) throw new Error("Failed to fetch");
        this.notes = await res.json();
      } catch (err) {
        console.error("Error fetching notes:", err);
      }
    },

    async addNote() {
      if (!this.title.trim() || !this.content.trim()) return;

      const newNote = {
        title: this.title,
        content: this.content,
        tag: this.selectedTag || "Other",
        pinned: false,
      };

      try {
        const res = await fetch("/api/notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newNote),
        });

        if (res.ok) {
          const savedNote = await res.json();
          this.notes.push(savedNote);

          // Clear inputs (v-model updates the view)
          this.title = "";
          this.content = "";
          this.selectedTag = "";
        }
      } catch (err) {
        console.error("Error adding note:", err);
      }
    },

    async deleteNote(id) {
      if (!confirm("Are you sure?")) return;

      try {
        const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
        if (res.ok) {
          this.notes = this.notes.filter((n) => n._id !== id);
        }
      } catch (err) {
        console.error("Error deleting note:", err);
      }
    },

    async togglePin(note) {
      try {
        const newStatus = !note.pinned;
        note.pinned = newStatus; // Optimistic UI update

        await fetch(`/api/notes/${note._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ pinned: newStatus }),
        });
      } catch (err) {
        note.pinned = !note.pinned; // Revert if API fails
        console.error("Error updating pin:", err);
      }
    },

    formatDate(date) {
      if (!date) return "";
      return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },

  mounted() {
    this.fetchNotes();
  },
};
</script>

<style>
.heading { font-size: 32px; margin-bottom: 20px; color: #1e293b; }
.note-input { display: flex; flex-direction: column; gap: 12px; max-width: 500px; }
.note-input input, .note-input textarea, .note-input select { padding: 12px; border-radius: 8px; border: 1px solid #cbd5e1; }
.note-input textarea { height: 120px; }
.note-input button { background: #6366f1; color: white; padding: 12px; border-radius: 8px; border: none; cursor: pointer; }
.notes-list { margin-top: 30px; display: flex; flex-direction: column; gap: 18px; }
.note-card { background: white; padding: 20px; border-radius: 12px; border: 1px solid #e2e8f0; }
.note-header { display: flex; justify-content: space-between; align-items: center; }
.pin-btn { background: none; border: none; cursor: pointer; color: #6366f1; font-weight: bold; }
.tag { display: inline-block; padding: 4px 10px; border-radius: 8px; font-size: 12px; margin-top: 6px; color: white; }
.tag.work { background: #0ea5e9; }
.tag.personal { background: #8b5cf6; }
.tag.study { background: #22c55e; }
.tag.other { background: #64748b; }
.content { margin: 10px 0; }
.delete-btn { background: #ef4444; color: white; padding: 8px 12px; border: none; border-radius: 6px; cursor: pointer; }
</style>
