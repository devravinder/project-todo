import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { ProjectService } from '../services/project/project.service';

export const activeProjectGuard: CanActivateFn = async (route, state) => {
  const isWelcome = state.url === '/welcome';
  const router = inject(Router);
  const projectService = inject(ProjectService);

  const activeProject = await projectService.getActiveProject();

  if (activeProject) {
    console.log(`active project found`);
    if (!isWelcome) return true;
  } else {
    console.log(`no active project found`);
    if (isWelcome) return true;
  }

  const nextRoute = router.parseUrl(isWelcome ? '' : 'welcome');
  return new RedirectCommand(nextRoute, {
    skipLocationChange: false, // skip adding to browser history
  });
};
