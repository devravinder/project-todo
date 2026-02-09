import { Routes } from '@angular/router';
import { taskResolver } from './pages/dashboard/task-details/task-details';
import { archiveTasksResolver } from './pages/dashboard/archive/archive';
import Layout from './components/layout/layout';
import { activeProjectGuard } from './guards/active-project-guard';
import { projectResolver } from './pages/dashboard/projects/projects';

export const routes: Routes = [
  {
    path: 'welcome',
    title: 'Welcome',
    canActivate: [activeProjectGuard],

    // we can load diffrent component based on user
    // we can inject anything in loadComponent method & implement logic
    loadComponent: () => import('./pages/welcome/welcome'),
  },

  // order is important, bcz /anything will be treated as :id, so keep it last
  {
    path: '',
    // pathMatch: 'full',// it creates a conflict with child routes because the entire URL must be empty to match.
    title: 'Tasks',
    component: Layout,
    canActivate: [activeProjectGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard/dashboard'),
      },
      {
        path: 'settings',
        title: 'Settings',
        loadComponent: () => import('./pages/dashboard/settings/settings'),
      },
      {
        path: 'archive',
        resolve: { data: archiveTasksResolver },
        loadComponent: () => import('./pages/dashboard/archive/archive'),
      },
      {
        path: 'projects',
        title: 'Projects',
        resolve: { formData: projectResolver },
        loadComponent: () => import('./pages/dashboard/projects/projects'),
      },
      {
        path: ':id',
        resolve: { task: taskResolver },
        loadComponent: () => import('./pages/dashboard/task-details/task-details'),
      },
    ],
  },
];
