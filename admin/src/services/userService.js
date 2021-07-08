import httpService from "./httpService";
import authService from "./authService";

import config from "../config/config.json";

const baseURL = config.apiBaseURL + "/user/general";

const getAllUsers = () => {
    const url = `${baseURL}/all`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.get(url, {}).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "No User Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const updateBanStatus = (isBanned, userId) => {
    const url = `${baseURL}/ban/update?id=${userId}`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        isBanned,
    }).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "No User Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const userService = {
    getAllUsers,
    updateBanStatus,
};

export default userService;