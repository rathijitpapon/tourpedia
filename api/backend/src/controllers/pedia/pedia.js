const { Pedia, Area, Food } = require("../../models/pedia");
const { Country, Place } = require("../../models/explore");

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

const createPedia = async (req, res) => {
    const fields = ["imageURL", "videoURL", "area", "food", "country", "place"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        let body = convertValidBody(req.body, fields);

        const country = await Country.findById(body.country);
        const place = await Place.findById(body.place);
        const areas = [];
        const foods = [];

        for (const data of body.area) {
            const area = new Area(data);
            await area.save();
            areas.push({_id: area._id});
        }
        for (const data of body.food) {
            const food = new Food(data);
            await food.save();
            foods.push({_id: food._id});
        }

        body.country = {_id: country.id};
        body.place = {_id: place.id};
        body.area = areas;
        body.food = foods;
        pedia.rating = 0;

        let pedia = new Pedia(body);
        await pedia.save();
        pedia = await Pedia.findById(pedia._id).populate('area._id').populate('food._id').exec();

        place.pedia = {_id: pedia._id};
        await place.save();

        res.status(200).send(pedia);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const updatePedia = async (req, res) => {
    const fields = ["imageURL", "videoURL", "area", "food"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const pedia = await Pedia.findById(req.query.id).populate('area._id').populate('food._id').exec();
        if (!pedia) {
            throw new Error("Pedia Not Found");
        }

        const areas = [];
        const foods = [];

        for (const data of body.area) {
            if (Object.keys(data).includes('_id')) {
                const area = await Area.findById(data._id);
                area.name = data.name;
                area.imageURL = data.imageURL;
                area.videoURL = data.videoURL;
                area.description = data.description;
                await area.save();
                areas.push({_id: area._id});
            }
            else {
                const area = new Area(data);
                await area.save();
                areas.push({_id: area._id});
            }
        }
        for (const data of body.food) {
            if (Object.keys(data).includes('_id')) {
                const food = await Food.findById(data._id);
                food.name = data.name;
                food.imageURL = data.imageURL;
                food.videoURL = data.videoURL;
                food.description = data.description;
                await food.save();
                foods.push({_id: food._id});
            }
            else {
                const food = new Food(data);
                await food.save();
                foods.push({_id: food._id});
            }
        }
        body.area = areas;
        body.food = foods;

        for (field of fields) {
            pedia[field] = body[field];
        }
        await pedia.save();

        res.status(200).send(pedia);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getPediaById = async (req, res) => {
    try {
        const pedia = await Pedia.findById(req.query.id).populate('area._id').populate('food._id').exec();
        if (!pedia) {
            throw new Error("Pedia Not Found");
        }

        res.status(200).send(pedia);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getManyPedia = async (req, res) => {
    try {
        const options = {
            skip: req.query.skip,
            limit: req.query.limit,
        }

        const pedias = await Pedia.find(options).populate('area._id').populate('food._id').exec();

        res.status(200).send(pedias);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const pediaController = {
    createPedia,
    updatePedia,
    getPediaById,
    getManyPedia,
};

module.exports = pediaController;