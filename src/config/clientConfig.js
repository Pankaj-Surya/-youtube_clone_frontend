import dotenv from 'dotenv'
dotenv.config()
module.exports = {
    API_URL : process.env.API_URL
}

console.log(process.env.API_URL)