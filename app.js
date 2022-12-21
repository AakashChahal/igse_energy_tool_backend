const express = require("express");
const cors = require("cors");
const firebase = require("firebase/app");
const app = express();

const firebaseConfig = {
    apiKey: "AIzaSyAF57fDJpxBjL2OS4R1x7vHNxGOaugdOeY",
    authDomain: "igse-energy-tool.firebaseapp.com",
    databaseURL: "https://igse-energy-tool-default-rtdb.firebaseio.com",
    projectId: "igse-energy-tool",
    storageBucket: "igse-energy-tool.appspot.com",
    messagingSenderId: "994278000336",
    appId: "1:994278000336:web:7099deec2acecbd2ee80d5",
    measurementId: "G-YGQ5LCHR41",
};

firebase.initializeApp(firebaseConfig);

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    // res.send("Hello World!");
    console.log("Connected to the frontend");
    res.redirect("/login");
});

app.post("/login", (req, res) => {
    console.log(req);
    res.send({
        message: "Hello World!",
        status: 200,
    });
});

app.get("/login", (req, res) => {
    res.send({
        message: "Login Page",
        status: 200,
    });
});

app.get("/register", (req, res) => {
    res.send({
        message: "Register Page",
        status: 200,
    });
});

app.post("/register", (req, res) => {
    console.log(req);
    res.send({
        message: "Registration Successfull",
        status: 200,
    });
});

app.listen(8080, console.log("Server is ready!"));
