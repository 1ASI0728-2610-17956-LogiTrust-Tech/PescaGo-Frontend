import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import {
    HttpTestingController,
    provideHttpClientTesting
} from '@angular/common/http/testing';
import { SignInV2Component } from './sign-in-v2.component';
import { AuthV2Service } from '../../../../core/auth/auth-v2.service';
import { environment } from '../../../../../enviroments/enviroment';
import { LoginResponse, SessionProfile } from '../../../../core/auth/auth-v2.models';

describe('SignInV2Component', () => {
    let component: SignInV2Component;
    let fixture: ComponentFixture<SignInV2Component>;
    let authV2Service: AuthV2Service;
    let httpMock: HttpTestingController;
    let router: Router;

    const loginResponse: LoginResponse = {
        accessToken: 'mock-access-token',
        tokenType: 'Bearer',
        profile: {
            userId: 10,
            email: 'carrier@example.com',
            role: 'CARRIER'
        }
    };

    const carrierProfile: SessionProfile = {
        userId: 10,
        username: 'carrier-user',
        email: 'carrier@example.com',
        role: 'CARRIER',
        profile: null
    };

    beforeEach(async () => {
        localStorage.clear();

        await TestBed.configureTestingModule({
            imports: [SignInV2Component],
            providers: [
                AuthV2Service,
                provideHttpClient(),
                provideHttpClientTesting(),
                provideRouter([])
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(SignInV2Component);
        component = fixture.componentInstance;
        authV2Service = TestBed.inject(AuthV2Service);
        httpMock = TestBed.inject(HttpTestingController);
        router = TestBed.inject(Router);
        fixture.detectChanges();
    });

    afterEach(() => {
        httpMock.verify();
        localStorage.clear();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should persist session and navigate to carrier fleet on successful CARRIER login', () => {
        const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

        component.loginForm.setValue({
            email: 'carrier@example.com',
            password: 'secret'
        });
        component.onSubmit();

        const loginRequest = httpMock.expectOne(`${environment.apiV2Url}/auth/login`);
        loginRequest.flush(loginResponse);

        const profileRequest = httpMock.expectOne(`${environment.apiV2Url}/users/me/profile`);
        profileRequest.flush(carrierProfile);

        expect(localStorage.getItem('pescago.v2.accessToken')).toBe('mock-access-token');
        expect(JSON.parse(localStorage.getItem('pescago.v2.profile')!)).toEqual(carrierProfile);
        expect(localStorage.getItem('carrierId')).toBeNull();
        expect(localStorage.getItem('userId')).toBeNull();
        expect(navigateSpy).toHaveBeenCalledWith(['/carrier/fleet']);
    });

    it('should show error message on 401 login response', () => {
        component.loginForm.setValue({
            email: 'carrier@example.com',
            password: 'wrong'
        });
        component.onSubmit();

        const loginRequest = httpMock.expectOne(`${environment.apiV2Url}/auth/login`);
        loginRequest.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });

        expect(component.errorMessage).toBe('Credenciales inválidas. Verifica tu correo y contraseña.');
        expect(localStorage.getItem('pescago.v2.accessToken')).toBeNull();
    });

    it('should not send request when form is invalid', () => {
        const loginSpy = spyOn(authV2Service, 'login').and.callThrough();

        component.loginForm.setValue({
            email: '',
            password: ''
        });
        component.onSubmit();

        expect(loginSpy).not.toHaveBeenCalled();
        httpMock.expectNone(`${environment.apiV2Url}/auth/login`);
    });

    it('should show Fleet-only message for non-CARRIER roles', () => {
        const navigateSpy = spyOn(router, 'navigate').and.returnValue(Promise.resolve(true));

        component.loginForm.setValue({
            email: 'entrepreneur@example.com',
            password: 'secret'
        });
        component.onSubmit();

        const loginRequest = httpMock.expectOne(`${environment.apiV2Url}/auth/login`);
        loginRequest.flush({
            ...loginResponse,
            profile: {
                userId: 20,
                email: 'entrepreneur@example.com',
                role: 'ENTREPRENEUR'
            }
        });

        const profileRequest = httpMock.expectOne(`${environment.apiV2Url}/users/me/profile`);
        profileRequest.flush({
            userId: 20,
            username: 'entrepreneur-user',
            email: 'entrepreneur@example.com',
            role: 'ENTREPRENEUR',
            profile: null
        });

        expect(navigateSpy).not.toHaveBeenCalledWith(['/carrier/fleet']);
        expect(component.errorMessage).toContain('Fleet v2 está disponible solo para usuarios Carrier');
        expect(localStorage.getItem('pescago.v2.accessToken')).toBeNull();
    });
});
