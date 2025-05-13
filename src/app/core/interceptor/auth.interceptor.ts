import { HttpInterceptorFn} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../authentication/auth.service';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  const cloned = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(cloned);
};