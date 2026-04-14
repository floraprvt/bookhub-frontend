import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book, BookSearchParams } from '../interface';

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

  searchBooks(search: BookSearchParams) {
    let params = new HttpParams();

    if (search.title?.trim()) {
      const normalizedTitle = search.title.trim().replace(/%/g, '');
      params = params.set('title', `%${normalizedTitle}%`);
    }

    if (search.categoryList?.length) {
      for (const categoryId of search.categoryList) {
        params = params.append('categoryList', String(categoryId));
      }
    }

    if (search.authors?.length) {
      for (const authorId of search.authors) {
        params = params.append('authors', String(authorId));
      }
    }

    if (search.date?.trim()) {
      params = params.set('date', search.date.trim());
    }

    if (search.isAvailable !== undefined) {
      params = params.set('isAvailable', String(search.isAvailable));
    }

    if (search.isbn?.trim()) {
      params = params.set('isbn', search.isbn.trim());
    }

    return this.http.get<BooksResponse>(`${API_URL}${BOOK_ENDPOINT}/search`, { params });
  }

  addBook(book: Partial<Book>) {
    return this.http.post<Book>(`${API_URL}${BOOK_ENDPOINT}`, book)
  }

  updateBook(book: Partial<Book>) {
    return this.http.put<Book>(`${API_URL}${BOOK_ENDPOINT}`, book)
  }

  deleteBook(id: number) {
    return this.http.delete(`${API_URL}${BOOK_ENDPOINT}/${id}`);
  }
}
