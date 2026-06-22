import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthV2Service } from './auth-v2.service';

export const authV2Guard: CanActivateFn = () => {
    const authV2Service = inject(AuthV2Service);
    const router = inject(Router);

    if (authV2Service.isAuthenticated()) {
        return true;
    }

    return router.createUrlTree(['/sign-in-v2']);
};
