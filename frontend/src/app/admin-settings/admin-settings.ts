import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-admin-settings',
  imports: [FormsModule],
  templateUrl: './admin-settings.html',
  styleUrl: './admin-settings.css'
})
export class AdminSettings implements OnInit {

  adminId: string = '';
  username: string = '';
  email: string = '';

  password: string = '';
  confirmPassword: string = '';

  message: string = '';
  successMessage: string = '';

  loading: boolean = true;
  saving: boolean = false;

  private apiUrl =
    'https://online-quiz-backend-r38d.onrender.com/api/admin';


  constructor(
    private http: HttpClient,
    private router: Router
  ) {}


  ngOnInit(): void {

    console.log('ADMIN SETTINGS STARTED');

    this.adminId =
      localStorage.getItem('adminId') || '';

    console.log(
      'Admin ID:',
      this.adminId
    );

    if (!this.adminId) {

      this.message =
        'Admin session not found. Please login again.';

      this.loading = false;

      return;
    }

    this.loadAdmin();
  }


  loadAdmin(): void {

    console.log(
      'Calling Admin API:',
      this.apiUrl
    );

    this.loading = true;

    this.http.get<any>(this.apiUrl)
      .pipe(
        timeout(15000)
      )
      .subscribe({

        next: (admin) => {

          console.log(
            'ADMIN API SUCCESS:',
            admin
          );

          this.username =
            admin.username || '';

          this.email =
            admin.email || '';

          this.loading = false;
        },

        error: (error) => {

          console.error(
            'ADMIN API ERROR:',
            error
          );

          this.loading = false;

          if (error.name === 'TimeoutError') {

            this.message =
              'Server is taking too long to respond. Please try again.';

          }
          else if (error.status === 0) {

            this.message =
              'Unable to connect to the backend server.';

          }
          else if (
            error.error &&
            error.error.message
          ) {

            this.message =
              error.error.message;

          }
          else {

            this.message =
              'Unable to load admin details.';
          }

        }

      });
  }


  updateSettings(): void {

    this.message = '';
    this.successMessage = '';


    if (!this.username.trim()) {

      this.message =
        'Please enter admin username.';

      return;
    }


    if (!this.email.trim()) {

      this.message =
        'Please enter admin email.';

      return;
    }


    if (!this.password) {

      this.message =
        'Please enter new password.';

      return;
    }


    if (!this.confirmPassword) {

      this.message =
        'Please confirm your password.';

      return;
    }


    if (
      this.password !==
      this.confirmPassword
    ) {

      this.message =
        'Passwords do not match.';

      return;
    }


    if (!this.adminId) {

      this.message =
        'Admin ID not found. Please login again.';

      return;
    }


    this.saving = true;


    const adminData = {

      username:
        this.username.trim(),

      email:
        this.email.trim(),

      password:
        this.password

    };


    console.log(
      'Updating admin settings...'
    );


    this.http.put<any>(
      this.apiUrl + '/' + this.adminId,
      adminData
    )
    .pipe(
      timeout(15000)
    )
    .subscribe({

      next: (response) => {

        console.log(
          'ADMIN UPDATE SUCCESS:',
          response
        );


        if (response.admin) {

          localStorage.setItem(
            'adminUsername',
            response.admin.username
          );

          localStorage.setItem(
            'adminEmail',
            response.admin.email
          );
        }


        this.successMessage =
          'Admin settings updated successfully!';

        this.message = '';

        this.password = '';
        this.confirmPassword = '';

        this.saving = false;


        alert(
          'Admin settings updated successfully!'
        );

      },


      error: (error) => {

        console.error(
          'ADMIN UPDATE ERROR:',
          error
        );

        this.saving = false;


        if (error.name === 'TimeoutError') {

          this.message =
            'Server is taking too long to respond.';

        }
        else if (error.status === 0) {

          this.message =
            'Unable to connect to backend server.';

        }
        else if (
          error.error &&
          error.error.message
        ) {

          this.message =
            error.error.message;

        }
        else {

          this.message =
            'Unable to update admin settings.';
        }

      }

    });
  }


  goToDashboard(): void {

    this.router.navigate([
      '/admin-dashboard'
    ]);

  }


  adminLogout(): void {

    localStorage.removeItem(
      'adminLoggedIn'
    );

    localStorage.removeItem(
      'adminId'
    );

    localStorage.removeItem(
      'adminUsername'
    );

    localStorage.removeItem(
      'adminEmail'
    );


    alert(
      'Admin logout successful!'
    );


    this.router.navigate([
      '/admin-login'
    ]);

  }

}
