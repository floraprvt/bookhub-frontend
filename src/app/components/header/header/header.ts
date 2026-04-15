import { Component, computed, inject, input, InputSignal, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth';
import { NotificationService, Notification } from '../../../services/notification';

@Component({
  selector: 'app-header',
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements OnInit {
  title: InputSignal<string> = input('Header');

  private readonly authService = inject(AuthService);
  private readonly notificationService = inject(NotificationService);

  isLoggedIn = this.authService.isAuthenticated;
  currentUser = this.authService.currentUser;
  isLibrarian = this.authService.isLibrarian;
  isAdmin = this.authService.isAdmin;

  notifications = signal<Notification[]>([]);
  showNotifications = signal(false);
  unreadCount = computed(() => this.notifications().filter(n => !n.isRead).length);

  ngOnInit() {
    if (this.isLoggedIn()) {
      this.loadUnreadCount();
    }
  }

  loadUnreadCount() {
    this.notificationService.getNotifications().subscribe({
      next: (data) => this.notifications.set(data),
      error: () => {}
    });
  }

  toggleNotifications() {
    const wasOpen = this.showNotifications();
    this.showNotifications.set(!wasOpen);

    if (!wasOpen) {
      this.notificationService.getNotifications().subscribe({
        next: (data) => {
          this.notifications.set(data);
          if (data.some(n => !n.isRead)) {
            this.notificationService.markAllAsRead().subscribe({
              next: () => {
                this.notifications.update(list => list.map(n => ({ ...n, isRead: true })));
              },
              error: () => {}
            });
          }
        },
        error: () => {}
      });
    }
  }

  closeNotifications() {
    this.showNotifications.set(false);
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  }
}
