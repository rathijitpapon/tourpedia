import httpService from "./httpService";

const baseURL = "api";

const getData = (campaignId) => {
    const url = `${baseURL}/`;

    const response = httpService.get(url, {}).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response.status >= 500) {
            return {
                status: error.response.status,
                message: "Unexpected server error.",
            };
        }
        return {
            status: error.response.status,
            message: error.response.data.message,
        };
    });

    return response;
};

const dummyService = {
    getData,
};

export default dummyService;