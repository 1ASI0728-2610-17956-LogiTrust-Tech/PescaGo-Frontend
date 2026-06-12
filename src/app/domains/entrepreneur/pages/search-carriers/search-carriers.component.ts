import { Component, OnInit } from "@angular/core";
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import {ApiService} from "../../../../core/services/api.service";

@Component({
  selector: "app-search-carriers",
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: "./search-carriers.component.html",
  styleUrl: "./search-carriers.component.css",
  standalone: true,
})
export class SearchCarriersComponent implements OnInit {
  carriersData = [
    {
      id: 1,
      image: "assets/images/truck-1.png",
      name: "Transportes Chamitos",
      description: "Descripción de la empresa",
      districts: ["Distrito 1", "Distrito 2", "Distrito 3"],
      selected: false, // Propiedad para el checkbox
    }
  ];

  filterText: string = ""; // Propiedad para almacenar el texto del filtro
  filteredCarriers: any[] = []; // Lista filtrada de empresas

  entrepreneurId: number | null = null;

  constructor(private router: Router,private apiService: ApiService) {}

  ngOnInit(): void {
    this.filteredCarriers = [...this.carriersData]; // Inicializamos con todas las empresas

    this.entrepreneurId = parseInt(localStorage.getItem('carrierId') || '0', 10); // Recuperar el id
    console.log('Entrepreneur ID:', this.entrepreneurId);

    // Cargar carriers procesados desde el servicio
    this.apiService.getProcessedCarriers().subscribe({
      next: (carriers) => {
        this.carriersData = carriers;
        this.filteredCarriers = [...this.carriersData]; // Inicializar lista filtrada
      },
      error: (err) => {
        console.error("Error al cargar carriers:", err);
      },
    });
  }

  // Metodo para manejar el filtrado
  filterCarriers(): void {
    if (!this.filterText) {
      this.filteredCarriers = [...this.carriersData]; // Si el filtro está vacío, mostramos todas
    } else {
      this.filteredCarriers = this.carriersData.filter((carrier) =>
        carrier.name.toLowerCase().includes(this.filterText.toLowerCase())
      );
    }
  }

  // Método para manejar el botón "Enviar Solicitud"
  submitRequest(): void {
    const selectedCarriers = this.carriersData.filter(
      (carrier) => carrier.selected
    );
    if (selectedCarriers.length === 0) {
      alert(
        "Por favor, selecciona al menos una empresa antes de enviar la solicitud."
      );
      return;
    }
    // Redirección a create-request con los IDs de las empresas seleccionadas
    const selectedIds = selectedCarriers.map((carrier) => carrier.id);
    this.router.navigate(["/entrepreneur/create-request"], {
      queryParams: { carrierIds: selectedIds.join(",") },
    });
  }
}
