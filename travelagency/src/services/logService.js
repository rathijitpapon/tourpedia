// import Raven from "raven-js";

const init = () => {
    // Raven.config("", {
    //     release: "1-0-0",
    //     environment: "development-test"
    //   }).install();
};
  
const log = (error) => {
    console.log(error);
    // Raven.captureException(error);
};

const logService = {
    init,
    log,
};

export default logService;