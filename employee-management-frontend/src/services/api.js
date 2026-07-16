import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api/";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Refresh token on 401 and retry original request
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (
            error.response?.status === 401 &&
            !originalRequest._retry
        ) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem("refresh_token");

            if (refreshToken) {
                try {
                    const res = await axios.post(`${API_BASE_URL}token/refresh/`, {
                        refresh: refreshToken,
                    });
                    const newAccess = res.data.access;
                    localStorage.setItem("access_token", newAccess);
                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    // Refresh token expired - force logout
                    localStorage.removeItem("access_token");
                    localStorage.removeItem("refresh_token");
                    window.location.href = "/login";
                }
            } else {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;