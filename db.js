const mongoose = require('mongoose');
const mongoURL = "mongodb+srv://navneetraj3695:GLB1NP2bWr7S312I@cluster0.xrk0vw6.mongodb.net/hivemqData";

const connectToMongo = async () => {
    try {
        await mongoose.connect(mongoURL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("Connected TO Mongo Successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};

module.exports = connectToMongo;
