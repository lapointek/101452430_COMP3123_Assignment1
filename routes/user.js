const express = require("express");
const sessionRouter = require("../utils/session");
const User = require("../models/user.model");
const { hashPassword, comparePassword } = require("../utils/helpers");
const app = express();

app.use(express.json());
app.use(sessionRouter);
const router = express.Router();
app.use(router);

// User Signup
router.post("/user/signup", async (req, res) => {
    // store the data sent in the requested body into the variable data
    const data = req.body;

    try {
        // Pass the users password into hashPassword() and store the hashed password into data.password
        data.password = await hashPassword(data.password);
        // create user
        const user = await User.create(data);
        // 201 - indicates request has been fulfilled. return user in json format
        res.status(201).json({
            message: `User created successfully, user_id: ${user.id}`,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// User Login
router.post("/user/login", async (req, res) => {
    // destructuring assignment syntax. Extract username and password from the requested body
    const { username, password } = req.body;
    console.log(req.body);
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
        // create session for user
        req.session.username = userDB;
        // assign true to visited property. track user has visited
        req.session.visited = true;
        // return status code 200 OK
        res.status(200).json({ message: "Login successful." });
    } else {
        res.sendStatus(401).json({ message: "Failed Authentication!" });
    }
});

module.exports = router;
