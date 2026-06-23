import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { routes } from './app.routes';
import { authV2Guard } from './core/auth/auth-v2.guard';
import { carrierRoleGuard } from './core/auth/carrier-role.guard';
import { AuthV2Service } from './core/auth/auth-v2.service';
import { environment } from '../enviroments/enviroment';

@Component({
    template: '<router-outlet />',
    standalone: true,
    imports: [RouterOutlet]
})
class RouterHostComponent {}

describe('app routes carrier fleet protection', () => {
    let router: Router;
    let httpMock: HttpTestingController;
    let hostFixture: ComponentFixture<RouterHostComponent>;

    beforeEach(async () => {
        localStorage.clear();

        await TestBed.configureTestingModule({
            imports: [RouterHostComponent],
            providers: [
                provideRouter(routes),
                AuthV2Service,
                provideHttpClient(),
                provideHttpClientTesting(),
                provideNoopAnimations()
            ]
        });

        router = TestBed.inject(Router);
        httpMock = TestBed.inject(HttpTestingController);

        hostFixture = TestBed.createComponent(RouterHostComponent);
        hostFixture.detectChanges();
        await router.initialNavigation();
        hostFixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should configure carrier/fleet with authV2Guard followed by carrierRoleGuard', () => {
        const fleetRoute = routes.find((route) => route.path === 'carrier/fleet');

        expect(fleetRoute?.canActivate?.[0]).toBe(authV2Guard);
        expect(fleetRoute?.canActivate?.[1]).toBe(carrierRoleGuard);
    });

    it('should redirect to sign-in-v2 when navigating to carrier/fleet without v2 token', async () => {
        await router.navigateByUrl('/carrier/fleet');

        expect(router.url).toBe('/sign-in-v2');
    });

    it('should redirect to sign-in-v2 when navigating to carrier/fleet with non-CARRIER v2 session', async () => {
        localStorage.setItem('pescago.v2.accessToken', 'mock-token');
        localStorage.setItem('pescago.v2.profile', JSON.stringify({
            userId: 20,
            username: 'entrepreneur-user',
            email: 'entrepreneur@example.com',
            role: 'ENTREPRENEUR',
            profile: null
        }));

        await router.navigateByUrl('/carrier/fleet');

        expect(router.url).toBe('/sign-in-v2');
    });

    it('should allow navigation to carrier/fleet with authenticated CARRIER v2 session', async () => {
        localStorage.setItem('pescago.v2.accessToken', 'mock-token');
        localStorage.setItem('pescago.v2.profile', JSON.stringify({
            userId: 10,
            username: 'carrier-user',
            email: 'carrier@example.com',
            role: 'CARRIER',
            profile: null
        }));

        await router.navigateByUrl('/carrier/fleet');
        hostFixture.detectChanges();
        await hostFixture.whenStable();

        expect(router.url).toBe('/carrier/fleet');

        const request = httpMock.expectOne(`${environment.apiV2Url}/fleet/vehicles`);
        request.flush([]);
    });
});
