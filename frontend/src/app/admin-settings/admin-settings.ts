import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-settings',

  imports: [
    FormsModule,
    RouterLink
  ],

  templateUrl: './admin-settings.html',

  styleUrl: './admin-settings.css'
})
export class AdminSettings implements OnInit {

  adminId: string = '';

  username: string = '';

  email: string = '';

  password: string = '';

  message: string = '';

  errorMessage: string = '';

  loading: boolean = true;

  saving: boolean = false;


  constructor(
    private http: HttpClient,

    private router: Router,

    private changeDetector: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    console.log(
      'ADMIN SETTINGS STARTED'
    );

    this.loadAdmin();

  }


  // ==================================
  // LOAD ADMIN FROM MONGODB
  // ==================================

  loadAdmin(): void {

    console.log(
      'Calling Admin API...'
    );

    this.http.get<any>(
      'http://localhost:3000/api/admin'
    )
    .subscribe({

      next: (admin) => {

        console.log(
          'ADMIN API SUCCESS:',
          admin
        );

        this.adminId =
          admin._id;

        this.username =
          admin.username || '';

        this.email =
          admin.email || '';

        this.loading = false;

        this.changeDetector.detectChanges();

      },


      error: (error) => {

        console.error(
          'ADMIN API ERROR:',
          error
        );

        this.loading = false;

        this.errorMessage =
          'Unable to load admin settings.';

        this.changeDetector.detectChanges();

      }

    });

  }


  // ==================================
  // UPDATE ADMIN
  // ==================================

  updateSettings(): void {

    this.message = '';

    this.errorMessage = '';


    if (!this.adminId) {

      this.errorMessage =
        'Admin ID not found.';

      return;

    }


    if (!this.username.trim()) {

      this.errorMessage =
        'Please enter admin username.';

      return;

    }


    if (!this.email.trim()) {

      this.errorMessage =
        'Please enter admin email.';

      return;

    }


    const updateData: any = {

      username:
        this.username.trim(),

      email:
        this.email.trim()

    };


    // Password is optional

    if (this.password.trim()) {

      updateData.password =
        this.password.trim();

    }


    console.log(
      'Updating Admin:',
      this.adminId
    );


    this.saving = true;


    this.http.put<any>(

      'http://localhost:3000/api/admin/' +
      this.adminId,

      updateData

    )
    .subscribe({

      next: (response) => {

        console.log(
          'ADMIN UPDATE SUCCESS:',
          response
        );


        this.username =
          response.admin.username;

        this.email =
          response.admin.email;

        this.password = '';


        localStorage.setItem(
          'adminUsername',
          response.admin.username
        );

        localStorage.setItem(
          'adminEmail',
          response.admin.email
        );


        this.message =
          'Admin settings updated successfully!';


        this.saving = false;

        this.changeDetector.detectChanges();

      },


      error: (error) => {

        console.error(
          'ADMIN UPDATE ERROR:',
          error
        );


        this.errorMessage =
          error.error?.message ||
          'Unable to update admin settings.';


        this.saving = false;

        this.changeDetector.detectChanges();

      }

    });

  }


  // ==================================
  // BACK TO DASHBOARD
  // ==================================

  goToDashboard(): void {

    this.router.navigate([
      '/admin-dashboard'
    ]);

  }

}
