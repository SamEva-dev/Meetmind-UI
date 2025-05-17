import { Route } from '@angular/router';
import { DashboardComponent } from './feature/dashboard/dashboard.component';
import { FeatureComponent } from './feature/feature.component';

export const routes: Route[] = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
        path: '',
        component: FeatureComponent,
        children: [
            { path: '', component: DashboardComponent },
            {
              path: 'dashboard',
              loadComponent: () =>
                import('./feature/dashboard/dashboard.component').then(c => c.DashboardComponent)
            },
            {
              path: 'meetings',
              loadComponent: () =>
                import('./feature/meetings/meetings.component').then(c => c.MeetingsComponent)
            },
            {
              path: 'settings',
              loadComponent: () =>
                import('./feature/settings/settings.component').then(c => c.SettingsComponent)
            },
            {
    path: '404',
    loadComponent: () => import('./pages/page404/page404.component').then(m => m.Page404Component),
      data: {
        title: 'Page 404'
      }
    },
    {
      path: '500',
      loadComponent: () => import('./pages/page500/page500.component').then(m => m.Page500Component),
      data: {
        title: 'Page 500'
      }
    },
        ]
    },
   {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.component').then(m => m.LoginComponent),
      data: {
        title: 'login'
      }
    },
    
    { path: '**', redirectTo: 'login' }
  ];