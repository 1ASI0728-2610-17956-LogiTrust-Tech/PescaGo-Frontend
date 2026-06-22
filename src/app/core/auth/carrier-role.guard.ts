import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthV2Service } from './auth-v2.service';

export const carrierRoleGuard: CanActivateFn = () => {
    const authV2Service = inject(AuthV2Service);
    const router = inject(Router);

    if (authV2Service.isAuthenticated() && authV2Service.hasRole('CARRIER')) {
        return true;
    }

    return router.createUrlTree(['/sign-in-v2']);
};
