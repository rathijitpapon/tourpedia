import jwtDecode from "jwt-decode";

const tokenKey = "token";
const userKey = "user";

const uiLogin = (jwt, username) => {
    localStorage.setItem(tokenKey, jwt);
    localStorage.setItem(userKey, username);
}

const uiLogout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
}

const getJWT = () => {
    return localStorage.getItem(tokenKey);
}

const getUser = () => {
    return localStorage.getItem(userKey);
}

const getCurrentUser = () => {
    try {
        const jwt = getJWT();
        return jwtDecode(jwt);
    } catch (e) {
        return null;
    }
}

const authService = {
    uiLogin,
    uiLogout,
    getJWT,
    getUser,
    getCurrentUser,
}

export default authService;