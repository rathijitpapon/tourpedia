const { Category } = require("../../models/explore");

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

const createCategory = async (req, res) => {
    const fields = ["name", "description", "banner"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const category = new Category(body);
        await category.save();

        res.status(200).send(category);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const updateCategory = async (req, res) => {
    const fields = ["name", "description", "banner"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const category = await Category.findById(req.query.id).populate('place._id').populate('blog._id').populate('tourPlan._id').populate('event._id').exec();
        if (!category) {
            throw new Error("Category Not Found");
        }

        for (field of fields) {
            category[field] = body[field];
        }
        await category.save();

        res.status(200).send(category);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getCategoryByName = async (req, res) => {
    const fields = ["name"];

    try {
        const isValid = checkValidBody(req.query, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.query, fields);

        const category = await Category.findOne({
            name: body.name
        }).populate('place._id').populate('blog._id').populate({
            path: 'tourPlan._id',
            populate: [
                {
                    path: 'place._id',
                },
                {
                    path: 'category._id',
                },
                {
                    path: 'country._id',
                },
                {
                    path: "dayPlan._id",
                    populate: {
                        path: "timePlan._id",
                        populate: {
                            path: "area._id",
                        }
                    }
                }
            ],
        }).populate({
            path: 'event._id',
            populate: [
                {
                    path: 'place._id',
                },
                {
                    path: 'category._id',
                },
                {
                    path: 'country._id',
                },
                {
                    path: 'guide._id',
                },
                {
                    path: 'travelAgency._id',
                },
                {
                    path: "dayPlan._id",
                    populate: {
                        path: "timePlan._id",
                        populate: {
                            path: "area._id",
                        }
                    }
                }
            ],
        }).populate('travelAgency._id').exec();
        if (!category) {
            throw new Error("Category Not Found");
        }

        res.status(200).send(category);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getAllCategory = async (req, res) => {
    try {
        const categories = await Category.find().populate('place._id').populate('blog._id').populate('tourPlan._id').populate('event._id').populate('travelAgency._id').exec();

        res.status(200).send(categories);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const categoryController = {
    createCategory,
    updateCategory,
    getCategoryByName,
    getAllCategory,
};

module.exports = categoryController;