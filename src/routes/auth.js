const express = require("express");
const authRouter = express.Router();
const {validateSignUpData} = require("../utils/validation");
const bcrypt = require("bcrypt");
const User = require("../models/user");

authRouter.post("/signup", async(req, res) => {
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

authRouter.post("/login",async(req,res)=>{
    try{
        const {emailId, password} = req.body;
        const user = await User.findOne({emailId: emailId});
        if (!user) {
            throw new Error("Invalid credentials")
        }
        const isPasswordValid = await user.validatePassword(password);

        if (isPasswordValid){
            //Create a JWT Token

            const token = await user.getJWT();
            console.log(token);
          // Add the token to cookie and send the response back to the user
            res.cookie("token", token, {httpOnly: true});
            res.send("Login Successful");
        }else{
            throw new Error("Invalid credentials");
        }

    }catch(err){
        res.status(400).send("ERROR :" + err.message);
    }
});

module.exports = authRouter;