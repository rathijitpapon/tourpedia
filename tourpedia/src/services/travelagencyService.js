import httpService from "./httpService";


const tarvelAgencyBaseURL = process.env.REACT_APP_API_BASE_URL + "/user/travelagency";
const guideBaseURL = process.env.REACT_APP_API_BASE_URL + "/user/guide";

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

const getManyTravelAgency = (category) => {
    const url = `${tarvelAgencyBaseURL}/many`;

    const response = httpService.get(url, {
        params: {
            category,
        },
    }).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Category isn't found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
}

const userAuthService = {
    getProfile,
    getManyTravelAgency,
};

export default userAuthService;