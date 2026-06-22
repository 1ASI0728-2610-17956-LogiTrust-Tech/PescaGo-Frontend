import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthV2Service } from '../auth/auth-v2.service';
import { environment } from '../../../enviroments/enviroment';

export const authV2Interceptor: HttpInterceptorFn = (req, next) => {
    const authV2Service = inject(AuthV2Service);
    const router = inject(Router);

    const isV2Request = req.url.startsWith(environment.apiV2Url);
    if (!isV2Request) {
        return next(req);
    }

    const loginEndpoint = `${environment.apiV2Url}/auth/login`;
    const isLoginRequest = req.url === loginEndpoint;
    const token = authV2Service.getAccessToken();
    const requestWithAuth = token && !isLoginRequest
        ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
        : req;

    return next(requestWithAuth).pipe(
        catchError((error: unknown) => {
            if (
                error instanceof HttpErrorResponse
                && error.status === 401
                && req.url !== loginEndpoint
            ) {
                authV2Service.logoutV2();
                void router.navigate(['/sign-in-v2']);
            }
            return throwError(() => error);
        })
    );
};
