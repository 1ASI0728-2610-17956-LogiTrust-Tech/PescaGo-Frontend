import { Component } from '@angular/core';
import { NgIf, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel, MatSuffix } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { Router, RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthV2Service } from '../../../../core/auth/auth-v2.service';

@Component({
    selector: 'app-sign-in-v2',
    imports: [
        NgIf,
        NgOptimizedImage,
        ReactiveFormsModule,
        MatFormField,
        MatInput,
        MatLabel,
        MatSuffix,
        MatIcon,
        MatButton,
        RouterLink
    ],
    templateUrl: './sign-in-v2.component.html',
    standalone: true,
    styleUrl: './sign-in-v2.component.css'
})
export class SignInV2Component {
    loginForm: FormGroup;
    errorMessage: string | null = null;
    successMessage: string | null = null;
    isSubmitting = false;

    constructor(
        private fb: FormBuilder,
        private authV2Service: AuthV2Service,
        private router: Router
    ) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }

    onSubmit(): void {
        if (this.loginForm.invalid || this.isSubmitting) {
            return;
        }

        this.errorMessage = null;
        this.successMessage = null;
        this.isSubmitting = true;
        const { email, password } = this.loginForm.value;

        this.authV2Service.login(email, password).subscribe({
            next: () => {
                this.authV2Service.loadProfile().subscribe({
                    next: (profile) => {
                        this.isSubmitting = false;
                        if (profile.role?.toUpperCase() === 'CARRIER') {
                            void this.router.navigate(['/carrier/fleet']);
                            return;
                        }

                        this.authV2Service.logoutV2();
                        this.errorMessage = 'Fleet v2 está disponible solo para usuarios Carrier por ahora.';
                    },
                    error: () => {
                        this.isSubmitting = false;
                        this.authV2Service.logoutV2();
                        this.errorMessage = 'No se pudo cargar el perfil de sesión. Inténtalo de nuevo.';
                    }
                });
            },
            error: (error: unknown) => {
                this.isSubmitting = false;

                if (error instanceof HttpErrorResponse && error.status === 401) {
                    this.errorMessage = 'Credenciales inválidas. Verifica tu correo y contraseña.';
                    return;
                }

                this.authV2Service.logoutV2();
                this.errorMessage = 'Ocurrió un error. Inténtalo de nuevo.';
            }
        });
    }
}
