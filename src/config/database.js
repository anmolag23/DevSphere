const mongoose = require('mongoose');

const connectDB = async () => {
    await mongoose.connect(   
    "mongodb+srv://anmol1gupta1ag23:QbESVOlR882IqARW@namastenode.l0v2u.mongodb.net/devTinder"
    );
};

module.exports = connectDB;