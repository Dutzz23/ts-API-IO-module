import HttpClients from "../config/httpClients";
import dotenv from "dotenv";
import Verbs from "./verbs";

import apiConfig from "../config/apiConfig";
import axios from "axios";

dotenv.config({path: "../.env.this.apiConfig"});

export default class Request {
    private apiConfig;
    private readonly _httpClient: axios;
    private readonly _isSecure: boolean;
    private readonly _interceptorsHandlers: HttpClients | null;

    constructor(isSecure: boolean) {
        this.apiConfig = apiConfig();
        this._isSecure = isSecure;
        const httpClients: HttpClients = new HttpClients()

        if (isSecure) {
            this._interceptorsHandlers = httpClients;
            this._httpClient = this._interceptorsHandlers.axiosSecure;
        } else {
            this._interceptorsHandlers = null;
            this._httpClient = httpClients.axios;
        }
    }


    public call(url: string, method: Verbs, data: object = null, id: any = null): Promise<any> {
        if (this._isSecure) {
            this._interceptorsHandlers.appendSecureRequestInterceptor();
            this._interceptorsHandlers.appendSecureResponseInterceptor(url, method, data, id);
        } else this._interceptorsHandlers.appendResponseIntercept(url, method, data, id);

        const returnPromise = async (): Promise<any> => {
            let restMethod: any;
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

            if (this._isSecure) {
                this._interceptorsHandlers.ejectSecureRequestIntercept();
                this._interceptorsHandlers.ejectSecureResponseIntercept();
            } else this._interceptorsHandlers.ejectResponseIntercept();

            return restMethod;
        }

        return returnPromise();
    }

    private async get(url: string, params: any = null): Promise<any> {
        try {
            return await this._httpClient.get(this.apiConfig.baseUrl + url, {
                'params': params
            });
        } catch
            (err) {
            console.log(err);
        }
    }

    private async post(url: string, data: Object): Promise<any> {
        try {
            return await this._httpClient.post(
                this.apiConfig.baseUrl + url,
                data
            );
        } catch
            (err) {
            console.log(err);
        }
    }

    private async put(url: string, data: Object, id: any): Promise<any> {
        Object.defineProperty(data, 'id', {
            'value': id
        })
        try {
            return await this._httpClient.put(
                this.apiConfig.baseUrl + url,
                data
            );
        } catch
            (err) {
            console.log(err);
        }
    }

    private async patch(url: string, data: Object, id: any): Promise<any> {
        Object.defineProperty(data, 'id', {
            'value': id
        })
        try {
            return await this._httpClient.patch(
                this.apiConfig.baseUrl + url + '/' + id,
                data
            );
        } catch
            (err) {
            console.log(err);
        }
    }

    private async delete(url: string, id: any): Promise<any> {
        try {
            return await this._httpClient.delete(
                this.apiConfig.baseUrl + url + '/' + id
            );
        } catch
            (err) {
            console.log(err);
        }
    }

    get httpClient(): axios {
        return this._httpClient;
    }
}