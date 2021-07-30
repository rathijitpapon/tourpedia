import httpService from "./httpService";

const baseURL = process.env.REACT_APP_API_BASE_URL + "/explore";

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
    getExploreByName,
    getAllExplore,
};

export default exploreService;