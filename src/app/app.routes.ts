import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Home } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Profil } from '../pages/profil/profil';
import { Register } from '../pages/register/register';
import { CatalogManagement } from '../pages/catalog-management/catalog-management';
import { ReturnsManagement } from '../pages/returns-management/returns-management';
import { LibrarianDashboard } from '../pages/librarian-dashboard/librarian-dashboard';
import { AdminDashboard } from '../pages/admin/admin';
import { EditUser } from './components/edit-user/edit-user';
import { DetailBook } from './components/detail-book/detail-book';


export const routes: Routes = [
    { path: '', component: Home, canActivate: [authGuard] },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'catalogue-management', component: CatalogManagement, canActivate: [authGuard]},
    { path: 'returns-management', component: ReturnsManagement, canActivate: [authGuard]},
    { path: 'librarian', component: LibrarianDashboard, canActivate: [authGuard]},
    { path: 'admin', component: AdminDashboard, canActivate: [authGuard]},
    { path: 'admin/edit-user/:id', component: EditUser, canActivate: [authGuard]},
    { path: 'detail-book/:id', component: DetailBook, canActivate: [authGuard]},
    { path: 'profil', component: Profil, canActivate: [authGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' },
]
