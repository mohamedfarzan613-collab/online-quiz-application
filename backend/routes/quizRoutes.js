const express = require("express");

const Quiz = require("../models/Quiz");

const router = express.Router();


// ==========================================
// ADD QUIZ
// ==========================================

router.post("/add", async (req, res) => {

    try {

        const quiz = new Quiz(req.body);

        const savedQuiz =
            await quiz.save();

        res.status(201).json({

            message:
                "Quiz added successfully",

            quiz: savedQuiz

        });

    } catch (error) {

        console.log(
            "Add Quiz Error:"
        );

        console.log(
            error.message
        );

        res.status(500).json({

            message:
                "Error adding quiz",

            error:
                error.message

        });

    }

});


// ==========================================
// GET ALL QUIZZES
// ==========================================

router.get("/", async (req, res) => {

    try {

        const quizzes =
            await Quiz.find();

        res.json(quizzes);

    } catch (error) {

        console.log(
            "Get Quizzes Error:"
        );

        console.log(
            error.message
        );

        res.status(500).json({

            message:
                "Error getting quizzes",

            error:
                error.message

        });

    }

});


// ==========================================
// GET SINGLE QUIZ
// ==========================================

router.get("/:id", async (req, res) => {

    try {

        const quiz =
            await Quiz.findById(
                req.params.id
            );

        if (!quiz) {

            return res.status(404).json({

                message:
                    "Quiz not found"

            });

        }

        res.json(quiz);

    } catch (error) {

        console.log(
            "Get Quiz Error:"
        );

        console.log(
            error.message
        );

        res.status(500).json({

            message:
                "Error getting quiz",

            error:
                error.message

        });

    }

});


// ==========================================
// UPDATE QUIZ
// ==========================================

router.put("/:id", async (req, res) => {

    try {

        console.log(
            "Update request received"
        );

        console.log(
            "Quiz ID:",
            req.params.id
        );


        const updatedQuiz =
            await Quiz.findByIdAndUpdate(

                req.params.id,

                req.body,

                {
                    new: true,
                    runValidators: true
                }

            );


        if (!updatedQuiz) {

            return res.status(404).json({

                message:
                    "Quiz not found"

            });

        }


        console.log(
            "Quiz updated:",
            updatedQuiz.title
        );


        res.json({

            message:
                "Quiz updated successfully",

            quiz:
                updatedQuiz

        });

    } catch (error) {

        console.log(
            "Update Quiz Error:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Error updating quiz",

            error:
                error.message

        });

    }

});


// ==========================================
// DELETE QUIZ
// ==========================================

router.delete("/:id", async (req, res) => {

    try {

        console.log(
            "DELETE REQUEST RECEIVED"
        );

        console.log(
            "Quiz ID:",
            req.params.id
        );


        const deletedQuiz =
            await Quiz.findByIdAndDelete(
                req.params.id
            );


        if (!deletedQuiz) {

            return res.status(404).json({

                message:
                    "Quiz not found"

            });

        }


        console.log(
            "Quiz deleted successfully:"
        );

        console.log(
            deletedQuiz.title
        );


        res.json({

            message:
                "Quiz deleted successfully",

            quiz:
                deletedQuiz

        });

    } catch (error) {

        console.log(
            "DELETE QUIZ ERROR:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Error deleting quiz",

            error:
                error.message

        });

    }

});


module.exports = router;