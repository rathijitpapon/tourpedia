const { TourPlan, Area } = require("../../models/pedia");
const { Category, Country, Place } = require("../../models/explore");
const { DayPlan, TimePlan } = require("../../models/event");
const { User } = require("../../models/user");

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

const createTourPlanProperty = async (body) => {
    const country = await Country.findById(body.country);
    const category = [];
    const place = [];
    for (const cat of body.category) {
        category.push(await Category.findById(cat));
    }
    for (const plc of body.place) {
        place.push(await Place.findById(plc));
    }

    body.country = {_id: country._id};
    body.category = [];
    body.place = [];

    for (const cat of category) {
        body.category.push({_id: cat._id});
    }
    for (const plc of place) {
        body.place.push({_id: plc._id});
    }

    const dayPlan = [];
    for (const dp of body.dayPlan) {
        const timePlan = [];
        for (const tp of dp.timePlan) {
            const area = [];
            for (const ar of tp.area) {
                area.push({_id: await Area.findById(ar)});
            }
            tp.area = area;
            const newTp = new TimePlan(tp);
            await newTp.save();
            timePlan.push({_id: newTp._id});
        }
        dp.timePlan = timePlan;
        const newDp = new DayPlan(dp);
        await newDp.save();
        dayPlan.push({_id: newDp._id});
    }
    body.dayPlan = dayPlan;

    return {
        planBody: body,
        category,
        place,
        country,
    };
}

const removeTourPlanProperty = async (tourPlan) => {
    const country = await Country.findById(tourPlan.country._id);
    let index = -1;
    for (let i = 0; i < country.tourPlan.length; i++) {
        if (country.tourPlan[i]._id === tourPlan._id) {
            index = i;
        }
    }
    country.tourPlan.splice(index, 1);
    await country.save();

    for (const cat of tourPlan.category) {
        const category = await Category.findById(cat._id);
        let index = -1;
        for (let i = 0; i < category.tourPlan.length; i++) {
            if (category.tourPlan[i]._id === tourPlan._id) {
                index = i;
            }
        }
        category.tourPlan.splice(index, 1);
        await category.save();
    }

    for (const plc of tourPlan.place) {
        const place = await Place.findById(plc._id);
        let index = -1;
        for (let i = 0; i < place.tourPlan.length; i++) {
            if (place.tourPlan[i]._id === tourPlan._id) {
                index = i;
            }
        }
        place.tourPlan.splice(index, 1);
        await place.save();
    }

    for (const dp of tourPlan.dayPlan) {
        const dayPlan = await DayPlan.findById(dp._id);
        for (const tp of dayPlan.timePlan) {
            await TimePlan.findByIdAndRemove(tp._id);
        }
        await DayPlan.findByIdAndRemove(dp._id);
    }
}

