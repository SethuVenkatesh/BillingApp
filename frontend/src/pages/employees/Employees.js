import React, { useEffect,useState } from 'react'
import { AuthorizedApi } from '../../axios'
import { useContext } from 'react'
import { UserDetailsContext } from '../../context/userContext'
import Loader from '../../components/common/Loader'
import Icons from '../../components/common/Icons'
import PopupComponent from '../../components/common/PopupComponent'
import InputComponent from '../../components/common/InputComponent'
import Toaster from '../../components/common/Toaster'
import axios from 'axios'
import { stateNames,genderNames } from '../../constants'
import SelectComponent from '../../components/common/SelectComponent'

const Employees = () => {
    const [loading,setLoading]=useState(false);
    const [toastMsg,setToastMsg] =useState("");
    const [toastStatus,setToastStatus] = useState(false);
    const [allEmployees,setAllEmployees] = useState([])
    const [showPopUp,setShowPopUp]=useState(false);
    const [popUpTitle,setPopUpTitle] = useState("");
    const [isPopUpEdit,setIsPopUpEdit] = useState(false);
    const [employeeDetails,setEmployeeDetails] = useState({})
    const { firmDetails } = useContext(UserDetailsContext);
    const onCloseFn=()=>{
        setToastStatus(true);
        setShowPopUp(false);
      }
    const createNewEmployee=()=>{
        setIsNewEmployee(true);
        setIsPopUpEdit(true);
        setPopUpTitle("Add Employee")
        setShowPopUp(true);
    }


    const [isNewEmployee,setIsNewEmployee] = useState(true);

    const getAllEmployees = (toastMessage) =>{
        setLoading(true);
        AuthorizedApi.get("/employee/all/"+firmDetails._id).then((res)=>{
              setAllEmployees(res.data)
              setLoading(false)
              setToastMsg(toastMessage)
            }).catch(err=>{
                setLoading(false)
              console.log(err);
        })
      }

    useEffect(()=>{
        getAllEmployees("")
    },[])



    const handleView = (employeeData) =>{
        setShowPopUp(true);
        setIsPopUpEdit(false);
        setPopUpTitle("Employee Details");
        setEmployeeDetails(employeeData);
        

    }
    
    const handleEdit = (employeeData) =>{
        setIsNewEmployee(false)
        setIsPopUpEdit(true);
        setPopUpTitle("Edit Employee")
        setShowPopUp(true);
        setEmployeeDetails(employeeData);
    }
    
    const handleDelete = (employeeData) =>{
        setLoading(true);
        AuthorizedApi.delete("/employee/delete/"+employeeData._id).then((res)=>{
            setLoading(false);
            setToastMsg("Employee Deleted successfully");
            setToastStatus(true);
            getAllEmployees("Employee Deleted successfully");

        }).catch(err=>{
            setLoading(false);
            setToastMsg("Error in Deleting Employee");
            setToastStatus(false);
        })
    }

  return (
    <>
    {
        loading ? (
            <Loader/> 
        ) : (
            <div className='flex items-center justify-center gap-2 flex-col'>
                <PopupComponent isOpen={showPopUp} onCloseFn={()=>onCloseFn()} popUpTitle={popUpTitle} isBtnVisible={false} >
                    {
                        isPopUpEdit ? <EmployeePopUp isNewEmployee={isNewEmployee} employeeDetails={employeeDetails} onCloseFn={onCloseFn} getAllEmployees={getAllEmployees}/> : <EmployeeDetailsPopUp employeeDetails={employeeDetails}/>

                    }
                </PopupComponent>
                <div className='rounded-sm border border-gray-300 shadow-md w-full min-h-[calc(100vh-50px)]'>
                    <div className='p-4 border-b border-gray-200 flex items-center   '>
                        <p className='font-semibold text-lg text-slate-600 '>Employee List</p>
                        <p className='px-2 py-2 shadow-md text-white font-semibold w-fit select-none cursor-pointer rounded-md ml-auto bg-[#212934]' onClick={()=>createNewEmployee()}>{Icons['add-icon']} Add Employees</p>
                    </div>
                    <div className='p-4 grid md:grid-cols-2 gap-x-2 gap-y-1 sm:grid-cols-1'>
                        {
                            allEmployees.map((employee)=>{
                                return (
                                    <EmployeeCard employeeDetails={employee} handleView={handleView} handleEdit={handleEdit} handleDelete={handleDelete}/>
                                )
                            })
                        }
                    </div>
                </div>
                {
                    toastMsg.length>=1&&
                    <Toaster toastMsg={toastMsg} setToastMsg={setToastMsg} isSuccess={toastStatus}/>
                }
            </div>
        ) 
    }
    </>
  )
}

