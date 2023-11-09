import Request from "./request";
import Verbs from "./verbs";

/**
 * @desc this abstract is designed to create new properties for each endpoint class as callback functions of what this abstract offers
 */
export default abstract class EndpointsAbstract {
    protected endpointURL: string;
    private request: Request = new Request();
    //TODO remove this from here
    setToken(token: string) {
        this.request.authenticate(token);
    }

    getRequest() {
        return this.request.call(this.endpointURL, Verbs.GET);
    }

    getByIdRequest(id: any) {
        const endpointURL = this.endpointURL + `/${id}`;
        return this.request.call(endpointURL, Verbs.GET);
    };


    getByIriRequest(iri: string) {
        return this.request.call(iri, Verbs.GET);
    }


    createRequest(data: object) {
        return this.request.call(this.endpointURL, Verbs.POST, data);
    }

    createByIriRequest(iri: string, data: object) {
        return this.request.call(iri, Verbs.POST, data);
    }

    updateByIdRequest(id: any, data: object) {
        return this.request.call(this.endpointURL, Verbs.PATCH, data, id);
    }

    replaceByIdRequest(id: any, data: object) {
        return this.request.call(this.endpointURL, Verbs.PUT, data, id);
    }

    deleteByIdRequest(id: any) {
        return this.request.call(this.endpointURL, Verbs.DELETE, id);
    }
}
