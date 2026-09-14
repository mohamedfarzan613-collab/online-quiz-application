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

  loading: boolean = false;


  constructor(
    private router: Router,
    private http: HttpClient
  ) {}


  login(): void {

    this.message = '';

    // Check empty fields
    if (!this.email || !this.password) {

      this.message =
        'Please enter email and password.';

      return;

    }


    this.loading = true;


    // Send login details to backend
    const adminLoginData = {

      email: this.email,

      password: this.password

    };


    this.http.post<any>(
      'http://localhost:3000/api/admin/login',
      adminLoginData
    )
    .subscribe({

      next: (response) => {

        console.log(
          'Admin login response:',
          response
        );


        // Store admin login status
        localStorage.setItem(
          'adminLoggedIn',
          'true'
        );


        // Store admin details
        if (response.admin) {

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

        }


        this.loading = false;


        alert(
          'Admin login successful!'
        );


        // Go to Admin Dashboard
        this.router.navigate([
          '/admin-dashboard'
        ]);

      },


      error: (error) => {

        console.error(
          'Admin login error:',
          error
        );


        this.loading = false;


        if (
          error.error &&
          error.error.message
        ) {

          this.message =
            error.error.message;

        }

        else {

          this.message =
            'Unable to connect to server.';

        }

      }

    });

  }

}