const createTourPlan = async (req, res) => {
    const fields = [
        "name", 
        "description", 
        "banner", 
        "imageURL", 
        "videoURL", 
        "groupOption", 
        "duration",
        "minimuParticipantLimit", 
        "accomodationOption", 
        "category", 
        "totalCost",
        "dayPlan", 
        "country", 
        "place",
    ];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        let body = convertValidBody(req.body, fields);

        const {planBody, category, place, country} = await createTourPlanProperty(body);

        const tourPlan = new TourPlan(planBody);
        await tourPlan.save();

        for (const cat of category) {
            cat.tourPlan.push({_id: tourPlan._id});
            await cat.save();
        }
        for (const plc of place) {
            plc.tourPlan.push({_id: tourPlan._id});
            await plc.save();
        }
        country.tourPlan.push({_id: tourPlan._id});
        await country.save();

        await tourPlan.populate("category._id").populate("place._id").populate("country._id").populate({
            path: "dayPlan._id",
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        }).execPopulate();

        res.status(200).send(tourPlan);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const updateTourPlan = async (req, res) => {
    const fields = [
        "name", 
        "description", 
        "banner", 
        "imageURL", 
        "videoURL", 
        "groupOption", 
        "duration",
        "minimuParticipantLimit", 
        "accomodationOption", 
        "category", 
        "totalCost",
        "dayPlan", 
        "country", 
        "place",
    ];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const tourPlan = await TourPlan.findById(req.query.id).populate("category._id").populate("place._id").populate("country._id").populate({
            path: "dayPlan._id",
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        });

        await removeTourPlanProperty(tourPlan);
        const {planBody, category, place, country} = await createTourPlanProperty(body);

        for (const key of Object.keys(planBody)) {
            tourPlan[key] = planBody[key];
        }
        await tourPlan.save();

        for (const cat of category) {
            cat.tourPlan.push({_id: tourPlan._id});
            await cat.save();
        }
        for (const plc of place) {
            plc.tourPlan.push({_id: tourPlan._id});
            await plc.save();
        }
        country.tourPlan.push({_id: tourPlan._id});
        await country.save();

        res.status(200).send();
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const removeTourPlan = async (req, res) => {
    try {
        const tourPlan = await TourPlan.findById(req.query.id);

        await removeTourPlanProperty(tourPlan);

        const users = await User.find();
        for (const user of users) {
            let index = -1;
            for (let i = 0; i < user.savedTourPlan.length; i++) {
                if (user.savedTourPlan[i]._id === tourPlan._id) {
                    index = i;
                }
            }
            if (index !== -1) {
                user.savedTourPlan.splice(index, 1);
            }
            await user.save();
        }

        await TourPlan.findByIdAndRemove(tourPlan._id);

        res.status(200).send({
            message: 'Tour Plan is Removed Successfully'
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getTourPlanById = async (req, res) => {
    try {
        const tourPlan = await TourPlan.findById(req.params.id).populate("category._id").populate("place._id").populate("country._id").populate({
            path: "dayPlan._id",
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        });

        res.status(200).send(tourPlan);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getAllTourPlans = async (req, res) => {
    try {
        const tourPlans = await TourPlan.find().populate("category._id").populate("place._id").populate("country._id").populate({
            path: "dayPlan._id",
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        });

        res.status(200).send(tourPlans);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getManyTourPlan = async (req, res) => {
    const fields = [
        "durationSort",
        "costSort",
        "participantSort",
        "date",
        "roomSize",
        "accomodationQuality",
        "groupOption",
        "accomodationOption",
        "participantLimit",
        "duration",
        'cost',
        // "category",
        // "country",
        // "place",
        "limit",
        "skip",
    ];

    try {
        const isValid = checkValidBody(req.query, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        
        const options = {
            participantLimit: +req.query.participantSort,
            totalCost: +req.query.costSort,
            duration: +req.query.durationSort,
        }

        const queryMatcher = {
            'groupOption': {$in: req.query.groupOption},
            'accomodationOption': {$in: req.query.accomodationOption},
            duration: { $gte: +req.query.duration[0], $lte: +req.query.duration[1] },
            minimuParticipantLimit: { $gte: +req.query.participantLimit[0], $lte: +req.query.participantLimit[1] },
            totalCost: { $gte: +req.query.cost[0], $lte: +req.query.cost[1] },
        };
        if (Object.keys(req.query).includes("category") && req.query.category.length > 0) {
            queryMatcher['category._id'] = {$in: req.query.category};
        }
        if (Object.keys(req.query).includes("country") && req.query.country.length > 0) {
            queryMatcher['country._id'] = {$in: req.query.country};
        }
        if (Object.keys(req.query).includes("place") && req.query.place.length > 0) {
            queryMatcher['place._id'] = {$in: req.query.place};
        }
    
        const tourPlans = await TourPlan.find().sort(options).skip(+req.query.skip).limit(+req.query.limit).populate("travelAgency._id").populate("category._id").populate("place._id").populate("guide._id").populate("country._id").populate({
            path: "dayPlan._id",
            match: {
                date: { $gte: new Date(req.query.date[0]), $lte: new Date(req.query.date[1]) },
                roomSize: { $gte: +req.query.roomSize[0], $lte: +req.query.roomSize[1] },
                accomodationQuality: { $gte: +req.query.accomodationQuality[0], $lte: +req.query.accomodationQuality[1] },
            },
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        });

        res.status(200).send(tourPlans);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const changeSaveTourPlan = async (req, res) => {
    const fields = ["isSaved"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const tourPlan = await TourPlan.findById(req.query.id).populate("category._id").populate("place._id").populate("country._id").populate({
            path: "dayPlan._id",
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        });
        
        if (body.isSaved) {
            req.user.savedTourPlan.push({_id: tourPlan._id});
        } 
        else {
            let index = -1;
            for (let i = 0; i < req.user.savedTourPlan.length; i++) {
                if (req.user.savedTourPlan[i]._id.toString() === tourPlan._id.toString()) {
                    index = i;
                }
            }
            req.user.savedTourPlan.splice(index, 1);
        }

        await req.user.save();

        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const tourPlanController = {
    createTourPlan,
    updateTourPlan,
    removeTourPlan,
    getTourPlanById,
    getAllTourPlans,
    getManyTourPlan,
    changeSaveTourPlan,
};

module.exports = tourPlanController;