import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Book, BookSearchParams, BooksPageResponse } from '../interface';

const API_URL = 'http://localhost:8080';
const BOOK_ENDPOINT = '/api/books'
const DEFAULT_PAGE = 0
const DEFAULT_SIZE = 20
const DEFAULT_SORT = 'title,asc'

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private readonly http = inject(HttpClient);

  getBooks(page = DEFAULT_PAGE, size = DEFAULT_SIZE, sort = DEFAULT_SORT) {
    const params = new HttpParams()
      .set('page', String(page))
      .set('size', String(size))
      .set('sort', sort)

    return this.http.get<BooksPageResponse>(`${API_URL}${BOOK_ENDPOINT}`, { params });
  }

  getBookById(id: number) {
    return this.http.get<Book>(`${API_URL}${BOOK_ENDPOINT}/${id}`);
  }

  searchBooks(search: BookSearchParams) {
    let params = new HttpParams()
      .set('page', String(search.page ?? DEFAULT_PAGE))
      .set('size', String(search.size ?? DEFAULT_SIZE))
      .set('sort', search.sort ?? DEFAULT_SORT)

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

    return this.http.get<BooksPageResponse>(`${API_URL}${BOOK_ENDPOINT}/search`, { params });
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
  
  getRatings(bookId: number | string) {
    return this.http.get<any[]>(`${API_URL}/api/ratings/book/${bookId}`);
  }

  addRating(bookId: number | string, score: number, comment: string) {
    const date = new Date().toISOString().split('T')[0];
    return this.http.post(`${API_URL}/api/ratings/book/${bookId}`, { score, comment, date });
  }

  updateRating(ratingId: number | string, score: number, comment: string, userId: number) {
    const date = new Date().toISOString().split('T')[0];
    return this.http.put(`${API_URL}/api/ratings/${ratingId}`, { score, comment, date, user: { id: userId } });
  }

  deleteRating(ratingId: number | string) {
    return this.http.delete(`${API_URL}/api/ratings/${ratingId}`, { responseType: 'text' });
  }
}
