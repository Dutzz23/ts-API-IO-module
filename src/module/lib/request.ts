import axios from 'axios';
import Verbs from "./verbs";
import apiConfig from "../config/apiConfig";

//TODO change baseUrl with the previous declaration. It was done for dev purposes
// const baseUrl = 'http://' + apiConfig.apiHost;
const baseUrl = apiConfig().apiHost;

export default class Request {

    public call(url: string, method: Object, data: object = null, id: any = null) {
        // if (AuthConfig.tokenExpirationTime - Date.now() <= 60) {
        //     this.refreshToken();
        // }
        switch (method) {
            case Verbs.GET:
                return this.get(url);
            case Verbs.POST:
                return this.post(url, data)
            case Verbs.PUT:
                return this.put(url, data, id)
            case Verbs.PATCH:
                return this.patch(url, data, id)
            case Verbs.DELETE:
                return this.delete(url, id)
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
            return await axios.get(baseUrl + url, {
                'headers': apiConfig.header,
                'params': params
            });
        } catch
            (err) {
            console.log(err);
        }
    }

    private post = async (url: string, data: Object) => {
        try {
            return await axios.post(
                baseUrl + url,
                data,
                {
                    'headers': apiConfig.header,
                }
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
            return await axios.put(
                baseUrl + url,
                data,
                {
                    'headers': apiConfig.header,
                }
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
            return await axios.patch(
                baseUrl + url + '/' + id,
                data,
                {
                    'headers': apiConfig.header,
                }
            );
        } catch
            (err) {
            console.log(err);
        }
    }

    private delete = async (url: string, id: any) => {
        try {
            return await axios.delete(
                baseUrl + url + '/' + id,
                {
                    'headers': apiConfig.header,
                }
            );
        } catch
            (err) {
            console.log(err);
        }
    }
}
