import { Component, signal, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../app/services/auth';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Loan, RoleEnum, User } from '../../app/interface';
import { ApiLoan, LoanService } from '../../app/services/loan';
import { BookService } from '../../app/services/book';

export interface ReservedBook {
  id: number;
  title: string;
  author: string;
  coverUrl: string;
  currentRank: number;
  totalRank: number;
}

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profil.html',
  styleUrl: './profil.css',
})

export class Profil implements OnInit {
  private authService = inject(AuthService);
  private loanService = inject(LoanService);
  private bookService = inject(BookService);
  private router = inject(Router);

  user = signal<User>({
    firstName: '', 
    lastName: '', 
    email: '',
    id: '',
    role: RoleEnum.USER
  });

  loan = signal<Loan[]>([]);
  reservations = signal<ReservedBook[]>([]);
  history = signal<Loan[]>([]);
  isUpdating = signal(false);
  updateSuccess = signal(false);
  updateError = signal<string | false>(false);

  showPasswordForm = signal(false);
  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  isChangingPassword = signal(false);
  passwordSuccess = signal(false);
  passwordError = signal<string | false>(false);

  starsArray = [1, 2, 3, 4, 5];

  ngOnInit() {
    this.loadUserData();
    this.loadBooksData();
  }

  loadUserData() {
    const loggedInUser = this.authService.currentUser();

    if (loggedInUser) {
      this.user.set({
        id: loggedInUser.id,
        firstName: loggedInUser.firstName || '',
        lastName: loggedInUser.lastName || '',
        email: loggedInUser.email || '',
        phone: loggedInUser.phone || '',
        role: loggedInUser.role || RoleEnum.USER
      });
    }
  }

  loadBooksData() {
    forkJoin({
      myLoansData: this.loanService.getMyLoans(),
      catalogData: this.bookService.getBooks()
    }).subscribe({
      next: ({ myLoansData, catalogData }) => {
        const allApiLoans = Object.values(myLoansData).flat();
        const allBooksInCatalog = catalogData.content;

        const mapToGlobalLoan = (apiLoan: ApiLoan): Loan => {
          const dueDate = new Date(apiLoan.returnDate);
          const today = new Date();
          const daysRemaining = Math.ceil((dueDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
          const realBook = allBooksInCatalog.find(b => b.id.toString() === apiLoan.bookId?.toString());

          return {
            id: apiLoan.id,
            loanDate: apiLoan.loanDate,
            returnDate: apiLoan.returnDate,
            isReturned: apiLoan.isReturned,
            late: apiLoan.late,
            daysRemaining: daysRemaining > 0 ? daysRemaining : 0,
            user: { id: apiLoan.userId, firstName: '', lastName: '', email: '', role: RoleEnum.USER },
            book: {
              id: realBook?.id || 0, 
              title: apiLoan.bookTitle, 
              image: realBook?.image || 'assets/livre.webp',
              author: realBook?.author || [{ id: 0, firstName: 'Auteur', lastName: 'Inconnu' }],
              category: realBook?.category || [],
              isAvailable: false
            }
          };
        };

        this.loan.set(allApiLoans.filter(l => !l.isReturned).map(mapToGlobalLoan));
        this.history.set(allApiLoans.filter(l => l.isReturned).map(mapToGlobalLoan));
        this.reservations.set([]);
      },
      error: (err) => console.error('Erreur lors du chargement des données:', err)
    });
  }

  updateProfile() {
    const { firstName, lastName, phone } = this.user();
    this.isUpdating.set(true);
    this.updateSuccess.set(false);
    this.updateError.set(false);

    this.authService.updateProfile({ firstName, lastName, phone: phone || '' }).subscribe({
      next: () => {
        this.isUpdating.set(false);
        this.updateSuccess.set(true);
      },
      error: (err) => {
        this.isUpdating.set(false);
        const fieldLabels: Record<string, string> = {
          firstName: 'Prénom',
          lastName: 'Nom',
          phone: 'Téléphone',
        };
        this.updateError.set(
          err.error && typeof err.error === 'object'
            ? Object.entries(err.error)
                .map(([key, msg]) => `${fieldLabels[key] ?? key} : ${msg}`)
                .join(' | ')
            : 'Une erreur est survenue, réessayez.'
        );
      }
    });
  }

  changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.passwordError.set('Les mots de passe ne correspondent pas.');
      return;
    }

    this.isChangingPassword.set(true);
    this.passwordSuccess.set(false);
    this.passwordError.set(false);

    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: () => {
        this.isChangingPassword.set(false);
        this.passwordSuccess.set(true);
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        this.isChangingPassword.set(false);
        this.passwordError.set(
          err.error && typeof err.error === 'object'
            ? Object.values(err.error).join(' | ')
            : err.error?.message ?? 'Une erreur est survenue, réessayez.'
        );
      }
    });
  }

  deleteAccount() {
    if (!confirm('Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est irréversible.')) return;

    this.authService.deleteAccount().subscribe({
      next: () => this.router.navigate(['/login']),
      error: (err) => alert(err.error?.message ?? 'Une erreur est survenue, réessayez.')
    });
  }

  cancelReservation(id: number) {
    this.reservations.update(res => res.filter(r => r.id !== id));
  }

  rateBook(id: string | number, rating: number) {
    this.history.update(hist =>
      hist.map(emprunt => emprunt.id === id ? { ...emprunt, rating } : emprunt)
    );
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  goToBook(bookId?: string | number) {
    if (bookId) {
      this.router.navigate(['/detail-book', bookId])
    }
  }
}