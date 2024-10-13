const express = require("express");
const sessionRouter = require("./utils/session");
// const session = require("express-session");
const mongoose = require("mongoose");
const userRouter = require("./routes/user");
const employeeRouter = require("./routes/employee");
const app = express();

app.use(express.json());
// app.use(
//     session({
//         secret: "pass123",
//         saveUninitialized: false,
//         resave: false,
//         cookie: {
//             maxAge: 60000 * 60,
//         },
//     })
// );

app.use(sessionRouter);
app.use("/api/v1", userRouter);
app.use("/api/v1", employeeRouter);

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
