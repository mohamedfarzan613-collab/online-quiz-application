import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { HttpClient } from '@angular/common/http';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  DatePipe,
  DecimalPipe
} from '@angular/common';


@Component({

  selector: 'app-admin-results',

  imports: [

    RouterLink,

    DatePipe,

    DecimalPipe

  ],

  templateUrl:
    './admin-results.html',

  styleUrl:
    './admin-results.css'

})


export class AdminResults
  implements OnInit {


  results: any[] = [];


  loading: boolean = true;


  message: string = '';


  constructor(

    private http: HttpClient,

    private router: Router,

    private changeDetector:
      ChangeDetectorRef

  ) {}


  ngOnInit(): void {

    this.loadResults();

  }


  // ==========================================
  // LOAD RESULTS
  // ==========================================

  loadResults(): void {


    console.log(
      'Loading student results...'
    );


    this.http.get<any[]>(

      'https://online-quiz-backend-r38d.onrender.com/api/results'

    ).subscribe({

      next: (data) => {


        console.log(
          'Results received:',
          data
        );


        this.results =
          data;


        this.loading = false;


        this.changeDetector
          .detectChanges();

      },


      error: (error) => {


        console.error(
          'Results loading error:',
          error
        );


        this.message =
          'Unable to load student results.';


        this.loading = false;


        this.changeDetector
          .detectChanges();

      }

    });

  }


  // ==========================================
  // LOGOUT
  // ==========================================

  adminLogout(): void {


    localStorage.removeItem(
      'adminLoggedIn'
    );


    alert(
      'Admin logout successful!'
    );


    this.router.navigate([
      '/admin-login'
    ]);

  }

}
