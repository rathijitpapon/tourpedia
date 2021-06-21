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

        const category = await Category.findById(req.query.id).populate('place._id').exec();
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
        }).populate('place._id').exec();
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
        const categories = await Category.find().populate('place._id').exec();

        res.status(200).send(categories);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const deleteCategory = async (req, res) => {
    const fields = ["name"];

    try {
        const isValid = checkValidBody(req.query, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.query, fields);

        await Category.findOneAndDelete({
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

const categoryController = {
    createCategory,
    updateCategory,
    getCategoryByName,
    getAllCategory,
    deleteCategory,
};

module.exports = categoryController;