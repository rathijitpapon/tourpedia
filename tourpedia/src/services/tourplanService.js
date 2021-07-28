import httpService from "./httpService";

import config from "../config/config.json";

const baseURL = config.apiBaseURL + "/pedia/tourplan";

const getManyTourPlans = (queryMatcher) => {
    const url = `${baseURL}/many`;

    const response = httpService.get(url, {
        params: queryMatcher
    }).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "No TourPlan Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const getTourPlanById = (id) => {
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
                message: "TourPlan Not Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const tourPlanService = {
    getManyTourPlans,
    getTourPlanById,
};

export default tourPlanService;