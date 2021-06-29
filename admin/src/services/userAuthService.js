import httpService from "./httpService";
import authService from "./authService";

import config from "../config/config.json";

const baseURL = config.apiBaseURL + "/user/admin";

const getSavedAuthInfo = () => {
    if (authService.getCurrentUser()) {
        return {
            email: authService.getEmail(),
            fullname: authService.getFullname(),
        };
    }
    return false;
}

const getAuth = () => {
    const url = `${baseURL}/auth`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.get(url, {}).then(res => {
        return {
            status: res.status,
            user: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: 'Unauthorized',
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const signin = (email, password) => {
    const url = `${baseURL}/signin`;

    const response = httpService.post(url, {
        email,
        password,
    }).then(res => {
        res.data.user = res.data.admin;
        authService.uiLogin(
            res.data.token, 
            res.data.user.email, 
            res.data.user.fullname,
        );
        return {
            status: res.status,
            user: res.data.user,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: 'Email or Password is incorrect',
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const signout = () => {
    const url = `${baseURL}/signout`;

    httpService.setJWT(authService.getJWT());
    authService.uiLogout();
    const response = httpService.get(url, {}).then(res => {
        return {
            status: res.status,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: 'Email or Username is already exist',
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const getProfile = () => {
    const url = `${baseURL}/profile`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.get(url, {}).then(res => {
        return {
            status: res.status,
            user: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Username isn't found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const userAuthService = {
    getSavedAuthInfo,
    getAuth,
    signin,
    signout,
    getProfile,
};

export default userAuthService;