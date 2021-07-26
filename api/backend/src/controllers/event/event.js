const { Area } = require("../../models/pedia");
const { Category, Country, Place } = require("../../models/explore");
const { Event, DayPlan, TimePlan } = require("../../models/event");
const { Guide, User } = require("../../models/user");

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

const createEventProperty = async (body) => {
    const country = await Country.findById(body.country);
    const category = [];
    const place = [];
    const guide = [];
    for (const cat of body.category) {
        category.push(await Category.findById(cat));
    }
    for (const plc of body.place) {
        place.push(await Place.findById(plc));
    }
    for (const gd of body.guide) {
        guide.push(await Guide.findById(gd));
    }

    body.country = {_id: country._id};
    body.category = [];
    body.place = [];
    body.guide = [];

    for (const cat of category) {
        body.category.push({_id: cat._id});
    }
    for (const plc of place) {
        body.place.push({_id: plc._id});
    }
    for (const gd of guide) {
        body.guide.push({_id: gd._id});
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
        eventBody: body,
        category,
        place,
        guide,
        country,
    };
}

const removeEventProperty = async (event) => {
    const country = await Country.findById(event.country._id);
    let index = -1;
    for (let i = 0; i < country.event.length; i++) {
        if (country.event[i]._id === event._id) {
            index = i;
        }
    }
    country.event.splice(index, 1);
    await country.save();

    for (const cat of event.category) {
        const category = await Category.findById(cat._id);
        let index = -1;
        for (let i = 0; i < category.event.length; i++) {
            if (category.event[i]._id === event._id) {
                index = i;
            }
        }
        category.event.splice(index, 1);
        await category.save();
    }

    for (const plc of event.place) {
        const place = await Place.findById(plc._id);
        let index = -1;
        for (let i = 0; i < place.event.length; i++) {
            if (place.event[i]._id === event._id) {
                index = i;
            }
        }
        place.event.splice(index, 1);
        await place.save();
    }

    for (const gd of event.guide) {
        const guide = await Guide.findById(gd._id);
        let index = -1;
        for (let i = 0; i < guide.guidedEvent.length; i++) {
            if (guide.guidedEvent[i]._id === event._id) {
                index = i;
            }
        }
        guide.guidedEvent.splice(index, 1);
        await guide.save();
    }

    for (const dp of event.dayPlan) {
        const dayPlan = await DayPlan.findById(dp._id);
        for (const tp of dayPlan.timePlan) {
            await TimePlan.findByIdAndRemove(tp._id);
        }
        await DayPlan.findByIdAndRemove(dp._id);
    }
}

