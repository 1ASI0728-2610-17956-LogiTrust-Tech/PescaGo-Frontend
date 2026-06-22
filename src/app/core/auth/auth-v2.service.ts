import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../enviroments/enviroment';
import {
    CanonicalRole,
    LoginProfile,
    LoginResponse,
    SessionProfile
} from './auth-v2.models';

@Injectable({
    providedIn: 'root'
})
export class AuthV2Service {

    private static readonly TOKEN_KEY = 'pescago.v2.accessToken';
    private static readonly PROFILE_KEY = 'pescago.v2.profile';

    constructor(private http: HttpClient) {}

    login(email: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(`${environment.apiV2Url}/auth/login`, {
            email,
            password
        }).pipe(
            tap((response) => {
                this.persistToken(response.accessToken);
                this.persistProfile(this.toSessionProfileFromLogin(response.profile));
            })
        );
    }

    loadProfile(): Observable<SessionProfile> {
        return this.http.get<SessionProfile>(`${environment.apiV2Url}/users/me/profile`).pipe(
            tap((profile) => this.persistProfile(profile))
        );
    }

    logoutV2(): void {
        localStorage.removeItem(AuthV2Service.TOKEN_KEY);
        localStorage.removeItem(AuthV2Service.PROFILE_KEY);
    }

    getAccessToken(): string | null {
        return localStorage.getItem(AuthV2Service.TOKEN_KEY);
    }

    getProfile(): SessionProfile | null {
        const rawProfile = localStorage.getItem(AuthV2Service.PROFILE_KEY);
        if (!rawProfile) {
            return null;
        }

        try {
            return JSON.parse(rawProfile) as SessionProfile;
        } catch {
            this.logoutV2();
            return null;
        }
    }

    isAuthenticated(): boolean {
        const token = this.getAccessToken();
        return token !== null && token.trim().length > 0;
    }

    hasRole(role: CanonicalRole | string): boolean {
        const profile = this.getProfile();
        if (!profile?.role) {
            return false;
        }
        return profile.role.toUpperCase() === role.toString().toUpperCase();
    }

    private persistToken(token: string): void {
        localStorage.setItem(AuthV2Service.TOKEN_KEY, token);
    }

    private persistProfile(profile: SessionProfile): void {
        localStorage.setItem(AuthV2Service.PROFILE_KEY, JSON.stringify(profile));
    }

    private toSessionProfileFromLogin(profile: LoginProfile): SessionProfile {
        return {
            userId: profile.userId,
            username: profile.email,
            email: profile.email,
            role: profile.role,
            profile: null
        };
    }
}
