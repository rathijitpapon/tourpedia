const bcrypt = require("bcryptjs");

const { Guide } = require("../../models/user");
const mailService = require('../../services/mailService');

const defaultProfileImage = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";

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
    const fields = ["username", "email", "password", "fullname"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        body.profileImage = defaultProfileImage;
        body.isBanned = false;
        body.isRemoved = false;
        body.about = "";
        body.travelAgency = {_id: req.user._id};
        const guide = new Guide(body);

        await guide.save();
        await mailService.sendWelcomeMail(guide.email, guide.fullname);

        req.user.guide.push({_id: guide._id});
        await req.user.save();

        res.status(200).send({
            guide,
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

        const guide = await Guide.findByCredentials(
            body.email,
            body.password,
        );
        if (guide.isRemoved) {
            throw new Error("No User Found");
        }
        const token = await guide.generateAuthToken();

        res.status(200).send({
            guide,
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
        const guide = await Guide.findOne({
            username: req.params.username,
        }).populate('guidedEvent._id').populate('travelAgency._id').exec();

        if (!guide) {
            throw new Error("");
        }

        res.status(200).send(guide)
    } catch (error) {
        res.status(404).send({
            message: "Profile isn't found.",
        });
    }
};

const getEmail = async (req, res) => {
    res.status(200).send({
        email: req.user.email,
    });
};

const editProfile = async (req, res) => {
    const fields = ["fullname", "about", "profileImage"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        fields.forEach((field) => {
            req.user[field] = body[field];
        });
    
        await req.user.save();

        res.status(200).send(req.user);

    } catch (error) {
        res.status(404).send({
            message: error.message,
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

const forgetPassword = async (req, res) => {
    const fields = ["email"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const guide = await Guide.findOne({
            email: body.email,
        });
        
        if(!guide) {
            throw new Error("Email isn't registered.");
        }

        const randomPassword = Math.random().toString(36).substring(2, 15);
        guide.password = randomPassword;
        await guide.save();

        await mailService.sendForgetPasswordMail(guide.email, guide.fullname, guide.password);

        res.status(200).send();

    } catch (error) {
        res.status(404).send({
            message: error.message,
        });
    }
}

const changeBannedStatus = async (req, res) => {
    const fields = ["isBanned"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const guide = await Guide.findById(req.query.id);
        fields.forEach((field) => {
            guide[field] = body[field];
        });
    
        await guide.save();

        res.status(200).send(guide);

    } catch (error) {
        res.status(404).send({
            message: error.message,
        });
    }
};

const getAllProfile = async (req, res) => {
    try {
        const guides = await Guide.find();

        res.status(200).send(guides);
    } catch (error) {
        res.status(404).send({
            message: "Profile isn't found.",
        });
    }
};

const removeGuide = async (req, res) => {
    try {
        const guide = await Guide.findById(req.query.id);

        const index = req.user.guide.indexOf({_id: guide._id});
        req.user.guide.splice(index, 1);
        await req.user.save();
        
        guide.isRemoved = true;
        await guide.save();

        res.status(200).send(req.user);

    } catch (error) {
        res.status(404).send({
            message: error.message,
        });
    }
};

const guideController = {
    signup,
    signin,
    signout,
    auth,
    getProfile,
    getEmail,
    editProfile,
    editPassword,
    forgetPassword,
    changeBannedStatus,
    getAllProfile,
    removeGuide,
};

module.exports = guideController;