import {Component, ElementRef, ViewChild, AfterViewInit, Inject, OnInit} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatFormField, MatInput, MatLabel, MatSuffix} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {ApiService} from "../../../../core/services/api.service";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-shipping-info',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent,
    MatFormField,
    MatIcon,
    MatInput,
    MatSuffix,
    MatLabel,
    FormsModule,
  ],
  templateUrl: './shipping-info.component.html',
  styleUrl: './shipping-info.component.css'
})
export class ShippingInfoComponent implements AfterViewInit, OnInit {
  @ViewChild('fileInput1') fileInput1!: ElementRef<HTMLInputElement>;
  @ViewChild('fileInput2') fileInput2!: ElementRef<HTMLInputElement>;

  imagePreview1: string | null = null; // Vista previa de la imagen cargada 1
  imagePreview2: string | null = null; // Vista previa de la imagen cargada 2

  ngAfterViewInit(): void {
    // Este hook asegura que las referencias @ViewChild estén inicializadas
    if (!this.fileInput1 || !this.fileInput2) {
      console.error('Las referencias de los inputs no están inicializadas.');
    }
  }

// Disparar el input de archivo 1
  triggerFileInput1(): void {
    if (this.fileInput1) {
      this.fileInput1.nativeElement.click();
    } else {
      console.error('fileInput1 no está inicializado.');
    }
  }

// Disparar el input de archivo 2
  triggerFileInput2(): void {
    if (this.fileInput2) {
      this.fileInput2.nativeElement.click();
    } else {
      console.error('fileInput2 no está inicializado.');
    }
  }

  // Manejar la selección de archivo para el primer input
  onFileSelected1(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview1 = reader.result as string;
        localStorage.setItem('cachedImage1', this.imagePreview1);
      };

      reader.readAsDataURL(file);
    }
  }

// Manejar la selección de archivo para el segundo input
  onFileSelected2(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        this.imagePreview2 = reader.result as string;
        localStorage.setItem('cachedImage2', this.imagePreview2);
      };

      reader.readAsDataURL(file);
    }
  }

  service: any; // Variable para almacenar la solicitud

  constructor(
      private apiService: ApiService,
      public dialogRef: MatDialogRef<ShippingInfoComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any // Recibe datos opcionales
  ) {
    console.log('Datos recibidos en ShippingInfoComponent:', this.data.service);
    this.service=data.service; // Asigna la solicitud recibida a la variable
  } // Verificar los datos

  ngOnInit(): void {
    }

// Método para cerrar el diálogo
  closeDialog(): void {
    this.dialogRef.close();
  }

  sendShippingInfo(): void {
    // Actualizar el objeto service
    this.service.status = "Confirmado";

    // Enviar la solicitud actualizada
    this.apiService.editServiceById(this.service.id, this.service).subscribe({
      next: (response) => {
        console.log('Service actualizado:', response);
      },
      error: (err) => {
        console.error('Error al actualizar el service:', err);
      }
    });
    this.dialogRef.close();
  }
}
