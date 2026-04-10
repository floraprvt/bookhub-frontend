import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Home } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Profil } from '../pages/profil/profil';
import { Register } from '../pages/register/register';
import { CatalogManagement } from '../pages/catalog-management/catalog-management';
import { ReturnsManagement } from '../pages/returns-management/returns-management';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'catalogue-management', component: CatalogManagement},
    { path: 'returns-management', component: ReturnsManagement},
    { path: 'profil', component: Profil, canActivate: [authGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' },
]
