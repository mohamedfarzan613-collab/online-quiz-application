import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-quiz',

  imports: [],

  templateUrl: './quiz.html',

  styleUrl: './quiz.css'
})


export class Quiz implements OnInit {


  quizzes: any[] = [];

  selectedQuiz: any = null;


  answers: string[] = [];

  score: number = 0;

  percentage: number = 0;


  submitted: boolean = false;

  loading: boolean = true;

  message: string = '';


  constructor(

    private http: HttpClient,

    private changeDetector:
      ChangeDetectorRef

  ) {}


  // ==========================================
  // LOAD QUIZZES
  // ==========================================

  ngOnInit(): void {

    console.log(
      'Loading all quizzes...'
    );


    this.http.get<any[]>(
      'https://online-quiz-backend-r38d.onrender.com/api/quizzes'
    )
    .subscribe({

      next: (data) => {

        console.log(
          'Quizzes received:',
          data
        );


        this.quizzes = data;

        this.loading = false;


        this.changeDetector
          .detectChanges();

      },


      error: (error) => {

        console.error(
          'Quiz loading error:',
          error
        );


        this.message =
          'Unable to load quizzes.';

        this.loading = false;


        this.changeDetector
          .detectChanges();

      }

    });

  }



  // ==========================================
  // SELECT QUIZ
  // ==========================================

  selectQuiz(quiz: any): void {

    this.selectedQuiz = quiz;


    this.answers =
      new Array(
        quiz.questions.length
      ).fill('');


    this.score = 0;

    this.percentage = 0;

    this.submitted = false;

    this.message = '';


    console.log(
      'Selected Quiz:',
      quiz.title
    );


    console.log(
      'Quiz Due Date:',
      quiz.dueDate
    );

  }



  // ==========================================
  // SELECT ANSWER
  // ==========================================

  selectAnswer(
    questionIndex: number,
    answer: string
  ): void {

    this.answers[
      questionIndex
    ] = answer;


    console.log(

      'Question',

      questionIndex + 1,

      'Selected:',

      answer

    );

  }



  // ==========================================
  // BACK TO QUIZ LIST
  // ==========================================

  backToQuizList(): void {

    this.selectedQuiz = null;

    this.answers = [];

    this.submitted = false;

    this.message = '';

  }



  // ==========================================
  // CALCULATE SCORE
  // ==========================================

  calculateScore(): void {


    if (!this.selectedQuiz) {

      return;

    }


    // ------------------------------------------
    // Check login
    // ------------------------------------------

    const userId =
      localStorage.getItem(
        'userId'
      );


    if (!userId) {

      alert(
        'Please login before submitting the quiz.'
      );

      return;

    }



    // ------------------------------------------
    // Calculate score
    // ------------------------------------------

    this.score = 0;


    for (

      let i = 0;

      i <
      this.selectedQuiz.questions.length;

      i++

    ) {

      const userAnswer =
        this.answers[i];


      const correctAnswer =
        this.selectedQuiz
          .questions[i]
          .correctAnswer;


      if (
        userAnswer ===
        correctAnswer
      ) {

        this.score++;

      }

    }



    // ------------------------------------------
    // Calculate percentage
    // ------------------------------------------

    this.percentage =

      (
        this.score /
        this.selectedQuiz.questions.length
      ) * 100;



    console.log(
      'Score:',
      this.score
    );


    console.log(
      'Percentage:',
      this.percentage
    );



    // ------------------------------------------
    // Send result
    // ------------------------------------------

    const result = {

      userId:
        userId,

      quizId:
        this.selectedQuiz._id,

      score:
        this.score,

      totalQuestions:
        this.selectedQuiz.questions.length,

      percentage:
        this.percentage

    };


    console.log(
      'Sending result:',
      result
    );


    this.http.post<any>(

      'https://online-quiz-backend-r38d.onrender.com/api/results/add',

      result

    )
    .subscribe({

      next: (response) => {

        console.log(
          'Result saved:',
          response
        );


        this.submitted =
          true;


        alert(
          'Quiz submitted successfully!'
        );


        this.changeDetector
          .detectChanges();

      },


      error: (error) => {

        console.error(
          'Result saving error:',
          error
        );


        if (
          error.error &&
          error.error.message
        ) {

          alert(
            error.error.message
          );

        }

        else {

          alert(
            'Score calculated, but result could not be saved.'
          );

        }

      }

    });

  }

}
