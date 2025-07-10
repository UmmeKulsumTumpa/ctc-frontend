const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const ACCESS_TOKEN_EXPIRY_KEY = 'accessTokenExpiry';
const REFRESH_TOKEN_EXPIRY_KEY = 'refreshTokenExpiry';

export const setTokens = (
    accessToken: string,
    refreshToken: string,
    accessTokenExpiry?: number,
    refreshTokenExpiry?: number
) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    if (accessTokenExpiry) {
        localStorage.setItem(ACCESS_TOKEN_EXPIRY_KEY, accessTokenExpiry.toString());
    }
    if (refreshTokenExpiry) {
        localStorage.setItem(REFRESH_TOKEN_EXPIRY_KEY, refreshTokenExpiry.toString());
    }
};

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);
export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const getAccessTokenExpiry = () => {
    const val = localStorage.getItem(ACCESS_TOKEN_EXPIRY_KEY);
    return val ? Number(val) : null;
};

export const getRefreshTokenExpiry = () => {
    const val = localStorage.getItem(REFRESH_TOKEN_EXPIRY_KEY);
    return val ? Number(val) : null;
};

export const isAccessTokenExpired = () => {
    const expiry = getAccessTokenExpiry();
    return expiry ? Date.now() > expiry : true;
};

export const isRefreshTokenExpired = () => {
    const expiry = getRefreshTokenExpiry();
    return expiry ? Date.now() > expiry : true;
};

export const clearTokens = () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(ACCESS_TOKEN_EXPIRY_KEY);
    localStorage.removeItem(REFRESH_TOKEN_EXPIRY_KEY);
};
