import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from "@angular/material/dialog";
import {MatButton} from "@angular/material/button";
import {MatFormField, MatInput, MatSuffix} from "@angular/material/input";
import {MatIcon} from "@angular/material/icon";
import {FormsModule} from "@angular/forms";
import {ApiService} from "../../../../core/services/api.service";

@Component({
  selector: 'app-offered-price',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatInput,
    MatFormField,
    MatIcon,
    MatSuffix,
    FormsModule,
  ],
  templateUrl: './offered-price.component.html',
  standalone: true,
  styleUrl: './offered-price.component.css'
})
export class OfferedPriceComponent {
  price: number = 0; // Inicializa el precio a 0
  request: any; // Variable para almacenar la solicitud

  constructor(
      private apiService: ApiService,
      public dialogRef: MatDialogRef<OfferedPriceComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any // Recibe datos opcionales
  ) {console.log('Datos recibidos en OfferedPriceComponent:', this.data.request); // Verificar los datos
    this.request=data.request; // Asigna la solicitud recibida a la variable
  }

// Método para cerrar el diálogo
  closeDialog(): void {
    console.log('Price value', this.price); // Verificar el valor del precio

    // Actualizar el objeto request
    this.request.price = this.price;
    this.request.status = "Cotizado";

    // Enviar la solicitud actualizada
    this.apiService.editRequestById(this.request.id, this.request).subscribe({
      next: (response) => {
        console.log('Request actualizado:', response);
      },
      error: (err) => {
        console.error('Error al actualizar el request:', err);
      }
    });

    this.dialogRef.close();
  }
}
