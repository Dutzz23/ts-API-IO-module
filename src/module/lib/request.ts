import getApiConfig from "../config/apiConfig";
import AuthConfig from "../config/AuthConfig";
import Verbs from "./verbs";
import dotenv from 'dotenv';
import Auth from "./auth";

dotenv.config({path: "../.env.apiConfig"});

//TODO add parameters from .env.apiConfig
const apiConfig = getApiConfig();

//TODO change baseUrl with the previous declaration. It was done for dev purposes
// const baseUrl = 'http://' + apiConfig.apiHost;
const baseUrl: string = apiConfig.apiHost;

export default class Request {

    public call(url: string, method: Object, data: object = null, id: any = null) {

        const requestIntercept = apiConfig.axios.interceptors.request.use(
            config => {
                if (!config.headers['Authorization']) {
                    config.headers['Authorization'] = `Bearer ${AuthConfig.token}`;
                }
                return config;
            }, (error) => Promise.reject(error)
        )

        const responseIntercept = apiConfig.axios.interceptors.response.use(
            response => response,
            async (error) => {
                const previousRequest = error?.config;
                if (error?.response?.status === 403 && !previousRequest?.sent) {
                    await Auth.refreshToken();
                    await (new Request()).call(url, method, data, id);
                    return () => apiConfig.axios.interceptors.response.eject(responseIntercept);
                }
                return Promise.reject(error);
            })

        let restMethod;
        switch (method) {
            case Verbs.GET: {
                restMethod = this.get(url);
                break;
            }
            case Verbs.POST: {
                restMethod = this.post(url, data);
                break;
            }
            case Verbs.PUT: {
                restMethod = this.put(url, data, id);
                break;
            }
            case Verbs.PATCH: {
                restMethod = this.patch(url, data, id);
                break;
            }
            case Verbs.DELETE: {
                restMethod = this.delete(url, id);
                break;
            }
        }

        return () => {
            apiConfig.axios.interceptors.request.eject(requestIntercept);
            apiConfig.axios.interceptors.request.eject(responseIntercept);
            restMethod();
        }
    }

    refreshToken() {
        this.get("/api/refresh")
            .then((response) => {
                if (response.status === 200) {
                    this.authenticate(response.data.token)
                } else {
                    this.authenticate(null);
                    localStorage.removeItem('token');
                }
            }).catch((error) => Error(error))
    }

    authenticate(token: string) {
        apiConfig.authenticate(token);
    }

    logout() {
    }

    private get = async (url: string, params: any = null) => {
        try {
            return await apiConfig.axios.get(baseUrl + url, {
                'params': params
            });
        } catch
            (err) {
            console.log(err);
        }
    }

    private post = async (url: string, data: Object) => {
        try {
            return await apiConfig.axios.post(
                baseUrl + url,
                data
            );
        } catch
            (err) {
            console.log(err);
        }
    }

    private put = async (url: string, data: Object, id: any) => {
        Object.defineProperty(data, 'id', {
            'value': id
        })
        try {
            return await apiConfig.axios.put(
                baseUrl + url,
                data
            );
        } catch
            (err) {
            console.log(err);
        }
    }

    private patch = async (url: string, data: Object, id: any) => {
        Object.defineProperty(data, 'id', {
            'value': id
        })
        try {
            return await apiConfig.axios.patch(
                baseUrl + url + '/' + id,
                data
            );
        } catch
            (err) {
            console.log(err);
        }
    }

    private delete = async (url: string, id: any) => {
        try {
            return await apiConfig.axios.delete(
                baseUrl + url + '/' + id
            );
        } catch
            (err) {
            console.log(err);
        }
    }
}
