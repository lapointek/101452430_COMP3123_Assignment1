const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Employee = require("./models/employee.model");
const { hashPassword } = require("./utils/helpers");
const { matchedData } = require("express-validator");
const { findOne } = require("mongoose");

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello from Node API Server Updated");
});

// signup
app.post("/api/v1/user/signup", async (req, res) => {
    const data = req.body;
    data.password = await hashPassword(data.password);
    try {
        const user = await User.create(data);
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//User login
app.post("/api/v1/user/login", async (req, res) => {
    const { username, password } = req.body;
});

// Get List of all employees

// create employee
app.post("/api/v1/emp/employees", async (req, res) => {
    const data = req.body;
    try {
        const employee = await Employee.create(data);
        res.status(201).json(employee);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// get employee by id

// update employee information

// delete employee

// Connect to database and run server
mongoose
    .connect(
        "mongodb+srv://klapointe:KOX0FRhZbVGnp8zA@comp3123-assignment1.t2p5g.mongodb.net/Node-API?retryWrites=true&w=majority&appName=comp3123-assignment1"
    )
    .then(() => {
        console.log("Connected to database!");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    .catch(() => {
        console.log("connection failed");
    });
