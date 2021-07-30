import httpService from "./httpService";
import authService from "./authService";

const baseURL = process.env.REACT_APP_API_BASE_URL + "/event/event";

const createEvent = (event) => {
    const url = `${baseURL}/create`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, event).then(res => {
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

const editEvent = (event, eventId) => {
    const url = `${baseURL}/update?id=${eventId}`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, event).then(res => {
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

const deleteEvent = (eventId) => {
    const url = `${baseURL}/remove?id=${eventId}`;

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

const getGuidedEvents = () => {
    const url = `${baseURL}/guidedevent`;

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

const getManyEvents = () => {
    const url = `${baseURL}/myevent`;

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

const eventService = {
    createEvent,
    editEvent,
    deleteEvent,
    getGuidedEvents,
    getManyEvents,
    getEventById,
};

export default eventService;