import { Routes } from '@angular/router';
import { RegisterComponent } from './auth/register/register.component';
import { ChooseTemplateComponent } from './choose-template/choose-template.component';
import { EditorPortfolioComponent } from './editor-portfolio/editor-portfolio.component';
import { PortfolioPreviewComponent } from './portfolio/portfolio-preview/portfolio-preview.component';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'register', loadComponent: () => import('./auth/register/register.component').then(m => m.RegisterComponent)},
  { path: 'login', loadComponent: () => import('./auth/login/login.component').then(m => m.LoginComponent) },
  { path: 'dashboard', loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent) },
  { path: 'cv-editor', loadComponent: () => import('./cv-editor/cv-editor.component').then(m => m.CvEditorComponent) },
  { path: 'choose-template', component: ChooseTemplateComponent },
  { path: 'editor-portfolio', component: EditorPortfolioComponent },
  { path: 'portfolio-preview', component: PortfolioPreviewComponent }
];
