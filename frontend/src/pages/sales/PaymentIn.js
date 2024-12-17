import React, { useState,useEffect,useContext } from 'react'
import { AuthorizedApi } from '../../axios'
import { UserDetailsContext } from '../../context/userContext'
import { stateNames } from '../../constants'
import Icons from '../../components/common/Icons'
import InputComponent from '../../components/common/InputComponent'
import Loader from '../../components/common/Loader'
import Toaster from '../../components/common/Toaster'
import SelectComponent from '../../components/common/SelectComponent'
import AutoComplete from '../../components/common/AutoComplete'
import { billingItemValidation, invoiceValidation } from '../../utils/CommonUtils'

const PaymentIn = () => {

    let today = new Date();
    let maxDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
    const [paymentInDetails,setPatymentInDetails]  = useState({
    invoiceItems:[],
    subtotalPrice:0,
    totalPrice:0,
    cgstPrice:0,
    sgstPrice:0,
    sgstPer :0,
    cgstPer :0,
    includeGst:false,
    invoiceDate:maxDate
  })
  const [addedItems,setAddedItems] = useState([{itemName:"Item 1",price:10,quantity:1}])
  const [toastMsg,setToastMsg] =useState("");
  const [toastStatus,setToastStatus] = useState(false);
  const [showGST,setShowGST] = useState(false);
  const [GSTDetails,setGSTDetails] = useState({
    CGST:2.50,
    SGST:2.50
  })
  const [companyDetails,setCompanyDetails] = useState({
    partyName:"",
    email:"",
    gstNumber:"",
    mobileNumber:"",
    altMobileNumber:"",
    address:{
        address:"",
        city:"",
        pincode:"",
        state:""
    }
  });
  const [partyName,setPartyName] = useState("");
  const [partySearchQuery,setPartySearchQuery] = useState("")
  const [loading,setLoading] = useState(false);
  const [allPartyItems,setAllPartyItems] = useState([])
  const {firmDetails} = useContext(UserDetailsContext)

  const onChangeParty = (res) =>{
    setPartySearchQuery(res);
    setPartyName(res);
  }
  

  const addNewItems = () =>{
        billingItemValidation.validate(addedItems,{abortEarly:false}).then((valid)=>{
            setAddedItems([...addedItems,{itemName:"Item "+(addedItems.length+1),price:10,quantity:1}])
        }).catch(error=>{
            setToastMsg(error.inner[0]?.message);
            setToastStatus(false); 
        })
    }

    const calculateBill = () =>{
        console.log("addedItems",addedItems)
        billingItemValidation.validate(addedItems,{abortEarly:false}).then((valid)=>{
            let totalPrice = 0;
            addedItems.map(item=>{
                totalPrice  = totalPrice + (item.price * item.quantity)
            })
            let GSTPrice = totalPrice; 
            let SGSTPrice = 0;
            let CGSTPrice = 0;
            let SGSTPer = 0;
            let CGSTPer = 0;
            let includeGST = showGST;
            if(showGST){
                CGSTPrice = totalPrice * GSTDetails.CGST /100;
                SGSTPrice = totalPrice * GSTDetails.SGST /100;
                GSTPrice = totalPrice + SGSTPrice + CGSTPrice;
                CGSTPrice = parseFloat(CGSTPrice).toFixed(2);
                SGSTPrice = parseFloat(SGSTPrice).toFixed(2);
                GSTPrice = parseFloat(GSTPrice).toFixed(2);
                SGSTPer = parseFloat(GSTDetails.SGST).toFixed(2);
                CGSTPer = parseFloat(GSTDetails.CGST).toFixed(2);
                CGSTPrice = parseFloat(CGSTPrice).toFixed(2);
                totalPrice = parseFloat(totalPrice).toFixed(2);
            }else{
                GSTPrice = parseFloat(GSTPrice).toFixed(2);
            }
            
            setPatymentInDetails({...paymentInDetails,subtotalPrice:totalPrice,invoiceItems:addedItems,totalPrice: GSTPrice,cgstPrice:CGSTPrice,sgstPrice:SGSTPrice,cgstPer:CGSTPer,sgstPer:SGSTPer,includeGst:includeGST})
        }).catch(error=>{
            setLoading(false);
            setToastMsg(error.inner[0]?.message);
            setToastStatus(false);  
        })        
    }
    const handleCheckOut = () =>{
        let invoiceData = {
            ...paymentInDetails,
            invoiceParty:{...companyDetails,partyName:partyName},
        }
        console.log(invoiceData)
        if(invoiceData.invoiceItems.length == 0){
            setToastMsg("Calculate the Bill and then proceed to checkout");
            setToastStatus(false);
            return;
        }
        setLoading(true);
        invoiceValidation.validate(invoiceData,{abortEarly:false}).then((valid)=>{
            AuthorizedApi.post("/invoice/new",{...invoiceData}).then((res)=>{
                setToastStatus(true);
                setToastMsg(res.data.message);
                setPartyName("")
                setCompanyDetails({  
                    partyName:"",
                    email:"",
                    gstNumber:"",
                    mobileNumber:"",
                    altMobileNumber:"",
                    address:{
                        address:"",
                        city:"",
                        pincode:"",
                        state:""
                    }
                })
                setPatymentInDetails({
                    invoiceItems:[],
                    subtotalPrice:0,
                    totalPrice:0,
                    cgstPrice:0,
                    sgstPrice:0,
                    sgstPer :0,
                    cgstPer :0,
                    includeGst:false,
                    invoiceDate:maxDate
                })
                setAddedItems([{itemName:"Item 1",price:10,quantity:1}])
                setLoading(false);
            }).catch(err=>{
                console.log(err)
                setLoading(false);
                setToastStatus(false);
                setToastMsg(err.response.data.message)
            })
            console.log("invoiceData",invoiceData)
        }).catch((error)=>{
            setLoading(false);
            setToastMsg(error.inner[0]?.message);
            setToastStatus(false); 
        })


    }

 


  const getPartyItems = (partyName) =>{
    if(partyName.trim() !== ""){
        setLoading(true);
        AuthorizedApi.get(`items/all_party_items?partyName=${partyName}`).then(res=>{
            setLoading(false);
            setAllPartyItems(res.data.data);
        }).catch(err=>{
            console.log(err);
            setLoading(false);
        })
  }
}


  const getParties = async (query) =>{
    try{
        const response =await AuthorizedApi.get('/parties/lists'+`?partyName=${query}`);
        return response.data.data;
    }catch(err){
        return err;
    }
  }
  
  return (
    <>
        {
            loading ? <Loader/> : (
                <div className='p-4 m-2 border   '>
                    <p className='text-slate-500 mb-4 text-center capitalize font-bold text-lg'>Sales Invoice</p>
                    <div className='w-max ml-auto'>
                        <InputComponent inputType="date" labelName="Invoice Date" inputName="invoiceDate" inputValue={paymentInDetails.invoiceDate} jsonDetails={paymentInDetails} setJsonDetails={setPatymentInDetails} maxValue={maxDate}/>
                    </div>
                    <div className='border-gray-300 border-b mb-4 pb-4'>
                        <p className='text-slate-500 mb-4 capitalize font-semibold text-md'>Party Details</p>
                        <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-4 gap-y-4'>   
                            <AutoComplete
                                placeholder={"Party Name"}
                                customLoading = {<>Loading...</>}
                                value={partyName}
                                searchQuery = {partySearchQuery}
                                setSearchQuery={setPartySearchQuery}
                                onInputChange={(res)=>{
                                    onChangeParty(res)
                                }}
                                onSelect = {(res) => 
                                    {
                                        setPartyName(res.partyName);
                                        getPartyItems(res.partyName);
                                        setCompanyDetails({...companyDetails,partyName:res.partyName,email:res.email,address:res.address,mobileNumber:res.mobileNumber,altMobileNumber:res.altMobileNumber,gstNumber:res.gstNumber})
                                    }
                                }
                                fetchSuggestions ={getParties}
                                dataKey ="partyName"
                                
                            />                      
                            <InputComponent inputType="text" labelName="Email Id" inputName="email" inputValue={companyDetails.email} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                            <InputComponent inputType="text" labelName="Address" section='address' inputName="address" inputValue={companyDetails.address.address} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                            <InputComponent inputType="text" labelName="City" section='address' inputName="city" inputValue={companyDetails.address.city} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                            <SelectComponent labelName="state" section='address' inputName="state" inputValue={companyDetails.address.state} inputArray={stateNames} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>
                            <InputComponent inputType="number" labelName="pincode" section='address' inputName="pincode" inputValue={companyDetails.address.pincode} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                            {
                                showGST &&
                                <InputComponent inputType="text" labelName="GST Number" inputName="gstNumber" inputValue={companyDetails.gstNumber} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                            }
                            <InputComponent inputType="number" labelName="mobile number" inputName="mobileNumber" inputValue={companyDetails.mobileNumber} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                            <InputComponent inputType="number" labelName="alternate mobile number" inputName="altMobileNumber" inputValue={companyDetails.altMobileNumber} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                        </div>
                    </div>
                    <div className=''>
                        <div className='grid lg:grid-cols-2 md:grid-cols-1 '>
                            <div>
                                <p className='text-slate-500 mb-4 capitalize font-semibold text-md'>Item Details</p>
                                {
                                    addedItems.map((itemDetails,index)=>{
                                        return(
                                            <ItemComponent itemDetails={itemDetails} itemIndex={index} setAddedItems={setAddedItems} allItems={addedItems} setToastStatus={setToastStatus} setToastMsg={setToastMsg} allPartyItems={allPartyItems}/>
                                        )
                                    })
                                }
                                <div className='flex gap-x-4 items-center mb-4'>
                                    <input className='' type="checkbox" checked={showGST} onChange={()=>setShowGST(!showGST)}/>
                                    <label className='text-sm text-sky-500 font-semibold'>Include GST (Goods And Service Tax) </label>
                                </div>
                                {
                                    showGST && 
                                    <div className='flex gap-x-2 mb-4'>
                                        <InputComponent inputType="number" labelName="CSGT" inputName="CGST" inputValue={GSTDetails.CGST} jsonDetails={GSTDetails} setJsonDetails={setGSTDetails}/>                        
                                        <InputComponent inputType="number" labelName="SGST" inputName="SGST" inputValue={GSTDetails.SGST} jsonDetails={GSTDetails} setJsonDetails={setGSTDetails}/>                        
                                    </div>
                                }
                                <div className='flex gap-x-2'>
                                    <p className='px-2 py-1 shadow-md font-semibold w-fit select-none cursor-pointer rounded-md   bg-blue-200 text-blue-500 mb-2 left' onClick={()=>addNewItems()}>{Icons['add-icon']} Add Items</p>
                                    <p className='px-2 py-1 shadow-md text-white font-semibold w-fit select-none cursor-pointer rounded-md   bg-green-300 text-green-600 mb-2 left' onClick={()=>calculateBill()}>{Icons['calculate-icon']} Calculate</p>
                                </div>
                            </div>
                            <div className='p-4 border border-gray-300 rounded-md h-max mb-2'>
                                <p className='text-slate-500 mb-4 capitalize font-semibold text-md'>Items Summary</p>
                                {
                                    paymentInDetails.invoiceItems.length == 0 ? 
                                    <>
                                        <p className='text-center text-gray-400'>Click calcualte to see the summary details </p>
                                    </>:
                                    <>
                                        <div className='grid grid-cols-4 mb-2'>
                                            <p className='font-semibold text-slate-600 col-span-2'>Item Name</p>
                                            <p className='font-semibold text-slate-600'>Price</p>
                                            <p className='font-semibold text-slate-600'>Total</p>
                                        </div>  
                                        {
                                            paymentInDetails.invoiceItems.map((item)=>{
                                                return(
                                                    <div className='grid grid-cols-4 mb-2'>
                                                        <p className=' text-slate-600 col-span-2 flex'><span className='w-5/6 truncate overflow-hidden'>{item.itemName}</span> x {item.quantity}</p>
                                                        <p className=' text-slate-600'>{parseFloat(item.price).toFixed(2)}</p>
                                                        <p className=' text-slate-600'>{parseFloat(item.price * item.quantity).toFixed(2)}</p>
                                                    </div>  
                                                )
                                            })
                                        }
                                        {
                                            paymentInDetails.includeGst && 
                                            <>
                                                <div className='grid grid-cols-4 mb-2'>
                                                    <p className='font-semibold text-slate-500 col-span-2'></p>
                                                    <p className='font-semibold text-slate-500'>Sub Total</p>
                                                    <p className='font-semibold text-slate-500'>{parseFloat(paymentInDetails.subtotalPrice).toFixed(2)}</p>
                                                </div>
                                                <div className='grid grid-cols-4 mb-2'>
                                                    <p className='font-semibold text-slate-500 col-span-2'></p>
                                                    <p className='font-semibold text-slate-500'>CGST Price ({parseFloat(paymentInDetails.cgstPer).toFixed(2)})%</p>
                                                    <p className='font-semibold text-slate-500'>{parseFloat(paymentInDetails.cgstPrice).toFixed(2)}</p>
                                                </div>
                                                <div className='grid grid-cols-4 mb-2'>
                                                    <p className='font-semibold text-slate-500 col-span-2'></p>
                                                    <p className='font-semibold text-slate-500'>SGST Price ({parseFloat(paymentInDetails.sgstPer).toFixed(2)})%</p>
                                                    <p className='font-semibold text-slate-500'>{parseFloat(paymentInDetails.sgstPrice).toFixed(2)}</p>
                                                </div> 
                                            </>
                                        }
                                        <div className='grid grid-cols-4 mb-2'>
                                            <p className='font-semibold text-slate-500 col-span-2'></p>
                                            <p className='font-semibold text-slate-500'>Total</p>
                                            <p className='font-semibold text-slate-500'>{parseFloat(paymentInDetails.totalPrice).toFixed(2)}</p>
                                        </div>
                                    </> 
                                }
                            </div>
                        </div>
                    </div>
                    <p className='px-2 py-1 shadow-md font-semibold w-fit select-none cursor-pointer rounded-md bg-yellow-200 text-yellow-700 mb-2 ml-auto' onClick={()=>handleCheckOut()}>{Icons["purchase-icon"]} Checkout</p>
                    
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

const ItemComponent = ({itemDetails,itemIndex,setAddedItems,allItems,setToastStatus,setToastMsg,allPartyItems }) => {

    const [itemData,setItemData] = useState({})

    const [itemSearchQuery,setItemSearchQuery] = useState("")

    const handleDelete = () =>{
        if(allItems.length == 1){
            setToastStatus(false);
            setToastMsg("Atleast One Item is required");
            return;
        }
        let allItemsModified = [...allItems];
        allItemsModified = allItemsModified.filter((_, i) => i !== itemIndex);
        setAddedItems(allItemsModified);

    }

    
    const handleItemChange = (e) =>{
        console.log(e.target.name,e.target.value)
        setItemData({...itemData,[e.target.name]:e.target.value})
        const allItemsModified = [...allItems];
        allItemsModified[itemIndex] = {...allItemsModified[itemIndex],[e.target.name]:e.target.value};
        setAddedItems(allItemsModified);  
    }


    const onChangeItem = (res) =>{
        console.log("on Item change",res)
        setItemSearchQuery(res);
        setItemData({
            ...itemData,
            itemName:res,
        })

        const allItemsModified = [...allItems];
        allItemsModified[itemIndex] = {...allItemsModified[itemIndex],itemName:res};
        setAddedItems(allItemsModified);  
    }

    console.log(itemData)
    
    useEffect(()=>{
        setItemData({
            ...itemDetails
        })
    },[allItems])

    return (
        <div className='flex gap-x-2 '>
            <AutoComplete
                placeholder={"Item Name"}
                customLoading = {<>Loading...</>}
                onSelect = {(res) => 
                    {
                        setItemData({...itemData,itemName:res.itemName,price:res.price})
                        const allItemsModified = [...allItems];
                        allItemsModified[itemIndex] = {...allItemsModified[itemIndex],itemName:res.itemName,price:res.price};
                        setAddedItems(allItemsModified);  
                    }
                }
                onInputChange={(res)=>{
                    onChangeItem(res)
                }}
                value={itemData.itemName}
                searchQuery = {itemSearchQuery}
                setSearchQuery={setItemSearchQuery}
                staticData={allPartyItems}
                dataKey ="itemName"          
            />  
            <div className='relative mb-4'>
                <input type='number' id="floating_outlined" class="block px-2 pb-2 pt-2 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={(e)=>handleItemChange(e)} name="price" value={itemData.price}/>
                <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2  peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 pointer-events-none capitalize">Price</label>
            </div>
            <div className='relative mb-4'>
                <input type='number' id="floating_outlined" class="block px-2 pb-2 pt-2 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-md appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" placeholder=" " onChange={(e)=>handleItemChange(e)} name="quantity" value={itemData.quantity}/>
                <label for="floating_outlined" class="absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-900 px-2 peer-focus:px-2  peer-focus:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1 pointer-events-none capitalize">Quantity</label>
            </div>
            <div className='text-gray-500 hover:text-red-500 pointer cursor-pointer' onClick={()=>handleDelete()}>
            {
                Icons['delete-icon']
            }
            </div>
        </div>
    )
}

export default PaymentIn