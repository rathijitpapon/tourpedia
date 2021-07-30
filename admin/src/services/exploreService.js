import httpService from "./httpService";
import authService from "./authService";

const baseURL = process.env.REACT_APP_API_BASE_URL + "/explore";

const uploadExplore = (name, description, banner, explore, country, category) => {
    const url = `${baseURL}/${explore}/create`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        name,
        description,
        banner,
        country,
        category
    }).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Authentication Error",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const updateExplore = (name, description, banner, explore, id) => {
    const url = `${baseURL}/${explore}/update?id=${id}`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        name,
        description,
        banner,
    }).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Authentication Error",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const getExploreByName = (name, explore) => {
    const url = `${baseURL}/${explore}?name=${name}`;

    const response = httpService.get(url, {}).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "No Explore Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const getAllExplore = (explore) => {
    const url = `${baseURL}/${explore}/all`;

    const response = httpService.get(url, {}).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "No Explore Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const exploreService = {
    uploadExplore,
    updateExplore,
    getExploreByName,
    getAllExplore,
};

export default exploreService;