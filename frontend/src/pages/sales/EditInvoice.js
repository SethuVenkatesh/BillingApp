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
import { useLocation,useNavigate } from 'react-router-dom'



const EditInvoice = () => { 
let today = new Date();
    let maxDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
  const [paymentInDetails,setPatymentInDetails]  = useState({
    items:[],
    subTotal:"",
    totalPrice:"",
    SGSTPrice:"",
    CGSTPrice:"",
    SGSTPer :"",
    CGSTPer :"",
    includeGST:false,
    invoiceDate:maxDate
  })
  const [addedItems,setAddedItems] = useState([{item_name:"Item 1",price:"1",quantity:"1"}])
  const [toastMsg,setToastMsg] =useState("");
  const [toastStatus,setToastStatus] = useState(false);
  const [showGST,setShowGST] = useState(false);
  const [GSTDetails,setGSTDetails] = useState({
    CGST:2.5,
    SGST:2.5
  })
  const [companyDetails,setCompanyDetails] = useState({
    party_name:"",
    email_id:"",
    address:"",
    city:"",
    state:"",
    pincode:"",
    GST_number:"",
    mobile_number:"",
    alt_mobile_number:""
  });

  const [partyId,setPartyId] = useState("");  
  const [partyName,setPartyName] = useState("");
  const [loading,setLoading] = useState(false);
  const [allPartyItems,setAllPartyItems] = useState([])
  const {firmDetails} = useContext(UserDetailsContext)

  const onChangeParty = (res) =>{
    console.log("onChnage Party",res)
    setPartyName(res)
  }
  

  const addNewItems = () =>{
        setAddedItems([...addedItems,{item_name:"Item "+(addedItems.length+1),price:"1",quantity:"1"}])
    }

    const calculateBill = () =>{
        let lastItem = addedItems[addedItems.length-1];
        console.log(lastItem)
        if(lastItem.item_name.trim() == ""){
            setToastMsg("Item Name cannot be empty");
            setToastStatus(false);
            return;
        }
        if(lastItem.price.toString().trim() == ""){
            setToastMsg("Price Cannot be empty");
            setToastStatus(false);
            return;
        }
        if(lastItem.quantity.toString().trim() == ""){
            setToastMsg("Quantity Cannot be empty");
            setToastStatus(false);
            return;
        }
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
            GSTPrice = GSTPrice.toFixed(3)
            SGSTPer = GSTDetails.SGST;
            CGSTPer = GSTDetails.CGST;
        }
        setPatymentInDetails({...paymentInDetails,subTotal:totalPrice,items:addedItems,totalPrice: GSTPrice,CGSTPrice:CGSTPrice,SGSTPrice:SGSTPrice,CGSTPer:CGSTPer,SGSTPer:SGSTPer,includeGST:includeGST})
        
    }
    const handleCheckOut = () =>{

        let {invoiceDetail} = state;
        if(paymentInDetails.items.length == 0){
            setToastStatus(false);
            setToastMsg("Calculate the Bill and then Checkout")
             return;
        }
        let invoiceData = {
            payment_details:paymentInDetails,
            party:{...companyDetails,party_name:partyName},
            firm:firmDetails._id
        }
        setLoading(true);
        AuthorizedApi.put("/sales/edit_invoice?invoice_id="+invoiceDetail._id,{invoiceData}).then((res)=>{
            setToastStatus(true);
            setToastMsg("Invoice Updated Successfully");
            setPartyName("")
            setCompanyDetails({  
            party_name:"",
            email_id:"",
            address:"",
            city:"",
            state:"",
            pincode:"",
            GST_number:"",
            mobile_number:"",
            alt_mobile_number:""
            })
            setPatymentInDetails({
                items:[],
                subTotal:"",
                totalPrice:"",
                SGSTPrice:"",
                CGSTPrice:"",
                SGSTPer :"",
                CGSTPer :"",
                includeGST:false,
                invoiceDate:maxDate
            })

            setAddedItems([{item_name:"Item 1",price:"1",quantity:"1"}])
            setLoading(false);
        }).catch(err=>{
            console.log(err)
            setLoading(false);
            setToastStatus(false);
            setToastMsg(err.message)
        })
    }


    const {state} = useLocation();
    
    useEffect(()=>{
        let {invoiceDetail} = state;
        
        setPatymentInDetails(invoiceDetail.payment_details)
        setCompanyDetails(invoiceDetail.party)
        setPartyName(invoiceDetail.party.party_name)
        setAddedItems(invoiceDetail.payment_details.items)

    },[])

  useEffect(()=>{
      if(partyId != ""){
        setLoading(true);
        AuthorizedApi.get(`party/all_items?firmId=${firmDetails._id}&partyId=${partyId}`).then(res=>{
            setLoading(false);
            setAllPartyItems(res.data);
        }).catch(err=>{
            console.log(err);
            setLoading(false);
        })
    }
  },[partyId]) 



  const getParties = async (query) =>{
    try{
        const response =await AuthorizedApi.get('party/all'+`?partyName=${query}`)
        return response.data;
    }catch(err){
        return err;
    }
  }
  
  console.log("party",allPartyItems)
  return (
    <>
        {
            loading ? <Loader/> : (
                <div className='p-4 m-2 border'>
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
                                onInputChange={(res)=>{
                                    onChangeParty(res)
                                }}
                                onSelect = {(res) => 
                                    {
                                        setPartyId(res._id)
                                        setCompanyDetails({...companyDetails,party_name:res.party_name,email_id:res.email_id,address:res.address,city:res.city,mobile_number:res.mobile_number,pincode:res.pincode,alt_mobile_number:res.alt_mobile_number,GST_number:res.GST_number,state:res.state})
                                    }
                                }
                                
                                fetchSuggestions ={getParties}
                                dataKey ="party_name"
                                
                            />                      
                            <InputComponent inputType="text" labelName="Email Id" inputName="email_id" inputValue={companyDetails.email_id} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                            <InputComponent inputType="text" labelName="Address" inputName="address" inputValue={companyDetails.address} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                            <InputComponent inputType="text" labelName="City" inputName="city" inputValue={companyDetails.city} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                            <SelectComponent labelName="state" inputName="state" inputValue={companyDetails.state} inputArray={stateNames} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>
                            <InputComponent inputType="number" labelName="pincode" inputName="pincode" inputValue={companyDetails.pincode} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                            {
                                showGST &&
                                <InputComponent inputType="text" labelName="GST Number" inputName="GST_number" inputValue={companyDetails.GST_number} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                            }
                            <InputComponent inputType="text" labelName="mobile number" inputName="mobile_number" inputValue={companyDetails.mobile_number} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
                            <InputComponent inputType="text" labelName="alternate mobile number" inputName="alt_mobile_number" inputValue={companyDetails.alt_mobile_number} jsonDetails={companyDetails} setJsonDetails={setCompanyDetails}/>                        
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
                                    <input className='' type="checkbox" value={showGST} onChange={()=>setShowGST(!showGST)}/>
                                    <label className='text-sm text-sky-500 font-semibold'>Include GST (Goods And Service Tax) </label>
                                </div>
                                {
                                    showGST && 
                                    <div className='flex gap-x-2 gap-y-4'>
                                        <InputComponent inputType="number" labelName="CSGT" inputName="CGST" inputValue={GSTDetails.CGST} jsonDetails={GSTDetails} setJsonDetails={setGSTDetails}/>                        
                                        <InputComponent inputType="number" labelName="SGST" inputName="SGST" inputValue={GSTDetails.SGST} jsonDetails={GSTDetails} setJsonDetails={setGSTDetails}/>                        
                                    </div>
                                }
                                <div className='flex gap-x-2 gap-y-4'>
                                    <p className='px-2 py-1 shadow-md font-semibold w-fit select-none cursor-pointer rounded-md   bg-blue-200 text-blue-500 mb-2 left' onClick={()=>addNewItems()}>{Icons['add-icon']} Add Items</p>
                                    <p className='px-2 py-1 shadow-md text-white font-semibold w-fit select-none cursor-pointer rounded-md   bg-green-300 text-green-600 mb-2 left' onClick={()=>calculateBill()}>{Icons['calculate-icon']} Calculate</p>
                                </div>
                            </div>
                            <div className='p-4 border border-gray-300 rounded-md h-max mb-2'>
                                <p className='text-slate-500 mb-4 capitalize font-semibold text-md'>Items Summary</p>
                                {
                                    paymentInDetails.items.length == 0 ? 
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
                                            paymentInDetails.items.map((item)=>{
                                                return(
                                                    <div className='grid grid-cols-4 mb-2'>
                                                        <p className=' text-slate-600 col-span-2 flex'><span className='w-5/6 truncate overflow-hidden'>{item.item_name}</span> x {item.quantity}</p>
                                                        <p className=' text-slate-600'>{item.price}</p>
                                                        <p className=' text-slate-600'>{item.price * item.quantity}</p>
                                                    </div>  
                                                )
                                            })
                                        }
                                        {
                                            paymentInDetails.includeGST && 
                                            <>
                                                <div className='grid grid-cols-4 mb-2'>
                                                    <p className='font-semibold text-slate-500 col-span-2'></p>
                                                    <p className='font-semibold text-slate-500'>Sub Total</p>
                                                    <p className='font-semibold text-slate-500'>{paymentInDetails.subTotal}</p>
                                                </div>
                                                <div className='grid grid-cols-4 mb-2'>
                                                    <p className='font-semibold text-slate-500 col-span-2'></p>
                                                    <p className='font-semibold text-slate-500'>CGST Price ({paymentInDetails.CGSTPer})%</p>
                                                    <p className='font-semibold text-slate-500'>{paymentInDetails.CGSTPrice}</p>
                                                </div>
                                                <div className='grid grid-cols-4 mb-2'>
                                                    <p className='font-semibold text-slate-500 col-span-2'></p>
                                                    <p className='font-semibold text-slate-500'>SGST Price ({paymentInDetails.SGSTPer})%</p>
                                                    <p className='font-semibold text-slate-500'>{paymentInDetails.SGSTPrice}</p>
                                                </div> 
                                            </>
                                        }
                                        <div className='grid grid-cols-4 mb-2'>
                                            <p className='font-semibold text-slate-500 col-span-2'></p>
                                            <p className='font-semibold text-slate-500'>Total</p>
                                            <p className='font-semibold text-slate-500'>{paymentInDetails.totalPrice}</p>
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
        setItemData({
            ...itemData,
            item_name:res,
        })
    }

    console.log("handleItem",allItems)  
    
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
                        setItemData({...itemData,item_name:res.item_name,price:res.price})
                        const allItemsModified = [...allItems];
                        allItemsModified[itemIndex] = {...allItemsModified[itemIndex],item_name:res.item_name,price:res.price};
                        setAddedItems(allItemsModified);  
                    }
                }
                onInputChange={(res)=>{
                    onChangeItem(res)
                }}
                value={itemData.item_name}
                staticData={allPartyItems}
                dataKey ="item_name"          
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



export default EditInvoice