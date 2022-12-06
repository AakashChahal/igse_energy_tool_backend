const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    // res.send("Hello World!");
    console.log("Connected to the frontend");
    res.redirect("/login");
});

app.get("/login", (req, res) => {
    res.send({
        message: "Hello World!",
    });
});

app.listen(8080, console.log("Server is ready!"));
