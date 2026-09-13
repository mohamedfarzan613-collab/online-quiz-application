const express = require("express");

const Result = require("../models/Result");
const Quiz = require("../models/Quiz");

const router = express.Router();


// ==========================================
// ADD RESULT
// ==========================================

router.post("/add", async (req, res) => {

    try {

        const {
            userId,
            quizId,
            score,
            totalQuestions,
            percentage
        } = req.body;


        console.log("================================");
        console.log("RESULT SAVE REQUEST");
        console.log("User ID:", userId);
        console.log("Quiz ID:", quizId);
        console.log("Score:", score);
        console.log("Total Questions:", totalQuestions);
        console.log("Percentage:", percentage);


        // ------------------------------------------
        // Find quiz
        // ------------------------------------------

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {

            return res.status(404).json({
                message: "Quiz not found"
            });

        }


        console.log("Quiz found:", quiz.title);
        console.log("Quiz Due Date:", quiz.dueDate);


        // ------------------------------------------
        // Get current submission time
        // ------------------------------------------

        const submittedAt = new Date();


        // ------------------------------------------
        // Get due date safely
        // ------------------------------------------

        let dueDate = null;

        if (quiz.dueDate) {

            const parsedDate =
                new Date(quiz.dueDate);

            if (!isNaN(parsedDate.getTime())) {

                dueDate = parsedDate;

            }

        }


        // ------------------------------------------
        // Determine submission status
        // ------------------------------------------

        let submissionStatus =
            "Submitted On Time";


        if (dueDate) {

            if (submittedAt > dueDate) {

                submissionStatus =
                    "Late Submitted";

            }

        }


        console.log("Submitted At:", submittedAt);
        console.log("Due Date:", dueDate);
        console.log(
            "Submission Status:",
            submissionStatus
        );


        // ------------------------------------------
        // Create result
        // ------------------------------------------

        const result = new Result({

            userId: userId,

            quizId: quizId,

            score: score,

            totalQuestions: totalQuestions,

            percentage: percentage,

            dueDate: dueDate,

            submissionStatus:
                submissionStatus,

            completedAt:
                submittedAt

        });


        // ------------------------------------------
        // Save result
        // ------------------------------------------

        const savedResult =
            await result.save();


        console.log(
            "Result saved successfully!"
        );

        console.log("================================");


        res.status(201).json({

            message:
                "Result saved successfully",

            result:
                savedResult

        });

    }


    catch (error) {

        console.log("================================");
        console.log("Result Error:");
        console.log(error.message);
        console.log("================================");


        res.status(500).json({

            message:
                "Error saving result",

            error:
                error.message

        });

    }

});



// ==========================================
// GET ALL RESULTS
// ==========================================

router.get("/", async (req, res) => {

    try {

        const results =
            await Result.find()
                .populate(
                    "userId",
                    "name email"
                )
                .populate(
                    "quizId",
                    "title"
                )
                .sort({
                    completedAt: -1
                });


        res.json(results);

    }


    catch (error) {

        console.log(
            "Get Results Error:"
        );

        console.log(
            error.message
        );


        res.status(500).json({

            message:
                "Error getting results",

            error:
                error.message

        });

    }

});



// ==========================================
// GET RESULTS OF ONE USER
// ==========================================

router.get(
    "/user/:userId",
    async (req, res) => {

        try {

            const results =
                await Result.find({
                    userId:
                        req.params.userId
                })
                .populate(
                    "quizId",
                    "title dueDate"
                )
                .sort({
                    completedAt: -1
                });


            res.json(results);

        }


        catch (error) {

            console.log(
                "Get User Results Error:"
            );

            console.log(
                error.message
            );


            res.status(500).json({

                message:
                    "Error getting user results",

                error:
                    error.message

            });

        }

    }
);


module.exports = router;