import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  DecimalPipe,
  DatePipe
} from '@angular/common';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';


@Component({
  selector: 'app-dashboard',

  imports: [
    DecimalPipe,
    DatePipe
  ],

  templateUrl: './dashboard.html',

  styleUrl: './dashboard.css'
})


export class Dashboard implements OnInit {

  userName: string = '';

  userId: string = '';

  results: any[] = [];

  totalAttempts: number = 0;

  averageScore: number = 0;

  bestScore: number = 0;

  loading: boolean = true;

  message: string = '';


  constructor(
    private http: HttpClient,

    private router: Router,

    private changeDetector: ChangeDetectorRef
  ) {}


  ngOnInit(): void {

    console.log(
      'STUDENT DASHBOARD STARTED'
    );


    this.userId =
      localStorage.getItem('userId') || '';


    this.userName =
      localStorage.getItem('userName') ||
      'Student';


    console.log(
      'User ID:',
      this.userId
    );


    console.log(
      'User Name:',
      this.userName
    );


    if (!this.userId) {

      this.loading = false;

      this.message =
        'Please login to view your dashboard.';

      return;

    }


    this.loadResults();

  }


  loadResults(): void {

    console.log(
      'Loading student results...'
    );


    this.loading = true;


    this.http.get<any[]>(
      'https://online-quiz-backend-r38d.onrender.com/api/results/user/' +
      this.userId
    )
    .subscribe({

      next: (data) => {

        console.log(
          'Student Results:',
          data
        );


        this.results =
          data || [];


        this.calculateStatistics();


        this.loading = false;


        this.changeDetector.detectChanges();

      },


      error: (error) => {

        console.error(
          'Results loading error:',
          error
        );


        this.results = [];

        this.totalAttempts = 0;

        this.averageScore = 0;

        this.bestScore = 0;

        this.loading = false;


        this.message =
          'Unable to load quiz results.';


        this.changeDetector.detectChanges();

      }

    });

  }


  calculateStatistics(): void {

    this.totalAttempts =
      this.results.length;


    if (this.results.length === 0) {

      this.averageScore = 0;

      this.bestScore = 0;

      return;

    }


    let totalPercentage = 0;

    let highestPercentage = 0;


    for (
      const result of this.results
    ) {

      const percentage =
        Number(result.percentage) || 0;


      totalPercentage += percentage;


      if (
        percentage >
        highestPercentage
      ) {

        highestPercentage =
          percentage;

      }

    }


    this.averageScore =
      totalPercentage /
      this.results.length;


    this.bestScore =
      highestPercentage;


    console.log(
      'Total Attempts:',
      this.totalAttempts
    );


    console.log(
      'Average Score:',
      this.averageScore
    );


    console.log(
      'Best Score:',
      this.bestScore
    );

  }


  getQuizTitle(
    result: any
  ): string {

    if (
      result.quizId &&
      result.quizId.title
    ) {

      return result.quizId.title;

    }


    return 'Unknown Quiz';

  }


  getDueDate(
    result: any
  ): string {

    if (!result.dueDate) {

      return '—';

    }


    const date =
      new Date(result.dueDate);


    if (
      isNaN(date.getTime())
    ) {

      return '—';

    }


    return date.toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


  getSubmittedDate(
    result: any
  ): string {

    if (!result.completedAt) {

      return '—';

    }


    const date =
      new Date(result.completedAt);


    if (
      isNaN(date.getTime())
    ) {

      return '—';

    }


    return date.toLocaleString(
      'en-IN',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


  isLate(
    result: any
  ): boolean {

    if (
      !result.dueDate ||
      !result.completedAt
    ) {

      return false;

    }


    const dueDate =
      new Date(result.dueDate);


    const submittedDate =
      new Date(result.completedAt);


    if (
      isNaN(dueDate.getTime()) ||
      isNaN(submittedDate.getTime())
    ) {

      return false;

    }


    return (
      submittedDate.getTime() >
      dueDate.getTime()
    );

  }


  getLateBy(
    result: any
  ): string {

    if (
      !this.isLate(result)
    ) {

      return '—';

    }


    const dueDate =
      new Date(result.dueDate);


    const submittedDate =
      new Date(result.completedAt);


    const difference =
      submittedDate.getTime() -
      dueDate.getTime();


    const totalMinutes =
      Math.floor(
        difference /
        (1000 * 60)
      );


    const days =
      Math.floor(
        totalMinutes /
        (60 * 24)
      );


    const hours =
      Math.floor(
        (totalMinutes %
          (60 * 24)) / 60
      );


    const minutes =
      totalMinutes % 60;


    if (days > 0) {

      return (
        days +
        ' day ' +
        hours +
        ' hr ' +
        minutes +
        ' min'
      );

    }


    if (hours > 0) {

      return (
        hours +
        ' hr ' +
        minutes +
        ' min'
      );

    }


    return (
      minutes +
      ' min'
    );

  }


  logout(): void {

    localStorage.removeItem(
      'userId'
    );


    localStorage.removeItem(
      'userName'
    );


    localStorage.removeItem(
      'userEmail'
    );


    alert(
      'Logout successful!'
    );


    this.router.navigate([
      '/login'
    ]);

  }


  takeAnotherQuiz(): void {

    this.router.navigate([
      '/quiz'
    ]);

  }

}
