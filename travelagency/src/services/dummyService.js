import httpService from "./httpService";
import config from "../config/config.json";

const baseURL = config.apiBaseURL;

const getData = (campaignId) => {
    const url = `${baseURL}/travelagency`;

    const response = httpService.get(url, {}).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: error.response.data.message,
            };
        }
        return {
            status: 500,
            message: "Unexpected server error.",
        };
    });

    return response;
};

const dummyService = {
    getData,
};

export default dummyService;