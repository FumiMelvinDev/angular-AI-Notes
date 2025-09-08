import { Injectable } from '@angular/core';
import { createClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class NoteService {
  supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

  async createNote(text: string, authorId: string) {
    const id = uuidv4();
    const { data, error } = await this.supabase
      .from('Note')
      .insert({
        id,
        text,
        authorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .select();
    return { data, error };
  }

  async getNotesByUser(authorId: string) {
    const { data, error } = await this.supabase
      .from('Note')
      .select('*')
      .eq('authorId', authorId)
      .order('createdAt', { ascending: false });
    return { data, error };
  }

  async getNoteById(id: string) {
    const { data, error } = await this.supabase.from('Note').select('*').eq('id', id).single();
    return { data, error };
  }

  async updateNote(id: string, text: string) {
    const { data, error } = await this.supabase
      .from('Note')
      .update({ text, updatedAt: new Date().toISOString() })
      .eq('id', id)
      .select();
    return { data, error };
  }

  async deleteNote(id: string) {
    const { data, error } = await this.supabase.from('Note').delete().eq('id', id);
    return { data, error };
  }
}
