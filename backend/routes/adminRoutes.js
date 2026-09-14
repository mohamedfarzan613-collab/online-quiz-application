const express = require("express");
const Admin = require("../models/Admin");

const router = express.Router();


// ======================================================
// ADMIN LOGIN
// POST: /api/admin/login
// ======================================================

router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {

            return res.status(400).json({
                message: "Please enter email and password"
            });

        }

        const admin = await Admin.findOne({
            email: email
        });

        if (!admin) {

            return res.status(401).json({
                message: "Invalid admin email or password"
            });

        }

        if (admin.password !== password) {

            return res.status(401).json({
                message: "Invalid admin email or password"
            });

        }

        res.json({

            message: "Admin login successful",

            admin: {
                id: admin._id,
                username: admin.username,
                email: admin.email
            }

        });

    }
    catch (error) {

        console.log("Admin Login Error:");
        console.log(error.message);

        res.status(500).json({

            message: "Error during admin login",
            error: error.message

        });

    }

});


// ======================================================
// GET ADMIN DETAILS
// GET: /api/admin
// ======================================================

router.get("/", async (req, res) => {

    try {

        const admin = await Admin.findOne()
            .select("-password");

        if (!admin) {

            return res.status(404).json({
                message: "Admin not found"
            });

        }

        res.json(admin);

    }
    catch (error) {

        console.log("Get Admin Error:");
        console.log(error.message);

        res.status(500).json({

            message: "Error getting admin",
            error: error.message

        });

    }

});


// ======================================================
// CREATE DEFAULT ADMIN
// POST: /api/admin/create-default
// ======================================================

router.post("/create-default", async (req, res) => {

    try {

        const existingAdmin =
            await Admin.findOne();

        if (existingAdmin) {

            return res.json({

                message: "Admin account already exists",

                admin: {
                    username: existingAdmin.username,
                    email: existingAdmin.email
                }

            });

        }

        const admin = new Admin({

            username: "admin",

            email: "admin@gmail.com",

            password: "admin123"

        });

        await admin.save();

        res.status(201).json({

            message: "Default admin created successfully",

            admin: {
                username: admin.username,
                email: admin.email
            }

        });

    }
    catch (error) {

        console.log("Create Admin Error:");
        console.log(error.message);

        res.status(500).json({

            message: "Error creating admin",
            error: error.message

        });

    }

});


// ======================================================
// UPDATE ADMIN SETTINGS
// PUT: /api/admin/:id
// ======================================================

router.put("/:id", async (req, res) => {

    try {

        const {
            username,
            email,
            password
        } = req.body;

        if (!username || !email || !password) {

            return res.status(400).json({

                message:
                    "Username, email and password are required"

            });

        }

        const admin =
            await Admin.findById(req.params.id);

        if (!admin) {

            return res.status(404).json({

                message: "Admin not found"

            });

        }

        admin.username = username;
        admin.email = email;
        admin.password = password;

        const updatedAdmin =
            await admin.save();

        res.json({

            message:
                "Admin settings updated successfully",

            admin: {

                id: updatedAdmin._id,

                username:
                    updatedAdmin.username,

                email:
                    updatedAdmin.email

            }

        });

    }
    catch (error) {

        console.log("Update Admin Error:");
        console.log(error.message);

        if (error.code === 11000) {

            return res.status(400).json({

                message:
                    "Username or email already exists"

            });

        }

        res.status(500).json({

            message:
                "Error updating admin settings",

            error: error.message

        });

    }

});


module.exports = router;