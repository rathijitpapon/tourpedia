import httpService from "./httpService";
import authService from "./authService";

import config from "../config/config.json";

const baseURL = config.apiBaseURL + "/pedia/pedia";

const createPedia = (imageURL, videoURL, area, food, country, place) => {
    const url = `${baseURL}/create`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        imageURL,
        videoURL,
        area,
        food,
        country,
        place,
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

const editPedia = (imageURL, videoURL, area, food, pediaId) => {
    const url = `${baseURL}/update?id=${pediaId}`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        imageURL,
        videoURL,
        area,
        food,
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

const getManyPedias = () => {
    const url = `${baseURL}/many`;

    const response = httpService.get(url, {
        params: {
            skip: 0,
            limit: 10000000000,
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
                message: "No Pedia Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const getPediaById = (id) => {
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
                message: "Pedia Not Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const pediaService = {
    createPedia,
    editPedia,
    getManyPedias,
    getPediaById,
};

export default pediaService;