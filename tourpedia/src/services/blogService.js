import httpService from "./httpService";

import config from "../config/config.json";

const baseURL = config.apiBaseURL + "/blog/blog";

const getManyBlogs = (category, country, date, upvote) => {
    const url = `${baseURL}/many`;

    const response = httpService.get(url, {
        params: {
            skip: 0,
            limit: 10000000000,
            upvote: upvote,
            date: date,
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
                message: "No Blog Found",
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
                message: "Blog Not Found",
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
    getManyBlogs,
    getBlogById,
};

export default blogService;