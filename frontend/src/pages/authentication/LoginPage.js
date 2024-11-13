import React, { useEffect, useState } from 'react'
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import PopupComponent from '../../components/common/PopupComponent';
import { useNavigate } from 'react-router-dom';
import { UnAuthorizedApi } from '../../axios';
import { useRef } from 'react';
import Loader from '../../components/common/Loader';
import Toaster from '../../components/common/Toaster';
import { useContext } from 'react';
import { UserDetailsContext } from '../../context/userContext';


//Password Reset Form
const PasswordResetForm = ({resetInfo,setResetInfo,resetUserPassword}) =>{

  const [newPasswordShown,setNewPasswordShown] = useState('password');
  const [confirmNewPasswordShown, setConfirmNewPasswordShown] =  useState('password');

  const handlePassword=(method, passwordType )=>{
    const newInputType = passwordType === 'text' ? 'password' : 'text';
    if(method === 'newPassword'){
      setNewPasswordShown(newInputType);  
    }else {
      setConfirmNewPasswordShown(newInputType);
    }
  }

  const handlePasswordInputChange = (e) => {
    setResetInfo({...resetInfo, [e.target.name]:e.target.value})
  }



  return (
  <div className='flex flex-col w-full gap-y-4 justify-center items-center'>
      <input type='text' className='px-2 py-2 w-3/4 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500	cursor-not-allowed' placeholder='Username' name='username' value={resetInfo.username} disabled/>
      <input type='text' className='px-2 py-2 w-3/4 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500	cursor-not-allowed' placeholder='Email' name='email' value={resetInfo.email} disabled/>
      <div className='relative w-3/4'>
        <input type={`${newPasswordShown}`} className='w-full px-2 py-2 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500' placeholder='Password' name='password' value={resetInfo.password} onChange={handlePasswordInputChange}/>
        <span className='absolute right-2 top-2 cursor-pointer z-10' onClick={()=>handlePassword('newPassword', newPasswordShown)}>
            {
              newPasswordShown === 'text' ? <VisibilityIcon/> : <VisibilityOffIcon/>
            }
        </span>
      </div>
      <div className='relative w-3/4'>
        <input type={`${confirmNewPasswordShown}`} className='w-full px-2 py-2 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500' placeholder='Confirm Password' value={resetInfo.confirm_password} name='confirm_password' onChange={handlePasswordInputChange}/>
        <span className='absolute right-2 top-2 cursor-pointer z-10' onClick={()=>handlePassword('confirmNewPassword', confirmNewPasswordShown)}>
            {
              confirmNewPasswordShown === 'text' ? <VisibilityIcon/> : <VisibilityOffIcon/>
            }
        </span>
      </div>
      <p 
        className='font-semibold text-white bg-green-500 px-2 py-1 text-center w-1/2 rounded-sm mx-auto cursor-pointer capitalize' 
        onClick={()=> resetUserPassword()}>
        update
      </p>
  </div>
  )
}


