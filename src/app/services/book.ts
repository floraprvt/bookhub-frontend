import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book } from '../interface';

const API_URL = 'http://localhost:8080';

interface BookResponse {
  content: Book[];
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);

  getBooks() {
    return this.http.get<BookResponse>(`${API_URL}/api/books`);
  }
}
