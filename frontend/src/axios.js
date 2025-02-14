import axios from 'axios'

export const UnAuthorizedApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL+"/api",
})
export const AuthorizedApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL+"/api",
})

AuthorizedApi.interceptors.request.use(function (config){
    const token = sessionStorage.getItem("techprinting-auth-token");
    config.headers.Authorization = token;
    return config;
})