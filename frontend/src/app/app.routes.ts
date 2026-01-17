import {Routes} from '@angular/router';
import {Login} from './login/login';
import {authGuard} from './auth-guard';
import {Register} from './register/register';
import {Quiz} from './quiz/quiz';
import {Dashboard} from './dashboard/dashboard'; // Import Dashboard component
import {AdminRegister} from './admin-register/admin-register'; // Import AdminRegister component
import {AdminDashboard} from './admin-dashboard/admin-dashboard'; // Import AdminDashboard component
import {QuizCrud} from './quiz-crud/quiz-crud'; // Import QuizCrud component
import {Home} from './home/home'; // Import Home component

export const routes: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: Home},
  {path: 'login', component: Login},
  {path: 'register', component: Register},
  {path: 'register/admin/:secret', component: AdminRegister},
  {path: 'dashboard', component: Dashboard, canActivate: [authGuard]},
  {path: 'admin-dashboard', component: AdminDashboard, canActivate: [authGuard], data: { requiredRole: 'admin' }},
  {path: 'admin/quiz-crud', component: QuizCrud, canActivate: [authGuard], data: { requiredRole: 'admin' }},
  {path: 'quiz', component: Quiz, canActivate: [authGuard]},
  {path: '**', redirectTo: 'home', pathMatch: 'full'}
];
