import httpService from "./httpService";
import authService from "./authService";

const baseURL = process.env.REACT_APP_API_BASE_URL + "/event/event";

const changeApproveEvent = (eventId, isApproved) => {
    const url = `${baseURL}/approve?id=${eventId}`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        isApproved
    }).then(res => {
        return {
            status: res.status,
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

const changeBanEvent = (eventId, isBanned) => {
    const url = `${baseURL}/ban?id=${eventId}`;

    httpService.setJWT(authService.getJWT());
    const response = httpService.post(url, {
        isBanned
    }).then(res => {
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

const getManyEvents = (queryMatcher) => {
    const url = `${baseURL}/many`;

    httpService.setJWT(authService.getJWT());
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

const eventService = {
    changeApproveEvent,
    changeBanEvent,
    getManyEvents,
};

export default eventService;