const bcrypt = require("bcryptjs");

const { Admin } = require("../../models/user");
const mailService = require('../../services/mailService');

const checkValidBody = (body, fields) => {
    const isValid = fields.every((field) => {
        return field in body;
    });

    return isValid;
}

const convertValidBody = (body, fields) => {
    const validBody = {}

    for (const field of fields) {
        validBody[field] = body[field];
    }

    return validBody;
}

const signup = async (req, res) => {
    const fields = ["email", "password", "fullname"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const admin = new Admin(body);

        await admin.save();
        const token = await admin.generateAuthToken();
        await mailService.sendWelcomeMail(admin.email, admin.fullname);

        res.status(200).send({
            admin,
            token,
        });

    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

const signin = async (req, res) => {
    const fields = ["email", "password"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const admin = await Admin.findByCredentials(
            body.email,
            body.password,
        );
        const token = await admin.generateAuthToken();

        res.status(200).send({
            admin,
            token,
        });

    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
};

const signout = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token != req.token;
        });

        await req.user.save();
        res.status(200).send();
    } catch (error) {
        res.status(500).send({
            message: "Sign out request failed.",
        });
    }
};

const auth = async (req, res) => {
    try {
        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send({
            message: "Authentication Failed.",
        });
    }
};

const getProfile = async (req, res) => {
    try {
        res.status(200).send(req.user)
    } catch (error) {
        res.status(404).send({
            message: "Profile isn't found.",
        });
    }
};

const editPassword = async (req, res) => {
    const fields = ["password", "newPassword"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const isMatch = await bcrypt.compare(body.password, req.user.password);
        if (!isMatch) {
            throw new Error("Invalid Password");
        }

        req.user.password = body.newPassword;
        req.user.tokens = [];
    
        await req.user.save();
        const token = await req.user.generateAuthToken();

        res.status(200).send({
            token: token,
        });

    } catch (error) {
        res.status(404).send({
            message: error.message,
        });
    }
};

const adminController = {
    signup,
    signin,
    signout,
    auth,
    getProfile,
    editPassword,
};

module.exports = adminController;