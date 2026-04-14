import { HttpClient } from '@angular/common/http'
import { inject, Injectable } from '@angular/core'
import { map } from 'rxjs'
import { Author } from '../interface'

const API_URL = 'http://localhost:8080'
const AUTHORS_ENDPOINT = '/api/authors'

interface AuthorsResponse {
  content: Author[]
}

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private readonly http = inject(HttpClient)

  getAuthors() {
    return this.http.get<Author[] | AuthorsResponse>(`${API_URL}${AUTHORS_ENDPOINT}`).pipe(
      map(response => Array.isArray(response) ? response : response.content)
    )
  }
}