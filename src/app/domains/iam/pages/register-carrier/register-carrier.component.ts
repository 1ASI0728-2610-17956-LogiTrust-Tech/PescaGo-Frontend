import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatFormField, MatInput, MatLabel} from "@angular/material/input";
import {MatButton} from "@angular/material/button";
import {Router} from "@angular/router";
import { FormBuilder, FormGroup, ReactiveFormsModule ,Validators } from '@angular/forms';
import {ApiService} from "../../../../core/services/api.service";
import {UserCreate} from "../../../../shared/models/user.model";

@Component({
  selector: 'app-register-carrier',
  imports: [
    MatFormField,
    MatLabel,
    MatInput,
    MatButton,
    ReactiveFormsModule
  ],
  templateUrl: './register-carrier.component.html',
  standalone: true,
  styleUrl: './register-carrier.component.css'
})
export class RegisterCarrierComponent {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  imagePreview: string | null = null; // Vista previa de la imagen cargada

  registerForm: FormGroup;
  errorMessage: string | null = null;

  constructor(
      private fb: FormBuilder,
      private apiService: ApiService,
      private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      description: ['', Validators.required]
    });
  }

  // Disparar el input de archivo
  triggerFileInput(): void {
    this.fileInput.nativeElement.click(); // Accede directamente al elemento input
  }

  // Manejar la selección de archivo
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview = reader.result as string; // Guardar la vista previa
        localStorage.setItem('cachedImage', this.imagePreview); // Guardar en caché
      };

      reader.readAsDataURL(file); // Leer el archivo como Data URL
    }
  }


  onSubmit(): void {
    if (this.registerForm.valid) {
      const { name, email, password, description } = this.registerForm.value;

      const UserCreate= { username: email, email, password, role: 'carrier' }; // Crear el objeto User
      const carrier = { name, description };

      this.apiService.registerCarrier(UserCreate, carrier).subscribe({
        next: () => {
          console.log('Registro exitoso');
          this.router.navigate(['/sign-in']);
        },
        error: (err) => {
          console.error('Error al registrar', err);
          this.errorMessage = 'Ocurrió un error. Inténtalo de nuevo.';
        }
      });
    }
  }

}
