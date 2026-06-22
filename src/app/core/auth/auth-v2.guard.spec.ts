import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authV2Guard } from './auth-v2.guard';
import { AuthV2Service } from './auth-v2.service';

describe('authV2Guard', () => {
    let authV2Service: jasmine.SpyObj<AuthV2Service>;
    let router: jasmine.SpyObj<Router>;

    beforeEach(() => {
        authV2Service = jasmine.createSpyObj('AuthV2Service', ['isAuthenticated']);
        router = jasmine.createSpyObj('Router', ['createUrlTree']);
        router.createUrlTree.and.returnValue({} as UrlTree);

        TestBed.configureTestingModule({
            providers: [
                { provide: AuthV2Service, useValue: authV2Service },
                { provide: Router, useValue: router }
            ]
        });
    });

    it('should allow activation when v2 token exists', () => {
        authV2Service.isAuthenticated.and.returnValue(true);

        const result = TestBed.runInInjectionContext(() => authV2Guard({} as never, {} as never));

        expect(result).toBeTrue();
        expect(router.createUrlTree).not.toHaveBeenCalled();
    });

    it('should redirect to sign-in-v2 when token is missing', () => {
        authV2Service.isAuthenticated.and.returnValue(false);

        TestBed.runInInjectionContext(() => authV2Guard({} as never, {} as never));

        expect(router.createUrlTree).toHaveBeenCalledWith(['/sign-in-v2']);
    });
});
