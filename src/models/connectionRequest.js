const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(         //Yaha connectionRequestSchema ek schema define kar raha hai, jo database structure batata hai.

    {
        // Yeh fromUserId field ek user ka MongoDB _id store karega.
//    mongoose.Schema.Types.ObjectId ka matlab hai yeh ek MongoDB ID store karega.
//     required: true ka matlab yeh field compulsory hai.
//      Yeh ID indicate karega ki request kisne bheji hai (sender).

        fromUserId: {                             
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",    // reference to the user collection
            required: true,
        },

        // Yeh toUserId field bhi ek MongoDB _id store karega.
        // Iska matlab hai request kisko bheji gayi hai (receiver).
        //  required: true means yeh field compulsory hai.

        toUserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        // status field ek String type ka hoga.
//       required: true hai, matlab iski value deni hi padegi.
//      Enum validation laga hai, jo sirf 4 values allow karega:

        status: {
            type: String,
            required: true,
            enum: {
                values: ["ignored","interested","accepted","rejected"],
                message: `{VALUE} is incorrect status type`,
            },
        },
    },
    {timestamps: true}
);

connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send connection request to yourself");
    }
    next();
});

// Yeh model connectionRequestSchema ka use karega.
// "ConnectionRequest" ka matlab database me connectionrequests collection banegi.

const connectionRequestModel = new mongoose.model(
    "ConnectionRequest",
    connectionRequestSchema
);

module.exports = connectionRequestModel;