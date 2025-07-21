import { Routes } from '@angular/router';
import { ApiListComponent } from './components/api-list/api-list';
import { ApiFormComponent } from './components/api-form/api-form';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  {
    path: 'home',
    component: ApiListComponent
  },
  {
    path: 'submit',
    component: ApiFormComponent
  },
  {
    path: 'panel',
    loadChildren: () => import('./panel/panel.routes').then(m => m.PANEL_ROUTES)
  }
];