const EmployeePopUp = ({isNewEmployee,employeeDetails,getAllEmployees,onCloseFn }) =>{

    const { firmDetails } = useContext(UserDetailsContext);
    const [employeeData,setEmployeeData] = useState({
        employee_name:"",
        date_of_birth:"",
        age:"",
        gender:"",
        profile_url:"",
        email_id:"",
        address:"",
        city:"",
        state:"",
        pincode:"",
        mobile_number:"",
        alt_mobile_number:"",
        date_of_birth:"",
        bank_name:"",
        bank_branch:"",
        account_number:"",
        IFSC_code:"",
        firm:firmDetails._id
    });
    
    const [loading,setLoading]=useState(false);
    const [toastMsg,setToastMsg] =useState("");
    const [toastStatus,setToastStatus] = useState(false);
    const [selectedTab,setSelectedTab] = useState(1);
    const [uploadFile, setUploadFile] = useState("");

    let today = new Date();
    let maxDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

    const handleTabChange = (tabIndex)=>{
        setSelectedTab(tabIndex)
    }
    const handleInputChange = (e) =>{
        setEmployeeData({...employeeData,[e.target.name]:e.target.value})
    }


    const handleValidate = () =>{
        if(employeeData.employee_name.trim()==""){
            setToastMsg("Employee Name cannot be empty");
            setToastStatus(false);
            return false;
        }
        if(employeeData.mobile_number.toString().trim()==""){
            setToastMsg("Mobile Number cannot be empty");
            setToastStatus(false);
            return false;
        }
        if(employeeData.address.trim()==""){
            setToastMsg("Address cannot be empty");
            setToastStatus(false);
            return false;
        }
        if(employeeData.gender.trim()==""){
            setToastMsg("Gender is Required");
            setToastStatus(false);
            return false;
        }
        if(employeeData.city.trim()==""){
            setToastMsg("City cannot be empty");
            setToastStatus(false);
            return false;
        }
        if(employeeData.state.trim()==""){
            setToastMsg("State cannot be empty");
            setToastStatus(false);
            return false;
        }
        if(employeeData.pincode.toString().trim()==""){
            setToastMsg("pincode cannot be empty");
            setToastStatus(false);
            return false;
        }
        return true
    }   
    const handleSaveEmployee = () => {
        setLoading(true)
        let isSuccess = handleValidate();
        if(!isSuccess){
            setLoading(false)
            return;

        }
        if(uploadFile){
            const formData = new FormData ();
            formData.append("file", uploadFile);
            formData.append("upload_preset", "ruwqs5az");
            formData.append("folder","employees/"+firmDetails._id+"/"+employeeData.employee_name);
            axios.post(
             "https://api.cloudinary.com/v1_1/dkjcfh7oj/image/upload",
             formData
           ).then((response)=>{
               let employeeDetails = {...employeeData,profile_url:response.data.secure_url,age:findEmployeeAge()} 
               setEmployeeData(employeeDetails)
               AuthorizedApi.post('/employee/new',{employeeDetails}).then((res)=>{
                   console.log(res)
                   setLoading(false);
                   setToastMsg("Employee Created successfully");
                   setEmployeeData(employeeDetails)
                   setToastStatus(true);
                   setUploadFile(null)
                   onCloseFn()
                   getAllEmployees("Employee Created successfully");
               }).catch((err)=>{
                   setLoading(false)
                   setToastMsg("Error in Creating Employee");
                   setToastStatus(false);
                   console.log(err)
               })
           }).catch((error) => {
            console.log(error);
            setToastMsg("Error in Uploading Image");
            setToastStatus(false);
            
          });
        }else{
            let employeeDetails = {...employeeData,age:findEmployeeAge(employeeData.date_of_birth)} 
            setEmployeeData(employeeDetails)
            AuthorizedApi.post('/employee/new',{employeeDetails}).then((res)=>{
                console.log(res)
                setLoading(false);
                setToastMsg("Employee Created successfully");
                setEmployeeData(employeeDetails)
                setToastStatus(true);
                setUploadFile(null)
                onCloseFn();
                getAllEmployees("Employee Created successfully");
            }).catch((err)=>{
                setLoading(false)
                setToastMsg("Error in Creating Employee");
                setToastStatus(false);
                console.log(err)
            })
        }
    }

    const findEmployeeAge = () =>{
        var today = new Date();
        var birthDate = new Date(employeeData.date_of_birth);  
        console.log(today,birthDate)
        var age_now = today.getFullYear() - birthDate.getFullYear();
        var m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
        {
            age_now--;
        }
        return age_now;
    }

    const handleUpdateEmployee = () =>{
        setLoading(true)
        let isSuccess = handleValidate();
        if(!isSuccess){
            setLoading(false)
            return;
        }
        if(uploadFile){
            const formData = new FormData ();
            formData.append("file", uploadFile);
            formData.append("upload_preset", "ruwqs5az");
            formData.append("folder","employees/"+firmDetails._id+"/"+employeeData.employee_name);
            axios.post(
             "https://api.cloudinary.com/v1_1/dkjcfh7oj/image/upload",
             formData
           ).then((response)=>{
               let employeeDetails = {...employeeData,profile_url:response.data.secure_url,age:findEmployeeAge()} 
               setEmployeeData(employeeDetails)
               AuthorizedApi.put('/employee/update/'+employeeDetails._id,{employeeDetails}).then((res)=>{
                   console.log(res)
                   setLoading(false);
                   setToastMsg("Employee Updated successfully");
                   setEmployeeData(employeeDetails)
                   setToastStatus(true);
                   setUploadFile(null);
                   onCloseFn();
                   getAllEmployees("Employee Updated successfully")
               }).catch((err)=>{
                   setLoading(false)
                   setToastMsg("Error in Updating Employee");
                   setToastStatus(false);
                   console.log(err)
               })
           }).catch((error) => {
            console.log(error);
            setToastMsg("Error in Uploading Image");
            setToastStatus(false);
            setLoading(false);
          });
        }else{
            let employeeDetails = {...employeeData,age:findEmployeeAge(employeeData.date_of_birth)} 
            setEmployeeData(employeeDetails)
            AuthorizedApi.put('/employee/update/'+employeeDetails._id,{employeeDetails}).then((res)=>{
                console.log(res)
                setLoading(false);
                setToastMsg("Employee Updated successfully");
                setEmployeeData(employeeDetails)
                setToastStatus(true);
                getAllEmployees("Employee Updated successfully")
                setUploadFile(null)
                onCloseFn();
            }).catch((err)=>{
                setLoading(false)
                setToastMsg("Error in Updating Employee");
                setToastStatus(false);
                console.log(err)
            })
        }
    }

    

    useEffect(()=>{
        var today = new Date();
        let todayFormatDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
        if(isNewEmployee){
            setEmployeeData({...employeeData,date_of_birth:todayFormatDate})
        }
        else{
            setEmployeeData(employeeDetails)
        }
    },[])


     return (
        <div className='flex flex-col'>
        <div className='grid grid-cols-2'>
            <div className='p-4 w-[300px] truncate'>
                {
                    employeeData.profile_url == '' ?
                   
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
                        <img src={employeeData.profile_url} className='w-[200px] aspect-square rounded-full border border-gray-300'/>
                        <p className='absolute bottom-2 right-1/4 p-2 bg-red-500 rounded-full cursor-pointer text-white' onClick={()=>setEmployeeData({...employeeData,profile_url:""})}>
                            {
                                Icons['delete-icon']
                            }
                        </p>
                    </div>
                }
            </div>
            <div className='flex flex-col gap-y-4'>
                <InputComponent inputType="text" labelName="Employee Name" inputName="employee_name" inputValue={employeeData.employee_name} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>
                <InputComponent inputType="date" labelName="Date of Birth" inputName="date_of_birth" inputValue={employeeData.date_of_birth} jsonDetails={employeeData} setJsonDetails={setEmployeeData} maxValue={maxDate}/>
                <SelectComponent labelName="gender" inputName="gender" inputValue={employeeData.gender} inputArray={genderNames} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>
                <InputComponent inputType="text" labelName="mobile number" inputName="mobile_number" inputValue={employeeData.mobile_number} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>                        
                <InputComponent inputType="text" labelName="alternate mobile number" inputName="alt_mobile_number" inputValue={employeeData.alt_mobile_number} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>
                <InputComponent inputType="text" labelName="Email ID" inputName="email_id" inputValue={employeeData.email_id} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>
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
                        <InputComponent inputType="text" labelName="Address" inputName="address" inputValue={employeeData.address} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>
                        <InputComponent inputType="text" labelName="City" inputName="city" inputValue={employeeData.city} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>
                        <InputComponent inputType="number" labelName="pincode" inputName="pincode" inputValue={employeeData.pincode} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>
                        <SelectComponent labelName="state" inputName="state" inputValue={employeeData.state} inputArray={stateNames} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>
                    </div> : 
                    <div className='flex flex-col gap-y-4'>
                        <InputComponent inputType="text" labelName="Bank Name" inputName="bank_name" inputValue={employeeData.bank_name} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>
                        <InputComponent inputType="text" labelName="Branch Name" inputName="bank_branch" inputValue={employeeData.bank_branch} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>
                        <InputComponent inputType="number" labelName="Account Number" inputName="account_number" inputValue={employeeData.account_number} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>
                        <InputComponent inputType="text" labelName="IFSC Code" inputName="IFSC_code" inputValue={employeeData.IFSC_code} jsonDetails={employeeData} setJsonDetails={setEmployeeData}/>
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
            isNewEmployee ? 
            <p className='text-white bg-blue-500 rounded-md p-1 cursor-pointer px-6 capitalize w-fit ml-auto mr-2 select-none' onClick={()=>handleSaveEmployee()}>save</p>
            :
            <p className='text-white bg-blue-500 rounded-md p-1 cursor-pointer px-6 capitalize w-fit ml-auto mr-2 select-none' onClick={()=>handleUpdateEmployee()}>update</p>
        }
    </div>
    )
}

