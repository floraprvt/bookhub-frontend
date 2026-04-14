import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs'
import { Category } from '../interface'

const API_URL = 'http://localhost:8080'
const CATEGORIES_ENDPOINT = '/api/categories'

interface CategoriesResponse {
  content: Category[]
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private readonly http = inject(HttpClient)

  getCategories() {
    return this.http.get<Category[] | CategoriesResponse>(`${API_URL}${CATEGORIES_ENDPOINT}`).pipe(
      map(response => Array.isArray(response) ? response : response.content)
    )
  }
}