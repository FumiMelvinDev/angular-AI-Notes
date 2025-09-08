import { Component, inject, signal, effect } from '@angular/core';
import { NgClass, NgIf, NgFor, JsonPipe } from '@angular/common';
import { NoteService } from '../../services/note';
import { AuthService } from '../../services/auth';

@Component({
  selector: 'app-home',
  imports: [NgIf, NgClass, NgFor, JsonPipe],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  drawerOpen = false;
  noteService = inject(NoteService);
  authService = inject(AuthService);
  notes = signal<any[]>([]);
  loading = signal(false);
  editingNoteId = signal<string | null>(null);
  editText = signal('');
  errorMsg = signal<string | null>(null);

  constructor() {
    effect(() => {
      this.loadNotes();
    });
  }

  async loadNotes() {
    this.loading.set(true);
    const user = this.authService.currentUser();
    if (user) {
      const { data } = await this.noteService.getNotesByUser(user.id);
      this.notes.set(data || []);
    }
    this.loading.set(false);
  }

  async addNote(text: string) {
    const user = this.authService.currentUser();
    this.errorMsg.set(null);
    if (user) {
      const { data, error } = await this.noteService.createNote(text, user.id);
      if (error) {
        console.error('Note creation error:', error.message);
        this.errorMsg.set(error.message);
      } else {
        await this.loadNotes();
      }
    }
  }

  startEdit(note: any) {
    this.editingNoteId.set(note.id);
    this.editText.set(note.text);
  }

  async saveEdit(note: any) {
    await this.noteService.updateNote(note.id, this.editText());
    this.editingNoteId.set(null);
    this.editText.set('');
    await this.loadNotes();
  }

  cancelEdit() {
    this.editingNoteId.set(null);
    this.editText.set('');
  }

  async deleteNote(note: any) {
    await this.noteService.deleteNote(note.id);
    await this.loadNotes();
  }

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }
}
