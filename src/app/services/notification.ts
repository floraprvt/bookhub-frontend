import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

const API_URL = 'http://localhost:8080';

export interface Notification {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private readonly http = inject(HttpClient);

  getNotifications() {
    return this.http.get<Notification[]>(`${API_URL}/api/notifications`);
  }

  markAllAsRead() {
    return this.http.put(`${API_URL}/api/notifications/read`, {}, { responseType: 'text' });
  }
}
