/**
 * @desc Static class that holds authentication config for the api
 *
 * @remarks
 * Stores:
 * <ul>
 *      <li>isAuthenticated: boolean (DEFAULT: false)
 *      <li>tokenExpirationTime: any (DEFAULT: null)
 *      <li>userId: any (DEFAULT: null)
 *      <li>token: string|null (DEFAULT: null)
 * </ul>
 */
export default class AuthConfig {
    /**@private*/
    private static _isAuthenticated: boolean = false;
    /**@private*/
    private static _tokenExpirationTime: any = null;
    /**@private*/
    private static _userId: any = null;
    /**@private*/
    private static _token: string | null = null;

    public static get isAuthenticated(): boolean {
        return this._isAuthenticated;
    }

    public static set isAuthenticated(value: boolean) {
        this._isAuthenticated = value;
    }

    public static get tokenExpirationTime(): any {
        return this._tokenExpirationTime;
    }


    public static set tokenExpirationTime(value: any) {
        this._tokenExpirationTime = value;
    }

    public static get userId(): any {
        return this._userId;
    }

    public static set userId(value: any) {
        this._userId = value;
    }

    public static get token(): any {
        return this._token;
    }

    public static set token(value: string) {
        this._token = value;
    }
}
