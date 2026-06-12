import { Component, OnInit } from "@angular/core";
import {Router, RouterLink} from "@angular/router";
import {ApiService} from "../../../../core/services/api.service";

@Component({
  selector: "app-home",
  imports: [RouterLink], // Añadimos RouterLink aquí
  templateUrl: "./home.component.html",
  styleUrl: "./home.component.css",
  standalone: true
})
export class HomeComponent implements OnInit {
  userId: number | null = null;
  entrepreneurId: number | null = null;
  entrepreneurName: string | null = null;


  constructor(
      private route:Router,
      private apiService: ApiService) {}

  ngOnInit(): void {
    this.userId = parseInt(localStorage.getItem('userId') || '0', 10); // Recuperar el id
    this.entrepreneurId = parseInt(localStorage.getItem('entrepreneurId') || '0', 10); // Recuperar el id
    this.entrepreneurName = localStorage.getItem('entrepreneurName') ; // Recuperar el id
    console.log('User ID:', this.userId);
    console.log('Entrepreneur ID:', this.entrepreneurId);
    console.log('Entrepreneur Name:', this.entrepreneurName);
  }

  logout(){
    localStorage.clear();
    this.route.navigate(['/sign-in']);
  }
}

