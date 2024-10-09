const bcrypt = require("bcrypt");
const saltRounds = 10;

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        console.log(salt);
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword;
    } catch (error) {
        console.error(error);
        throw new Error("Error hashing password");
    }
};

exports.hashPassword = hashPassword;