const createEvent = async (req, res) => {
    const fields = [
        "name", 
        "description", 
        "banner", 
        "imageURL", 
        "videoURL", 
        "groupOption", 
        "duration", 
        "inclusion", 
        "minimumAge", 
        "maximumAge", 
        "childAllowed", 
        "physicalRating", 
        "participantLimit", 
        "accomodationOption", 
        "category", 
        "totalCost", 
        "possibleAdditionalCost", 
        "dayPlan", 
        "country", 
        "place", 
        "guide", 
        "planFileURL", 
        "agreementFileURL"
    ];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        let body = convertValidBody(req.body, fields);

        const {eventBody, category, place, guide, country} = await createEventProperty(body);
        eventBody.travelAgency = {_id: req.user._id};
        eventBody.isBanned = false;
        eventBody.isApproved = false;

        const event = new Event(eventBody);
        await event.save();

        for (const cat of category) {
            cat.event.push({_id: event._id});
            await cat.save();
        }
        for (const plc of place) {
            plc.event.push({_id: event._id});
            await plc.save();
        }
        country.event.push({_id: event._id});
        await country.save();

        req.user.event.push({_id: event._id});
        await req.user.save();

        for (const gd of guide) {
            gd.guidedEvent.push({_id: event._id});
            await gd.save();
        }

        await event.populate("travelAgency._id").populate("category._id").populate("place._id").populate("guide._id").populate("country._id").populate({
            path: "dayPlan._id",
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        }).execPopulate();

        res.status(200).send(event);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const updateEvent = async (req, res) => {
    const fields = [
        "name", 
        "description", 
        "banner", 
        "imageURL", 
        "videoURL", 
        "groupOption", 
        "duration", 
        "inclusion", 
        "minimumAge", 
        "maximumAge", 
        "childAllowed", 
        "physicalRating", 
        "participantLimit", 
        "accomodationOption", 
        "category", 
        "totalCost", 
        "possibleAdditionalCost", 
        "dayPlan", 
        "country", 
        "place", 
        "guide", 
        "planFileURL", 
        "agreementFileURL"
    ];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const event = await Event.findById(req.query.id).populate("travelAgency._id").populate("category._id").populate("place._id").populate("guide._id").populate("country._id").populate({
            path: "dayPlan._id",
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        });

        if (event.travelAgency._id._id.toString() !== req.user._id.toString()) {
            throw new Error("You are not allowed to update this event");
        }

        await removeEventProperty(event);
        const {eventBody, category, place, guide, country} = await createEventProperty(body);

        for (const key of Object.keys(eventBody)) {
            event[key] = eventBody[key];
        }
        await event.save();

        for (const cat of category) {
            cat.event.push({_id: event._id});
            await cat.save();
        }
        for (const plc of place) {
            plc.event.push({_id: event._id});
            await plc.save();
        }
        country.event.push({_id: event._id});
        await country.save();

        for (const gd of guide) {
            gd.guidedEvent.push({_id: event._id});
            await gd.save();
        }

        res.status(200).send();
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const removeEvent = async (req, res) => {
    try {
        const event = await Event.findById(req.query.id);

        await removeEventProperty(event);

        for (const userId of event.enrolledUser) {
            const user = await User.findById(userId._id);
            let index = -1;
            for (let i = 0; i < user.enrolledEvent.length; i++) {
                if (user.enrolledEvent[i]._id === event._id) {
                    index = i;
                }
            }
            user.enrolledEvent.splice(index, 1);
            await user.save();
        }

        const users = await User.find();
        for (const user of users) {
            let index = -1;
            for (let i = 0; i < user.savedEvent.length; i++) {
                if (user.savedEvent[i]._id === event._id) {
                    index = i;
                }
            }
            if (index !== -1) {
                user.savedEvent.splice(index, 1);
            }
            await user.save();
        }

        let index = -1;
        for (let i = 0; i < req.user.event.length; i++) {
            if (req.user.event[i]._id === event._id) {
                index = i;
            }
        }
        req.user.event.splice(index, 1);
        await req.user.save();

        await Event.findByIdAndRemove(event._id);

        res.status(200).send({
            message: 'Event is Removed Successfully'
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getEventById = async (req, res) => {
    try {
        const event = await Event.findById(req.params.id).populate("travelAgency._id").populate("category._id").populate("place._id").populate("guide._id").populate("country._id").populate({
            path: "dayPlan._id",
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        });

        res.status(200).send(event);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getMyEventsEvent = async (req, res) => {
    try {
        let eventData = [];
        if (Object.keys(req.user.toObject()).includes("guidedEvent")) {
            await req.user.populate("guidedEvent._id").execPopulate();
            eventData = req.user.guidedEvent;
        }
        else {
            await req.user.populate("event._id").execPopulate();
            eventData = req.user.event;
        }

        const events = [];
        for (const event of eventData) {
            const value = event._id;
            await value.populate("travelAgency._id").populate("category._id").populate("place._id").populate("guide._id").populate("country._id").populate({
                path: "dayPlan._id",
                populate: {
                    path: "timePlan._id",
                    populate: {
                        path: "area._id",
                    }
                }
            }).execPopulate();

            events.push(value);
        }

        res.status(200).send(events);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getManyEvent = async (req, res) => {
    const fields = [
        "durationSort",
        "costSort",
        "participantSort",
        "date",
        "roomSize",
        "accomodationQuality",
        "groupOption",
        "inclusion",
        "childAllowed",
        "physicalRating",
        "accomodationOption",
        'date',
        "participantLimit",
        "duration",
        "age",
        'cost',
        "category",
        "country",
        "place",
        "limit",
        "skip",
    ];

    try {
        const isValid = checkValidBody(req.body, fields);
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
            'inclusion': {$in: req.query.inclusion},
            'physicalRating': {$in: req.query.physicalRating},
            'accomodationOption': {$in: req.query.accomodationOption},
            'childAllowed': req.query.childAllowed,
            minimumAge: { $gte: +req.query.age[0], $lte: +req.query.age[1] },
            maximumAge: { $gte: +req.query.age[0], $lte: +req.query.age[1] },
            duration: { $gte: +req.query.duration[0], $lte: +req.query.duration[1] },
            participantLimit: { $gte: +req.query.participantLimit[0], $lte: +req.query.participantLimit[1] },
            totalCost: { $gte: +req.query.cost[0], $lte: +req.query.cost[1] },
        };
        if (req.query.category.length > 0) {
            queryMatcher['category._id'] = {$in: req.query.category};
        }
        if (req.query.country.length > 0) {
            queryMatcher['country._id'] = {$in: req.query.country};
        }
        if (req.query.place.length > 0) {
            queryMatcher['place._id'] = {$in: req.query.place};
        }
    
        const events = await Event.find(queryMatcher).sort(options).skip(+req.query.skip).limit(+req.query.limit).populate("travelAgency._id").populate("category._id").populate("place._id").populate("guide._id").populate("country._id").populate({
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

        res.status(200).send(events);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const changeEnrollEvent = async (req, res) => {
    const fields = ["isEnrolled"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const event = await Event.findById(req.query.id).populate("travelAgency._id").populate("category._id").populate("place._id").populate("guide._id").populate("country._id").populate({
            path: "dayPlan._id",
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        });
        
        if (body.isEnrolled) {
            req.user.enrolledEvent.push({_id: event._id});
            event.enrolledUser.push({_id: req.user._id});
        } 
        else {
            let index = -1;
            for (let i = 0; i < req.user.enrolledEvent.length; i++) {
                if (req.user.enrolledEvent[i]._id.toString() === event._id.toString()) {
                    index = i;
                }
            }
            req.user.enrolledEvent.splice(index, 1);

            index = -1;
            for (let i = 0; i < event.enrolledUser.length; i++) {
                if (event.enrolledUser[i]._id.toString() === req.user._id.toString()) {
                    index = i;
                }
            }
            event.enrolledUser.splice(index, 1);
        }

        await req.user.save();
        await event.save();

        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const changeSaveEvent = async (req, res) => {
    const fields = ["isSaved"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const event = await Event.findById(req.query.id).populate("travelAgency._id").populate("category._id").populate("place._id").populate("guide._id").populate("country._id").populate({
            path: "dayPlan._id",
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        });
        
        if (body.isSaved) {
            req.user.savedEvent.push({_id: event._id});
        } 
        else {
            let index = -1;
            for (let i = 0; i < req.user.savedEvent.length; i++) {
                if (req.user.savedEvent[i]._id.toString() === event._id.toString()) {
                    index = i;
                }
            }
            req.user.savedEvent.splice(index, 1);
        }

        await req.user.save();

        res.status(200).send(req.user);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const changeApproveEvent = async (req, res) => {
    const fields = ["isApproved"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const event = await Event.findById(req.query.id).populate("travelAgency._id").populate("category._id").populate("place._id").populate("guide._id").populate("country._id").populate({
            path: "dayPlan._id",
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        });
        event.isApproved = body.isApproved;
        await event.save();

        res.status(200).send(event);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const changeBanEvent = async (req, res) => {
    const fields = ['isBanned'];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const event = await Event.findById(req.query.id).populate("travelAgency._id").populate("category._id").populate("place._id").populate("guide._id").populate("country._id").populate({
            path: "dayPlan._id",
            populate: {
                path: "timePlan._id",
                populate: {
                    path: "area._id",
                }
            }
        });
        event.isBanned = body.isBanned;
        await event.save();

        res.status(200).send(event);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const eventController = {
    createEvent,
    updateEvent,
    removeEvent,
    getEventById,
    getMyEventsEvent,
    getManyEvent,
    changeEnrollEvent,
    changeSaveEvent,
    changeApproveEvent,
    changeBanEvent,
};

module.exports = eventController;