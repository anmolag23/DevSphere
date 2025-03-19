const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");



app.use(express.json());

app.post("/signup", async(req, res) => {
    //validation of Data
try{
    validateSignUpData(req);
//req.body ko direct pass karna ,yeh aacha tarika nhi h issliye deconstruct kr k pass karte h
    const {firstName, lastName, emailId, password} = req.body;

    //Encrypt the password
    const passwordHash= await bcrypt.hash(password,10);
    console.log(passwordHash);


    const user = new User({
        firstName,
        lastName,
        emailId,
        password: passwordHash,
    });    

    await user.save();
    res.send("User Added successfully");
   }catch(err){
    res.status(400).send("Error :" +  err.message);
   }
});

app.post("/login",async(req,res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if (!user) {
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid){
            res.send("Login Successful");
        }else{
            throw new Error("Invalid credentials");
        }

    }catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
});

// Get user by email
app.get("/user", async (req,res) => {
    const userEmail = req.body.emailId;
    try{
        const users = await User.find({emailId: userEmail});
        if (users.length === 0){
            res.status(404).send("User not found");
        }else{
            res.send(users);
        }
    }catch(err){
        res.status(400).send("Something went wrong");
    }
});

// Feed API - GET/feed - get all the users from the database
app.get("/feed", async (req,res) => {
    try{
        const users = await User.find({});
        res.send(users);
    }catch(err) {
        res.status(400).send("Something went wrong");
    }
});

app.delete("/user", async (req,res) => {
    const userId = req.body.userId;
    try{
        const user = await User.findByIdAndDelete(userId);
        res.send("User deleted successfully");
    } catch (err){
        res.status(400).send("Something went wrong");
    }
});

//Updata data of the user 
app.patch("/user/:userId", async(req,res) => {
    const userId = req.params?.userId;
    const data = req.body;
   
    try {
        const ALLOWED_UPDATES = [
            "photoUrl",
            "about",
            "gender",
            "age",
            "skills",
        ];
        const isUpdateAllowed = Object.keys(data).every((k) =>
            ALLOWED_UPDATES.includes(k)
        );
        if (!isUpdateAllowed){
            throw new Error("Update not allowed");
        }
        if(data?.skills.length >10){
            throw new Error("skills cananot be more than 10")
        }
        const user = await User.findByIdAndUpdate({_id: userId}, data,{
        returnDocument: "after",
        runValidators: true,
        });
        console.log(user);
        res.send("User updated successfully");
    } catch (err){
        res.status(400).send("UPDATE FAILED:" + err.message);
    }
});

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