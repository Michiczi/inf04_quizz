import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../environments/environment';

export const authGuard: CanActivateFn = async (route, state) => {
  const router = inject(Router);
  const http = inject(HttpClient);
  const requiredRole = route.data?.['requiredRole'] as string | undefined;

  try {
    const userData: any = await firstValueFrom(
      http.get(`${environment.apiUrl}/users/user`, {
        withCredentials: true,
      })
    );

    if (!userData) {
      return router.createUrlTree(['/login']);
    }

    if (requiredRole && userData.role !== requiredRole) {
      if (requiredRole === 'admin') {
        return router.createUrlTree(['/dashboard']);
      }
      return router.createUrlTree(['/login']);
    }

    return true;
  } catch (err) {
    console.error('AuthGuard error:', err);
    return router.createUrlTree(['/login']);
  }
};
