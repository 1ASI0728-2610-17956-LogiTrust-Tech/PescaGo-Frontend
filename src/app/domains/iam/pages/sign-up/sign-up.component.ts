import { Component } from '@angular/core';
import {NgOptimizedImage} from "@angular/common";
import {Router} from "@angular/router";

@Component({
  selector: 'app-sign-up',
    imports: [
        NgOptimizedImage
    ],
  templateUrl: './sign-up.component.html',
  standalone: true,
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  constructor(private router: Router) {}

  navigateTo(userType: string): void {
    if (userType === 'carrier') {
      this.router.navigate(['/register-carrier']);
    } else if (userType === 'entrepreneur') {
      this.router.navigate(['/register-entrepreneur']);
    }
  }
}
