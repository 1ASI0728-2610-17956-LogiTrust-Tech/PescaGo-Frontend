export type CanonicalRole = 'CARRIER' | 'ENTREPRENEUR' | 'ADMIN' | 'LEGACY_USER';

export interface BusinessProfile {
    type: string;
    id: number;
    userId: number;
    name: string;
    description?: string;
}

export interface SessionProfile {
    userId: number;
    username: string;
    email: string;
    role: CanonicalRole | string;
    profile?: BusinessProfile | null;
}

export interface LoginProfile {
    userId: number;
    email: string;
    role: string;
}

export interface LoginResponse {
    accessToken: string;
    tokenType: string;
    profile: LoginProfile;
}
