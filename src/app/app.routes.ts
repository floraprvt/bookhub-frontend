import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { Home } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Profil } from '../pages/profil/profil';
import { Register } from '../pages/register/register';


export const routes: Routes = [
    { path: '', component: Home },
    { path: 'register', component: Register },
    { path: 'login', component: Login },
    { path: 'profil', component: Profil, canActivate: [authGuard] },
    { path: '**', redirectTo: '', pathMatch: 'full' },
]