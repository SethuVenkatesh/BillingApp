import React, { useEffect } from 'react'
import { useContext } from 'react';
import { UserDetailsContext } from './userContext';
import { Navigate } from 'react-router-dom';

const ProtectiveRoute = ({children}) => {
    const {userDetails,firmDetails} = useContext(UserDetailsContext);
    console.log("protective route")
    console.log(userDetails)

    if(!userDetails){
        return <Navigate to='/login'/>
    }
    return children;
}

export default ProtectiveRoute