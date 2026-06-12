import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {MatIcon} from "@angular/material/icon";
import {PacketDetailsComponent} from "../../components/packet-details/packet-details.component";
import {MatDialog} from "@angular/material/dialog";
import {ShippingInfoComponent} from "../../components/shipping-info/shipping-info.component";
import {ApiService} from "../../../../core/services/api.service";

@Component({
  selector: 'app-confirmed-services',
  imports: [
    NgForOf,
    NgIf,
    RouterLink,
    MatIcon
  ],
  templateUrl: './confirmed-services.component.html',
  standalone: true,
  styleUrl: './confirmed-services.component.css'
})
export class ConfirmedServicesComponent implements OnInit {
  hiredServices: any[] = [];
  requestData: any[] = [];
  carrierId: number | null = null;

  constructor(private dialog: MatDialog,private apiService: ApiService) {
  }

  getRequestForHiredService(hiredService: any): any {
    return this.requestData.find(request => request.id === hiredService.requestId);
  }

  ngOnInit(): void {
    this.carrierId = parseInt(localStorage.getItem('carrierId') || '0', 10); // Recuperar el id
    console.log("Carrier ID:", this.carrierId);

    if (this.carrierId) {
      this.apiService.getHiredServicesByCarrierId(this.carrierId).subscribe({
        next: (services) => {
          this.hiredServices = services;
        },
        error: (err) => {
          console.error("Error al cargar los servicios contratados:", err);
        },
      });

      this.apiService.getRequestsByCarrierId(this.carrierId).subscribe({
        next: (requests) => {
          this.requestData = requests;
        },
        error: (err) => {
          console.error("Error al cargar los requests:", err);
        },
      });

    }
  }

  openPacketDetails(request:any): void {
    this.dialog.open(PacketDetailsComponent, {
      data: {request}, // Puedes pasar datos al componente si es necesario
      panelClass: 'carrier-packet-details-dialog-container', // Clase CSS personalizada está en styles.css
    });
  }
  openShippingInfo(service:any): void {
    this.dialog.open(ShippingInfoComponent, {
      data: {service}, // Puedes pasar datos al componente si es necesario
      panelClass: 'carrier-shipping-info-dialog-container', // Clase CSS personalizada está en styles.css
    });

  }
}