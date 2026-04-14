import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from '../interface';

const API_URL = 'http://localhost:8080';

interface BooksResponse {
  content: Book[];
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);

  getBooks() {
    return this.http.get<BooksResponse>(`${API_URL}/api/books`);
  }

  getBookById(id: number) {
    return this.http.get<Book>(`${API_URL}/api/books/${id}`);
  }
}
