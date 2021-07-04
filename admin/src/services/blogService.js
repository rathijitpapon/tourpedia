import httpService from "./httpService";
import authService from "./authService";

import config from "../config/config.json";

const baseURL = config.apiBaseURL + "/blog/blog";

const createBlog = (title, description, imageURL, videoURL, country, place, category) => {
    const url = `${baseURL}/create`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        title,
        description,
        imageURL,
        videoURL,
        country,
        place, 
        category,
    }).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Unauthorized",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const editBlog = (title, description, imageURL, videoURL, blogId) => {
    const url = `${baseURL}/update?id=${blogId}`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        title,
        description,
        imageURL,
        videoURL,
    }).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Unauthorized",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const deleteBlog = (blogId) => {
    const url = `${baseURL}/remove?id=${blogId}`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.delete(url, {}).then(res => {
        return {
            status: res.status,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Unauthorized",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const getManyBlogs = (category, country) => {
    const url = `${baseURL}/many`;

    const response = httpService.get(url, {
        params: {
            skip: 0,
            limit: 10000000000,
            upvote: 1,
            date: 1,
            category: category,
            country: country,
        }
    }).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Unauthorized",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const getBlogById = (id) => {
    const url = `${baseURL}/${id}`;
    
    const response = httpService.get(url, {}).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Unauthorized",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const blogService = {
    createBlog,
    editBlog,
    deleteBlog,
    getManyBlogs,
    getBlogById,
};

export default blogService;