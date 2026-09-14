import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Quiz } from './quiz/quiz';
import { Dashboard } from './dashboard/dashboard';

import { Admin } from './admin/admin';
import { AdminLogin } from './admin-login/admin-login';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminResults } from './admin-results/admin-results';
import { AdminSettings } from './admin-settings/admin-settings';

import { adminAuthGuard } from './admin-auth-guard';

export const routes: Routes = [

  {
    path: '',
    component: Home
  },

  {
    path: 'login',
    component: Login
  },

  {
    path: 'register',
    component: Register
  },

  {
    path: 'quiz',
    component: Quiz
  },

  {
    path: 'dashboard',
    component: Dashboard
  },

  {
    path: 'admin-login',
    component: AdminLogin
  },

  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [adminAuthGuard]
  },

  {
    path: 'admin',
    component: Admin,
    canActivate: [adminAuthGuard]
  },

  {
    path: 'admin-results',
    component: AdminResults,
    canActivate: [adminAuthGuard]
  },

  {
    path: 'admin-settings',
    component: AdminSettings,
    canActivate: [adminAuthGuard]
  },

  {
    path: '**',
    redirectTo: ''
  }

];
