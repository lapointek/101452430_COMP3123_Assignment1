const express = require("express");
const sessionRouter = require("../utils/session");
const Employee = require("../models/employee.model");
const cookieParser = require("cookie-parser");
const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(sessionRouter);
const router = express.Router();
app.use(router);

// Create Employee
router.post("/emp/employees", async (req, res) => {
    // store the requested body in the declared variable data
    const data = req.body;
    // if the user session doesnt exist
    if (!req.session.username) {
        // return status 401 unauthorized error occured
        res.sendStatus(401).json({ message: "Failed to create employee." });
    } else {
        // otherwise create employee with requested body
        const employee = await Employee.create(data);
        // return status 201 request fulfilled
        res.status(201).json({
            message: `Employee Created Successfully. employee_id: ${employee.id}`,
        });
    }
});

// Get List of all employees
router.get("/emp/employees", async (req, res) => {
    try {
        // await for promise to be resolved. Use a mongoose method find() to find all employees.
        // without any parameters it returns all employees.
        const fetchEmployees = await Employee.find();
        console.log("Successfully fetched employees");
        // return status 200 OK
        res.status(200).json(fetchEmployees);
    } catch (err) {
        console.error("Error fetching employee data:", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Fetch employee by id
router.get("/emp/employees/:id", async (req, res) => {
    try {
        // store route parameters of id into a const called id
        const id = req.params.id;
        // find employee by id
        const fetchEmployee = await Employee.findById(id);
        if (fetchEmployee) {
            // if employee by id exist return employee in json format
            res.status(200).json(fetchEmployee);
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
router.put("/emp/employees/:id", async (req, res) => {
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
            res.status(200).json({
                message: `Employee details updated successfully.`,
            });
            console.log(`Updated employee`);
        } else {
            res.status(404).json({ message: "Employee cannot be updated" });
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

// Delete Employee
router.delete("/emp/employees/:id", async (req, res) => {
    try {
        // store id parameters into const variable id
        const id = req.params.id;
        // find employee by id and delete
        const employee = await Employee.findByIdAndDelete(id);
        if (employee) {
            // if successful return status 204 (no content) fulfilled request
            res.status(204).json({ message: "Employee deleted successfully." });
            console.log(`Deleted employee: ${id}`);
        } else {
            res.status(404).json({ message: "Employee cannot be deleted" });
        }
    } catch (err) {
        console.error("Error", err);
        res.status(500).json({ message: "Internal Server Error" });
    }
});

module.exports = router;
