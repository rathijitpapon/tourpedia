const jwt = require("jsonwebtoken");

const {
    User,
    Guide,
    TravelAgency,
    Admin,
} = require("../models/user");

const JWT_SECRET = process.env.jwtSecret;

const auth = async (req, res, next, UserType) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await UserType.findOne({
            _id: decoded._id,
            "tokens.token": token,
        });

        if (!user) {
            throw new Error("Authentication unsuccessful!");
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        res.status(401).send({
            message: error.message,
        });
    }
};

const userAuth = async (req, res, next) => {
    auth(req, res, next, User);
}

const adminAuth = async (req, res, next) => {
    auth(req, res, next, Admin);
}

const guideAuth = async (req, res, next) => {
    auth(req, res, next, Guide);
}

const travelAgencyAuth = async (req, res, next) => {
    auth(req, res, next, TravelAgency);
}

module.exports = {
    userAuth,
    adminAuth,
    guideAuth,
    travelAgencyAuth,
};