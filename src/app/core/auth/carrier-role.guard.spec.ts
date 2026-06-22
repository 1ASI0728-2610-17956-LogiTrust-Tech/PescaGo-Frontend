import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { carrierRoleGuard } from './carrier-role.guard';
import { AuthV2Service } from './auth-v2.service';

describe('carrierRoleGuard', () => {
    let authV2Service: jasmine.SpyObj<AuthV2Service>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authV2Service = jasmine.createSpyObj('AuthV2Service', ['isAuthenticated', 'hasRole']);
        router = jasmine.createSpyObj('Router', ['createUrlTree']);
        router.createUrlTree.and.returnValue({} as UrlTree);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthV2Service, useValue: authV2Service },
                { provide: Router, useValue: router }
            ]
        });
    });

    it('should allow activation for authenticated CARRIER users', () => {
        authV2Service.isAuthenticated.and.returnValue(true);
        authV2Service.hasRole.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() => carrierRoleGuard({} as never, {} as never));

        expect(result).toBeTrue();
        expect(authV2Service.hasRole).toHaveBeenCalledWith('CARRIER');
    });

    it('should redirect ENTREPRENEUR users to sign-in-v2', () => {
        authV2Service.isAuthenticated.and.returnValue(true);
        authV2Service.hasRole.and.returnValue(false);

        TestBed.runInInjectionContext(() => carrierRoleGuard({} as never, {} as never));

        expect(router.createUrlTree).toHaveBeenCalledWith(['/sign-in-v2']);
    });

    it('should redirect unauthenticated users to sign-in-v2', () => {
        authV2Service.isAuthenticated.and.returnValue(false);

        TestBed.runInInjectionContext(() => carrierRoleGuard({} as never, {} as never));

        expect(router.createUrlTree).toHaveBeenCalledWith(['/sign-in-v2']);
    });
});
