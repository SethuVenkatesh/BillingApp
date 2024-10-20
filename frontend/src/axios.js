import axios from 'axios'

export const UnAuthorizedApi = axios.create({
    baseURL:'http://localhost:8081/api'
})
export const AuthorizedApi = axios.create({
    baseURL:'http://localhost:8081/api',
    headers:{
        "Authorization":sessionStorage.getItem("techprinting-auth-token")
    }
})

