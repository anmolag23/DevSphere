const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const {userAuth} = require("./middlewares/auth");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/",requestRouter);

connectDB()
    .then(() => {
        console.log("Database connection established");
        app.listen(3007, ()=>{
            console.log("My server");
        });
})
    .catch((err) => {
        console.error("Database cannot be connected!!");
});








// mongodb+srv://anmol1gupta1ag23:QbESVOlR882IqARW@namastenode.l0v2u.mongodb.net/