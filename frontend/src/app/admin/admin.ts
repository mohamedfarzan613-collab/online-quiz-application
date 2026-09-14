import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { HttpClient } from '@angular/common/http';

import {
  RouterLink,
  Router
} from '@angular/router';

import { DatePipe } from '@angular/common';


@Component({

  selector: 'app-admin',

  imports: [

    FormsModule,

    RouterLink,

    DatePipe

  ],

  templateUrl:
    './admin.html',

  styleUrl:
    './admin.css'

})


export class Admin implements OnInit {


  quizzes: any[] = [];


  editing: boolean = false;


  editingId: string = '';


  message: string = '';


  quiz = {

    title: '',

    description: '',

    dueDate: '',

    questions: [

      {

        question: '',

        options: [

          '',

          '',

          '',

          ''

        ],

        correctAnswer: ''

      }

    ]

  };


  constructor(

    private http: HttpClient,

    private changeDetector:
      ChangeDetectorRef,

    private router: Router

  ) {}


  ngOnInit(): void {

    this.loadQuizzes();

  }


  // ==========================================
  // LOAD QUIZZES
  // ==========================================

  loadQuizzes(): void {

    this.http.get<any[]>(

      'https://online-quiz-backend-r38d.onrender.com/api/quizzes'

    ).subscribe({

      next: (data) => {

        this.quizzes = data;

        this.changeDetector
          .detectChanges();

      },

      error: (error) => {

        console.error(
          error
        );

        this.message =
          'Unable to load quizzes.';

      }

    });

  }


  // ==========================================
  // ADD QUESTION
  // ==========================================

  addQuestion(): void {

    this.quiz.questions.push({

      question: '',

      options: [

        '',

        '',

        '',

        ''

      ],

      correctAnswer: ''

    });

  }


  // ==========================================
  // REMOVE QUESTION
  // ==========================================

  removeQuestion(
    index: number
  ): void {

    if (
      this.quiz.questions.length > 1
    ) {

      this.quiz.questions
        .splice(index, 1);

    }

  }


  // ==========================================
  // SAVE QUIZ
  // ==========================================

  saveQuiz(): void {

    this.message = '';


    if (
      !this.validateQuiz()
    ) {

      return;

    }


    if (this.editing) {

      this.updateQuiz();

    } else {

      this.addQuiz();

    }

  }


  // ==========================================
  // VALIDATE QUIZ
  // ==========================================

  validateQuiz(): boolean {


    if (
      !this.quiz.title.trim()
    ) {

      this.message =
        'Please enter quiz title.';

      return false;

    }


    if (!this.quiz.dueDate) {

      this.message =
        'Please select quiz due date and time.';

      return false;

    }


    const selectedDate =
      new Date(
        this.quiz.dueDate
      );


    if (
      selectedDate <= new Date()
    ) {

      this.message =
        'Due date must be in the future.';

      return false;

    }


    for (
      let i = 0;
      i < this.quiz.questions.length;
      i++
    ) {


      const question =
        this.quiz.questions[i];


      if (
        !question.question.trim()
      ) {

        this.message =
          'Please enter Question ' +
          (i + 1) +
          '.';

        return false;

      }


      for (
        let j = 0;
        j < question.options.length;
        j++
      ) {

        if (
          !question.options[j].trim()
        ) {

          this.message =
            'Please enter all options for Question ' +
            (i + 1) +
            '.';

          return false;

        }

      }


      if (
        !question.correctAnswer
      ) {

        this.message =
          'Please select the correct answer for Question ' +
          (i + 1) +
          '.';

        return false;

      }

    }


    return true;

  }


  // ==========================================
  // ADD QUIZ
  // ==========================================

  addQuiz(): void {

    this.http.post<any>(

      'https://online-quiz-backend-r38d.onrender.com/api/quizzes/add',

      this.quiz

    ).subscribe({

      next: () => {

        alert(
          'Quiz added successfully!'
        );

        this.resetForm();

        this.loadQuizzes();

      },

      error: (error) => {

        console.error(
          error
        );

        this.message =
          'Error adding quiz.';

      }

    });

  }


  // ==========================================
  // EDIT QUIZ
  // ==========================================

  editQuiz(
    quizItem: any
  ): void {


    this.editing = true;


    this.editingId =
      quizItem._id;


    this.quiz = {

      title:
        quizItem.title,

      description:
        quizItem.description || '',

      dueDate:
        quizItem.dueDate
          ? this.formatDateForInput(
              quizItem.dueDate
            )
          : '',

      questions:
        quizItem.questions.map(
          (question: any) => ({

            question:
              question.question,

            options:
              [
                ...question.options
              ],

            correctAnswer:
              question.correctAnswer

          })

        )

    };


    this.message =
      'Editing: ' +
      quizItem.title;


    window.scrollTo({

      top: 0,

      behavior: 'smooth'

    });

  }


  // ==========================================
  // FORMAT DATE FOR INPUT
  // ==========================================

  formatDateForInput(
    date: string
  ): string {


    const d =
      new Date(date);


    const year =
      d.getFullYear();


    const month =
      String(
        d.getMonth() + 1
      ).padStart(
        2,
        '0'
      );


    const day =
      String(
        d.getDate()
      ).padStart(
        2,
        '0'
      );


    const hours =
      String(
        d.getHours()
      ).padStart(
        2,
        '0'
      );


    const minutes =
      String(
        d.getMinutes()
      ).padStart(
        2,
        '0'
      );


    return (

      `${year}-${month}-${day}` +

      `T${hours}:${minutes}`

    );

  }


  // ==========================================
  // UPDATE QUIZ
  // ==========================================

  updateQuiz(): void {


    this.http.put<any>(

      'https://online-quiz-backend-r38d.onrender.com/api/quizzes/' +

      this.editingId,

      this.quiz

    ).subscribe({

      next: () => {

        alert(
          'Quiz updated successfully!'
        );

        this.resetForm();

        this.loadQuizzes();

      },

      error: (error) => {

        console.error(
          error
        );

        this.message =
          'Error updating quiz.';

      }

    });

  }


  // ==========================================
  // DELETE QUIZ
  // ==========================================

  deleteQuiz(
    id: string
  ): void {


    const confirmDelete =
      confirm(

        'Are you sure you want to delete this quiz?'

      );


    if (!confirmDelete) {

      return;

    }


    this.http.delete<any>(

      'https://online-quiz-backend-r38d.onrender.com/api/quizzes/' +

      id

    ).subscribe({

      next: () => {

        alert(
          'Quiz deleted successfully!'
        );


        this.quizzes =
          this.quizzes.filter(

            quizItem =>
              quizItem._id !== id

          );


        this.changeDetector
          .detectChanges();

      },

      error: (error) => {

        console.error(
          error
        );

        this.message =
          'Unable to delete quiz.';

      }

    });

  }


  // ==========================================
  // CANCEL EDIT
  // ==========================================

  cancelEdit(): void {

    this.resetForm();

  }


  // ==========================================
  // RESET FORM
  // ==========================================

  resetForm(): void {


    this.editing = false;

    this.editingId = '';

    this.message = '';


    this.quiz = {

      title: '',

      description: '',

      dueDate: '',

      questions: [

        {

          question: '',

          options: [

            '',

            '',

            '',

            ''

          ],

          correctAnswer: ''

        }

      ]

    };

  }


  // ==========================================
  // ADMIN LOGOUT
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