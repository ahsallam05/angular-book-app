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
    this.bookService.getPopularBooks().subscribe((data) => {
      this.popularBooks = data;
    });
  }

  searchBooks() {
    if (!this.searchQuery.trim()) return;
    this.loading = true;
    this.bookService.searchBooks(this.searchQuery).subscribe((data) => {
      this.searchResults = data;
      this.loading = false;
    });
  }

  addToMyBooks(book: Book) {
    this.bookService.addMyBook(book);
    this.loadMyBooks(); // ✅ Refresh immediately after adding
  }

  viewBookDetails(id: string) {
    this.router.navigate(['/book', id]);
  }
}
