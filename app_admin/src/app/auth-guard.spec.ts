import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth-guard';
import { Authentication } from './services/authentication';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: any;
  let router: any;

  beforeEach(() => {
    authService = {
      isLoggedIn: vi.fn()
    };

    router = {
      navigate: vi.fn()
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Authentication, useValue: authService },
        { provide: Router, useValue: router }
      ]
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('allows access when user is logged in', () => {
    authService.isLoggedIn.mockReturnValue(true);

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBe(true);
  });

  it('redirects when user is not logged in', () => {
    authService.isLoggedIn.mockReturnValue(false);

    const result = guard.canActivate({} as any, {} as any);

    expect(result).toBe(false);
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });
});