//OTP Input Form
const OTPInputForm = ({resetInfo,setResetInfo,setResetPassIndex,setToastMsg,setSuccesNotification}) =>{

  const otpBoxReference = useRef([]);
  let numberOfDigits = 6;
  let prevOtp = new Array(numberOfDigits).fill("");
  const [resetTimer,setResetTimer] = useState(10);
  const [showTimer,setShowTimer] = useState(true);

  const handleResentOTP = () =>{
    setShowTimer(true)
    setResetTimer(10)
    // let timer1 = setTimeout(() => {        
    //   setResetTimer(10);
    //   setShowTimer(false);
    // }, 10000);
    // return () => {
    //   clearTimeout(timer1);
    // };

  }

  const handleSubmitOTP = () =>{
    let otp = 0;
    let otpFilled = true;
    otpBoxReference.current.forEach((data) => {
      if(!data.value){
        otpFilled = false;
        return;
      }
      otp = parseInt(otp * 10) + parseInt(data.value);
    })
    if(otpFilled){
      let email = resetInfo.email;
      UnAuthorizedApi.get(`/user/reset_password/verify_otp?email=${email}&otp=${otp}`).then((res)=>{
        if(res.data.status){
          setResetInfo({...resetInfo,username:res.data.username})
          setSuccesNotification(true);
          setToastMsg(res.data.msg);
          setResetPassIndex(2);
        }else{
          setSuccesNotification(false);
          setToastMsg(res.data.msg);
        }
      }).catch(e=>{
        console.log(e);
        setSuccesNotification(false);
        setToastMsg("Something went wrong")
      })
    }
    else{
      setSuccesNotification(false);
      setToastMsg("Invalid OTP");
    }
  }


  const handleOTPText = (event,inputIndex) => {
    const key = event.key.toLowerCase();
    let prevValue = prevOtp[inputIndex]
    const currValue = otpBoxReference.current[inputIndex].value;
    
    if (key == "backspace" || key == "delete") {
      if(prevValue == ""){
        const prevIndex = inputIndex - 1;
        if(prevIndex >=0 && prevIndex <= 5){
          otpBoxReference.current[prevIndex].focus();
        }
      }

    }else{
      const nextIndex = inputIndex + 1;
      if(key>= "0" && key <= "9"){
        otpBoxReference.current[inputIndex].value = key
      }
      if(nextIndex <= 5){
        otpBoxReference.current[nextIndex].focus();
      }
    }
    let newOtp = [...prevOtp]
    newOtp[inputIndex] = currValue
    prevOtp=newOtp
  }
  
  useEffect(() => {
    if(resetTimer == 0){
      setResetTimer(10);
      setShowTimer(false);
    }
    else{
      (resetTimer > 0 && showTimer)  && setTimeout(() => setResetTimer(resetTimer - 1), 1000);
    }
  }, [resetTimer,showTimer]);


  return (
    <div className='flex flex-col w-full gap-y-4 justify-center'>
              <p className='font-bold text-blue-500 '>OTP Verification</p>
              <p className='text-slate-500'>Enter the OTP you received to : <span className='font-semibold text-black'>{resetInfo.email}</span></p>

              <div className='flex items-center justify-between'>
                {
                  Array.from({length: 6}, (v, index) =>{
                    return (
                      <input type='text'  
                             ref={el => otpBoxReference.current[index] = el} 
                             maxLength={1} 
                             onKeyUp={(e)=> handleOTPText(e, index)}
                             className='border-2 border-gray-300 appearance-none text-center w-[40px] h-[50px] rounded-md outline-none focus:border-sky-500 valid:border-sky-500' required
                      />
                      )
                  })
                }
              </div>
              {
                showTimer ?
                <p className='font-semibold text-slate-500 cursor-pointer text-sm'>Resend OTP in {resetTimer} seconds</p>
                : 
                <p className='font-semibold text-blue-500 cursor-pointer text-sm' onClick={()=>handleResentOTP()}>Resend OTP</p>

              }
              <p 
              className='float-none font-semibold text-white bg-green-500 px-2 py-1 text-center w-fit rounded-sm mx-auto cursor-pointer' 
              onClick={()=>handleSubmitOTP()}>
                Submit OTP
              </p>
            </div>
  )
}


