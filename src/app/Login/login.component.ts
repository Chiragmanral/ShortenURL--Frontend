// login.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  email = '';
  password = '';
  isInvalidCredentials : boolean = false;

  constructor(private http: HttpClient, private router: Router, private auth: AuthService) {}

  login() {
    if(!this.email || !this.password) return;
    this.http.post<{ success: boolean }>('https://shortenurl-backend-taj4.onrender.com/login', {
      email: this.email,
      password: this.password
    }).subscribe({
      next: (res) => {
        if (res.success) {
          this.auth.login();
          this.router.navigate(['/short-url']);
        } else {
          this.isInvalidCredentials = true;
        }
      },
      error: () => alert('Server error – check backend console.')
    });
  }

  goToSignup() {
    this.router.navigate(['/signup']);
  }
}
