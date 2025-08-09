import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  myBooks: Book[] = [];
  popularBooks: Book[] = [];
  searchQuery = '';
  searchResults: Book[] = [];
  loading = false;

  constructor(private bookService: BookService, private router: Router) {}

  ngOnInit(): void {
    this.loadMyBooks();
    this.loadPopularBooks();
  }

  loadMyBooks() {
    this.myBooks = this.bookService.getMyBooks();
  }

  loadPopularBooks() {
    this.bookService.getPopularBooks().subscribe({
      next: (res) => (this.popularBooks = res),
      error: () => (this.popularBooks = []),
    });
  }

  searchBooks(query: string) {
    const searchTerm = query.trim();
    this.searchQuery = searchTerm;

    if (!searchTerm) {
      this.searchResults = [];
      return;
    }

    this.loading = true;
    this.bookService.searchBooks(searchTerm).subscribe({
      next: (res) => {
        this.searchResults = res;
        this.loading = false;
      },
      error: () => {
        this.searchResults = [];
        this.loading = false;
      },
    });
  }

  addToMyBooks(book: Book) {
    this.bookService.addMyBook(book);
    this.loadMyBooks();
  }

  viewBookDetails(id: string) {
    this.router.navigate(['/book', id]);
  }
}
