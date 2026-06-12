import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {MatIcon} from "@angular/material/icon";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ApiService} from "../../../../core/services/api.service";
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-in',
  imports: [
    NgOptimizedImage,
    MatFormField,
    MatButton,
    MatLabel,
    MatInput,
    MatIcon,
    MatSuffix,
    ReactiveFormsModule
  ],
  templateUrl: './sign-in.component.html',
  standalone: true,
  styleUrl: './sign-in.component.css'
})

export class SignInComponent {
  loginForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
      private fb: FormBuilder,
      private apiService: ApiService,
      private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.apiService.authenticateUser(email, password).subscribe({
        next: (user) => {
          console.log(user);
            if (user.role === 'carrier') {

              // Obtener el id del entrepreneur
              this.apiService.getCarrierById(user.id).subscribe({

                next: (carrier) => {
                  localStorage.setItem('userId', carrier.userId); // Guardar el id en localStorage
                  localStorage.setItem('carrierId', carrier.id); // Guardar el id en localStorage
                  localStorage.setItem('carrierName', carrier.name); // Guardar el id en localStorage
                  this.router.navigate(['/carrier/home']);
                },
                error: (err) => {
                  console.error('Error al obtener carrier', err);
                }
              });

            } else if (user.role === 'entrepreneur') {
              // Obtener el id del entrepreneur
              /*console.log('User ID:', user.id);*/
              this.apiService.getEntrepreneurById(user.id).subscribe({

                next: (entrepreneur) => {
                  localStorage.setItem('userId', entrepreneur.userId); // Guardar el id en localStorage
                  localStorage.setItem('entrepreneurId', entrepreneur.id); // Guardar el id en localStorage
                  localStorage.setItem('entrepreneurName', entrepreneur.name); // Guardar el id en localStorage

                  this.router.navigate(['/entrepreneur/home']);
                },
                error: (err) => {
                  console.error('Error al obtener entrepreneur', err);
                }
              });
            }
        },
        error: (err) => {
          console.error('Error al autenticar', err);
          this.errorMessage = 'Ocurrió un error. Inténtalo de nuevo.';
        }
      });
    }
  }

}
