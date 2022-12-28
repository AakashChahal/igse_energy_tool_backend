const express = require("express");
const cors = require("cors");
const firebase = require("firebase/app");
const { getDatabase, ref, set } = require("firebase/database");
const {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} = require("firebase/auth");
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

const firebaseApp = firebase.initializeApp(firebaseConfig);
const database = getDatabase(firebaseApp);
const auth = getAuth();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    // res.send("Hello World!");
    console.log("Connected to the frontend");
    res.redirect("/login");
});

app.post("/login", (req, res) => {
    const { email, password } = req.body;
    let userCredentials;
    async function loginUser() {
        userCredentials = await signInWithEmailAndPassword(
            auth,
            email,
            password
        );
    }
    loginUser()
        .then(() => {
            console.log("User Logged In Successfully");
            console.log("email: ", email);
            console.log("password: ", password);
            res.json({
                email: email,
                password: password,
                user: userCredentials.user,
            });
        })
        .catch((error) => {
            console.log("Error Occured while logging in the user: ", error);
            res.status(500).send({
                message: "Error Occured while logging in the user",
                status: 500,
            });
        });
});

app.get("/login", (req, res) => {
    res.send({
        message: "Login Page",
        status: 200,
    });
});

// app.get("/register", (req, res) => {
//     res.send({
//         message: "Register Page",
//         status: 200,
//     });
// });

app.post("/register", (req, res) => {
    const {
        email,
        password,
        firstName,
        lastName,
        propertyType,
        numBedrooms,
        address,
        evc,
    } = req.body;
    const user = {
        customer_id: email,
        password,
        firstName,
        lastName,
        propertyType,
        numBedrooms,
        address,
        evc,
    };

    try {
        async function registerUser() {
            const userCredentials = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
        }
        registerUser()
            .then(() => {
                set(
                    ref(
                        database,
                        `/customers/${user.firstName + "_" + lastName}`
                    ),
                    user
                )
                    .then(() => {
                        console.log("Database Updated Successfully");
                        res.redirect("/dashboard");
                    })
                    .catch((error) => {
                        console.log(
                            "Error Occured while storing data: ",
                            error
                        );
                        res.send({
                            message: "Error Occured while storing data",
                            status: 500,
                        });
                    });
            })
            .catch((error) => {
                console.log(
                    "Error Occured while registering the user: ",
                    error
                );
                res.send({
                    message: "Error Occured while registering the user",
                    status: 500,
                });
            });

        // res.redirect("/dashboard");
    } catch (error) {
        console.error("Error Occured while registering the user: ", error);
        res.send({
            message: "Error Occured while registering the user",
            status: 500,
        });
    }
});

app.get("/dashboard", (req, res) => {
    res.send({
        message: "Dashboard Page",
        status: 200,
    });
});

app.listen(8080, console.log("Server is ready!"));
