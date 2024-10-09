const mongoose = require("mongoose");
var ObjectId = require("mongodb").ObjectId;

const UserSchema = mongoose.Schema(
    {
        _id: {
            type: ObjectId,
            default: new mongoose.Types.ObjectId(),
        },
        username: String,
        email: String,
        password: String, // This should be hashed
        created_at: Date,
        updated_at: Date,
    },
    {
        Timestamp: true,
    }
);

const User = mongoose.model("User", UserSchema);
module.exports = User;
