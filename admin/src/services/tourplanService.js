import httpService from "./httpService";
import authService from "./authService";

const baseURL = process.env.REACT_APP_API_BASE_URL + "/pedia/tourplan";

const createTourPlan = (tourPlan) => {
    const url = `${baseURL}/create`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, tourPlan).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Unauthorized",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const editTourPlan = (tourPlan, tourPlanId) => {
    const url = `${baseURL}/update?id=${tourPlanId}`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, tourPlan).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Unauthorized",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const deleteTourPlan = (tourPlanId) => {
    const url = `${baseURL}/remove?id=${tourPlanId}`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.delete(url, {}).then(res => {
        return {
            status: res.status,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Unauthorized",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const getManyTourPlans = () => {
    const url = `${baseURL}/all`;

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
    createTourPlan,
    editTourPlan,
    deleteTourPlan,
    getManyTourPlans,
    getTourPlanById,
};

export default tourPlanService;