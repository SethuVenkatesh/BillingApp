import React from 'react'
import { useState,useEffect } from 'react';
import Loader from '../../components/common/Loader';
import Toaster from '../../components/common/Toaster';
import { useContext } from 'react';
import { UserDetailsContext } from '../../context/userContext';
import { AuthorizedApi } from '../../axios';
import Icons from '../../components/common/Icons';
import PopupComponent from '../../components/common/PopupComponent';
import InputComponent from '../../components/common/InputComponent';
import SelectComponent from '../../components/common/SelectComponent';
import { stateNames } from '../../constants'
import {newPartySchemaValidation} from '../../utils/CommonUtils';
import { getStateDifference,getDateInReadableFmt } from '../../utils/CommonUtils';
import Pagination from '../../components/common/Pagination';
import SortPopUpComponent from '../../components/common/SortPopUpComponent';
import FilterPopUpComponent from '../../components/common/FilterPopUpComponent';
import { partyFilterData, partySortData } from '../../constants';

const Parties = () => {
  const [loading,setLoading]=useState(false);
  const [toastMsg,setToastMsg] =useState("");
  const [toastStatus,setToastStatus] = useState(false);
  const [allParties,setAllParties] = useState([])
  const [showPopUp,setShowPopUp]=useState(false);
  const [popUpTitle,setPopUpTitle] = useState("");
  const [isPopUpEdit,setIsPopUpEdit] = useState(false);
  const [partyDetails,setPartyDetails] = useState({})
  const { firmDetails } = useContext(UserDetailsContext);
  const [isNewParty,setIsNewParty] = useState(true);

//   Search Query for Pagination
const [currentPage,setCurrentPage] = useState(1);
const [itemsPerPage,setItemsPerPage] = useState(20);
const [totalPages,setTotalPages] = useState(1);
const [totalCount,setTotalCount] = useState(1);

// Filters and Sort
const [selectedFilter,setSelectedFilter] = useState({
    partyName:""
  });
  const [selectedSort,setSelectedSort] = useState({
    sortType:"desc",
    sortKey:"createdAt"
  })


  const changeSortFn = (sortType,sortKey) =>{
    setSelectedSort({
      sortType:sortType,
      sortKey:sortKey
    })
  }
  
  const changeFilterValues = (filterKey,filterValue) =>{
    setSelectedFilter({...selectedFilter,[filterKey]:filterValue})
  }
  
  const resetFilter = () =>{
    setSelectedFilter({
      partyName:"",
    })
  }


  const onCloseFn=()=>{
      setShowPopUp(false);
    }
    const createNewParty=()=>{
      setIsNewParty(true);
      setIsPopUpEdit(true);
      setPopUpTitle("Add Party")
      setShowPopUp(true);
  }


  const getAllParties = (pageNumber,pageSize) =>{
      setLoading(true);
      AuthorizedApi.get("/parties/all",{
        params:{
            pageNum:pageNumber,
            pageSize:pageSize,
            ...selectedSort,
            ...selectedFilter
        }
      }).then((res)=>{
            setAllParties(res.data.data)
            setLoading(false)
            setTotalCount(res.data.totalCount);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.pageNum);
            setItemsPerPage(res.data.pageSize);
            setToastStatus(true);
          }).catch(err=>{
              setLoading(false);
              setToastMsg(err.response.data.message);
              setToastStatus(false);  
      })
    }

  useEffect(()=>{
    getAllParties(1,20)
  },[selectedSort])



  const handleView = (partyData) =>{
      setShowPopUp(true);
      setIsPopUpEdit(false);
      setPopUpTitle("Party Details");
      setPartyDetails(partyData);
  }
  const handleEdit = (partyData) =>{
      setIsNewParty(false)
      setIsPopUpEdit(true);
      setPopUpTitle("Edit Party")
      setShowPopUp(true);
      setPartyDetails(partyData);
  }
  
  const handleDelete = (partyData) =>{
      setLoading(true);
      AuthorizedApi.delete("/parties/delete?partyName=" + partyData.partyName).then((res)=>{
          setLoading(false);
          setToastStatus(true);
          getAllParties(1,20);
      }).catch(err=>{
          setLoading(false);
          setToastMsg(err.response.data.message)
          setToastStatus(false);
      })
  }

