const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectId;

const EmployeeSchema = mongoose.Schema(
    {
        _id: {
            type: ObjectId,
            default: new mongoose.Types.ObjectId(),
        },
        first_name: String,
        last_name: String,
        email: String,
        position: String,
        salary: Number,
        date_of_joining: Date,
        department: String,
        created_at: Date,
        updated_at: Date,
    },
    {
        Timestamp: true,
    }
);

const Employee = mongoose.model("Employee", EmployeeSchema);
module.exports = Employee;
