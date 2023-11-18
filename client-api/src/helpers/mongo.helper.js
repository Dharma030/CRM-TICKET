require('dotenv').config();
const mongoose = require("mongoose");

const mongoURI = process.env.MONGO_URL;

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true,
});

mongoose.connection.on('connected', () => {
    console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error:', err);
});

const JWTSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    token: { type: String, required: true },
});

const JWTModel = mongoose.model("JWT", JWTSchema);

module.exports = {
    storeUserRefreshJWT: async (userId, token) => {
        try {
            const result = await JWTModel.findOneAndUpdate(
                { userId },
                { token },
                { upsert: true, new: true }
            );
            return result; // Return the updated document
        } catch (error) {
            throw error;
        }
    },

    deleteJWT: async (userId) => {
        try {
            await JWTModel.findOneAndDelete({ userId });
        } catch (error) {
            throw error;
        }
    },
};
