import { TestBed } from '@angular/core/testing';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthV2Service } from './auth-v2.service';
import { authV2Interceptor } from '../interceptors/auth-v2.interceptor';
import { environment } from '../../../enviroments/enviroment';
import { LoginResponse, SessionProfile } from './auth-v2.models';

describe('AuthV2Service', () => {
    let service: AuthV2Service;
    let httpMock: HttpTestingController;

    const loginResponse: LoginResponse = {
        accessToken: 'mock-access-token',
        tokenType: 'Bearer',
        profile: {
            userId: 10,
            email: 'carrier@example.com',
            role: 'CARRIER'
        }
    };

    const sessionProfile: SessionProfile = {
        userId: 10,
        username: 'carrier-user',
        email: 'carrier@example.com',
        role: 'CARRIER',
        profile: {
            type: 'CARRIER',
            id: 5,
            userId: 10,
            name: 'Carrier Name'
        }
    };

    beforeEach(() => {
        localStorage.clear();

        TestBed.configureTestingModule({
            providers: [
                AuthV2Service,
                provideHttpClient(withInterceptors([authV2Interceptor])),
                provideHttpClientTesting(),
                { provide: Router, useValue: { navigate: jasmine.createSpy('navigate') } }
            ]
        });

        service = TestBed.inject(AuthV2Service);
        httpMock = TestBed.inject(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('login should POST credentials to v2 auth endpoint and persist session', () => {
        service.login('carrier@example.com', 'secret').subscribe((response) => {
            expect(response).toEqual(loginResponse);
        });

        const request = httpMock.expectOne(`${environment.apiV2Url}/auth/login`);
        expect(request.request.method).toBe('POST');
        expect(request.request.body).toEqual({
            email: 'carrier@example.com',
            password: 'secret'
        });

        request.flush(loginResponse);

        expect(localStorage.getItem('pescago.v2.accessToken')).toBe('mock-access-token');
        expect(JSON.parse(localStorage.getItem('pescago.v2.profile')!)).toEqual({
            userId: 10,
            username: 'carrier@example.com',
            email: 'carrier@example.com',
            role: 'CARRIER',
            profile: null
        });
    });

    it('login should not persist session on 401', () => {
        service.login('carrier@example.com', 'wrong').subscribe({
            next: () => fail('Expected login to fail'),
            error: (error) => expect(error.status).toBe(401)
        });

        const request = httpMock.expectOne(`${environment.apiV2Url}/auth/login`);
        request.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

        expect(localStorage.getItem('pescago.v2.accessToken')).toBeNull();
        expect(localStorage.getItem('pescago.v2.profile')).toBeNull();
    });

    it('loadProfile should GET v2 profile and update stored profile', () => {
        localStorage.setItem('pescago.v2.accessToken', 'mock-access-token');

        service.loadProfile().subscribe((profile) => {
            expect(profile).toEqual(sessionProfile);
        });

        const request = httpMock.expectOne(`${environment.apiV2Url}/users/me/profile`);
        expect(request.request.method).toBe('GET');
        expect(request.request.headers.get('Authorization')).toBe('Bearer mock-access-token');
        request.flush(sessionProfile);

        expect(service.getProfile()).toEqual(sessionProfile);
    });

    it('logoutV2 should remove only v2 keys', () => {
        localStorage.setItem('pescago.v2.accessToken', 'mock-access-token');
        localStorage.setItem('pescago.v2.profile', JSON.stringify(sessionProfile));
        localStorage.setItem('userId', 'legacy-user');

        service.logoutV2();

        expect(localStorage.getItem('pescago.v2.accessToken')).toBeNull();
        expect(localStorage.getItem('pescago.v2.profile')).toBeNull();
        expect(localStorage.getItem('userId')).toBe('legacy-user');
    });
});
