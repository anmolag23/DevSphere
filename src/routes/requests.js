const express = require('express');
const {userAuth} = require("../middlewares/auth");

const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId", userAuth, async(req,res) => {
    try {

// fromUserId → Yeh authenticated user ka ID hai jo request bhej raha hai.
//    toUserId → Yeh jis user ko request bheji ja rahi hai uska ID hai (req.params se mila hai).
//  status → Yeh request ka status "ignored", "interested", "accepted", "rejected" me se ek hoga.
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus =["ignored","interested"];
        if(!allowedStatus.includes(status)){
            return res
            .status(400)
            .json({message:"Invalid status type:" + status});
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            return res.status(404).json({message : "User not found!"});
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId},
                { fromUserId: toUserId, toUserId: fromUserId},
            ],
        });
        if(existingConnectionRequest){
            return res
                .status(400)
                .send({ message: "Connection Request Already Exists!!"});
        }


// Ek naya connection request object banaya hai jo MongoDB me save hoga.
// fromUserId = Sender ka ID.
// toUserId = Receiver ka ID.
// status = Request ka current status.

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status,
        });
         
       const data = await connectionRequest.save();

       res.json({
        message: req.user.firstName + "is" + status + "in" + toUser.firstName,
        data,
       })
    }catch (err){
        res.status(400).send("ERROR:" + err.message);
    }

});

requestRouter.post("/request/reveiw/:status/:requestId", userAuth, async(req,res) => {
    try{
      const loggedInUser = req.user;
      const {status, requestId} = req.params;

      const allowedStatus = ["accepted","rejected"];
      if(!allowedStatus.includes(status)){
        return res.status(400).json({message: "Status not allowed!"});
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if(!connectionRequest){
        return res
        .status(404)
        .json({message: "Connection request not found"});
      }

      connectionRequest.status = status;

      const data= await connectionRequest.save();
      res.json({message: "ConnectionReques" + status, data});

    }catch(err){
        res.status(400).send("ERROR:" + err.message);
    }
});

module.exports = requestRouter;