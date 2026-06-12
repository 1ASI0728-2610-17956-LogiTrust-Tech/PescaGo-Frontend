import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {PacketDetailsComponent} from "../../components/packet-details/packet-details.component";
import {OfferedPriceComponent} from "../../components/offered-price/offered-price.component";
import {ApiService} from "../../../../core/services/api.service";

@Component({
  selector: 'app-requests',
  imports: [
    NgForOf,
    NgIf,
    RouterLink
  ],
  templateUrl: './requests.component.html',
  standalone: true,
  styleUrl: './requests.component.css'
})
export class RequestsComponent implements OnInit {
  requestData: any[] = [];
  carrierId: number | null = null;

  constructor(private dialog: MatDialog, private apiService: ApiService) {}

  ngOnInit(): void {
    this.carrierId = parseInt(localStorage.getItem('carrierId') || '0', 10); // Recuperar el id
    console.log('Carrier ID:', this.carrierId);

    if (this.carrierId) {
      this.apiService.getRequestsByCarrierId(this.carrierId).subscribe({
        next: (requests) => {
          this.requestData = requests; // Asignar los datos obtenidos
          console.log('Request Data:', this.requestData);
        },
        error: (err) => {
          console.error('Error al obtener las solicitudes:', err);
        }
      });
    }
  }

  openPacketDetails(request:any): void {
    this.dialog.open(PacketDetailsComponent, {
      data: {request}, // Puedes pasar datos al componente si es necesario
      panelClass: 'carrier-packet-details-dialog-container', // Clase CSS personalizada está en styles.css
    });
  }

  openOfferedPrice(request:any): void {
    this.dialog.open(OfferedPriceComponent, {
      data: {request}, // Puedes pasar datos al componente si es necesario
      panelClass: 'carrier-offered-price-dialog-container', // Clase CSS personalizada está en styles.css
    });
  }
}
