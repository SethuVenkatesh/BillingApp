import React, { useEffect, useState } from 'react'
import { useNavigate,useLocation } from 'react-router-dom';
import { useContext } from 'react'
import { UserDetailsContext } from '../context/userContext'
import Icons from '../components/common/Icons'
import PopupComponent from './common/PopupComponent';
import { sideBarAccountTabs, sideBarTabs } from '../constants'
import InputComponent from './common/InputComponent';
import axios from 'axios';
import { AuthorizedApi } from '../axios';
import Loader from './common/Loader';
import Toaster from './common/Toaster';
import { stateNames } from '../constants';
import SelectComponent from './common/SelectComponent';
import { firmSchemaValidation, getStateDifference } from '../utils/CommonUtils';
import { type } from '@testing-library/user-event/dist/type';

const SideBar = () => {
    //bg-color #212934
    //active-color  #191f26
    // border-color #3e454e
    // text-color #9b9ea3
    // tab-color #ed1a3b
    const { userDetails,userLogout,firmDetails,setFirmDetails } = useContext(UserDetailsContext);
    const location = useLocation();
    const [showPopUp,setShowPopUp]=useState(false);
    const onCloseFn=()=>{
      setShowPopUp(false);
    }
  
    const onOpenFn=()=>{
      setShowPopUp(true);
    }


    const [activeTab, setActiveTab] = useState(sideBarTabs[0].tabName);
    const [expandSubTab, setExpandSubTab] = useState("");
    const [activeSubTab, setActiveSubTab] = useState("");
    const navigate = useNavigate();

    const handleTabChange = (tabName, tabExpand, subTab) => {
        if(tabName=='Logout'){
            handleLogout()                 
            return;
        }
        if (activeTab == tabName && expandSubTab == tabName) {
            setExpandSubTab("")
            setActiveSubTab("")
        }else if(tabExpand){
            setExpandSubTab(tabName)
            setActiveSubTab(subTab[0].routeName)
        }
        setActiveTab(tabName)
        if(tabExpand){
            navigate(`${tabName}/${subTab[0].routeName}`)
            
        }else{
            navigate(`${tabName}`)
        }
        
    }

    const handleLogout =async () =>{
    
        await userLogout();
        navigate('/')
      }
    

    const handleSubTabChange = (subTab) => {
        setActiveSubTab(subTab)
        navigate(`${activeTab}/${subTab}`)
    }

    
    useEffect(()=>{
        let tabName = location.pathname.split("/")[2];
        let subTabName = location.pathname.split("/")[3];
        setActiveTab(tabName);
        console.log(subTabName)
        if(subTabName){
            setExpandSubTab(tabName)
        }
        setActiveSubTab(subTabName);
        console.log(location.pathname)
    },[firmDetails])

  
    return (

        <div className='min-h-[100vh] w-[220px] bg-[#212934] flex flex-col justify-between relative '>
                <PopupComponent isOpen={showPopUp} onCloseFn={()=>onCloseFn()} popUpTitle={'Edit Firm'} isBtnVisible={false} >
                    <EditFirmComponent onCloseFn={()=>onCloseFn()}/>
                </PopupComponent>
            <div>
                {
                    <div className='p-2 flex items-center gap-x-4 border-b-2 border-[#3e454e] cursor-pointer text-white' onClick={()=>onOpenFn()}>
                        <div className='w-[45px] h-[45px] aspect-square rounded-full'>
                            {
                                (firmDetails && firmDetails.logoUrl != '') ?
                                <img className='h-full w-full object-cover rounded-full' src={firmDetails.logoUrl} alt='not-found' />
                                :
                                <img className='h-full w-full object-cover rounded-full' src='https://res.cloudinary.com/dkjcfh7oj/image/upload/v1713684716/firms/building_1_jc8pct.png' alt='not-found' />

                            }
                        </div>
                        {
                        firmDetails &&
                        <p className='capitalize font-bold w-full overflow-hidden truncate'>{firmDetails ? firmDetails.firmName :"New Firm"}</p>
                        }   
                        {Icons['arrow-right-icon']}
                    </div>
                }
            {

                sideBarTabs.map((sideBarTab) => {
                    if (sideBarTab.isTabExpand) {
                        return (
                            <div className=''>
                                <div className={` p-2 flex items-center gap-x-4 cursor-pointer relative ${activeTab === sideBarTab.tabName ? 'text-white bg-[#191f26]' : 'text-[#9b9ea3]'}`} onClick={() => handleTabChange(sideBarTab.tabName, sideBarTab.isTabExpand, sideBarTab.subTabs)}>
                                    <div className='ml-2'>
                                        {sideBarTab.icon}
                                    </div>
                                    <p className='font-semibold capitalize'>{sideBarTab.tabName}</p>
                                    {
                                        activeTab === sideBarTab.tabName &&
                                        <p className='absolute h-full w-1 bg-[#ed1a3b] left-0'></p>
                                    }
                                    {
                                        (activeTab == sideBarTab.tabName && expandSubTab == sideBarTab.tabName) ?
                                        <div className='ml-auto'>
                                            {
                                                Icons['arrow-up-icon']
                                            }
                                        </div>
                                        :
                                        <div className='ml-auto'>
                                            {
                                                Icons['arrow-down-icon']
                                            }
                                        </div>
                                    }
                                </div>
                                {/*  &&  */}
                                <div className={`transition-all duration-300 ease-in-out ${(activeTab == sideBarTab.tabName && expandSubTab == sideBarTab.tabName) ? 'block':'hidden'}`}>
                                {
                                    
                                    sideBarTab.subTabs.map((subTab) => {
                                        return (
                                            <div className={`p-2 flex items-center cursor-pointer relative ${activeSubTab === subTab.routeName ? 'text-white bg-[#191f26]' : 'text-[#9b9ea3]'}`} onClick={() => handleSubTabChange(subTab.routeName)}>
                                                <p className='font-semibold capitalize text-sm text-center ml-8'>{subTab.tabName}</p>
                                            </div>
                                        )
                                    })
                                }
                                </div>
                            </div>
                        )
                    }
                    else {
                        return (
                            <div className={` p-2 flex items-center gap-x-4 cursor-pointer relative ${activeTab === sideBarTab.tabName ? 'text-white bg-[#191f26]' : 'text-[#9b9ea3]'}`} onClick={() => handleTabChange(sideBarTab.tabName, sideBarTab.isTabExpand, sideBarTab.subTabs)}>
                                <div className='ml-2'>
                                    {sideBarTab.icon}
                                </div>
                                <p className='font-semibold capitalize'>{sideBarTab.tabName}</p>
                                {
                                    activeTab === sideBarTab.tabName &&
                                    <p className='absolute h-full w-1 bg-[#ed1a3b] left-0'></p>
                                }
                            </div>
                        )
                    }
                })
            }
            <p className='mt-2 border-b-2 border-[#3e454e] relative'></p>
            </div>
            <div className='border-t-2 border-[#3e454e]'>
                {
                    sideBarAccountTabs.map((sideBarTab)=>{
                        return(
                            <div className={`p-2 flex items-center gap-x-4 cursor-pointer relative ${activeTab === sideBarTab.tabName ? 'text-white bg-[#191f26]' : 'text-[#9b9ea3]'}`} onClick={() => handleTabChange(sideBarTab.tabName)}>
                            <div className='ml-2'>
                                {sideBarTab.icon}
                            </div>
                            <p className='font-semibold capitalize'>{sideBarTab.tabName}</p>
                            {
                                activeTab === sideBarTab.tabName &&
                                <p className='absolute h-full w-1 bg-[#ed1a3b] left-0'></p>
                            }
                        </div>
                        )
                    })
                }
            </div>
        </div>
    )
}

