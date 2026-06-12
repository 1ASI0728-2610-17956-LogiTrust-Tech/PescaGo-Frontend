import {Component, Inject} from '@angular/core';
import {MatDialogRef, MAT_DIALOG_DATA, MatDialogActions, MatDialogContent} from '@angular/material/dialog';
import {MatButton} from "@angular/material/button";


@Component({
  selector: 'app-packet-details',
  imports: [
    MatButton,
    MatDialogActions,
    MatDialogContent
  ],
  templateUrl: './packet-details.component.html',
  standalone: true,
  styleUrl: './packet-details.component.css'
})
export class PacketDetailsComponent {

  constructor(
      public dialogRef: MatDialogRef<PacketDetailsComponent>,
      @Inject(MAT_DIALOG_DATA) public data: any // Recibe datos opcionales
  ) {console.log('Datos recibidos en PacketDetailsComponent:', this.data.request); // Verificar los datos
  }

  // Método para cerrar el diálogo
  closeDialog(): void {
    this.dialogRef.close();
  }

}