return (
  <>

          <div className='flex items-center justify-center gap-2 flex-col '>
              <PopupComponent isOpen={showPopUp} onCloseFn={()=>onCloseFn()} popUpTitle={popUpTitle} isBtnVisible={false} >
                  {
                      isPopUpEdit ? <PartyPopUp isNewParty={isNewParty} partyDetails={partyDetails} setShowPopUp={setShowPopUp} getAllParties={getAllParties}/> : <PartyDetailsPopUp partyDetails={partyDetails}/>
                  }
              </PopupComponent>

              <div className='rounded-sm border border-gray-300 shadow-md w-full relative '>
                  <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
                      <p className='font-semibold text-lg text-slate-600 '>Party List</p>
                      <div className='flex item-center justify-end gap-x-2'>
                        <SortPopUpComponent data={partySortData} selectedItem={selectedSort} changeSortFn={(sortType,sortKey)=>changeSortFn(sortType,sortKey)}/>
                        <FilterPopUpComponent data={partyFilterData} selectedFilter={selectedFilter} filterChanges = {(filterKey,filterValue)=>changeFilterValues(filterKey,filterValue)} resetFilter= {()=>resetFilter()} applyFilter={()=>getAllParties(1,20)}/>
                        <p className='px-2 py-1 shadow-md text-white font-semibold w-fit select-none cursor-pointer rounded-md  bg-[#212934]' onClick={()=>createNewParty()}>{Icons['add-icon']} Add Parties</p>
                     </div>
                  </div>
                  <div className='h-[calc(100vh-200px)] overflow-y-auto'>
                    <div className='p-4 grid md:grid-cols-1 gap-x-2 gap-y-1 sm:grid-cols-1 lg:grid-cols-2'>
                        {
                            allParties.map((party)=>{
                                return (
                                    <PartyCard partyDetails={party} handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete}/>
                                )
                            })
                        }
                    </div>
                </div>

                  
                    <Pagination onPageChange={(page,pageSize)=>getAllParties(page,pageSize)} totalCount={totalCount} siblingCount={1} currentPage={currentPage} pageSize={itemsPerPage} totalPages={totalPages}/>
              </div>
              {loading && <Loader/>}
              {
                  toastMsg.length>=1&&
                  <Toaster toastMsg={toastMsg} setToastMsg={setToastMsg} isSuccess={toastStatus}/>
              }
          </div>
      
  
  </>
  )
}

