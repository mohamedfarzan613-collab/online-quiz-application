import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  imports: [RouterLink, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  email: string = '';
  password: string = '';

  message: string = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  loginUser(): void {

    const loginData = {
      email: this.email,
      password: this.password
    };

    console.log('Login data:', loginData);

    this.http.post<any>(
      'https://online-quiz-backend-r38d.onrender.com/api/users/login',
      loginData
    ).subscribe({

      next: (response) => {

        console.log('Login response:', response);

        // Save user information
        localStorage.setItem(
          'userId',
          response.user.id
        );

        localStorage.setItem(
          'userName',
          response.user.name
        );

        localStorage.setItem(
          'userEmail',
          response.user.email
        );

        this.message = 'Login successful!';

        alert('Login successful!');

        // Go to quiz page
        this.router.navigate(['/quiz']);

      },

      error: (error) => {

        console.error('Login error:', error);

        if (error.error && error.error.message) {

          this.message = error.error.message;

        } else {

          this.message = 'Login failed';

        }

      }

    });

  }

}
