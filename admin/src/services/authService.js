import jwtDecode from "jwt-decode";

const tokenKey = "token";
const emailKey = "email";
const fullnameKey = "fullname";

const uiLogin = (jwt, email, fullname) => {
    localStorage.setItem(tokenKey, jwt);
    localStorage.setItem(emailKey, email);
    localStorage.setItem(fullnameKey, fullname);
}

const uiLogout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(emailKey);
    localStorage.removeItem(fullnameKey);
}

const getJWT = () => {
    return localStorage.getItem(tokenKey);
}

const getEmail = () => {
    return localStorage.getItem(emailKey);
}

const getFullname = () => {
    return localStorage.getItem(fullnameKey);
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
    getEmail,
    getFullname,
    getCurrentUser,
}

export default authService;