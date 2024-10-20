import React, { useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { useNavigate } from 'react-router-dom';
import Toaster from '../../components/common/Toaster';
import { UnAuthorizedApi } from '../../axios';
import axios from 'axios';
import Loader from '../../components/common/Loader';

const SignUpPage = () => {
  const [passwordShown,setPasswordShown] = useState('password');
  const [confirmPasswordShown, setConfirmPasswordShown] =  useState('password');
  const [toastMsg,setToastMsg] =useState("");
  const [succesNotification, setSuccesNotification] = useState(false);
  const [loading,setLoading]=useState(false);
  const [uploadFile, setUploadFile] = useState("");
  const [userData, setUserData] =  useState({
    username:'',
    email:'',
    password:'',
    mobile_number:'',
    profile_url:''
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

  const isValidEmail = (email) => {
    const regex =  /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    return email.match(regex);
  }

  const handleLogin=()=>{
    navigate('/')
  }

  const handleImageUpload = () => {
    setLoading(true)
    let isSuccess = handleValidate();
    console.log("isSuccess",isSuccess)
    if(isSuccess){
      handleUserExsist(userData.email,userData.username)
    }
  };

  const handleUserExsist =(email,username) =>{
    UnAuthorizedApi.post('/user/isExist',{email,username}).then((res) => {
      if(res.data.emailFound){
        setSuccesNotification(false);
        setLoading(false);
        setToastMsg("Email already Exists. Use another email");
        return;
      }
      else if(res.data.userNameFound){
        setSuccesNotification(false);
        setLoading(false);
        setToastMsg("Username already Exists. Use another username");
        return;
      }
      else{
          console.log("first",uploadFile)
          if(uploadFile){
            const formData = new FormData ();
            formData.append("file", uploadFile);
            formData.append("upload_preset", "ruwqs5az");
            formData.append("folder","users");
            axios.post(
             "https://api.cloudinary.com/v1_1/dkjcfh7oj/image/upload",
             formData
            ).then((response) => {
              let userDetails={...userData,profile_url:response.data.secure_url}
              setUserData({...userData,profile_url:response.data.secure_url})
              UnAuthorizedApi.post('/user/new',{userDetails}).then((req,res)=>{
                console.log(res);
                setSuccesNotification(true);
                setToastMsg("User Created Successfully")
                const myTimeout = setTimeout(()=>{
                  navigate('/')
                }  
                , 5000);
                setLoading(false)
              }).catch(e=>{ 
                setLoading(false)
                 setToastMsg("Error in Creating User");
                 setSuccesNotification(false);
                 console.log(e)
              }
              )
            })
            .catch((error) => {
              console.log(error);
                 setToastMsg("Error in Uploading Image");
                setSuccesNotification(false);
              setLoading(false);
            });
          }
      }
    });
  }

  const handleValidate = () =>{
    let userValidation = userData
    let valSuccess = true
    for(const key in userValidation)
    {
      if(key != 'profile_url'){
        if(userValidation[key].trim().length == 0){
          if(key == 'mobile_number'){
            setSuccesNotification(false);
            setToastMsg("mobile number is required")
          }
          else{
            setSuccesNotification(false);
            setToastMsg(`${key} is required`)
          }
          setLoading(false);
          valSuccess = false
          return false; 
        }
        else if(key == 'password'){
          if(userValidation.password !== userValidation.confirmPassword){
            setLoading(false);
            setSuccesNotification(false);
            setToastMsg("Pasword and confirm password should be same");
            valSuccess = false
            return false; 
          }
        }
        else if(key == 'email'){
            if(!isValidEmail(userValidation.email)){
              setSuccesNotification(false);
              setToastMsg("Please Enter a valid email")
              setLoading(false);
              valSuccess = false
              return false; 
            }
        }
      }
    }
    if(!valSuccess) return false;
    if(uploadFile.length == 0){
      setLoading(false);
      setSuccesNotification(false);
      setToastMsg("Profile picture is required");
      return false;
    }
    return true;
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
              <input type='text' className='px-2 py-2 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500	' placeholder='Username' name='username' onChange={handleInputChange}/>
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
              <input type='number' className='px-2 py-2 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500	' placeholder='Mobile Number' name='mobile_number' onChange={handleInputChange}/>
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