const EditFirmComponent = ({onCloseFn}) =>{
    const { userDetails,userLogout,firmDetails,setFirmDetails } = useContext(UserDetailsContext);


    const [firmData,setFirmData] = useState(firmDetails);
    const [firmDifferences,setFirmDifferences] = useState({});
    const [loading,setLoading]=useState(false);
    const [toastMsg,setToastMsg] =useState("");
    const [toastStatus,setToastStatus] = useState(false);
    const [selectedTab,setSelectedTab] = useState(1);
    const [uploadFile, setUploadFile] = useState(null);

    const handleTabChange = (tabIndex)=>{
        setSelectedTab(tabIndex)
    }

    
    const handleValidate = () =>{
        setLoading(true);
        firmSchemaValidation.validate(firmData,{abortEarly:false}).then(valid=>{
            if(firmDetails){
                if(Object.keys(firmDifferences).length == 0 && uploadFile == null){
                    setLoading(false);
                    return;
                }
                handleUpdateFirm();
            }else{
                handleSaveFirm()
            }
        }).catch(error=>{
            setLoading(false);
            console.log("erro",error)
            setToastMsg(error.inner[0]?.message);
            setToastStatus(false);
        });
    }   
    const handleSaveFirm = () => {
      
        const formData = new FormData();
        formData.append("firmDetails", new Blob([JSON.stringify(firmDifferences)],{type:'application/json'}));
        if(uploadFile){
            formData.append("firmImage",uploadFile);
        }
        AuthorizedApi.post(`/firms/new`,formData).then((res)=>{
            console.log(res)
            setLoading(false);
            setToastMsg("Firm Created successfully");
            setFirmDetails(firmData)
            setToastStatus(true);
            setUploadFile(null)
        }).catch((err)=>{
            setLoading(false)
            setToastMsg(err.response.data.message);
            setToastStatus(false);
        })
              
    }


    const handleUpdateFirm = () => {
        const formData = new FormData();
        formData.append("firmDetails", new Blob([JSON.stringify(firmDifferences)],{type:'application/json'}));
        if(uploadFile){
            formData.append("firmImage",uploadFile);
        }
        AuthorizedApi.patch(`/firms/update`,formData).then((res)=>{
            console.log(res)
            setLoading(false);
            setToastMsg("Firm Updated successfully");
            setFirmDetails(res.data.data)
            setToastStatus(true);
            setUploadFile(null);
            setFirmDifferences({})
        }).catch((err)=>{
            setLoading(false)
            setToastMsg(err.response.data.message);
            setToastStatus(false);
        })
    }

    useEffect(()=>{
        if(firmDetails){
            setFirmData(firmDetails)
        }else{
            setFirmData({
                firmName:"",  
                logoUrl:"",
                email:"",
                gstNumber:"",
                mobileNumber:"",
                altMobileNumber:"",
                address:{
                  address:"",
                  city:"",
                  state:"",
                  pincode:""
                },
                bank:{
                    bankName:"",
                    accountNumber:"",
                    branch:"",
                    ifscCode:""
                }
            })
        }
    },[])



    useEffect(()=>{
       const differences = getStateDifference(firmDetails,firmData);
       if(Object.keys(differences).length >= 1){
        setFirmDifferences(differences);
       }
       console.log(Object.keys(differences).length)
       console.log(differences);
    },[firmData])
    console.log("firmDiffernce",firmDifferences)


    return(
        firmData &&
        <div className='flex flex-col'>
            <div className='grid grid-cols-2'>
                <div className='p-4 w-[300px] truncate'>
                    {
                        firmData && firmData.logoUrl != '' ?
                        <div className='mb-4 relative p-4 flex items-center justify-center'>
                            <img src={firmData.logoUrl} className='w-[200px] aspect-square rounded-full border border-gray-300'/>
                            <p className='absolute bottom-2 right-1/4 p-2 bg-red-500 rounded-full cursor-pointer text-white' onClick={()=>setFirmData({...firmData,logoUrl:""})}>
                                {
                                    Icons['delete-icon']
                                }
                            </p>
                        </div>
                        :
                        <div className='p-4 border border-blue-500 rounded-md mb-4 w-full h-fit '> 
                            <p className='capitalize font-semibold text-center mb-2 text-blue-500'>upload logo</p>
                            <input 
                                type="file" 
                                accept="image/*" 
                                className='w-full'
                                onChange ={(event) => {setUploadFile(event.target.files[0]);}} 
                            />
                        </div>
                    }
                </div>
                <div className='flex flex-col gap-y-4'>
                    <InputComponent inputType="text" labelName="Firm Name" inputName="firmName" inputValue={firmData.firmName} jsonDetails={firmData} setJsonDetails={setFirmData}/>
                    <InputComponent inputType="text" labelName="GSTIN" inputName="gstNumber" inputValue={firmData.gstNumber} jsonDetails={firmData} setJsonDetails={setFirmData}/>
                    <InputComponent inputType="text" labelName="mobile number" inputName="mobileNumber" inputValue={firmData.mobileNumber} jsonDetails={firmData} setJsonDetails={setFirmData}/>                        
                    <InputComponent inputType="text" labelName="alternate mobile number" inputName="altMobileNumber" inputValue={firmData.altMobileNumber} jsonDetails={firmData} setJsonDetails={setFirmData}/>
                    <InputComponent inputType="text" labelName="Email ID" inputName="email" inputValue={firmData.email} jsonDetails={firmData} setJsonDetails={setFirmData}/>
                </div>
            </div>
            <div className='mb-4'>
                <div className='flex border-b border-gray-300'>
                    <p className={`capitalise px-2 py-2 cursor-pointer select-none ${selectedTab == 1 ? 'text-blue-500 font-bold border-b-2 border-blue-500' : 'text-slate-500 font-semibold'}`} onClick={()=>handleTabChange(1)}>Address Details</p>
                    <p className={`capitalise px-2 py-2 cursor-pointer select-none ${selectedTab == 2 ? 'text-blue-500 font-bold border-b-2 border-blue-500' : 'text-slate-500 font-semibold'}`} onClick={()=>handleTabChange(2)}>Bank Details</p>
                </div>
                <div className='p-4 w-1/2 h-[200px]'>
                    {
                        selectedTab == 1 ? 
                        <div className='flex flex-col gap-y-4'>
                            <InputComponent inputType="text" labelName="Address" section="address" inputName="address" inputValue={firmData.address.address} jsonDetails={firmData} setJsonDetails={setFirmData}/>
                            <InputComponent inputType="text" labelName="City" section="address" inputName="city" inputValue={firmData.address.city} jsonDetails={firmData} setJsonDetails={setFirmData}/>
                            <InputComponent inputType="number" labelName="pincode" section="address" inputName="pincode" inputValue={firmData.address.pincode} jsonDetails={firmData} setJsonDetails={setFirmData}/>
                            <SelectComponent labelName="state"  section="address" inputName="state"     inputValue={firmData.address.state} inputArray={stateNames} jsonDetails={firmData} setJsonDetails={setFirmData}/>
                        </div> : 
                        <div className='flex flex-col gap-y-4'>
                            <InputComponent inputType="text" labelName="Bank Name" section="bank" inputName="bankName" inputValue={firmData.bank.bankName} jsonDetails={firmData} setJsonDetails={setFirmData}/>
                            <InputComponent inputType="text" labelName="Branch Name" section="bank" inputName="branch" inputValue={firmData.bank.branch} jsonDetails={firmData} setJsonDetails={setFirmData}/>
                            <InputComponent inputType="number" labelName="Account Number" section="bank" inputName="accountNumber" inputValue={firmData.bank.accountNumber} jsonDetails={firmData} setJsonDetails={setFirmData}/>
                            <InputComponent inputType="text" labelName="IFSC Code" section="bank" inputName="ifscCode" inputValue={firmData.bank.ifscCode} jsonDetails={firmData} setJsonDetails={setFirmData}/>
                        </div>
                    }
                </div>
            </div>
            {loading && <Loader/>}
            {
                toastMsg.length>=1&&
                <Toaster toastMsg={toastMsg} setToastMsg={setToastMsg} isSuccess={toastStatus}/>
            }
            {
                firmDetails ?
                <p className={`text-white rounded-md p-1 px-6 capitalize w-fit ml-auto mr-2 select-none ${Object.keys(firmDifferences).length === 0 && uploadFile == null ? 'cursor-not-allowed bg-gray-500':'cursor-pointer bg-blue-500'}` } onClick={()=>handleValidate()}>update</p>
                :
                <p className='text-white bg-blue-500 rounded-md p-1 cursor-pointer px-6 capitalize w-fit ml-auto mr-2 select-none' onClick={()=>handleValidate()}>save</p>
            }
        </div>
    )
}

export default SideBar