const PartyPopUp = ({isNewParty,partyDetails,getAllParties,setShowPopUp}) =>{

  const { firmDetails } = useContext(UserDetailsContext);
  const [partyData,setPartyData] = useState(null);
  
  const [loading,setLoading]=useState(false);
  const [toastMsg,setToastMsg] =useState("");
  const [toastStatus,setToastStatus] = useState(false);
  const [selectedTab,setSelectedTab] = useState(1);
  const [uploadFile, setUploadFile] = useState(null);
  const [partyDifference,setPartyDifference] = useState({});


  const handleTabChange = (tabIndex)=>{
      setSelectedTab(tabIndex)
  }



  const handleValidate = () =>{
    setLoading(true);
    if(isNewParty){
        newPartySchemaValidation.validate(partyData,{abortEarly:false}).then(valid=>{
            handleSaveParty();
        }).catch(error=>{
            setLoading(false);
            setToastMsg(error.inner[0]?.message);
            setToastStatus(false);  
        })

    }else{
        newPartySchemaValidation.validate(partyData,{abortEarly:false}).then(valid=>{
            handleUpdateParty();
        }).catch(error=>{
            setLoading(false);
            setToastMsg(error.inner[0]?.message);
            setToastStatus(false);  
        })
    }
  }   
  const handleSaveParty = () => {
        const formData = new FormData ();
        formData.append("partyDetails",new Blob([JSON.stringify(partyData)],{type:'application/json'}));
        formData.append("partyImage",uploadFile);
        AuthorizedApi.post(`/parties/new`,formData).then((res)=>{
            console.log(res)
            setLoading(false);
            setToastMsg(res.data.message);
            setPartyData(partyDetails)
            setToastStatus(true);
            setUploadFile(null)
            setShowPopUp(false);
            getAllParties(1,20);
            setShowPopUp(false);
        }).catch((err)=>{
            setLoading(false);
            setToastMsg(err.response.data.message);
            setToastStatus(false);
        })

      }
  


  const handleUpdateParty = () =>{
    const formData = new FormData ();
    formData.append("partyDetails",new Blob([JSON.stringify(partyDifference)],{type:'application/json'}));
    formData.append("partyImage",uploadFile);
    console.log(formData);
    AuthorizedApi.patch(`/parties/update?partyName=${partyData.partyName}`,formData).then((res)=>{
        console.log(res)
        setLoading(false);
        setToastMsg(res.data.message);
        setPartyData(partyDetails)
        setToastStatus(true);
        setUploadFile(null)
        getAllParties(1,20);
        setShowPopUp(false);
    }).catch((err)=>{
        setLoading(false)
        setToastMsg(err.response.data.message);
        setToastStatus(false);
        console.log(err)
    })
}
  

  

  useEffect(()=>{
      if(isNewParty){
          setPartyData({
            partyName:"",  
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
      else{
          setPartyData(partyDetails)
      }
  },[])
  
  useEffect(()=>{
    if(partyData){
        const differences = getStateDifference(partyDetails,partyData);
        if(Object.keys(differences).length >= 1){
         setPartyDifference(differences);
        }
        console.log(Object.keys(differences).length)
        console.log(differences);
    }
 },[partyData])



   return (
    partyData &&
      <div className='flex flex-col'>
      <div className='grid grid-cols-2'>
          <div className='p-4 w-[300px] truncate'>
              {
                  partyData.logoUrl == '' ?
                 
                  <div className='p-4 border border-blue-500 rounded-md mb-4 w-full h-fit '> 
                      <p className='capitalize font-semibold text-center mb-2 text-blue-500'>upload logo</p>
                      <input 
                          type="file" 
                          accept="image/*" 
                          className='w-full'
                          onChange ={(event) => {setUploadFile(event.target.files[0]);}} 
                      />
                  </div>
                  :
                  <div className='mb-4 relative p-4 flex items-center justify-center'>
                      <img src={partyData.logoUrl} className='w-[200px] aspect-square rounded-full border border-gray-300'/>
                      <p className='absolute bottom-2 right-1/4 p-2 bg-red-500 rounded-full cursor-pointer text-white' onClick={()=>setPartyData({...partyData,logoUrl:""})}>
                          {
                              Icons['delete-icon']
                          }
                      </p>
                  </div>
              }
          </div>
          <div className='flex flex-col gap-y-4'>
              <InputComponent inputType="text" labelName="Party Name" inputName="partyName" inputValue={partyData.partyName} jsonDetails={partyData} setJsonDetails={setPartyData}/>
              <InputComponent inputType="text" labelName="GST Number" inputName="gstNumber" inputValue={partyData.gstNumber} jsonDetails={partyData} setJsonDetails={setPartyData}/>
              <InputComponent inputType="text" labelName="mobile number" inputName="mobileNumber" inputValue={partyData.mobileNumber} jsonDetails={partyData} setJsonDetails={setPartyData}/>                        
              <InputComponent inputType="text" labelName="alternate mobile number" inputName="altMobileNumber" inputValue={partyData.altMobileNumber} jsonDetails={partyData} setJsonDetails={setPartyData}/>
              <InputComponent inputType="text" labelName="Email ID" inputName="email" inputValue={partyData.email} jsonDetails={partyData} setJsonDetails={setPartyData}/>
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
                      <InputComponent inputType="text" labelName="Address" section='address' inputName="address" inputValue={partyData.address.address} jsonDetails={partyData} setJsonDetails={setPartyData}/>
                      <InputComponent inputType="text" labelName="City" section='address' inputName="city" inputValue={partyData.address.city} jsonDetails={partyData} setJsonDetails={setPartyData}/>
                      <InputComponent inputType="number" labelName="pincode" section='address' inputName="pincode" inputValue={partyData.address.pincode} jsonDetails={partyData} setJsonDetails={setPartyData}/>
                      <SelectComponent labelName="state" inputName="state" section='address' inputValue={partyData.address.state} inputArray={stateNames} jsonDetails={partyData} setJsonDetails={setPartyData}/>
                  </div> : 
                  <div className='flex flex-col gap-y-4'>
                      <InputComponent inputType="text" labelName="Bank Name" section='bank' inputName="bankName" inputValue={partyData.bank.bankName} jsonDetails={partyData} setJsonDetails={setPartyData}/>
                      <InputComponent inputType="text" labelName="Branch Name" section='bank' inputName="branch" inputValue={partyData.bank.branch} jsonDetails={partyData} setJsonDetails={setPartyData}/>
                      <InputComponent inputType="number" labelName="Account Number" section='bank' inputName="accountNumber" inputValue={partyData.bank.accountNumber} jsonDetails={partyData} setJsonDetails={setPartyData}/>
                      <InputComponent inputType="text" labelName="IFSC Code" section='bank' inputName="ifscCode" inputValue={partyData.bank.ifscCode} jsonDetails={partyData} setJsonDetails={setPartyData}/>
                  </div>
              }
          </div>
      </div>
      {loading && <Loader/>}
      {
          toastMsg.length >=1 &&
          <Toaster toastMsg={toastMsg} setToastMsg={setToastMsg} isSuccess={toastStatus}/>
      }
      {
          isNewParty ? 
          <p className='text-white bg-blue-500 rounded-md p-1 cursor-pointer px-6 capitalize w-fit ml-auto mr-2 select-none' onClick={()=>handleValidate()}>save</p>
          :
          <p className={`text-white bg-blue-500 rounded-md p-1 cursor-pointer px-6 capitalize w-fit ml-auto mr-2 select-none ${Object.keys(partyDifference).length === 0 && uploadFile == null ? 'cursor-not-allowed bg-gray-500':'cursor-pointer bg-blue-500'}`} onClick={()=>handleValidate()}>update</p>
      }
  </div>
  )
}

const PartyCard = ({partyDetails,handleView,handleEdit,handleDelete}) =>{
  return(
    <div className='p-2 border border-gray-300 w-full'>
        <div className='flex gap-x-4 items-center relative'>
            <div className='w-[50px] rounded-full'>
                {
                    partyDetails.logoUrl == '' ? 
                    <img src='https://res.cloudinary.com/dkjcfh7oj/image/upload/v1713684716/firms/building_1_jc8pct.png' alt='Not Found' className='h-full w-full object-cover '/> 
                    :
                    <img src={partyDetails.logoUrl} alt='Not Found' className='h-full aspect-square object-cover rounded-full'/> 
                }
            </div>
            <div className='text-slate-900 '>
                <p className='font-semibold'>{partyDetails.partyName}</p>
                <p className='text-xs text-gray-600'>Created at : {getDateInReadableFmt(partyDetails.createdAt)}</p>
            </div>
            <div className=' relative ml-auto cursor-pointer group'>
                <div className='p-4'>
                    {
                        Icons['more-icon']
                    }
                </div>
                <div className='absolute hidden group-hover:block right-4 top-10 cursor-pointer z-10 bg-white border border-gray-300 rounded-md shadow-md min-w-[150px] '>
                    <p className='flex px-4 py-2 items-center gap-x-2  hover:text-green-600 font-semibold' onClick={()=>handleView(partyDetails)}>
                        {
                            Icons['eye-icon']
                        }
                        <span>View</span>
                    </p>
                    <p className='flex px-4 py-2 items-center gap-x-2 hover:text-blue-600 font-semibold' onClick={()=>handleEdit(partyDetails)}>
                        {
                            Icons['edit-icon']
                        }
                        <span>Edit</span>
                    </p>
                    <p className='flex px-4 py-2 items-center gap-x-2 hover:text-red-600 font-semibold' onClick={()=>handleDelete(partyDetails)}>
                        {
                            Icons['delete-icon']
                        }
                        <span>Delete</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
)
}

const PartyDetailsPopUp = ({partyDetails}) =>{
  return (
    <div className='flex flex-col w-full'>
        <div className='flex items-center justify-center w-full'>
            {
                <img src={partyDetails.logoUrl == '' ? 'https://res.cloudinary.com/dkjcfh7oj/image/upload/v1713684716/firms/building_1_jc8pct.png': partyDetails.logoUrl} alt='not found' className='w-[100px] aspect-square  object-cover rounded-full'/>
            }
            
        </div>
        <p className='font-bold text-slate-600 text-center mb-2'>{partyDetails.partyName}</p>
        <div className='flex flex-col gap-y-2'>
            <div className='grid grid-cols-2 text-slate-500 capitalize'>
                <p className='font-semibold'>GST_number</p>
                <p>: {partyDetails.gstNumber}</p>
            </div>
            <div className='grid grid-cols-2 text-slate-500 capitalize'>
                <p className='font-semibold'>Mobile Number</p>
                <p>: {partyDetails.mobileNumber}</p>
            </div>
            <div className='grid grid-cols-2 text-slate-500 capitalize'>
                <p className='font-semibold'>alternate mobile number</p>
                <p>: {partyDetails.altMobileNumber}</p>
            </div>
            <div className='grid grid-cols-2 text-slate-500 capitalize'>
                <p className='font-semibold'>Address</p>
                <p>: {partyDetails.address.address}</p>
            </div>
            <div className='grid grid-cols-2 text-slate-500 capitalize'>
                <p className='font-semibold'>City</p>
                <p>: {partyDetails.address.city}</p>
            </div>
            <div className='grid grid-cols-2 text-slate-500 capitalize'>
                <p className='font-semibold'>state</p>
                <p>: {partyDetails.address.state}</p>
            </div>
            <div className='grid grid-cols-2 text-slate-500 capitalize'>
                <p className='font-semibold'>pincode</p>
                <p>: {partyDetails.address.pincode}</p>
            </div>
            <div className='grid grid-cols-2 text-slate-500 capitalize'>
                <p className='font-semibold'>Account Number</p>
                <p>: {partyDetails.bank.accountNumber}</p>
            </div>
            <div className='grid grid-cols-2 text-slate-500 capitalize'>
                <p className='font-semibold'>IFSC Code</p>
                <p>: {partyDetails.bank.ifscCode}</p>
            </div>
            <div className='grid grid-cols-2 text-slate-500 capitalize'>
                <p className='font-semibold'>Bank Name</p>
                <p>: {partyDetails.bank.bankName}</p>
            </div>
            <div className='grid grid-cols-2 text-slate-500 capitalize'>
                <p className='font-semibold'>Branch</p>
                <p>: {partyDetails.bank.branch}</p>
            </div>

        </div>
    </div>
)
}

export default Parties