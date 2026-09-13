const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const quizRoutes = require("./routes/quizRoutes");
const userRoutes = require("./routes/userRoutes");
const resultRoutes = require("./routes/resultRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();


// ===============================
// MIDDLEWARE
// ===============================

app.use(cors());

app.use(express.json());


// ===============================
// ROUTES
// ===============================

app.use("/api/quizzes", quizRoutes);

app.use("/api/users", userRoutes);

app.use("/api/results", resultRoutes);

app.use("/api/admin", adminRoutes);


// ===============================
// HOME ROUTE
// ===============================

app.get("/", (req, res) => {

    res.send("Online Quiz Backend is Running");

});


// ===============================
// SERVER
// ===============================

const PORT = process.env.PORT || 3000;


async function startServer() {

    try {

        await mongoose.connect(
            process.env.MONGO_URI
        );

        console.log(
            "MongoDB Connected Successfully"
        );


        app.listen(PORT, () => {

            console.log(
                `Server running on http://localhost:${PORT}`
            );

        });

    } catch (error) {

        console.log(
            "MongoDB Connection Error:"
        );

        console.log(
            error.message
        );

    }

}


startServer();