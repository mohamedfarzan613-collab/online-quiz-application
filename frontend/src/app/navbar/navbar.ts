import { Component, OnInit } from '@angular/core';
import {
  Router,
  RouterLink,
  NavigationEnd
} from '@angular/router';

import { filter } from 'rxjs';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class Navbar implements OnInit {

  userName: string = '';

  isLoggedIn: boolean = false;


  constructor(
    private router: Router
  ) {}


  ngOnInit(): void {

    // Check login when application starts
    this.checkLogin();


    // Check again whenever page changes
    this.router.events
      .pipe(
        filter(
          event => event instanceof NavigationEnd
        )
      )
      .subscribe(() => {

        this.checkLogin();

      });

  }


  checkLogin(): void {

    const userId =
      localStorage.getItem('userId');

    const name =
      localStorage.getItem('userName');


    if (userId) {

      this.isLoggedIn = true;

      this.userName = name || 'User';

    }

    else {

      this.isLoggedIn = false;

      this.userName = '';

    }

  }


  logout(): void {

    // Remove user information
    localStorage.removeItem('userId');

    localStorage.removeItem('userName');

    localStorage.removeItem('userEmail');


    this.isLoggedIn = false;

    this.userName = '';


    alert('Logout successful!');


    // Go to login
    this.router.navigate(['/login']);

  }

}
