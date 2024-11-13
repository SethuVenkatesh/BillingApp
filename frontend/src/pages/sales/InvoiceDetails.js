import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { UserDetailsContext } from '../../context/userContext'
import Icons from "../../components/common/Icons"
import PopupComponent from '../../components/common/PopupComponent'
import Toaster from '../../components/common/Toaster'
import InputComponent from '../../components/common/InputComponent'
import Loader from '../../components/common/Loader'

import { useLocation,useNavigate } from 'react-router-dom'
const InvoiceDetails = () => {

    const { firmDetails } = useContext(UserDetailsContext);
    const {state} = useLocation();
    const [invoiceDetail,setInvoiceDetail]= useState();
    const [showPopUp,setShowPopUp]=useState(false);
    const [popUpTitle,setPopUpTitle] = useState("Payment Status");

    const navigate = useNavigate();

    const onCloseFn=()=>{
        setShowPopUp(false);

      }
    useEffect(()=>{
        let {invoiceData} = state;
        setInvoiceDetail(invoiceData)
    },[])

    console.log(invoiceDetail,firmDetails)
  return (
    <div className=''>
        {
            invoiceDetail &&
        
        <div className='border border-gray-400 p-2 flex gap-2'>
            <PopupComponent isOpen={showPopUp} onCloseFn={()=>onCloseFn()} popUpTitle={popUpTitle} isBtnVisible={false} >
                <PaymentStatus billAmount={invoiceDetail.payment_details.totalPrice}/>
            </PopupComponent>
            <div className='p-2 border border-blue-200 w-3/4 min-h-[90vh] flex flex-col justify-between'>
                <div>
                <div className='flex gap-x-4 mb-2 pb-2 border-b-2'>
                    <div className='w-[75px] h-[75px] border border-gray-200 shadow-md rounded-full overflow-hidden'>
                        {
                            firmDetails.logo_url == '' &&
                            <img className='w-full object-cover ' src={firmDetails.default_logo_url} alt='not-found'/>
                        }
                    </div>

                    <div className='flex justify-center flex-col items-center flex-1'>
                        <p className='bg-blue-500  text-white rounded-sm px-2 font-semibold'>Tax Invoice</p>
                        <p className='text-lg text-gray-500 font-bold uppercase '>{firmDetails.firm_name}</p>
                        <p className='capitalize text-gray-500 font-semibold'>{firmDetails.address}</p>
                        <p className='capitalize text-gray-500 font-semibold'>{firmDetails.city} - {firmDetails.pincode}</p>
                    </div>
                    <div className='text-left'>
                        <p className='text-gray-500'><span className='font-semibold text-gray-600'>GSTIN: </span>{firmDetails.GST_number}</p>
                        <p className='text-gray-500'><span className='font-semibold text-gray-600'>Mobile: </span>{firmDetails.mobile_number}</p>
                    </div>  
                </div>
                <div className='flex justify-between'>
                    <p className='text-gray-500'><span className='font-semibold text-gray-600'>Invoice No: </span>{invoiceDetail.invoice_no}</p>
                    <p className='text-gray-500'><span className='font-semibold text-gray-600'>Invoice Date: </span>{invoiceDetail.payment_details.invoiceDate}</p>
                </div>
                <div className='grid grid-cols-2 mb-2 '>
                    <div className=''>
                        <p className='font-bold text-gray-500'>To:</p>
                        <p className='capitalize text-gray-500 font-semibold'>{invoiceDetail.party.party_name}</p>
                        <p className='capitalize text-gray-500 font-semibold'>{invoiceDetail.party.address}</p>
                        <p className='capitalize text-gray-500 font-semibold'>{invoiceDetail.party.city} - {invoiceDetail.party.pincode}</p>
                    </div>
                    <div className=''>

                    </div>
                </div>
                <table className="min-w-full bg-white border">
                    <thead className='bg-blue-500 text-white'>
                    <tr>
                        <th className="py-2 px-4 border-b-2 border-gray-300">Item</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300">Quantity</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300">Price (In &#8377;)</th>
                        <th className="py-2 px-4 border-b-2 border-gray-300">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoiceDetail.payment_details.items.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-blue-100' : 'bg-white'}>
                        <td className="py-2 px-4 border-b text-center">{item.item_name}</td>
                        <td className="py-2 px-4 border-b text-center">{item.quantity}</td>
                        <td className="py-2 px-4 border-b text-center">{item.price.toFixed(2)}</td>
                        <td className="py-2 px-4 border-b text-center">{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                    {
                        invoiceDetail.payment_details.includeGST ?
                        <>
                        <tr className={invoiceDetail.payment_details.items.length%2 == 0 ? 'bg-blue-100' : 'bg-white'}>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center font-semibold">Sub Total</td>
                            <td className="py-2 px-4 border-b text-center font-semibold">{invoiceDetail.payment_details.subTotal}</td>
                        </tr>
                        <tr className={invoiceDetail.payment_details.items.length%2 == 1 ? 'bg-blue-100' : 'bg-white'}>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center font-semibold">SGST @ {invoiceDetail.payment_details.SGSTPer} %</td>
                            <td className="py-2 px-4 border-b text-center font-semibold">{invoiceDetail.payment_details.SGSTPrice}</td>
                        </tr>
                        <tr className={invoiceDetail.payment_details.items.length%2 == 0 ? 'bg-blue-100' : 'bg-white'}>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center font-semibold">CGST @ {invoiceDetail.payment_details.CGSTPer} % </td>
                            <td className="py-2 px-4 border-b text-center font-semibold">{invoiceDetail.payment_details.CGSTPrice}</td>
                        </tr>
                        <tr className={invoiceDetail.payment_details.items.length%2 == 1 ? 'bg-blue-100' : 'bg-white'}>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center font-semibold">Total</td>
                            <td className="py-2 px-4 border-b text-center font-semibold">{invoiceDetail.payment_details.totalPrice}</td>
                        </tr>
                        </>
                        :
                        <>
                        <tr className={invoiceDetail.payment_details.items.length%2 == 0 ? 'bg-blue-100' : 'bg-white'}>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center font-semibold">Total</td>
                            <td className="py-2 px-4 border-b text-center font-semibold">{invoiceDetail.payment_details.totalPrice}</td>
                        </tr>
                        </>
                    }
                    </tbody>
                </table>
                </div>
                <div className='border border-gray-300 mt-2 rounded-sm grid grid-cols-2 '>
                    <div className='border-r border-gray-300 p-2'>
                        <p className='text-gray-700'><span className='font-semibold text-gray-600'>Bank Name: </span>{firmDetails.bank_name}</p>
                        <p className='text-gray-700'><span className='font-semibold text-gray-600'>Branch: </span>{firmDetails.bank_branch}</p>
                        <p className='text-gray-700'><span className='font-semibold text-gray-600'>A/C No: </span>{firmDetails.account_number}</p>
                        <p className='text-gray-700'><span className='font-semibold text-gray-600'>IFSC Code: </span>{firmDetails.IFSC_code}</p>
                    </div>
                    <div className='p-2 flex flex-col justify-between'>
                        <p className='text-gray-700 uppercase font-semibold'> <span className='capitalize'>For : </span>{firmDetails.firm_name}</p>
                        <img className='w-[60px] h-[60px] m-auto' src='https://c8.alamy.com/comp/2AC1K1G/grunge-blue-signature-word-round-rubber-seal-stamp-on-white-background-2AC1K1G.jpg'/>
                        <p className='text-center'>Authorised Signatory</p>
                    </div>
                </div>
            </div>
            <div className='p-2 flex-1 '>
                <div className='w-3/4 m-auto '>
                    <p className='text-white mb-2 m-auto text-center bg-blue-500 px-4 cursor-pointer py-2 rounded-sm font-semibold text-lg ' onClick={()=>navigate('/dashboard/sales/edit_invoice_details',{state:{invoiceDetail:invoiceDetail}})}>{Icons['edit-icon']} Edit Invoice</p>
                    <p className='text-white m-auto text-center bg-blue-500 px-4 cursor-pointer py-2 rounded-sm font-semibold text-lg ' onClick={()=>setShowPopUp(true)}>{Icons['payment-icon']} Add Payment</p>
                </div>
            </div>
        </div>
            
    }
    </div>
  )
}


const PaymentStatus = ({billAmount}) =>{

  const [loading,setLoading]=useState(false);
  const [toastMsg,setToastMsg] =useState("");
  const [toastStatus,setToastStatus] = useState(false);
  const [fieldEnable,setFieldEnable]= useState(true);

  const [paymentStatus,setPaymentStatus] = useState({
    payment_date:"",
    payment_mode:"",
    payment_status:"",
    amount_paid:"",
    payment_type:"",
    amount_paid:"",
  })

  const validatePayment = () =>{
    if(paymentStatus.payment_status == "Paid"){
        if(paymentStatus.payment_type == ""){
            setToastMsg("Payment Type is mandatory");
            setToastStatus(false);
            return false;
        }else{
            if(paymentStatus.amount_paid.toString().trim() == ""){
                setToastMsg("Amount Paid is mandatory for partial payment");
                setToastStatus(false);
                return false;
            }
        }
        if(paymentStatus.payment_date.toString().trim() == ""){
            setToastMsg("Payment date is mandatory");
            setToastStatus(false);
            return false;
        }
        if(paymentStatus.payment_mode.toString().trim() == "")
        {
            setToastMsg("Payment Mode is mandatory");
            setToastStatus(false);
            return false;
        }
    }
    return true;
  }

  const handleUpdatePayment = () =>{

    if (validatePayment()) {
        console.log("update Payment",paymentStatus)
        let paymentData = {}
        if(paymentStatus.payment_status == "Paid"){
            paymentData ={
                payment_date:paymentStatus.payment_date,
                payment_mode:paymentStatus.payment_mode,
                payment_type:paymentStatus.payment_type,
                payment_status:paymentStatus.payment_status,
                amount_paid:paymentStatus.payment_type == "PP" ? "Part Amount":"Full Amount",     
            }
        }else{
            paymentData ={
                payment_date:"",
                payment_mode:"",
                payment_type:"",
                payment_status:paymentStatus.payment_status,
                amount_paid:"",     
            }
        }
        console.log(paymentData)
    }
  }


  const handleChange= (e)=>{
    let lableName=e.target.name;
    if(lableName == 'payment_status'){
        let labelValue=e.target.value;
        let fieldStatus = labelValue == 'Paid' ? true : false;
        setFieldEnable(fieldStatus)
    }
    setPaymentStatus({...paymentStatus,[e.target.name]:e.target.value})
  }
    return (
        <div className='flex flex-col w-full  '>
            <div className='flex flex-col w-full gap-y-2 mb-2'>
            <p className='font-semibold text-md'>Total Bill Amount : &#8377; {billAmount}</p>
            <div className='grid grid-cols-2 items-center gap-x-2 w-full justify-center'>
                    <p className='text-gray-600 font-semibold'>Payment Status</p>
                    <div className='grid grid-cols-2 gap-y-2 items-center gap-x-2'>
                        <div className='block'>
                            <input type='radio' name='payment_status' onChange={handleChange} value="Paid" id='checkbox-1' style={{display:"none"}} checked={paymentStatus.payment_status==="Paid"} className='peer'></input>
                            <label for='checkbox-1' className='rounded-md px-2 py-1 border border-gray-300 w-full font-semibold text-center cursor-pointer peer-checked:bg-green-300 peer-checked:text-green-800 block'>Paid</label>
                        </div>
                        <div className='block'>
                            <input type='radio' name='payment_status' onChange={handleChange} value="Not Paid" id='checkbox-2' style={{display:"none"}} checked={paymentStatus.payment_status==="Not Paid"} className='peer'></input>
                            <label for='checkbox-2' className='rounded-md px-2 py-1 border border-gray-300 w-full font-semibold text-center cursor-pointer peer-checked:bg-yellow-300 peer-checked:text-yellow-800 block'>Not Paid</label>
                        </div>
                    </div>                
            </div>
            {
                paymentStatus.payment_status==="Paid" &&
                <>
                    <div className='grid grid-cols-2 items-center gap-x-2 w-full justify-center'>
                            <p className='text-gray-600 font-semibold'>Payment Type</p>
                            <div className='grid grid-cols-2 gap-y-2 items-center gap-x-2'>
                                <div className='block'>
                                    <input type='radio' name='payment_type' onChange={handleChange} value="FP" id='checkbox-3' style={{display:"none"}} checked={paymentStatus.payment_type == 'FP'} className='peer'></input>
                                    <label for='checkbox-3' className='rounded-md px-2 py-1 border border-gray-300 w-full font-semibold text-center cursor-pointer peer-checked:bg-green-300 peer-checked:text-green-800 block'>Full Payment</label>
                                </div>
                                <div className='block'>
                                    <input type='radio' name='payment_type' onChange={handleChange} value="PP" id='checkbox-4' style={{display:"none"}} checked={paymentStatus.payment_type == 'PP'} className='peer'></input>
                                    <label for='checkbox-4' className='rounded-md px-2 py-1 border border-gray-300 w-full font-semibold text-center cursor-pointer peer-checked:bg-yellow-300 peer-checked:text-yellow-800 block'>Part Payment</label>
                                </div>
                            </div>                
                    </div>
                    {
                        paymentStatus.payment_type == 'PP' &&
                        <div className='grid grid-cols-2 items-center gap-x-2 w-full justify-center'>
                            <p className='text-gray-600 font-semibold'>Amount Paid</p>
                            <InputComponent inputType="number" inputName="amount_paid" inputValue={paymentStatus.amount_paid} jsonDetails={paymentStatus} setJsonDetails={setPaymentStatus} disabledFlag={!fieldEnable}/>
                        </div>
                    }
                </>
            }
            <div className='grid grid-cols-2 items-center gap-x-2 w-full justify-center'>
                    <p className='text-gray-600 font-semibold'>Payment Date</p>
                    <InputComponent inputType="date" inputName="payment_date" inputValue={paymentStatus.payment_date} jsonDetails={paymentStatus} setJsonDetails={setPaymentStatus} disabledFlag={!fieldEnable}/>
            </div>
                <div className='grid grid-cols-2 gap-x-2 items-center '>
                    <p className='text-gray-600 font-semibold'>Payment Mode</p>
                    <select className={`border border-gray-300 py-2 px-2 text-md rounded-md focus:outline-none focus:border-blue-500 text-sm text-gray-800 ${fieldEnable ? 'cursor-pointer':'cursor-not-allowed'}`} name='payment_mode' value={paymentStatus.payment_mode} onChange={handleChange} disabled={!fieldEnable}>
                        <option value="" disabled>Select Payment Mode</option>
                        <option value="UPI (Gpay/PhonePe)">UPI (Gpay/PhonePe)</option>     
                        <option value="Account Transfer">Account Transfer</option>  
                        <option value="Cash">Cash</option>                
                    </select>
                </div>
            </div>
        {loading && <Loader/>}
        {
            toastMsg.length>=1&&
            <Toaster toastMsg={toastMsg} setToastMsg={setToastMsg} isSuccess={toastStatus}/>
        }
        
        <p className='text-white bg-blue-500 rounded-md p-1 cursor-pointer px-6 capitalize w-full text-center font-semibol ml-auto mr-2 select-none' onClick={()=>handleUpdatePayment()}>update</p>
        
    </div>
    )
}

export default InvoiceDetails