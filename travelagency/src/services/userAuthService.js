import httpService from "./httpService";
import authService from "./authService";

import config from "../config/config.json";

const tarvelAgencyBaseURL = config.apiBaseURL + "/user/travelagency";
const guideBaseURL = config.apiBaseURL + "/user/guide";

const getSavedAuthInfo = () => {
    if (authService.getCurrentUser()) {
        return {
            username: authService.getUser(),
            fullname: authService.getFullname(),
            profileImage: authService.getProfileImage(),
            isAgency: authService.getIsAgency(),
        };
    }
    return false;
}

const getAuth = (isAgency) => {
    let url = isAgency === 'agency' ? tarvelAgencyBaseURL : guideBaseURL;
    url = `${url}/auth`;

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

const signin = (email, password, isAgency) => {
    let url = isAgency === 'agency' ? tarvelAgencyBaseURL : guideBaseURL;
    url = `${url}/signin`;

    const response = httpService.post(url, {
        email,
        password,
    }).then(res => {
        res.data.user = isAgency === 'agency' ? res.data.travelAgency : res.data.guide;
        authService.uiLogin(
            res.data.token, 
            res.data.user.username, 
            res.data.user.fullname, 
            res.data.user.profileImage, 
            isAgency
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

const signup = (username, email, password, fullname, isAgency) => {
    let url = isAgency === 'agency' ? tarvelAgencyBaseURL : guideBaseURL;
    url = `${url}/signup`;

    if (isAgency === 'guide') {
        httpService.setJWT(authService.getJWT());
    }
    const response = httpService.post(url, {
        username,
        email,
        password,
        fullname,
    }).then(res => {
        res.data.user = isAgency === 'agency' ? res.data.travelAgency : res.data.guide;
        if (isAgency === 'agency') {
            authService.uiLogin(
                res.data.token, 
                res.data.user.username, 
                res.data.user.fullname, 
                res.data.user.profileImage, 
                isAgency
            );
        }
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

const signout = (isAgency) => {
    let url = isAgency === 'agency' ? tarvelAgencyBaseURL : guideBaseURL;
    url = `${url}/signout`;

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

const getProfile = (username, isAgency) => {
    let url = isAgency === 'agency' ? tarvelAgencyBaseURL : guideBaseURL;
    url = `${url}/profile/${username}`;

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

const removeGuide = (guideId) => {
    let url = `${guideBaseURL}/remove?id=${guideId}`;

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
                message: 'Guide Not Found',
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const updateProfile = (fullname, about, profileImage, category, isAgency) => {
    let url = isAgency === 'agency' ? tarvelAgencyBaseURL : guideBaseURL;
    url = `${url}/profile`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        fullname,
        about,
        profileImage,
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
    removeGuide,
    updateProfile,
};

export default userAuthService;