//Login Page
const LoginPage = () => {

  const [toastMsg,setToastMsg] =useState("");
  const [succesNotification, setSuccesNotification] = useState(false);
  const [loading,setLoading]=useState(false);
  const [showPopUp,setShowPopUp]=useState(false);
  const [resetPassIndex,setResetPassIndex] = useState(0);
  const [resetInfo,setResetInfo] = useState({
    email:"",
    username:"",
    password:"",
    confirm_password:""
  })
  const navigate = useNavigate()
  const [passwordShown,setPasswordShown] = useState('password')
  const [userCredentials,setUserCredentials] = useState({
    userName:'',
    password:''
  })
  const { userLogin } = useContext(UserDetailsContext);


  const onCloseFn=()=>{
    setShowPopUp(false);
    setResetPassIndex(0)
  }

  const isValidEmail = (email) => {
    const regex =  /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    return email.match(regex);
  }
  
  const handlePassword=(method, passwordType )=>{
    const newInputType = passwordType === 'text' ? 'password' : 'text';
    setPasswordShown(newInputType)
  
  }

  const handleInputChange = (e) => {
    setUserCredentials({...userCredentials, [e.target.name]:e.target.value})
  }

  // const handleLogin = () =>{
  //   setLoading(true);
  //   api.post("/user/login",{userCredentials}).then((res) => {
  //     if(res.data.status){
  //       setSuccesNotification(true);
  //       setToastMsg(res.data.msg);
  //       setLoading(false)
  //       setUserDetails(res.data)
  //       localStorage.setItem('techprinting-current-user', JSON.stringify(res.data.userData));
  //       navigate('/dashboard');
  //     }else{
  //       setSuccesNotification(false);
  //       setToastMsg(res.data.msg);
  //       setLoading(false)
  //     }
  //   }).catch((err) => {
  //     setSuccesNotification(false);
  //     setLoading(false)
  //     setToastMsg("Something went wrong");
  //   })
  // }

  const handleLogin =async () =>{
    setLoading(true);
    try{
        const response = await userLogin(userCredentials);
        console.log("response",response);
        if(response.status === 200){
            setSuccesNotification(true);
            setToastMsg(response.data.message);
            setLoading(false);
            navigate("/dashboard/home");
        }
    }catch(err){
        console.log(err);
        setLoading(false);
        setSuccesNotification(false);
        setToastMsg(err.response.data.message);
    }
  }

  const handleSignUp = () =>{
    navigate('/signup')
  }



  const handleForgotPassword = () =>{
    setShowPopUp(true)

  }

  const handleSendOTP = () =>{
    let email = resetInfo.email;
    if(isValidEmail(email)){
      setLoading(true);
      UnAuthorizedApi.post('/user/reset_password/send_otp',{email}).then((res)=>{
        if(res.data.status){
          setResetPassIndex(1);
          setLoading(false);
          setSuccesNotification(true);
          setToastMsg("Mail send succesfully...");
        }else{
          setLoading(false);
          setSuccesNotification(false);
          setToastMsg("This is email is not associated with any account.")
        }        
      }).catch(e=>{
        console.log(e);
        setLoading(false);
        setSuccesNotification(false);
        setToastMsg("Something went wrong")
      })
    }
    else{
      setSuccesNotification(false);
      setToastMsg("Please Enter a valid email");
    }

  }

  

  const resetUserPassword = () => {
    setLoading(true);
    if(resetInfo.password.length == 0){
      setSuccesNotification(false);
      setToastMsg("Password cannot be empty");
      setLoading(false);
      return;
    }else if(resetInfo.confirm_password.length == 0){
      setSuccesNotification(false);
      setToastMsg("Confirm password cannot be empty");
      setLoading(false);
      return;
    }
    if(resetInfo.password !== resetInfo.confirm_password){
      setSuccesNotification(false);
      setToastMsg("Password and Confirm password should be same");
      setLoading(false);
      return;
    }
    
    let data = { email: resetInfo.email, password:resetInfo.password}
    UnAuthorizedApi.patch('/user/reset_password', data).then((res) => {
      setSuccesNotification(true);
      setToastMsg(res.data.msg);
      setLoading(false);
      onCloseFn();
    }).catch((e) => {
      console.log(e);
      setSuccesNotification(false);
      setToastMsg("Something went wrong..");
      setLoading(false);
    })
  }



  return (
      <div className="flex items-center justify-center h-screen bg-authimg bg-cover bg-center bg-no-repeat">
        {loading && <Loader/>}
        {toastMsg.length>=1&&
          <Toaster toastMsg={toastMsg} setToastMsg={setToastMsg} isSuccess={succesNotification}/>
        }
        <PopupComponent  isOpen={showPopUp} onCloseFn={()=>onCloseFn()} popUpTitle={'Reset Password'} isBtnVisible={false}>
          
          {
            resetPassIndex == 0 ? (
              <div className='flex flex-col w-full gap-y-4 justify-center items-center'>
                <input type='' className='px-2 py-2  border-2 border-gray-400 rounded-md outline-none focus:border-sky-500 w-full' placeholder='email' onChange={(e)=>setResetInfo({...resetInfo,email:e.target.value})}/>
                <p className='bg-blue-500 px-2 py-2 rounded-md font-semibold text-white text-center cursor-pointer w-fit' onClick={()=>handleSendOTP()}>Sent OTP</p>
              </div>
            ):
            (
              resetPassIndex == 1 ?
              <OTPInputForm resetInfo={resetInfo} setResetInfo={setResetInfo} setResetPassIndex={setResetPassIndex} setToastMsg={setToastMsg} setSuccesNotification={setSuccesNotification}/>
              : 
              <PasswordResetForm resetInfo={resetInfo} setResetInfo={setResetInfo} resetUserPassword={resetUserPassword} />
            )
          }
        </PopupComponent>
          <div className='p-8 border border-gray-300 rounded-md flex flex-col w-1/4 gap-4 z-10 bg-white shadow-md min-w-[350px]'>
              <p className='text-center font-bold text-slate-500 text-xl '>Login</p>
              <input type='' className='px-2 py-2 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500	' placeholder='Username' name='userName' onChange={handleInputChange}/>
              <div className='relative'>
                <input type={`${passwordShown}`} className='w-full px-2 py-2 border-2 border-gray-400 rounded-md outline-none focus:border-sky-500	' placeholder='Password' name='password' onChange={handleInputChange}/>
                <span className='absolute right-2 top-2 cursor-pointer z-10' onClick={()=>handlePassword("password",passwordShown)}>
                    {
                      passwordShown=='text' ? <VisibilityIcon/> : <VisibilityOffIcon/>
                    }
                </span>
              </div>
              <div className='bg-blue-500 px-2 py-2 rounded-md font-bold text-white text-center cursor-pointer' onClick={()=>handleLogin()}>Login</div>
              <div className='flex justify-between'>
                <p className='text-blue-600 font-semibold cursor-pointer' onClick={()=>handleForgotPassword()}>Forgot Password?</p>
                <p className='text-blue-600 font-semibold cursor-pointer' onClick={()=>handleSignUp()}>Create an account</p>
              </div>
          </div>
      </div>
  )
}

export default LoginPage;