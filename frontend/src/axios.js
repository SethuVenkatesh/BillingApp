import axios from 'axios'

export const UnAuthorizedApi = axios.create({
    baseURL:'http://localhost:8081/api'
})
export const AuthorizedApi = axios.create({
    baseURL:'http://localhost:8081/api',
})

AuthorizedApi.interceptors.request.use(function (config){
    const token = sessionStorage.getItem("techprinting-auth-token");
    config.headers.Authorization = token;
    return config;
})