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


@Component({
  selector: 'app-admin-dashboard',

  imports: [RouterLink],

  templateUrl: './admin-dashboard.html',

  styleUrl: './admin-dashboard.css'
})
export class AdminDashboard implements OnInit {


  totalUsers: number = 0;

  totalQuizzes: number = 0;

  totalQuestions: number = 0;

  totalAttempts: number = 0;

  loading: boolean = false;

  message: string = '';


  constructor(
    private http: HttpClient,

    private router: Router,

    private changeDetector: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    console.log(
      '=============================='
    );

    console.log(
      'ADMIN DASHBOARD STARTED'
    );

    console.log(
      '=============================='
    );


    this.loadUsers();

    this.loadQuizzes();

    this.loadResults();

  }


  // ==============================
  // LOAD USERS
  // ==============================

  loadUsers(): void {

    console.log(
      'Calling Users API...'
    );


    this.http.get<any[]>(
      'https://online-quiz-backend-r38d.onrender.com/api/users'
    )
    .subscribe({

      next: (users) => {

        console.log(
          'USERS API SUCCESS:',
          users
        );


        this.totalUsers =
          users.length;


        console.log(
          'TOTAL USERS:',
          this.totalUsers
        );


        // Force Angular UI refresh

        this.changeDetector.detectChanges();

      },


      error: (error) => {

        console.error(
          'USERS API FAILED:',
          error
        );


        this.message =
          'Unable to load users.';


        this.changeDetector.detectChanges();

      }

    });

  }


  // ==============================
  // LOAD QUIZZES
  // ==============================

  loadQuizzes(): void {

    console.log(
      'Calling Quizzes API...'
    );


    this.http.get<any[]>(
      'https://online-quiz-backend-r38d.onrender.com/api/quizzes'
    )
    .subscribe({

      next: (quizzes) => {

        console.log(
          'QUIZZES API SUCCESS:',
          quizzes
        );


        this.totalQuizzes =
          quizzes.length;


        this.totalQuestions =
          quizzes.reduce(
            (
              total: number,
              quiz: any
            ) => {

              if (
                quiz.questions &&
                Array.isArray(
                  quiz.questions
                )
              ) {

                return total +
                  quiz.questions.length;

              }


              return total;

            },

            0
          );


        console.log(
          'TOTAL QUIZZES:',
          this.totalQuizzes
        );


        console.log(
          'TOTAL QUESTIONS:',
          this.totalQuestions
        );


        // Force Angular UI refresh

        this.changeDetector.detectChanges();

      },


      error: (error) => {

        console.error(
          'QUIZZES API FAILED:',
          error
        );


        this.message =
          'Unable to load quizzes.';


        this.changeDetector.detectChanges();

      }

    });

  }


  // ==============================
  // LOAD RESULTS
  // ==============================

  loadResults(): void {

    console.log(
      'Calling Results API...'
    );


    this.http.get<any[]>(
      'https://online-quiz-backend-r38d.onrender.com/api/results'
    )
    .subscribe({

      next: (results) => {

        console.log(
          'RESULTS API SUCCESS:',
          results
        );


        this.totalAttempts =
          results.length;


        console.log(
          'TOTAL ATTEMPTS:',
          this.totalAttempts
        );


        // Force Angular UI refresh

        this.changeDetector.detectChanges();

      },


      error: (error) => {

        console.error(
          'RESULTS API FAILED:',
          error
        );


        this.message =
          'Unable to load results.';


        this.changeDetector.detectChanges();

      }

    });

  }


  // ==============================
  // MANAGE QUIZZES
  // ==============================

  goToQuizManagement(): void {

    this.router.navigate([
      '/admin'
    ]);

  }


  // ==============================
  // STUDENT RESULTS
  // ==============================

  goToStudentResults(): void {

    this.router.navigate([
      '/admin-results'
    ]);

  }


  // ==============================
  // ADMIN LOGOUT
  // ==============================

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