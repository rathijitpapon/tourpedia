import httpService from "./httpService";
import authService from "./authService";


const baseURL = process.env.REACT_APP_API_BASE_URL + "/pedia/tourplan";

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

const saveTourplan = (id, isSaved) => {
    const url = `${baseURL}/save/?id=${id}`;
    
    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        isSaved,
    }).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Tour Plan Not Found",
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
    saveTourplan,
};

export default tourPlanService;