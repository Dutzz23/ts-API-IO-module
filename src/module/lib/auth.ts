import EndpointsAbstract from "./EndpointsAbstract";
import AuthConfig from "../config/AuthConfig";
import axios, {AxiosResponse} from "axios";
import Request from "./request";

class Auth extends EndpointsAbstract {

    static api = new Request(true);


    public static refreshToken = () => axios.get('/refresh', {
        //TODO handle refresh using token expiration time
        withCredentials: true
    })
        .then((response: AxiosResponse<any>) => {
            if (response.status === 200) AuthConfig.token = response.data.token;
        })
        .catch((error) => {
            Auth.removeToken();
            console.error(error);
        });

    public static setToken = (token: string) => {
        if (token) {
            // Set the authorization header for all requests if the token is present
            this.api.httpClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
            // Save the token to local storage mechanism
            AuthConfig.token = token;
        } else {
            // Remove the authorization header if the token is null
            delete this.api.httpClient.defaults.headers.common['Authorization'];
            // Clear the token from storage mechanism
            AuthConfig.token = null;
        }
    }

    public static removeToken = () => {
        AuthConfig.token = null;
        AuthConfig.userId = null;
        AuthConfig.tokenExpirationTime = 0;
        AuthConfig.isAuthenticated = false;
    }

    public register = (credentials) => this.createByIriRequest("/signup", credentials)
        .then((response: AxiosResponse<any>) => {
            //TODO check request status
            Auth.setToken(response.data.token)
        })
        .catch((error) => {
            console.error(error);
        });

    public login = (credentials) => this.createByIriRequest("/login", credentials)
        .then((response: AxiosResponse<any>) => {
            //TODO check request status
            if (1 == "1"/*TODO CHECK STATUS*/)
                Auth.setToken(response.data.token)
            //     TODO get user id and expiration time
        })
        .catch((error) => {
            console.error("Login error: ", error);
        });

    public logout = () => this.createByIriRequest("/logout", {})
        .then((response: AxiosResponse<any>) => {
            if (response.status === 200) {
                Auth.removeToken();
            }
        })
        .catch((error) => {
            console.error("Logout error: ", error);
        });

}

export default Auth;