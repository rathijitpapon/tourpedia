import axios from "axios";
import logService from "./logService";

axios.defaults.baseUrl = process.env.REACT_APP_API_BASE_URL;

axios.interceptors.response.use(null, error => {
    const expectedError =
      error.response &&
      error.response.status >= 400 &&
      error.response.status < 500;
  
    if (!expectedError) {
      console.log("logging the error", error);
      logService.log(error);
    }
  
    return Promise.reject(error);
});

const httpService = {
    get: axios.get,
    post: axios.post,
    patch: axios.patch,
    delete: axios.delete,
    put: axios.put,
};

export default httpService;