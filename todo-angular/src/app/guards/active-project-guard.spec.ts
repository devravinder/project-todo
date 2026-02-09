import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { activeProjectGuard } from './active-project-guard';

describe('activeProjectGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => activeProjectGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
