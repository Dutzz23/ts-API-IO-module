import EndpointsAbstract from "./EndpointsAbstract";
import axios from "axios";
import apiConfig from "../config/apiConfig";
import AuthConfig from "../config/AuthConfig";


class Auth extends EndpointsAbstract {

    public register = (credentials) => this.createByIriRequest("/signup", credentials)
        .then((response) => {

        })
        .catch()

    public refreshToken = (token: string) => this.createByIriRequest("/refreshToken", new Object(token))
        .then((response) => {
            AuthConfig.token = response.data.token;
        })
        .catch((error) => {
            AuthConfig.isAuthenticated = false;
            AuthConfig.token = "";
        });
    public login;
    public logout;

}