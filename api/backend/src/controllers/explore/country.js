const { Country } = require("../../models/explore");

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

const createCountry = async (req, res) => {
    const fields = ["name", "description", "banner"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const country = new Country(body);
        await country.save();

        res.status(200).send(country);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const updateCountry = async (req, res) => {
    const fields = ["name", "description", "banner"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const country = await Country.findById(req.query.id).populate('place._id').exec();
        if (!country) {
            throw new Error("Country Not Found");
        }

        for (field of fields) {
            country[field] = body[field];
        }
        await country.save();

        res.status(200).send(country);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getCountryByName = async (req, res) => {
    const fields = ["name"];

    try {
        const isValid = checkValidBody(req.query, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.query, fields);

        const country = await Country.findOne({
            name: body.name
        }).populate('place._id').exec();
        if (!country) {
            throw new Error("Country Not Found");
        }

        res.status(200).send(country);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getAllCountry = async (req, res) => {
    try {
        const countries = await Country.find().populate('place._id').exec();

        res.status(200).send(countries);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const deleteCountry = async (req, res) => {
    const fields = ["name"];

    try {
        const isValid = checkValidBody(req.query, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.query, fields);

        await Country.findOneAndDelete({
            name: body.name
        });

        res.status(200).send({
            message: "successfully deleted",
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const countryController = {
    createCountry,
    updateCountry,
    getCountryByName,
    getAllCountry,
    deleteCountry,
};

module.exports = countryController;