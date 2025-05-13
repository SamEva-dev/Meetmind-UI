import { Route, Routes } from '@angular/router';

// Standalone components (à créer ensuite)
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { MeetingsListComponent } from './features/meetings/meetings-list/meetings-list.component';
import { MeetingDetailComponent } from './features/meetings/meeting-detail/meeting-detail.component';
import { SearchComponent } from './features/search/search.component';
import { HistoryComponent } from './features/history/history.component';
import { SettingsComponent } from './features/settings/settings.component';

export const routes: Route[] = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  
    {
      path: 'dashboard',
      loadComponent: () =>
        import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
    },
    {
      path: 'meetings',
      children: [
        {
          path: '',
          loadComponent: () =>
            import('./features/meetings/meetings-list/meetings-list.component').then(m => m.MeetingsListComponent)
        },
        {
          path: ':id',
          loadComponent: () =>
            import('./features/meetings/meeting-detail/meeting-detail.component').then(m => m.MeetingDetailComponent)
        }
      ]
    },
    {
      path: 'search',
      loadComponent: () =>
        import('./features/search/search.component').then(m => m.SearchComponent)
    },
    {
      path: 'history',
      loadComponent: () =>
        import('./features/history/history.component').then(m => m.HistoryComponent)
    },
    {
      path: 'settings',
      loadComponent: () =>
        import('./features/settings/settings.component').then(m => m.SettingsComponent)
    },
    { path: '**', redirectTo: 'dashboard' }
  ];