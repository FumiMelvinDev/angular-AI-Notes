import { Component, inject } from '@angular/core';
import { NoteForm } from '../../components/note-form/note-form';
import { NgClass, NgIf } from '@angular/common';

@Component({
  selector: 'app-home',
  imports: [NoteForm, NgIf, NgClass],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  drawerOpen = false;

  toggleDrawer() {
    this.drawerOpen = !this.drawerOpen;
  }
}
