import httpService from "./httpService";

const baseURL = process.env.REACT_APP_API_BASE_URL + "/pedia/pedia";

const getManyPedias = () => {
    const url = `${baseURL}/many`;

    const response = httpService.get(url, {
        params: {
            skip: 0,
            limit: 10000000000,
        }
    }).then(res => {
        return {
            status: res.status,
            data: res.data,
        };
    }).catch(error => {
        if(error.response && error.response.status <= 500) {
            return {
                status: error.response.status,
                message: "No Pedia Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const getPediaById = (id) => {
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
                message: "Pedia Not Found",
            };
        }
        return {
            status: 500,
            message: "Unexpected server error",
        };
    });

    return response;
};

const pediaService = {
    getManyPedias,
    getPediaById,
};

export default pediaService;