const EmployeeCard = ({employeeDetails,handleView,handleEdit,handleDelete}) =>{
    

    return(
        <div className='p-2 border border-gray-300 w-full'>
            <div className='flex gap-x-4 items-center relative'>
                <div className='w-[50px] rounded-full'>
                    {
                        employeeDetails.profile_url == '' ? 
                        <img src={employeeDetails.default_profile_url} alt='Not Found' className='h-full w-full object-cover '/> 
                        :
                        <img src={employeeDetails.profile_url} alt='Not Found' className='h-full aspect-square object-cover rounded-full'/> 
                    }
                </div>
                <div className='grid grid-cols-3 w-full'>
                    <div className='text-slate-900  w-full col-span-2'>
                        <p className='font-semibold truncate'>{employeeDetails.employee_name}</p>
                        <p className=''>Age : {employeeDetails.age}</p>
                    </div>
                    <p className={`px-2 py-1 h-fit w-fit rounded-md capitalize  ${employeeDetails.gender=='male'?'bg-blue-500':"bg-green-500"} text-white select-none`}>{employeeDetails.gender}</p>

                </div>
                <div className=' relative ml-auto cursor-pointer group'>
                    <div className='p-4'>
                        {
                            Icons['more-icon']
                        }
                    </div>
                    <div className='absolute hidden group-hover:block right-4 top-10 cursor-pointer z-10 bg-white border border-gray-300 rounded-md shadow-md min-w-[150px] '>
                        <p className='flex px-4 py-2 items-center gap-x-2  hover:text-green-600 font-semibold' onClick={()=>handleView(employeeDetails)}>
                            {
                                Icons['eye-icon']
                            }
                            <span>View</span>
                        </p>
                        <p className='flex px-4 py-2 items-center gap-x-2 hover:text-blue-600 font-semibold' onClick={()=>handleEdit(employeeDetails)}>
                            {
                                Icons['edit-icon']
                            }
                            <span>Edit</span>
                        </p>
                        <p className='flex px-4 py-2 items-center gap-x-2 hover:text-red-600 font-semibold' onClick={()=>handleDelete(employeeDetails)}>
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

const EmployeeDetailsPopUp = ({employeeDetails})=>{
    return (
        <div className='flex flex-col w-full'>
            <div className='flex items-center justify-center w-full'>
                {
                    <img src={employeeDetails.profile_url == '' ? employeeDetails.default_profile_url: employeeDetails.profile_url} alt='not found' className='w-[100px] aspect-square  object-cover rounded-full'/>
                }
                
            </div>
            <p className='font-bold text-slate-600 text-center mb-2'>{employeeDetails.employee_name}</p>
            <div className='flex flex-col gap-y-2'>
                <div className='grid grid-cols-2 text-slate-500'>
                    <p className='font-semibold'>Age</p>
                    <p>: {employeeDetails.age}</p>
                </div>
                <div className='grid grid-cols-2 text-slate-500'>
                    <p className='font-semibold'>Date of Birth</p>
                    <p>: {employeeDetails.date_of_birth}</p>
                </div>
                <div className='grid grid-cols-2 text-slate-500 capitalize'>
                    <p className='font-semibold'>Gender</p>
                    <p>: {employeeDetails.gender}</p>
                </div>
                <div className='grid grid-cols-2 text-slate-500 capitalize'>
                    <p className='font-semibold'>Mobile Number</p>
                    <p>: {employeeDetails.mobile_number}</p>
                </div>
                <div className='grid grid-cols-2 text-slate-500 capitalize'>
                    <p className='font-semibold'>alternate mobile number</p>
                    <p>: {employeeDetails.alt_mobile_number}</p>
                </div>
                <div className='grid grid-cols-2 text-slate-500 capitalize'>
                    <p className='font-semibold'>Address</p>
                    <p>: {employeeDetails.address}</p>
                </div>
                <div className='grid grid-cols-2 text-slate-500 capitalize'>
                    <p className='font-semibold'>City</p>
                    <p>: {employeeDetails.city}</p>
                </div>
                <div className='grid grid-cols-2 text-slate-500 capitalize'>
                    <p className='font-semibold'>state</p>
                    <p>: {employeeDetails.state}</p>
                </div>
                <div className='grid grid-cols-2 text-slate-500 capitalize'>
                    <p className='font-semibold'>pincode</p>
                    <p>: {employeeDetails.pincode}</p>
                </div>
                <div className='grid grid-cols-2 text-slate-500 capitalize'>
                    <p className='font-semibold'>Account Number</p>
                    <p>: {employeeDetails.account_number}</p>
                </div>
                <div className='grid grid-cols-2 text-slate-500 capitalize'>
                    <p className='font-semibold'>IFSC Code</p>
                    <p>: {employeeDetails.IFSC_code}</p>
                </div>
                <div className='grid grid-cols-2 text-slate-500 capitalize'>
                    <p className='font-semibold'>Bank Name</p>
                    <p>: {employeeDetails.bank_name}</p>
                </div>
                <div className='grid grid-cols-2 text-slate-500 capitalize'>
                    <p className='font-semibold'>Branch</p>
                    <p>: {employeeDetails.bank_branch}</p>
                </div>

            </div>
        </div>
    )
}


export default Employees