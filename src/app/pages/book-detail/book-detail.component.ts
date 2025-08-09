import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})
export class BookDetailComponent {
  localBook?: Book;
  apiBook?: Book;
  loading = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private bookService: BookService
  ) {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      return;
    }

    // first check local books
    const local = this.bookService.getMyBookById(id);
    if (local) {
      this.localBook = local;
      return;
    }

    // else fetch from API
    this.loading = true;
    this.bookService.getApiBookById(id).subscribe({
      next: (b) => {
        this.apiBook = b;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  goHome() {
    this.router.navigate(['/']);
  }

  addApiBookToMyBooks() {
    if (!this.apiBook) return;
    this.bookService.addMyBook(this.apiBook);
    // maybe navigate to home to show it
    this.router.navigate(['/']);
  }
}
