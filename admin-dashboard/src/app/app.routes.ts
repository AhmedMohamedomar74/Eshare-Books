import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Books } from './pages/books/books';
import { Reports } from './pages/reports/reports';
import { Categories } from './pages/categories/categories';
import { Users } from './pages/users/users';
import { NotFound } from './pages/not-found/not-found';
import { Login } from './pages/login/login';
import { AuthGuard } from './guards/auth-guard';
import { LoginGuard } from './guards/login-guard';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [LoginGuard],
    title: 'Login',
  },

  { path: '', redirectTo: '/login', pathMatch: 'full' },

  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: 'dashboard', component: Dashboard, title: 'Dashboard' },
      { path: 'users', component: Users, title: 'Users' },
      { path: 'books', component: Books, title: 'Books' },
      { path: 'reports', component: Reports, title: 'Reports' },
      { path: 'categories', component: Categories, title: 'Categories' },
    ],
  },

  { path: '**', component: NotFound, title: 'Not Found' },
];
