import httpService from "./httpService";
import authService from "./authService";

import config from "../config/config.json";

const baseURL = config.apiBaseURL + "/user/general";

const getSavedAuthInfo = () => {
    if (authService.getCurrentUser()) {
        return authService.getUser();
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
        authService.uiLogin(res.data.token, res.data.user.username, res.data.user._id);
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

const signup = (username, email, password, fullname) => {
    const url = `${baseURL}/signup`;

    const response = httpService.post(url, {
        username,
        email,
        password,
        fullname,
    }).then(res => {
        authService.uiLogin(res.data.token, res.data.user.username, res.data.user._id);
        return {
            status: res.status,
            user: res.data.user,
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

const getProfile = (username) => {
    const url = `${baseURL}/profile/${username}`;

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

const updateProfile = (fullname, about, profileImage) => {
    const url = `${baseURL}/profile`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        fullname,
        about,
        profileImage,
    }).then(res => {
        return {
            status: res.status,
            data: res.data,
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

const userAuthService = {
    getSavedAuthInfo,
    getAuth,
    signin,
    signup,
    signout,
    getProfile,
    updateProfile,
};

export default userAuthService;