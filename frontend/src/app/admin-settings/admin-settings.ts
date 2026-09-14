import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

    this.adminId =
      localStorage.getItem('adminId') || '';

    if (!this.adminId) {

      this.message =
        'Admin session not found. Please login again.';

      this.loading = false;

      return;
    }

    this.loadAdmin();
  }

  loadAdmin(): void {

    this.loading = true;

    this.http.get<any>(this.apiUrl)
      .subscribe({

        next: (admin) => {

          console.log('Admin details:', admin);

          this.username =
            admin.username || '';

          this.email =
            admin.email || '';

          this.loading = false;
        },

        error: (error) => {

          console.error(
            'Error loading admin:',
            error
          );

          this.message =
            'Unable to load admin details.';

          this.loading = false;
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
    .subscribe({

      next: (response) => {

        console.log(
          'Admin updated:',
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
          'Admin settings error:',
          error
        );

        this.saving = false;

        if (
          error.error &&
          error.error.message
        ) {

          this.message =
            error.error.message;

        } else {

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
