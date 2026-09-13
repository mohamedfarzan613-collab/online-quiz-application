import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-admin-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './admin-login.html',
  styleUrl: './admin-login.css'
})
export class AdminLogin {

  email: string = '';
  password: string = '';
  message: string = '';

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login(): void {

    this.message = '';

    if (!this.email || !this.password) {
      this.message = 'Please enter email and password.';
      return;
    }

    const adminLoginData = {
      email: this.email,
      password: this.password
    };

    this.http.post<any>(
      'http://localhost:3000/api/admin/login',
      adminLoginData
    ).subscribe({

      next: (response) => {

        console.log('Admin login successful:', response);

        localStorage.setItem(
          'adminLoggedIn',
          'true'
        );

        localStorage.setItem(
          'adminId',
          response.admin.id
        );

        localStorage.setItem(
          'adminUsername',
          response.admin.username
        );

        localStorage.setItem(
          'adminEmail',
          response.admin.email
        );

        alert('Admin login successful!');

        this.router.navigate([
          '/admin-dashboard'
        ]);
      },

      error: (error) => {

        console.error(
          'Admin login error:',
          error
        );

        if (
          error.error &&
          error.error.message
        ) {

          this.message =
            error.error.message;

        } else {

          this.message =
            'Unable to connect to server.';

        }
      }

    });
  }
}
