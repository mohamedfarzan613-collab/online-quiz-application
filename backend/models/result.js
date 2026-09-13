const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    quizId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
        required: true
    },

    score: {
        type: Number,
        required: true
    },

    totalQuestions: {
        type: Number,
        required: true
    },

    percentage: {
        type: Number,
        required: true
    },

    dueDate: {
        type: Date,
        required: false
    },

    submissionStatus: {
        type: String,
        enum: ["Submitted On Time", "Late Submitted"],
        default: "Submitted On Time"
    },

    completedAt: {
        type: Date,
        default: Date.now
    }

});

module.exports = mongoose.model("Result", resultSchema);