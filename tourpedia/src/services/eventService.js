import httpService from "./httpService";
import authService from "./authService";

import config from "../config/config.json";

const baseURL = config.apiBaseURL + "/event/event";

const getManyEvents = (queryMatcher) => {
    const url = `${baseURL}/many`;

    const response = httpService.get(url, {
        params: queryMatcher
    }).then(res => {
        const filteredData = res.data.filter(event => {
            return (
                event.isApproved && 
                !event.isBanned
            );
        });
        return {
            status: res.status,
            data: filteredData,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "No Event Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const getEventById = (id) => {
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
                message: "Event Not Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const saveEvent = (id, isSaved) => {
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
                message: "Event Not Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const enrollEvent = (id, isEnrolled) => {
    const url = `${baseURL}/enroll/?id=${id}`;
    
    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        isEnrolled,
    }).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "Event Not Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const eventService = {
    getManyEvents,
    getEventById,
    saveEvent,
    enrollEvent,
};

export default eventService;