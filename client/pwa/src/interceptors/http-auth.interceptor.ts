 /* eslint-disable */
import authService from '../services/auth-service';

export function tokenResponseInterceptor(response: any) {
    // TODO refreshtoken
    return response;
}


export function tokenRequestInterceptor(request: any) {
    request.headers['Authorization'] = `Bearer ${authService.getJwtToken()}`;
    return request
}