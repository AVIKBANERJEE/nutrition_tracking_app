const express = require('express');
const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');


// importing models 
const { UserModel, createUserTable } = require('./models/userModel');
//const foodModel = require("./models/foodModel")
//const trackingModel = require("./models/trackingModel")
//const verifyToken = require("./verifyToken")

// database connection  settings
const mysql1 = require('mysql2/promise');

async function connectToDatabase() {
    try {
        const connection = await mysql1.createConnection({
            host: 'localhost',
            port: 3306,
            user: 'root',
            password: '',
            database: 'nutrify'
        });
        console.log("Database connection successful");
        return connection;
    } catch (err) {
        console.error("Database connection error:", err);
        throw err;
    }
}
// Call the function to connect
async function main() {
    const connection = await connectToDatabase();
    await createUserTable(connection);
}

main();

const app = express();
app.use(express.json());
app.use(cors());


// endpoint for registering user 

app.post("/register", async (req, res) => {
    let user = req.body;

    try {
        // Generate salt
        const salt = await bcrypt.genSalt(10);
        // Hash password
        const hashedPassword = await bcrypt.hash(user.password, salt);

        // Modify user object with hashed password
        user.password = hashedPassword;

        // Create user in MySQL database
        await userModel.create(user);

        res.status(201).send({ message: "User Registered" });
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: "Some Problem" });
    }
});
