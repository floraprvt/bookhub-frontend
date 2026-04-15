import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { ReservedBook } from '../../pages/profil/profil';

const API_URL = 'http://localhost:8080';

@Injectable({
  providedIn: 'root',
})
export class ReservationService {
  constructor(private http: HttpClient) {}

  createReservation(bookId: number) {
    return this.http.post(`${API_URL}/api/reservations`, {
      bookId: bookId,
    });
  }

  findMyReservations() {
    return this.http.get<ReservedBook[]>(`${API_URL}/api/reservations/my`);
  }

  deleteMyReservations(id: number) {
    return this.http.delete(`${API_URL}/api/reservations/${id}`);
  }

  hasReserved(bookId: number) {
    return this.http.get<boolean>(`${API_URL}/api/reservations/exists/${bookId}`);

  }
}
