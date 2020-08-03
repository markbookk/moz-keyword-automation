require('dotenv').config();

const config = {
    credentials: {
        email:process.env.EMAIL,
        password:process.env.PASSWORD
    },
    keyword:process.env.KEYWORD
}

module.exports = config;