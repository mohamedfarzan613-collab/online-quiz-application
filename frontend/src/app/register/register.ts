import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [RouterLink, FormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  name = '';
  email = '';
  password = '';

  message = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  registerUser() {

    const user = {
      name: this.name,
      email: this.email,
      password: this.password
    };

    this.http.post(
      'https://online-quiz-backend-r38d.onrender.com/api/users/register',
      user
    ).subscribe({

      next: (response: any) => {

        this.message = response.message;

        alert('Registration successful!');

        this.router.navigate(['/login']);

      },

      error: (error) => {

        console.log(error);

        if (error.error && error.error.message) {
          this.message = error.error.message;
        } else {
          this.message = 'Registration failed';
        }

      }

    });

  }

}
