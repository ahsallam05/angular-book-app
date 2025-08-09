import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  books: Book[] = [];
  form: Partial<Book> = { title: '', authors: [] };
  editingId?: string;
  message = '';

  constructor(
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.loadBooks();

    const editParam = this.route.snapshot.queryParamMap.get('edit');
    if (editParam) {
      const b = this.bookService.getMyBookById(editParam);
      if (b) this.beginEdit(b);
    }
  }

  loadBooks() {
    this.books = this.bookService.getMyBooks();
  }

  beginEdit(b: Book) {
    this.editingId = b.id;
    this.form = { ...b };
    history.replaceState(null, '', '/admin');
  }

  submit() {
    if (!this.form.title || this.form.title.trim() === '') {
      this.message = 'Title is required';
      return;
    }
    if (typeof (this.form as any).authors === 'string') {
      (this.form as any).authors = (this.form as any).authors
        .split(',')
        .map((s: string) => s.trim())
        .filter((s: string) => !!s);
    }

    if (this.editingId) {
      const updated: Book = {
        id: this.editingId,
        title: this.form.title!.trim(),
        authors: (this.form.authors as string[]) || [],
        image: this.form.image || '',
        description: this.form.description || '',
      };
      this.bookService.updateMyBook(updated);
      this.message = 'Book updated.';
    } else {
      this.bookService.addMyBook({
        title: this.form.title!.trim(),
        authors: (this.form.authors as string[]) || [],
        image: this.form.image || '',
        description: this.form.description || '',
      });
      this.message = 'Book added.';
    }

    this.form = { title: '', authors: [] };
    this.editingId = undefined;
    this.loadBooks();
  }

  deleteBook(id: string) {
    if (!confirm('Delete this book?')) return;
    this.bookService.deleteMyBook(id);
    if (this.editingId === id) {
      this.form = { title: '', authors: [] };
      this.editingId = undefined;
    }
    this.loadBooks();
  }

  view(b: Book) {
    this.router.navigate(['/book', b.id]);
  }
}
