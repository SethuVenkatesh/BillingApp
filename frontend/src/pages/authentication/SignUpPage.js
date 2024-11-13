import React, { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import Toaster from '../../components/common/Toaster';
import {isValidEmail, registerUserSchemaValidation} from '../../utils/CommonUtils'
import * as Yup from 'yup';

import { UnAuthorizedApi } from '../../axios';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const SignUpPage = () => {
  const [passwordShown,setPasswordShown] = useState('password');
  const [confirmPasswordShown, setConfirmPasswordShown] =  useState('password');
  const [toastMsg,setToastMsg] =useState("");
  const [succesNotification, setSuccesNotification] = useState(false);
  const [loading,setLoading]=useState(false);
  const [uploadFile, setUploadFile] = useState(null);

  const [userData, setUserData] =  useState({
    userName:"",
    email:'',
    password:'',
    confirmPassword:'',
    mobileNumber:'',
    profileUrl:''
  })
  const navigate = useNavigate()
  const handlePassword=(method, passwordType )=>{
    const newInputType = passwordType === 'text' ? 'password' : 'text';
    if(method === 'password'){
      setPasswordShown(newInputType);  
    }else if(method === 'confirmPassword'){
      setConfirmPasswordShown(newInputType);
    }
  }

  const handleLogin=()=>{
    navigate('/')
  }

  const handleImageUpload = () => {
    setLoading(true)
    let isSuccess = handleValidate();
    console.log("isSuccess",isSuccess)
    if(isSuccess){
      createNewUser()
    }
  };

  const createNewUser =() =>{
      const formData = new FormData ();
      formData.append("userDetails",new Blob([JSON.stringify(userData)],{type:'application/json'}));
      formData.append("userImage",uploadFile);
      UnAuthorizedApi.post('/users/auth/new',formData).then((res)=>{
        if(res.status == 201){
          setSuccesNotification(true);
          setToastMsg(res.data.message);
          const myTimeout = setTimeout(()=>{
            navigate('/')
          }  
          , 5000);
          setLoading(false)
        }
      }).catch(err=>{ 
        console.log(err);
        setLoading(false);
        setToastMsg(err.response.data.message);
        setSuccesNotification(false);
      }
      )
            
  }

  const handleValidate = () =>{
    setLoading(true);
    registerUserSchemaValidation.validate(userData,{abortEarly:false}).then(valid=>{
      console.log(valid);  
      if(uploadFile == null){
        setLoading(false);
        setToastMsg("Profile Picture is required");
        setSuccesNotification(false); 
        return; 
      }
      createNewUser();
    }).catch(error=>{
      setLoading(false);
      setToastMsg(error.inner[0]?.message);
      setSuccesNotification(false);  
    });
  }


  const handleInputChange = (e) => {
    setUserData({...userData, [e.target.name]:e.target.value})
  }


  return (
      <div className="flex items-center justify-center h-screen bg-authimg bg-cover bg-center bg-no-repeat">
        {loading && <Loader/>}
        {toastMsg.length>=1&&
          <Toaster toastMsg={toastMsg} setToastMsg={setToastMsg} isSuccess={succesNotification}/>
        }
          <div className='p-8 border border-gray-300 rounded-md flex flex-col w-1/4 gap-4 z-10 bg-white shadow-md min-w-[400px]'>
              <p className='text-center font-bold text-slate-500 text-xl '>Sign Up</p>
              <input type='text' className='px-2 py-2 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500	' placeholder='Username' name='userName' onChange={handleInputChange}/>
              <input type='text' className='px-2 py-2 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500	' placeholder='Email' name='email' onChange={handleInputChange}/>
              <div className='relative'>
                <input type={`${passwordShown}`} className='w-full px-2 py-2 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500' placeholder='Password' name='password' onChange={handleInputChange}/>
                <span className='absolute right-2 top-2 cursor-pointer z-10' onClick={()=>handlePassword('password', passwordShown)}>
                    {
                      passwordShown === 'text' ? <VisibilityIcon/> : <VisibilityOffIcon/>
                    }
                </span>
              </div>
              <div className='relative'>
                <input type={`${confirmPasswordShown}`} className='w-full px-2 py-2 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500' placeholder='Confirm Password' name='confirmPassword' onChange={handleInputChange}/>
                <span className='absolute right-2 top-2 cursor-pointer z-10' onClick={()=>handlePassword('confirmPassword', confirmPasswordShown)}>
                    {
                      confirmPasswordShown === 'text' ? <VisibilityIcon/> : <VisibilityOffIcon/>
                    }
                </span>
              </div>
              <input type='number' className='px-2 py-2 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500	' placeholder='Mobile Number' name='mobileNumber' onChange={handleInputChange}/>
              <div className='p-4 border border-blue-500 rounded-md mb-4'> 
                  <p className='capitalize font-semibold text-center mb-2 text-blue-700'>upload profile   </p>
                  <input 
                      type="file" 
                      onChange ={(event) => {setUploadFile(event.target.files[0]);}} 
                  />
              </div>
              <div className='bg-blue-500 px-2 py-2 rounded-md font-bold text-white text-center cursor-pointer' onClick={() => handleImageUpload()}>Sign Up</div>
              <p className='text-blue-600 font-semibold cursor-pointer' onClick={()=>handleLogin()}>Already have an account</p>
          </div>
      </div>
  )
}

export default SignUpPage;