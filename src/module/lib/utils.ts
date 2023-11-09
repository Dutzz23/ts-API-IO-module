/**
 * @param string
 * @returns {string}
 */
export function capitalizeFirstLetter(string: string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

//Todo check with apiConfig.isAuthenticated and move it to Layout.js
export function isLoggedIn(setDisplayLoginForm: any) {
    if (localStorage.getItem("token") === null) {
        setDisplayLoginForm(true);
        return false;
    }
    return true;
}

export function parseJwt(token: string) {
    let base64Url = token.split('.')[1];
    let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    let jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

/**
 * Transforms a string to it's camelCase form
 * @param {string} str
 * @returns {string}
 */
export function camelize(str: string) {
    return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (word, index) {
        return index === 0 ? word.toLowerCase() : word.toUpperCase();
    }).replace(/\s+/g, '');
}