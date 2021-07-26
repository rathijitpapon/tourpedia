const bcrypt = require("bcryptjs");

const { TravelAgency } = require("../../models/user");
const { Category } = require("../../models/explore");
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
        body.about = "";
        const travelAgency = new TravelAgency(body);

        await travelAgency.save();
        const token = await travelAgency.generateAuthToken();
        await mailService.sendWelcomeMail(travelAgency.email, travelAgency.fullname);

        res.status(200).send({
            travelAgency,
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

        const travelAgency = await TravelAgency.findByCredentials(
            body.email,
            body.password,
        );
        const token = await travelAgency.generateAuthToken();

        res.status(200).send({
            travelAgency,
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
        const travelAgency = await TravelAgency.findOne({
            username: req.params.username,
        }).populate({
            path: "event._id",
            populate: [
                {
                    path: "category._id",
                },
                {
                    path: "country._id",
                },
                {
                    path: "place._id",
                }
            ]
        }).populate('guide._id').populate('category._id').exec();

        if (!travelAgency) {
            throw new Error("");
        }

        res.status(200).send(travelAgency)
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
    const fields = ["fullname", "about", "profileImage", "category"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const deletable = [];
        for (const ctg of req.user.category) {
            if (!body.category.includes(ctg._id)) {
                const category = await Category.findById(ctg._id);
                let index = -1;
                for (let i = 0; i < category.travelAgency.length; i++) {
                    if (category.travelAgency[i]._id.toString() === req.user._id.toString()) {
                        index = i;
                    }
                }
                category.travelAgency.splice(index, 1);
                await category.save();
                deletable.push(ctg);
            }
        }

        for (const ctg of deletable) {
            let index = -1;
            for (let i = 0; i < req.user.category.length; i++) {
                if (req.user.category[i]._id.toString() === ctg.toString()) {
                    index = i;
                }
            }
            req.user.category.splice(index, 1);
        }

        for (const ctg of body.category) {
            if (!req.user.category.includes({_id: ctg})) {
                const category = await Category.findById(ctg);
                category.travelAgency.push({_id: req.user._id});
                await category.save();
                req.user.category.push({_id: ctg});
            }
        }

        req.user.fullname = body.fullname;
        req.user.about = body.about;
        req.user.profileImage = body.profileImage;
    
        await req.user.save();
        await req.user.populate('event._id').populate('guide._id').populate('category._id').execPopulate();

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

        const travelAgency = await TravelAgency.findOne({
            email: body.email,
        });
        
        if(!travelAgency) {
            throw new Error("Email isn't registered.");
        }

        const randomPassword = Math.random().toString(36).substring(2, 15);
        travelAgency.password = randomPassword;
        await travelAgency.save();

        await mailService.sendForgetPasswordMail(travelAgency.email, travelAgency.fullname, travelAgency.password);

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

        const travelagency = await TravelAgency.findById(req.query.id);
        fields.forEach((field) => {
            travelagency[field] = body[field];
        });
    
        await travelagency.save();

        res.status(200).send(travelagency);

    } catch (error) {
        res.status(404).send({
            message: error.message,
        });
    }
};

const getAllProfile = async (req, res) => {
    try {
        const travelagencies = await TravelAgency.find();

        res.status(200).send(travelagencies);
    } catch (error) {
        res.status(404).send({
            message: "Profile isn't found.",
        });
    }
};

const getManyProfileByFiltering = async (req, res) => {
    try {
        const queryMatcher = {};
        if (Object.keys(req.query).includes("category") && req.query.category.length > 0) {
            queryMatcher['category._id'] = {$in: req.query.category};
        }

        const travelagencies = await TravelAgency.find(queryMatcher).populate('category._id');

        res.status(200).send(travelagencies);
    } catch (error) {
        res.status(404).send({
            message: "Profile isn't found.",
        });
    }
};

const travelAgencyController = {
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
    getManyProfileByFiltering,
};

module.exports = travelAgencyController;