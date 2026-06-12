import {Component, Input, Output, EventEmitter, OnInit} from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { Router } from "@angular/router";
import {ApiService} from "../../../../core/services/api.service";

@Component({
  selector: "app-payment-form",
  imports: [CommonModule, FormsModule],
  templateUrl: "./payment-form.component.html",
  styleUrl: "./payment-form.component.css",
  standalone: true,
})
export class PaymentFormComponent implements OnInit {
  @Input() requestId: number | null = null;
  @Input() paymentMethod: string | null = null;
  @Output() closeModal = new EventEmitter<void>();
  // Receipt Model
  holderName: string = "";
  cardNumber: string = "";
  expiryDate: string = "";
  cvv: string = "";
  // request
  request:any;


  constructor(private router: Router,private apiService: ApiService) {
  }

  ngOnInit(): void {
    console.log('Método de pago recibido:', this.paymentMethod); // Verificar el valor recibido

    if (this.requestId != null) {
      console.log('requestId:', this.requestId); // Verificar el valor recibido
      this.apiService.getRequestById(this.requestId).subscribe({
        next: (request) => {
          this.request = request;
          console.log('Request:', this.request); // Mover aquí para garantizar que el valor esté disponible
        },
        error: (err) => {
          console.error("Error al cargar el request:", err);
        },
      });
    }
  }
  submitPayment(): void {
    if (this.holderName && this.cardNumber && this.expiryDate && this.cvv) {
      const receipt = {
        requestId: this.requestId,
        holderName: this.holderName,
        cardNumber: this.cardNumber,
        expiryDate: this.expiryDate,
        cvv: this.cvv,
        paymentDate: new Date().toISOString(),
      };

      // Llamar al servicio para guardar el recibo
      this.apiService.createReceipt(receipt).subscribe({
        next: () => {
          console.log("Recibo guardado:", receipt);
          alert("Pago realizado con éxito.");
          this.closeModal.emit();
          this.router.navigate(["/entrepreneur/request-status"]);
        },
        error: (err) => {
          console.error("Error al guardar el recibo:", err);
          alert("Ocurrió un error al procesar el pago.");
        },
      });

      // Actualizar el objeto request
      this.request.status = "Pagado";

      // Enviar la solicitud actualizada
      this.apiService.editRequestById(this.request.id, this.request).subscribe({
        next: (response) => {
          console.log('Request actualizado:', response);
        },
        error: (err) => {
          console.error('Error al actualizar el request:', err);
        }
      });

      const hiredService={
        requestId: this.requestId,
        entrepreneurId: this.request.entrepreneurId,
        entrepreneurName: this.request.entrepreneurName,
        carrierId: this.request.carrierId,
        carrierName: this.request.carrierName,
        packageDescription: this.request.packageDescription,
        pickupDateTime: this.request.pickupDateTime,
        carrierData: {
          vehicleBrand: "",
          plate: "",
          driver: ""
        },
        status: "Pendiente",
        paymentMethod: this.paymentMethod,
      }

      // Llamar al servicio para guardar el hiredService

        this.apiService.createHiredService(hiredService).subscribe({
            next: () => {
            console.log("HiredService guardado:", hiredService);
            alert("Servicio Pagado con éxito.");
            },
            error: (err) => {
            console.error("Error al guardar el hiredService:", err);
            alert("Ocurrió un error al procesar el pago.");
            },
        });


    } else {
      alert("Por favor, complete todos los campos.");
    }



  }
}
