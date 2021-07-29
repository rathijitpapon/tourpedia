import jwtDecode from "jwt-decode";

const tokenKey = "token";
const userKey = "user";
const userIdKey = "userId"

const uiLogin = (jwt, username,userId) => {
    localStorage.setItem(tokenKey, jwt);
    localStorage.setItem(userKey, username);
    localStorage.setItem(userIdKey, userId);
}

const uiLogout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    localStorage.removeItem(userIdKey);
}

const getJWT = () => {
    return localStorage.getItem(tokenKey);
}

const getUser = () => {
    return localStorage.getItem(userKey);
}

const getUserId = () => {
    return localStorage.getItem(userIdKey);
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
    getUserId,
}

export default authService;