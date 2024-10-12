const express = require("express");
const mongoose = require("mongoose");
const User = require("./models/user.model");
const Employee = require("./models/employee.model");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const { hashPassword } = require("./utils/helpers");
const { comparePassword } = require("./utils/helpers");

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(
    session({
        secret: "pass123",
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60,
        },
    })
);

app.get("/", (req, res) => {
    console.log(req.session);
    console.log(req.session.id);
});

// User signup
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

// User login
app.post("/api/v1/user/login", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.sendStatus(400);
    const userDB = await User.findOne({ username });
    if (!userDB) return res.sendStatus(401);
    const isValid = comparePassword(password, userDB.password);
    if (isValid) {
        console.log("Authenticated Successfully!");
        req.session.username = userDB;
        req.session.visited = true;
        return res.sendStatus(200);
    } else {
        console.log("Failed Authentication!");
        return res.sendStatus(401);
    }
});

// create employee
app.post("/api/v1/emp/employees", async (req, res) => {
    const data = { ...req.body };
    if (!req.session.username) {
        return res.sendStatus(401);
    } else {
        const employee = await Employee.create(data);
        res.status(201).json(employee);
    }
});

// TODO: Get List of all employees
app.get("/api/v1/emp/employees", async (req, res) => {
    try {
        const fetchEmployees = await employee.find();
        res.sendStatus(201).json(fetchEmployees);
    } catch (err) {
        console.error("Error fetching employee data:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Fetch employee by id
app.get("/api/v1/emp/employees/:id", async (req, res) => {
    try {
        const { _id } = req.params;
        const fetchEmployee = await Employee.findById(_id);
        if (fetchEmployee) {
            res.status(200).json(fetchEmployee);
        } else {
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update Employee
app.get("/api/v1/emp/employees/:id", async (req, res) => {
    try {
        const { _id } = req.params;
        const employee = await Employee.findByIdAndUpdate(_id);
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// TODO: delete employee
app.get("/api/v1/emp/employees/:id", async (req, res) => {
    try {
        const { _id } = req.params;
        const employee = await Employee.findByIdAndDelete(_id);
        if (employee) {
            res.status(200).json(employee);
        } else {
            res.status(404).json({ message: "Employee not found" });
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

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
