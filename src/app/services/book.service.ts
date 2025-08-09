import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Book } from '../models/book.model';
import { Observable, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BookService {
  private myBooksKey = 'myBooks';

  constructor(private http: HttpClient) {}

  private readMyBooks(): Book[] {
    return JSON.parse(localStorage.getItem(this.myBooksKey) || '[]') as Book[];
  }

  getMyBooks(): Book[] {
    return this.readMyBooks();
  }

  saveMyBooks(books: Book[]): void {
    localStorage.setItem(this.myBooksKey, JSON.stringify(books));
  }

  addMyBook(partial: Partial<Book>): Book {
    const books = this.readMyBooks();

    if (partial.id) {
      const existing = books.find((b) => b.id === partial.id);
      if (existing) return existing;
    }

    const id = partial.id || `local-${Date.now()}`;

    const created: Book = {
      id,
      title: partial.title || 'Untitled',
      authors: partial.authors || [],
      image: partial.image || '',
      description: partial.description || '',
    };

    books.push(created);
    this.saveMyBooks(books);
    return created;
  }

  updateMyBook(updated: Book): Book | undefined {
    const books = this.readMyBooks();
    const idx = books.findIndex((b) => b.id === updated.id);
    if (idx === -1) return undefined;
    books[idx] = { ...updated };
    this.saveMyBooks(books);
    return books[idx];
  }

  deleteMyBook(id: string): void {
    const books = this.readMyBooks().filter((b) => b.id !== id);
    this.saveMyBooks(books);
  }

  getMyBookById(id: string): Book | undefined {
    return this.readMyBooks().find((b) => b.id === id);
  }

  getPopularBooks(): Observable<Book[]> {
    return this.http
      .get<any>(
        'https://www.googleapis.com/books/v1/volumes?q=programming&maxResults=12&orderBy=newest'
      )
      .pipe(
        map((res) => (res.items || []).map((it: any) => this.mapVolume(it)))
      );
  }

  searchBooks(query: string): Observable<Book[]> {
    return this.http
      .get<any>(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&maxResults=12`
      )
      .pipe(
        map((res) => (res.items || []).map((it: any) => this.mapVolume(it)))
      );
  }

  getApiBookById(volumeId: string): Observable<Book> {
    return this.http
      .get<any>(
        `https://www.googleapis.com/books/v1/volumes/${encodeURIComponent(
          volumeId
        )}`
      )
      .pipe(map((it) => this.mapVolume(it)));
  }

  private mapVolume(item: any): Book {
    const info = item.volumeInfo || item;
    const authors = info.authors || [];
    let image = '';
    if (info.imageLinks) {
      image = info.imageLinks.thumbnail || info.imageLinks.smallThumbnail || '';
      if (image && image.startsWith('http:'))
        image = image.replace('http:', 'https:');
    }
    return {
      id: item.id || `local-${Date.now()}`,
      title: info.title || 'Untitled',
      authors,
      image,
      description: info.description || '',
    } as Book;
  }
}
