import React, { useEffect, useState } from 'react'
import CloseIcon from '@mui/icons-material/Close';


const Toaster = ({toastMsg,setToastMsg,isSuccess}) => {
    const [showToast,setShowToast]=useState(true)
    useEffect(()=>{
        let timer1 = setTimeout(() => {
          setShowToast(false)
          setToastMsg("")
        }, 5000);
        return () => {
          clearTimeout(timer1);
        };
    },[showToast])

  return (
    <>
        {
            showToast &&
            <div className={`${isSuccess ? "bg-green-500":"bg-red-900"} text-white w-1/4 mb-2 m-auto rounded-t-lg fixed right-[20px] bottom-[10px] z-20 `}>
                <p className='text-baseline font-semibold px-4 py-3 capitalize'>{toastMsg}</p>
                <CloseIcon className='absolute top-0 right-0 cursor-pointer' onClick={()=>{
                  setShowToast(false)
                  setToastMsg("")
                }
                }/>
                <p className={`h-[4px] ${isSuccess ? "bg-green-800":"bg-red-500"} toast-animation`}></p>
            </div>
        }
    </>
  )
}


export default Toaster