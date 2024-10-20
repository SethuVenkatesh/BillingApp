import React, { createContext, useEffect, useState,useCallback } from 'react';
import { UnAuthorizedApi,AuthorizedApi } from '../axios';

export const UserDetailsContext = createContext();

export function UserDetailsProvider({ children }) {


  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem('techprinting-current-user'))||null);
  const [authToken,setAuthToken] = useState(sessionStorage.getItem("techprinting-auth-token")||null);
  const [firmDetails,setFirmDetails] = useState();
  
  const userLogin = useCallback(async (inputs) => {
    console.log("User Login Api call");
    const res = await UnAuthorizedApi.post("/users/auth/login",inputs);
    if(res.status === 200){
      console.log("user Login Callback ");
      let authKey = res.headers.getAuthorization();
      console.log("authKey",authKey);
      sessionStorage.setItem("techprinting-auth-token",authKey);
      localStorage.setItem("techprinting-current-user",JSON.stringify(res.data.data));
      setUserDetails(res.data.data);
      setAuthToken(authKey);
    }
    return res;
  }, []);

  const userLogout = useCallback(async () => {
    console.log("user Logout Api call");
    sessionStorage.removeItem("techprinting-auth-token");
    localStorage.removeItem("techprinting-current-user");
    setUserDetails(null);
    setAuthToken(null);
  }, []);


   const getFirmDetails = () =>{
    AuthorizedApi.get('/firms/details').then((res)=>{
      setFirmDetails(res.data)
    }).catch(err=>console.log(err))
   }


   useEffect(() => {
     if (authToken) {
       getFirmDetails();
    } else {
      localStorage.removeItem("techprinting-current-user");
      setFirmDetails(null);
    }
  }, [authToken]);


  return (
    <UserDetailsContext.Provider value={{ userDetails,userLogin,userLogout,firmDetails,setFirmDetails}}>
      {children}
    </UserDetailsContext.Provider>
  );
}