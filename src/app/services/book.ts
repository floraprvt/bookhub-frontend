import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from '../interface';

const API_URL = 'http://localhost:8080';
const BOOK_ENDPOINT = '/api/books'

interface BooksResponse {
  content: Book[];
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);

  getBooks() {
    return this.http.get<BooksResponse>(`${API_URL}${BOOK_ENDPOINT}`);
  }

  getBookById(id: number) {
    return this.http.get<Book>(`${API_URL}${BOOK_ENDPOINT}/${id}`);
  }

  // GET ${BOOK_ENDPOINT}/search
  searchBooks(title: string, categoryList: number[], authors: number[], date: string, isAvailable: boolean, isbn: string) {
    return this.http.get<BooksResponse>(`${API_URL}${BOOK_ENDPOINT}/search?title=${title}`);
  }

  addBook(book: Partial<Book>) {
    return this.http.post<Book>(`${API_URL}${BOOK_ENDPOINT}`, book)
  }
  updateBook(id: string | number, book: Partial<Book>) {
    return this.http.put<Book>(`${API_URL}${BOOK_ENDPOINT}/${id}`, book)
  }

  getRatings(bookId: number | string) {
    return this.http.get<any[]>(`${API_URL}/api/ratings/book/${bookId}`);
  }

  addRating(bookId: number | string, score: number, comment: string) {
    const date = new Date().toISOString().split('T')[0];
    return this.http.post(`${API_URL}/api/ratings/book/${bookId}`, { score, comment, date });
  }

  // DELETE /api/books/{id} (ADMIN)
}
