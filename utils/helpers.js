const bcrypt = require("bcryptjs");
const saltRounds = 10;

const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(saltRounds);
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword;
    } catch (error) {
        console.error(error);
        throw new Error("Error hashing password");
    }
};

function comparePassword(raw, hash) {
    return bcrypt.compareSync(raw, hash);
}

module.exports = { hashPassword, comparePassword };
