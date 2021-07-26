const { Country, Place, Category } = require("../../models/explore");

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

const createPlace = async (req, res) => {
    const fields = ["country", "name", "description", "banner", "category"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        let body = convertValidBody(req.body, fields);

        const country = await Country.findById(body.country);
        const category = [];
        for (const cat of body.category) {
            const curCat = await Category.findById(cat);
            category.push(curCat);
        }

        body.country = {};
        body.country._id = country._id;
        body.category = [];
        for (const cat of category) {
            body.category.push({
                _id: cat._id,
            });
        }
        
        let place = new Place(body);
        await place.save();
        place = await Place.findById(place._id).populate('country._id').populate('category._id').populate('blog._id').populate('tourPlan._id').populate('event._id').exec();

        country.place.push({
            _id: place._id,
        });
        await country.save();
        for (const cat of category) {
            cat.place.push({
                _id: place._id,
            });
            await cat.save();
        }

        res.status(200).send(place);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const updatePlace = async (req, res) => {
    const fields = ["name", "description", "banner"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const place = await Place.findById(req.query.id).populate('country._id').populate('category._id').populate('blog._id').populate('tourPlan._id').populate('event._id').exec();
        if (!place) {
            throw new Error("Place Not Found");
        }

        if (!place) {
            throw new Error("Place Not Found");
        }

        for (field of fields) {
            place[field] = body[field];
        }
        await place.save();

        res.status(200).send(place);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getPlaceByName = async (req, res) => {
    const fields = ["name"];

    try {
        const isValid = checkValidBody(req.query, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.query, fields);

        const place = await Place.findOne({
            name: body.name
        }).populate('country._id').populate('category._id').populate('blog._id').populate('tourPlan._id').populate('event._id').exec();
        if (!place) {
            throw new Error("Place Not Found");
        }

        res.status(200).send(place);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getAllPlace = async (req, res) => {
    try {
        const places = await Place.find().populate('country._id').populate('category._id').populate('blog._id').populate('tourPlan._id').populate('event._id').exec();

        res.status(200).send(places);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getManyPlacesByFilter = async (req, res) => {
    try {
        const queryMatcher = {};
        if (Object.keys(req.query).includes("category") && req.query.category.length > 0) {
            queryMatcher['category._id'] = {$in: req.query.category};
        }
        if (Object.keys(req.query).includes("country") && req.query.country.length > 0) {
            queryMatcher['country._id'] = {$in: req.query.country};
        }

        const places = await Place.find(queryMatcher).populate('country._id').populate('category._id').populate('blog._id').populate('tourPlan._id').populate('event._id').exec();

        res.status(200).send(places);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const placeController = {
    createPlace,
    updatePlace,
    getPlaceByName,
    getAllPlace,
    getManyPlacesByFilter,
};

module.exports = placeController;