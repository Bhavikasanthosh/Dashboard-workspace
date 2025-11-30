<template>
  <div>
    <h1 class="heading">Notes</h1>

    <!-- Input area -->
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

    <!-- Notes list -->
    <div class="notes-list">
      <div
        v-for="(note, index) in sortedNotes"
        :key="index"
        class="note-card"
      >
        <div class="note-header">
          <h3>{{ note.title }}</h3>

          <button class="pin-btn" @click="togglePin(index)">
            📌 {{ note.pinned ? 'Unpin' : 'Pin' }}
          </button>
        </div>

        <span class="tag" :class="note.tag.toLowerCase()">{{ note.tag }}</span>

        <p class="content">{{ note.content }}</p>

        <small class="date">
          Created: {{ formatDate(note.date) }}
        </small>

        <button class="delete-btn" @click="deleteNote(index)">Delete</button>
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
      notes: JSON.parse(localStorage.getItem("notes") || "[]"),
    };
  },

  computed: {
    sortedNotes() {
      return [...this.notes].sort((a, b) => b.pinned - a.pinned);
    },
  },

  methods: {
    addNote() {
      if (!this.title.trim() || !this.content.trim()) return;

      this.notes.push({
        title: this.title,
        content: this.content,
        tag: this.selectedTag || "Other",
        pinned: false,
        date: new Date(),
      });

      this.saveNotes();

      this.title = "";
      this.content = "";
      this.selectedTag = "";
    },

    deleteNote(index) {
      this.notes.splice(index, 1);
      this.saveNotes();
    },

    togglePin(index) {
      this.notes[index].pinned = !this.notes[index].pinned;
      this.saveNotes();
    },

    saveNotes() {
      localStorage.setItem("notes", JSON.stringify(this.notes));
    },

    formatDate(date) {
      return new Date(date).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    },
  },
};
</script>

<style>
.heading {
  font-size: 32px;
  margin-bottom: 20px;
  color: #1e293b;
}

/* Input area */
.note-input {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-width: 500px;
}

.note-input input,
.note-input textarea,
.note-input select {
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #cbd5e1;
}

.note-input textarea {
  height: 120px;
}

.note-input button {
  background: #6366f1;
  color: white;
  padding: 12px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
}

/* Notes list */
.notes-list {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.note-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.note-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pin-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: #6366f1;
  font-weight: bold;
}

.tag {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 8px;
  font-size: 12px;
  margin-top: 6px;
  color: white;
}

.tag.work {
  background: #0ea5e9;
}

.tag.personal {
  background: #8b5cf6;
}

.tag.study {
  background: #22c55e;
}

.content {
  margin: 10px 0;
}

.delete-btn {
  background: #ef4444;
  color: white;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}
</style>
