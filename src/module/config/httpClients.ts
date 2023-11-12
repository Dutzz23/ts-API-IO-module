import AuthConfig from "./AuthConfig";
import Request from "../lib/request";
import Auth from "../lib/auth";
import apiConfig from "./apiConfig";
import axios from "axios";

export default class HttpClients {
    private readonly _axiosSecure: axios;
    private readonly _axios: axios;
    private _responseIntercept;
    private _secureRequestIntercept;
    private _secureResponseIntercept;

    constructor() {
        const apiConfiguration = apiConfig();
        this._axiosSecure = axios.create({
            baseURL: apiConfiguration.apiHost,
            headers: apiConfiguration.headers,
            withCredentials: true
        })

        this._axios = axios.create({
            baseURL: apiConfiguration.apiHost,
            headers: {'Content-Type': 'application/json',},
            withCredentials: false
        })
    }

    public get axiosSecure(): axios {
        return this._axiosSecure;
    }

    public get axios(): axios {
        return this._axios;
    }

    /**
     * Handle request before it is actually done
     */
    public appendSecureRequestInterceptor(): void {
        this._secureRequestIntercept = this.axiosSecure.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${AuthConfig.token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        )
    }

    /**
     * Handle server response to retry the call after 403 code error with a new JWT token
     */
    appendSecureResponseInterceptor(url, method, data, id): void {

        this._secureResponseIntercept = this._axiosSecure.interceptors.response.use(
            response => response,
            async (error) => {
                const previousRequest = error?.config;
                if (error?.response?.status === 403 && !previousRequest?.sent) {
                    await Auth.refreshToken();
                    await (new Request(true)).call(url, method, data, id);
                    return () => this.axiosSecure.interceptors.response.eject(this._secureResponseIntercept);
                }
                return Promise.reject(error);
            })
    }

    appendResponseIntercept(url, method, data, id) {
        this._responseIntercept = this.axios.interceptors.response.use(
            response => response,
            async (error) => {
                const previousRequest = error?.config;
                if (error?.response?.status === 403 && !previousRequest?.sent) {
                    await (new Request(false)).call(url, method, data, id);
                    return () => this.axios.interceptors.response.eject(this._responseIntercept);
                }
                return Promise.reject(error);
            })
    }

    ejectResponseIntercept(): void {
        this.axios.interceptors.response.eject(this._responseIntercept);

    }

    ejectSecureRequestIntercept(): void {
        this.axiosSecure.interceptors.request.eject(this._secureRequestIntercept);
    }

    ejectSecureResponseIntercept(): void {
        this.axiosSecure.interceptors.response.eject(this._secureResponseIntercept);

    }
}