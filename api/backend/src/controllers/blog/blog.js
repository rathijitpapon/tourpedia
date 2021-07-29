const { Blog } = require("../../models/blog");
const {Category, Country, Place } = require("../../models/explore");
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

const createBlog = async (req, res) => {
    const fields = ["title", "description", "imageURL", "videoURL", "country", "place", "category"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        let body = convertValidBody(req.body, fields);

        const category = [];
        for (const cat of body.category) {
            const data = await Category.findById(cat);
            category.push(data);
        }
        const country = await Country.findById(body.country);
        const place = [];
        for (const plc of body.place) {
            const data = await Place.findById(plc);
            place.push(data);
        }

        body.category = [];
        for (const cat of category) {
            body.category.push({_id: cat._id});
        }
        body.country = {};
        body.country._id = country._id;
        body.place = [];
        for (const plc of place) {
            body.place.push({_id: plc._id});
        }
        
        body.date = new Date();
        body.upvote = 0;
        body.downvote = 0;
        body.isApproved = true;
        body.isBanned = false;

        let blog = new Blog(body);
        await blog.save();
        blog = await Blog.findById(blog._id).populate('country._id').populate('category._id').populate('place._id').exec();

        country.blog.push({
            _id: blog._id,
        });
        await country.save();

        for (const cat of category) {
            cat.blog.push({
                _id: blog._id,
            });
            await cat.save();
        }

        for (const plc of place) {
            plc.blog.push({
                _id: blog._id,
            });
            await plc.save();
        }

        res.status(200).send(blog);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const updateBlog = async (req, res) => {
    const fields = ["title", "description", "imageURL", "videoURL"];

    try {
        const isValid = checkValidBody(req.body, fields);
        if (!isValid) {
            throw new Error("Invalid Fields");
        }
        const body = convertValidBody(req.body, fields);

        const blog = await Blog.findById(req.query.id).populate('country._id').populate('category._id').populate('place._id').exec();
        if (!blog) {
            throw new Error("Blog Not Found");
        }

        for (field of fields) {
            blog[field] = body[field];
        }
        blog.date = new Date();
        await blog.save();

        res.status(200).send(blog);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('country._id').populate('category._id').populate('place._id').exec();
        if (!blog) {
            throw new Error("Blog Not Found");
        }

        res.status(200).send(blog);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const getManyBlog = async (req, res) => {
    try {
        const options = {
            upvote: +req.query.upvote,
            date: +req.query.date,
        }

        const queryMatcher = {};
        if (Object.keys(req.query).includes("category") && req.query.category.length > 0) {
            queryMatcher['category._id'] = {$in: req.query.category};
        }
        if (Object.keys(req.query).includes("country") && req.query.country.length > 0) {
            queryMatcher['country._id'] = {$in: req.query.country};
        }

        const blogs = await Blog.find(queryMatcher).sort(options).skip(+req.query.skip).limit(+req.query.limit).exec();

        res.status(200).send(blogs);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.query.id);
        if (!blog) {
            throw new Error("Blog Not Found");
        }

        for (const cat of blog.category) {
            const data = await Category.findById(cat._id);
            let index = -1;
            for (let i = 0; i < data.blog.length; i++) {
                if (data.blog[i]._id.toString() === blog._id.toString()) {
                    index = i;
                }
            }
            data.blog.splice(index, 1);
            await data.save();
        }

        const data = await Country.findById(blog.country._id);
        let index = -1;
        for (let i = 0; i < data.blog.length; i++) {
            if (data.blog[i]._id.toString() === blog._id.toString()) {
                index = i;
            }
        }
        data.blog.splice(index, 1);
        await data.save();

        for (const plc of blog.place) {
            const data = await Place.findById(plc._id);
            let index = -1;
            for (let i = 0; i < data.blog.length; i++) {
                if (data.blog[i]._id.toString() === blog._id.toString()) {
                    index = i;
                }
            }
            data.blog.splice(index, 1);
            await data.save();
        }

        await Blog.findByIdAndDelete(blog._id);

        res.status(200).send({
            message: "successfully deleted",
        });
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const upvoteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.query.id).populate('country._id').populate('category._id').populate('place._id').exec();
        if (!blog) {
            throw new Error("Blog Not Found");
        }

        req.user.upvotedBlog.push({_id: blog._id});
        await req.user.save();
        blog.upvote++;
        await blog.save();

        res.status(200).send(blog);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const downvoteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.query.id).populate('country._id').populate('category._id').populate('place._id').exec();
        if (!blog) {
            throw new Error("Blog Not Found");
        }

        let index = -1;
        for (let i = 0; i < req.user.upvotedBlog.length; i++) {
            if (req.user.upvotedBlog[i]._id.toString() === blog._id.toString()) {
                index = i;
            }
        }
        req.user.upvotedBlog.splice(index, 1);
        await req.user.save();
        blog.upvote--;
        await blog.save();

        res.status(200).send(blog);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const saveBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.query.id).populate('country._id').populate('category._id').populate('place._id').exec();
        if (!blog) {
            throw new Error("Blog Not Found");
        }

        req.user.savedBlog.push({_id: blog._id});
        await req.user.save();

        res.status(200).send(blog);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const unsaveBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.query.id).populate('country._id').populate('category._id').populate('place._id').exec();
        if (!blog) {
            throw new Error("Blog Not Found");
        }

        let index = -1;
        for (let i = 0; i < req.user.savedBlog.length; i++) {
            if (req.user.savedBlog[i]._id.toString() === blog._id.toString()) {
                index = i;
            }
        }
        req.user.savedBlog.splice(index, 1);
        await req.user.save();

        res.status(200).send(blog);
    } catch (error) {
        res.status(400).send({
            message: error.message,
        });
    }
}

const blogController = {
    createBlog,
    updateBlog,
    getBlogById,
    getManyBlog,
    deleteBlog,
    upvoteBlog,
    downvoteBlog,
    saveBlog,
    unsaveBlog,
};

module.exports = blogController;