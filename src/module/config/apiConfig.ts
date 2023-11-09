import {parseJwt} from "../lib/utils";
import AuthConfig from "./AuthConfig";
import axios from "axios";

class ApiConfig {
    private readonly _baseUrl: string;
    private readonly _apiKey: any;
    private readonly _apiHost: string;
    private readonly _headers: any;
    private readonly _axios: axios;

    constructor(params) {
        const {baseUrl, apiKey, apiHost} = params;
        this._baseUrl = baseUrl;
        this._apiKey = apiKey;
        this._apiHost = apiHost;
        this._headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${AuthConfig.token}`
        }
        this._axios = axios.create({
            baseURL: this._apiHost,
            headers: this._headers,
            withCredentials: true
        })
    }

    public get apiHost() {
        return this._apiHost
    }

    public get headers() {
        return this._headers;
    }

    public get getApiKey() {
        return this._apiKey;
    }

    public get axios() {
        return this._axios;
    }

    authenticate(token: any) {
        // this._authToken = token;
        this._headers ['Authorization: Bearer '] = token;
        let parsedToken = parseJwt(token);
        console.log(parsedToken);
        AuthConfig.tokenExpirationTime = parsedToken.exp;
        AuthConfig.isAuthenticated = true;
        AuthConfig.userId = parsedToken.userId;
    }

    static verifyParamsTypesForInstantiation(params): boolean {
        if (typeof params[0] !== "string") {
            return false;
        }

        //TODO check 2nd property

        if (typeof params[2] !== "string") {
            return false;
        }
        return true;
    }
}

let config: ApiConfig;

// TODO define apiKey type
/**
 * @param params nothing|parsed as three parameters, defined:
 * <ul>
 * <li>baseUrl: string
 * <li>apiKey: any
 * <li>apiHost: string
 * </ul>
 *
 * @returns ApiConfig()
 * @remarks
 * If API configuration is not instantiated, the function needs the parameters above to create one. Otherwise, the current instance of it will be returned
 *
 * If the configuration is already set, call it as a function:
 *
 * apiConfig() (with parenthesis)
 *
 * and treat it an object:
 *
 * apiConfig().property
 */

const apiConfig = (...params): ApiConfig => {
    if (config ! instanceof ApiConfig)
        if (ApiConfig.verifyParamsTypesForInstantiation(params))
            config = new ApiConfig(params);
        else {
            //TODO throw error if params are not ok
        }
    return config;
}

export default apiConfig;

