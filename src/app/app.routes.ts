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
import { adminGuard } from './guards/admin.guard';
import { librarianGuard } from './guards/librarian.guard';


export const routes: Routes = [
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    
    { path: '', component: Home, canActivate: [authGuard] },
    { path: 'detail-book/:id', component: DetailBook, canActivate: [authGuard]},
    { path: 'profil', component: Profil, canActivate: [authGuard] },

    { path: 'returns-management', component: ReturnsManagement, canActivate: [librarianGuard]},
    { path: 'catalogue-management', component: CatalogManagement, canActivate: [librarianGuard]},
    { path: 'librarian', component: LibrarianDashboard, canActivate: [librarianGuard]},

    { path: 'admin', component: AdminDashboard, canActivate: [adminGuard]},
    { path: 'admin/edit-user/:id', component: EditUser, canActivate: [adminGuard]},

    { path: '**', redirectTo: 'login', pathMatch: 'full' },
]
