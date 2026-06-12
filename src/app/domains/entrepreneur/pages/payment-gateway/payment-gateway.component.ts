import { Component, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ActivatedRoute } from "@angular/router"; //Si se necesita agregar routerLink se hace aqui
import { trigger, transition, style, animate } from "@angular/animations";
import { PaymentFormComponent } from "../../components/payment-form/payment-form.component";
import { Location } from "@angular/common";

@Component({
  selector: "app-payment-gateway",
  imports: [CommonModule, PaymentFormComponent],
  templateUrl: "./payment-gateway.component.html",
  styleUrl: "./payment-gateway.component.css",
  standalone: true,
  animations: [
    trigger("fadeAnimation", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate("300ms", style({ opacity: 1 })),
      ]),
      transition(":leave", [animate("300ms", style({ opacity: 0 }))]),
    ]),
  ],
})
export class PaymentGatewayComponent implements OnInit {
  requestId: number | null = null;
  showPaymentModal: boolean = false;
  paymentMethod: string = ""; // Método de pago por defecto

  constructor(private route: ActivatedRoute, private location: Location) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.requestId = +params["id"];
    });
  }

  selectMethod(method: string): void {
    this.paymentMethod = method;
    console.log('Método de pago seleccionado:', this.paymentMethod); // Verificar el valor
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
  }

  // Añade este método
  goBack(): void {
    this.location.back();
  }
}
