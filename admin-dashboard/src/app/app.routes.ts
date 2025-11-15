import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Dashboard } from './pages/dashboard/dashboard';
import { Books } from './pages/books/books';
import { Reports } from './pages/reports/reports';
import { Categories } from './pages/categories/categories';
import { Users } from './pages/users/users';
import { NotFound } from './pages/not-found/not-found';
import { AuthGuard } from './guards/auth-guard';
import { LoginGuard } from './guards/login-guard';
import { MainLayout } from './layout/main-layout/main-layout';
import { AuthLayout } from './layout/auth-layout/auth-layout';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayout,
    children: [
      { path: 'login', component: Login, canActivate: [LoginGuard], title: 'Login' },
      { path: '', redirectTo: '/login', pathMatch: 'full' },
    ],
  },

  {
    path: '',
    component: MainLayout,
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
