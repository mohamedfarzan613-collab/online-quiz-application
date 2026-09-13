import { Routes } from '@angular/router';

import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Quiz } from './quiz/quiz';
import { Dashboard } from './dashboard/dashboard';

import { Admin } from './admin/admin';
import { AdminLogin } from './admin-login/admin-login';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { AdminSettings } from './admin-settings/admin-settings';

import { adminAuthGuard } from './admin-auth-guard';


export const routes: Routes = [

  // =========================
  // HOME
  // =========================

  {
    path: '',
    component: Home
  },


  // =========================
  // STUDENT LOGIN
  // =========================

  {
    path: 'login',
    component: Login
  },


  // =========================
  // STUDENT REGISTER
  // =========================

  {
    path: 'register',
    component: Register
  },


  // =========================
  // QUIZ
  // =========================

  {
    path: 'quiz',
    component: Quiz
  },


  // =========================
  // STUDENT DASHBOARD
  // =========================

  {
    path: 'dashboard',
    component: Dashboard
  },


  // =========================
  // ADMIN LOGIN
  // =========================

  {
    path: 'admin-login',
    component: AdminLogin
  },


  // =========================
  // ADMIN DASHBOARD
  // =========================

  {
    path: 'admin-dashboard',
    component: AdminDashboard,
    canActivate: [adminAuthGuard]
  },


  // =========================
  // QUIZ MANAGEMENT
  // =========================

  {
    path: 'admin',
    component: Admin,
    canActivate: [adminAuthGuard]
  },


  // =========================
  // ADMIN SETTINGS
  // =========================

  {
    path: 'admin-settings',
    component: AdminSettings,
    canActivate: [adminAuthGuard]
  },


  // =========================
  // INVALID URL
  // =========================

  {
    path: '**',
    redirectTo: ''
  }

];
