import React, { createContext, useEffect, useState,useCallback } from 'react';
import { UnAuthorizedApi,AuthorizedApi } from '../axios';
import { useNavigate } from 'react-router-dom';

export const UserDetailsContext = createContext();

export function UserDetailsProvider({ children }) {

  const [userDetails, setUserDetails] = useState(JSON.parse(localStorage.getItem('techprinting-current-user'))||null);
  const [authToken,setAuthToken] = useState(sessionStorage.getItem("techprinting-auth-token")||null);
  const [firmDetails,setFirmDetails] = useState();
  const userLogin = useCallback(async (inputs) => {
    console.log("User Login Api call");
    const res = await UnAuthorizedApi.post("/users/auth/login",inputs);
    if(res.status === 200){
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
    sessionStorage.removeItem("techprinting-auth-token");
    localStorage.removeItem("techprinting-current-user");
    setUserDetails(null);
    setFirmDetails(null);   
    setAuthToken(null);
  }, []);


   const getFirmDetails = () =>{
    AuthorizedApi.get('/firms/details').then((res)=>{
      setFirmDetails(res.data.data)
    }).catch((err)=>{
      if(err.response.status == '401')
        userLogout();
    })
   }


   useEffect(() => {
     if (authToken) {
       getFirmDetails();
    } else {
      localStorage.removeItem("techprinting-current-user");
      sessionStorage.removeItem("techprinting-auth-token");
      setFirmDetails(null);
      setUserDetails((null));
    }
  }, [authToken]);


  return (
    <UserDetailsContext.Provider value={{ userDetails,userLogin,userLogout,firmDetails,setFirmDetails}}>
      {children}
    </UserDetailsContext.Provider>
  );
}