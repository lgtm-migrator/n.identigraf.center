import Bugsnag from '@bugsnag/js';
import type {
    CheckPhoneResponse,
    CompareStatusResponse,
    ErrorResponse,
    LoginResponse,
    MatchedFacesResponse,
    SearchStatusResponse,
} from './types';
export { decodeErrorCode, decodeErrorResponse, decodeFirebaseError } from './errors';
export * from './types';

export default class API {
    public static checkPhone(phone: string): Promise<CheckPhoneResponse | ErrorResponse> {
        return API.post('/identigraf-auth/v2/checkphone', { phone });
    }

    public static login(token: string): Promise<LoginResponse | ErrorResponse> {
        return API.post('/identigraf-auth/v2/login', undefined, token);
    }

    public static checkCompareStatus(guid: string): Promise<CompareStatusResponse | ErrorResponse> {
        return API.get(`/identigraf/v2/compare/${guid}`);
    }

    public static checkSearchStatus(guid: string): Promise<SearchStatusResponse | ErrorResponse> {
        return API.get(`/identigraf/v2/search/${guid}`);
    }

    public static getMatchedFaces(guid: string, faceID: number): Promise<MatchedFacesResponse | ErrorResponse> {
        return API.get(`/identigraf/v2/search/${guid}/matches/${faceID}/0/20`);
    }

    private static post<R>(endpoint: string, body: unknown, auth?: string): Promise<R | ErrorResponse> {
        const headers: Record<string, string> = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        };

        if (auth) {
            headers.Authorization = `Bearer ${auth}`;
        }

        return fetch(`https://api2.myrotvorets.center${endpoint}`, {
            method: 'POST',
            headers,
            body: body !== undefined ? JSON.stringify(body) : undefined,
        })
            .then((response) => response.json())
            .catch((e) => {
                Bugsnag.notify(e);
                return {
                    success: false,
                    status: 502,
                    code: 'COMM_ERROR',
                    message: 'Помилка спілкування з сервером',
                };
            });
    }

    private static get<R>(endpoint: string, auth?: string): Promise<R | ErrorResponse> {
        const headers: Record<string, string> = {
            Accept: 'application/json',
        };

        if (auth) {
            headers.Authorization = `Bearer ${auth}`;
        }

        return fetch(`https://api2.myrotvorets.center${endpoint}`, { headers })
            .then((response) => response.json())
            .catch((e) => {
                Bugsnag.notify(e);
                return {
                    success: false,
                    status: 502,
                    code: 'COMM_ERROR',
                    message: 'Помилка спілкування з сервером',
                };
            });
    }
}
