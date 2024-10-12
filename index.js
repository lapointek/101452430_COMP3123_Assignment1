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

// User Signup
app.post("/api/v1/user/signup", async (req, res) => {
    // store the data sent in the requested body into the variable data
    const data = req.body;
    // Pass the users password into hashPassword() and store the hashed password into data.password
    data.password = await hashPassword(data.password);
    try {
        // create user
        const user = await User.create(data);
        // 201 - indicates request has been fulfilled. return user in json format
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User Login
app.post("/api/v1/user/login", async (req, res) => {
    // destructuring assignment syntax. Extract username and password from the requested body
    const { username, password } = req.body;
    // if no username or password return status 400 bad request
    if (!username || !password) return res.sendStatus(400);
    // find by username assign username to userDB
    const userDB = await User.findOne({ username });
    // if no username exist send status code 401 unauthorized
    if (!userDB) return res.sendStatus(401);
    // compare hash password and password sent by json body
    const isValid = comparePassword(password, userDB.password);
    // if both passwords return true or are the same
    if (isValid) {
        console.log("Authenticated Successfully!");
        // create session for user
        req.session.username = userDB;
        // assign true to visited property. track user has visited
        req.session.visited = true;
        // return status code 200 OK
        return res.sendStatus(200);
    } else {
        console.log("Failed Authentication!");
        return res.sendStatus(401);
    }
});

// Create Employee
app.post("/api/v1/emp/employees", async (req, res) => {
    // store the requested body in the declared variable data
    const data = req.body;
    // if the user session doesnt exist
    if (!req.session.username) {
        // return status 401 unauthorized error occured
        return res.sendStatus(401);
    } else {
        // otherwise create employee with requested body
        const employee = await Employee.create(data);
        // return status 201 request fulfilled
        res.status(201).json(employee);
    }
});

// Get List of all employees
app.get("/api/v1/emp/employees", async (req, res) => {
    try {
        // await for promise to be resolved. Use a mongoose method find() to find all employees.
        // without any parameters it returns all employees.
        const fetchEmployees = await Employee.find();
        console.log("Successfully fetched employees");
        // return status 201 request fulfilled
        res.status(201).json(fetchEmployees);
    } catch (err) {
        console.error("Error fetching employee data:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Fetch employee by id
app.get("/api/v1/emp/employees/:id", async (req, res) => {
    try {
        // store route parameters of id into a const called id
        const id = req.params.id;
        // find employee by id
        const fetchEmployee = await Employee.findById(id);
        if (fetchEmployee) {
            // if employee by id exist return employee in json format
            res.json(fetchEmployee);
        } else {
            // return status 404 Not Found
            res.status(404).json({ message: "Employee id not found" });
        }
    } catch (err) {
        console.error("Error", err);
        // return status 500 Interal Server Error
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Update Employee
app.put("/api/v1/emp/employees/:id", async (req, res) => {
    try {
        // store id parameters in const variable id
        const id = req.params.id;
        // store requested body into const variable updatedData
        const updatedData = req.body;
        // find employee by id and update with requested body data
        const employee = await Employee.findByIdAndUpdate(id, updatedData);
        // if successful in updating
        if (employee) {
            // return status 200 OK
            res.status(200).json(employee);
            console.log(`Updated employee: ${id}`);
        } else {
            res.status(404).json({ message: "Employee cannot be updated" });
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete Employee
app.delete("/api/v1/emp/employees/:id", async (req, res) => {
    try {
        // store id parameters into const variable id
        const id = req.params.id;
        // find employee by id and delete
        const employee = await Employee.findByIdAndDelete(id);
        if (employee) {
            // if successful return status 200 OK
            res.status(200).json(employee);
            console.log(`Deleted employee: ${id}`);
        } else {
            res.status(404).json({ message: "Employee cannot be deleted" });
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
    // if connection is successful console log and start server on port 3000
    .then(() => {
        console.log("Connected to database!");
        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    })
    // if connection failed console log connection failed
    .catch(() => {
        console.log("connection failed");
    });
