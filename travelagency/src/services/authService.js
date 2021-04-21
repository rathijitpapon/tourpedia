import jwtDecode from "jwt-decode";

const tokenKey = "token";
const userKey = "user";
const fullnameKey = "fullname";
const profileImageKey = "image";
const isAgencyKey = "isAgency";

const uiLogin = (jwt, username, fullname, profileImage, isAgency) => {
    localStorage.setItem(tokenKey, jwt);
    localStorage.setItem(userKey, username);
    localStorage.setItem(fullnameKey, fullname);
    localStorage.setItem(profileImageKey, profileImage);
    localStorage.setItem(isAgencyKey, isAgency);
}

const uiLogout = () => {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(userKey);
    localStorage.removeItem(fullnameKey);
    localStorage.removeItem(profileImageKey);
    localStorage.removeItem(isAgencyKey);
}

const getJWT = () => {
    return localStorage.getItem(tokenKey);
}

const getUser = () => {
    return localStorage.getItem(userKey);
}

const getFullname = () => {
    return localStorage.getItem(fullnameKey);
}

const getProfileImage = () => {
    return localStorage.getItem(profileImageKey);
}

const getIsAgency = () => {
    return localStorage.getItem(isAgencyKey);
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
    getFullname,
    getProfileImage,
    getIsAgency,
    getCurrentUser,
}

export default authService;