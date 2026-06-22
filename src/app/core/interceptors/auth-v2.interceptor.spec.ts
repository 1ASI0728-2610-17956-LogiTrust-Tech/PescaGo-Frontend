import { TestBed } from '@angular/core/testing';
import {
    HttpClient,
    HttpErrorResponse,
    provideHttpClient,
    withInterceptors
} from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { authV2Interceptor } from './auth-v2.interceptor';
import { AuthV2Service } from '../auth/auth-v2.service';
import { environment } from '../../../enviroments/enviroment';

describe('authV2Interceptor', () => {
    let http: HttpClient;
    let httpMock: HttpTestingController;
    let authV2Service: AuthV2Service;
    let routerNavigateSpy: jasmine.Spy;

    beforeEach(() => {
        localStorage.clear();
        routerNavigateSpy = jasmine.createSpy('navigate');

        TestBed.configureTestingModule({
            providers: [
                AuthV2Service,
                provideHttpClient(withInterceptors([authV2Interceptor])),
                provideHttpClientTesting(),
                {
                    provide: Router,
                    useValue: { navigate: routerNavigateSpy }
                }
            ]
        });

        http = TestBed.inject(HttpClient);
        httpMock = TestBed.inject(HttpTestingController);
        authV2Service = TestBed.inject(AuthV2Service);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should add Bearer token to v2 profile requests when token exists', () => {
        localStorage.setItem('pescago.v2.accessToken', 'mock-access-token');

        http.get(`${environment.apiV2Url}/users/me/profile`).subscribe();

        const request = httpMock.expectOne(`${environment.apiV2Url}/users/me/profile`);
        expect(request.request.headers.get('Authorization')).toBe('Bearer mock-access-token');
        request.flush({});
    });

    it('should not add Bearer token to v1 requests', () => {
        localStorage.setItem('pescago.v2.accessToken', 'mock-access-token');

        http.get(`${environment.apiUrl}/users/authentication`).subscribe();

        const request = httpMock.expectOne(`${environment.apiUrl}/users/authentication`);
        expect(request.request.headers.has('Authorization')).toBeFalse();
        request.flush({});
    });

    it('should not add invalid Authorization header when token is missing', () => {
        http.get(`${environment.apiV2Url}/users/me/profile`).subscribe();

        const request = httpMock.expectOne(`${environment.apiV2Url}/users/me/profile`);
        expect(request.request.headers.has('Authorization')).toBeFalse();
        request.flush({});
    });

    it('should not clear session or redirect on 401 from v2 login endpoint', () => {
        localStorage.setItem('pescago.v2.accessToken', 'existing-token');
        localStorage.setItem('pescago.v2.profile', JSON.stringify({ userId: 1 }));

        http.post(`${environment.apiV2Url}/auth/login`, {
            email: 'carrier@example.com',
            password: 'wrong'
        }).subscribe({
            next: () => fail('Expected login to fail'),
            error: (error: HttpErrorResponse) => expect(error.status).toBe(401)
        });

        const request = httpMock.expectOne(`${environment.apiV2Url}/auth/login`);
        request.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

        expect(authV2Service.getAccessToken()).toBe('existing-token');
        expect(JSON.parse(localStorage.getItem('pescago.v2.profile')!)).toEqual({ userId: 1 });
        expect(routerNavigateSpy).not.toHaveBeenCalled();
    });

    it('should clear v2 session and redirect on 401 from other v2 endpoints', () => {
        localStorage.setItem('pescago.v2.accessToken', 'mock-access-token');
        localStorage.setItem('pescago.v2.profile', JSON.stringify({ userId: 1 }));

        http.get(`${environment.apiV2Url}/users/me/profile`).subscribe({
            next: () => fail('Expected request to fail'),
            error: (error: HttpErrorResponse) => expect(error.status).toBe(401)
        });

        const request = httpMock.expectOne(`${environment.apiV2Url}/users/me/profile`);
        request.flush({}, { status: 401, statusText: 'Unauthorized' });

        expect(authV2Service.getAccessToken()).toBeNull();
        expect(authV2Service.getProfile()).toBeNull();
        expect(routerNavigateSpy).toHaveBeenCalledWith(['/sign-in-v2']);
    });
});
