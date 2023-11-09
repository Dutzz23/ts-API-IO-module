import EndpointsAbstract from "./EndpointsAbstract";
import AuthConfig from "../config/AuthConfig";
import axios, {AxiosResponse} from "axios";

class Auth extends EndpointsAbstract {


    public register = (credentials) => this.createByIriRequest("/signup", credentials)
        .then((response: AxiosResponse<any>) => {

        })
        .catch((error) => {
            console.error(error);
        });

     public static refreshToken = () => axios.get('/refresh', {
        withCredentials: true
    })
        .then((response: AxiosResponse<any>) => {
            if (response.status === 200) AuthConfig.token = response.data.token;
        })
        .catch((error) => {
            AuthConfig.isAuthenticated = false;
            AuthConfig.token = "";
            console.error(error);
        });

    public login = (credentials) => this.createByIriRequest("/login", credentials)
        .then((response: AxiosResponse<any>) => {

        })
        .catch((error) => {
            console.error(error);
        });
    public logout = () => this.createByIriRequest("/logout", {})
        .then((response: AxiosResponse<any>) => {
            if (response.status === 200) AuthConfig.logout();
        })
        .catch((error) => {
            console.error(error);
        });

}

export default Auth;