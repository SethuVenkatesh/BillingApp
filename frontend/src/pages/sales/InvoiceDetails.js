import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { UserDetailsContext } from '../../context/userContext'
import Icons from "../../components/common/Icons"
import PopupComponent from '../../components/common/PopupComponent'
import Toaster from '../../components/common/Toaster'
import InputComponent from '../../components/common/InputComponent'
import Loader from '../../components/common/Loader'
import Accordian from '../../components/common/Accordian'
import PaymentAccordianItem from '../../components/accordian/PaymentAccordianItem'

import { useLocation,useNavigate } from 'react-router-dom'
import { paymentValidation } from '../../utils/CommonUtils'
import { AuthorizedApi } from '../../axios'
const InvoiceDetails = () => {

    const { firmDetails } = useContext(UserDetailsContext);
    const {state} = useLocation();
    const [invoiceDetail,setInvoiceDetail]= useState();
    const [showPopUp,setShowPopUp]=useState(false);
    const [popUpTitle,setPopUpTitle] = useState("Add Payment");
    const [toastMsg,setToastMsg] =useState("");
    const [toastStatus,setToastStatus] = useState(false);
    const [loading,setLoading] = useState(false);

    
  const [paymentExpand,setPaymentExpand] = useState(false);
  const [accordianTitle,setAccordianTitle] = useState("Payment Details")
  const getAllPayments =async (invoiceNumber) =>{
    try{
      const response =await AuthorizedApi.get("/invoice/payments?invoiceNumber="+invoiceNumber)
      return response.data;
  }catch(err){
      return err;
  }
  }

  const getInvoiceDetails = (invoiceNumber) =>{
    setLoading(true);
    AuthorizedApi.get("/invoice/details?invoiceNumber="+invoiceNumber).then(res=>{
        setInvoiceDetail(res.data.data);
        setLoading(false);
    }).catch(err=>{
        setToastMsg(err.response.data.message);
        setToastStatus(false);
        setLoading(false);
    })
  }

    const navigate = useNavigate();

    const onCloseFn=()=>{
        setShowPopUp(false);

    }

    const handleEditInvoice = () =>{
        setLoading(true);
        AuthorizedApi.get("/invoice/payments?invoiceNumber="+invoiceDetail.invoiceNumber).then((res)=>{
            setLoading(false);
            let allPayments = res.data.data;
            if(allPayments.length == 0){
                navigate('/dashboard/sales/edit_invoice_details',{state:{invoiceDetail:invoiceDetail}})
            }else{
                setToastMsg("Invoice Cannot be edited if any payment is done");
                setToastStatus(false);
            }
        }).catch((error)=>{
            setLoading(false);
            setToastMsg(error.response.data.message);
            setToastStatus(false);
        })
    }

    const handleDownloadInvoice = () =>{
        AuthorizedApi.get("/invoice/download?invoiceNumber="+invoiceDetail.invoiceNumber).then((res)=>{
            let fileData = res.data.data;
            // Convert base64-encoded PDF data to a Blob
            const binaryString = window.atob(fileData);
            const len = binaryString.length;
            const bytes = new Uint8Array(len);
            for (let i = 0; i < len; i++) {
                bytes[i] = binaryString.charCodeAt(i);
            }
            const file = new Blob([bytes.buffer], { type: "application/pdf" });

            // Create a download link for the PDF
            const fileURL = URL.createObjectURL(file);
            const link = document.createElement("a");                                                                                                                                                       
            link.href = fileURL;
            link.download = "Invoice_"+invoiceDetail.invoiceNumber+"_"+invoiceDetail.invoiceDate ;
            link.click();

            // Clean up
            URL.revokeObjectURL(fileURL);

        }).catch(err=>{
            console.log(err);
        })

     
    }
    useEffect(()=>{
        let {invoiceData} = state;
        getInvoiceDetails(invoiceData.invoiceNumber)
    },[])



  return (
    <div className=''>
        {
            invoiceDetail &&
        <>
        <div className=' p-2 flex gap-2'>
            <PopupComponent isOpen={showPopUp} onCloseFn={()=>onCloseFn()} popUpTitle={popUpTitle} isBtnVisible={false} >
                <PaymentStatus totalAmount={invoiceDetail.totalPrice} paymentStatus={invoiceDetail.paymentStatus} invoiceNumber={invoiceDetail.invoiceNumber} getInvoiceDetails={getInvoiceDetails} onCloseFn={onCloseFn}/>
            </PopupComponent>
            <div className='p-2 border border-gray-400 min-w-[800px] min-h-[90vh] flex flex-col justify-between shadow-md'>
                <div>
                <div className='flex gap-x-4 mb-2 pb-2 border-b-2'>
                    <div className='w-[75px] h-[75px] border border-gray-200 shadow-md rounded-full overflow-hidden'>
                        {
                            firmDetails?.logoUrl !== '' ?
                            <img className='w-full object-cover ' src={firmDetails?.logoUrl} alt='not-found'/>:
                            <img className='w-full object-cover ' src='https://res.cloudinary.com/dkjcfh7oj/image/upload/v1713684716/firms/building_1_jc8pct.png' alt='not-found'/>
                        }
                    </div>

                    <div className='flex justify-center flex-col items-center flex-1'>
                        <p className='bg-blue-500  text-white rounded-sm px-2 font-semibold'>Tax Invoice</p>
                        <p className='text-lg text-gray-500 font-bold uppercase '>{firmDetails?.firmName}</p>
                        <p className='capitalize text-gray-500 font-semibold'>{firmDetails?.address.address}</p>
                        <p className='capitalize text-gray-500 font-semibold'>{firmDetails?.address.city} - {firmDetails?.address.pincode}</p>
                    </div>
                    <div className='text-left'>
                        <p className='text-gray-500'><span className='font-semibold text-gray-600'>GSTIN: </span>{firmDetails?.gstNumber}</p>
                        <p className='text-gray-500'><span className='font-semibold text-gray-600'>Mobile: </span>{firmDetails?.mobileNumber}</p>
                    </div>  
                </div>
                <div className='flex justify-between'>
                    <p className='text-gray-500'><span className='font-semibold text-gray-600'>Invoice No: </span>{invoiceDetail.invoiceNumber}</p>
                    <p className='text-gray-500'><span className='font-semibold text-gray-600'>Invoice Date: </span>{invoiceDetail.invoiceDate}</p>
                </div>
                <div className='grid grid-cols-2 mb-2 '>
                    <div className=''>
                        <p className='font-bold text-gray-500'>To:</p>
                        <p className='capitalize text-gray-500 font-semibold'>{invoiceDetail.invoiceParty.partyName}</p>
                        <p className='capitalize text-gray-500 font-semibold'>{invoiceDetail.invoiceParty.address.address}</p>
                        <p className='capitalize text-gray-500 font-semibold'>{invoiceDetail.invoiceParty.address.city} - {invoiceDetail.invoiceParty.address.pincode}</p>
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
                        <th className="py-2 px-4 border-b-2 border-gray-300">Amount</th>
                    </tr>
                    </thead>
                    <tbody>
                    {invoiceDetail.invoiceItems.map((item, index) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-blue-100' : 'bg-white'}>
                        <td className="py-2 px-4 border-b text-center">{item.itemName}</td>
                        <td className="py-2 px-4 border-b text-center">{item.quantity}</td>
                        <td className="py-2 px-4 border-b text-center">{item.price.toFixed(2)}</td>
                        <td className="py-2 px-4 border-b text-center">{(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    ))}
                    {
                        invoiceDetail.includeGst ?
                        <>
                        <tr className={invoiceDetail.invoiceItems.length%2 == 0 ? 'bg-blue-100' : 'bg-white'}>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center font-semibold">Sub Total</td>
                            <td className="py-2 px-4 border-b text-center font-semibold">{invoiceDetail.subtotalPrice.toFixed(2)}</td>
                        </tr>
                        <tr className={invoiceDetail.invoiceItems.length%2 == 1 ? 'bg-blue-100' : 'bg-white'}>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center font-semibold">SGST @ {invoiceDetail.sgstPer.toFixed(2)} %</td>
                            <td className="py-2 px-4 border-b text-center font-semibold">{invoiceDetail.sgstPrice.toFixed(2)}</td>
                        </tr>
                        <tr className={invoiceDetail.invoiceItems.length%2 == 0 ? 'bg-blue-100' : 'bg-white'}>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center font-semibold">CGST @ {invoiceDetail.cgstPer.toFixed(2)} % </td>
                            <td className="py-2 px-4 border-b text-center font-semibold">{invoiceDetail.cgstPrice.toFixed(2)}</td>
                        </tr>
                        <tr className={invoiceDetail.invoiceItems.length%2 == 1 ? 'bg-blue-100' : 'bg-white'}>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center font-semibold">Total</td>
                            <td className="py-2 px-4 border-b text-center font-semibold">{invoiceDetail.totalPrice.toFixed(2)}</td>
                        </tr>
                        </>
                        :
                        <>
                        <tr className={invoiceDetail.invoiceItems.length%2 == 0 ? 'bg-blue-100' : 'bg-white'}>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center"></td>
                            <td className="py-2 px-4 border-b text-center font-semibold">Total</td>
                            <td className="py-2 px-4 border-b text-center font-semibold">{invoiceDetail.totalPrice.toFixed(2)}</td>
                        </tr>
                        </>
                    }
                    </tbody>
                </table>
                </div>
                <div className='border border-gray-300 mt-2 rounded-sm grid grid-cols-2 '>
                    <div className='border-r border-gray-300 p-2'>
                        <p className='text-gray-700'><span className='font-semibold text-gray-600'>Bank Name: </span>{firmDetails?.bank.bankName}</p>
                        <p className='text-gray-700'><span className='font-semibold text-gray-600'>Branch: </span>{firmDetails?.bank.branch}</p>
                        <p className='text-gray-700'><span className='font-semibold text-gray-600'>A/C No: </span>{firmDetails?.bank.accountNumber}</p>
                        <p className='text-gray-700'><span className='font-semibold text-gray-600'>IFSC Code: </span>{firmDetails?.bank.ifscCode}</p>
                    </div>
                    <div className='p-2 flex flex-col justify-between'>
                        <p className='text-gray-700 uppercase font-semibold'> <span className='capitalize'>For : </span>{firmDetails?.firmName}</p>
                        <img className='w-[60px] h-[60px] m-auto' src='https://c8.alamy.com/comp/2AC1K1G/grunge-blue-signature-word-round-rubber-seal-stamp-on-white-background-2AC1K1G.jpg'/>
                        <p className='text-center'>Authorised Signatory</p>
                    </div>
                </div>
            </div>
            <div className='p-4 flex-1 '>
                <p className='mb-2 font-semibold text-slate-500'>Payment Status : <span className={`rounded-md font-semibold p-1 text-md  ${invoiceDetail.paymentStatus == "FULLY_PAID" ? 'text-green-600 ':(invoiceDetail.paymentStatus == "NOT_PAID" ? 'text-red-600  ':'text-yellow-600  ')} `}>{invoiceDetail.paymentStatus}</span></p>
                <div className=' m-auto flex  gap-x-2 flex-wrap'>
                    <p className='text-white mb-2 text-center bg-blue-500 px-4 cursor-pointer py-2 rounded-sm font-semibold text-md ' onClick={()=>handleEditInvoice()}>{Icons['edit-icon']} Edit Invoice</p>
                    <p className='text-white  text-center bg-blue-500 px-4 cursor-pointer py-2 rounded-sm font-semibold text-md mb-2 ' onClick={()=>setShowPopUp(true)}>{Icons['payment-icon']} Add Payment</p>
                    <p className='text-white mb-2  text-center bg-blue-500 px-4 cursor-pointer py-2 rounded-sm font-semibold text-md ' onClick={()=>handleDownloadInvoice()}>{Icons['download-icon']} Download Invoice</p>

                </div>
                <div className='w-auto mt-4 mb-2 '>
                    <Accordian expand={paymentExpand} setExpand={setPaymentExpand} title={accordianTitle} callBackfn = {()=>getAllPayments(invoiceDetail.invoiceNumber)} >
                        <PaymentAccordianItem/>
                    </Accordian> 
                </div>
            </div>
        </div>
        </>

            
    }

    {                    
        toastMsg.length>=1&&
        <Toaster toastMsg={toastMsg} setToastMsg={setToastMsg} isSuccess={toastStatus}/>
                                            
    }
    {
        loading && <Loader/>
    }
    </div>
  )
}


const PaymentStatus = ({totalAmount,paymentStatus,invoiceNumber,getInvoiceDetails,onCloseFn}) =>{

  const [loading,setLoading]=useState(false);
  const [toastMsg,setToastMsg] =useState("");
  const [toastStatus,setToastStatus] = useState(false);
  const [amountDisable,setAmountDisable] = useState(true);
  const [fieldEnable,setFieldEnable]= useState(true);

  let today = new Date();
    let maxDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);

  const [paymentDetails,setPaymentDetails] = useState({
    paymentDate:"",
    paymentMode:"",
    amountPaid:"",
    paymentType:""
  })


  useEffect(()=>{
    getAllPayments();

  },[])

  const getAllPayments= ()=>{
    setLoading(true);
    AuthorizedApi.get("/invoice/payments?invoiceNumber="+invoiceNumber).then((res)=>{
        setLoading(false);
        let allPayments = res.data.data;
        let paidAmount = allPayments.map(payment => payment.amountPaid).reduce((total, amount) => total + amount,0);
        setPaymentDetails({
            paymentDate:maxDate,
            paymentMode:"",
            amountPaid:(totalAmount - paidAmount).toFixed(2),
            paymentType:"FP",
            remaningAmount:(totalAmount - paidAmount).toFixed(2)
        })
    }).catch((error)=>{
        setLoading(false);
        setToastMsg(error.response.data.message);
        setToastStatus(false);
    })
  }

  const handleUpdatePayment = () =>{
    let paymentData = {
        paymentDate : paymentDetails.paymentDate,
        amountPaid: paymentDetails.amountPaid,
        paymentMode : paymentDetails.paymentMode
    }
    console.log(paymentData);
    setLoading(true);
    paymentValidation.validate(paymentData,{abortEarly:false}).then((valid)=>{
        AuthorizedApi.post("/invoice/payments?invoiceNumber="+invoiceNumber,{...paymentData}).then(res=>{
            setLoading(false);
            setToastMsg(res.data.message);
            getInvoiceDetails(invoiceNumber)
            onCloseFn();
            setToastStatus(true);
        }).catch((error)=>{
            setLoading(false);
            setToastMsg(error.response.data.message);
            setToastStatus(false);
        })
    }).catch(error=>{
        console.log(error);
        setLoading(false);
        setToastMsg(error.inner[0]?.message);
        setToastStatus(false);
    })

  }


  const handleChange= (e)=>{
    let lableName=e.target.name;
    if(lableName == 'paymentType'){
        let labelValue=e.target.value;
        let fieldStatus = labelValue == 'FP';
        
        setAmountDisable(fieldStatus)
    }
    setPaymentDetails({...paymentDetails,[e.target.name]:e.target.value})
  }
  
  console.log("amount Diable :",amountDisable);

    return (
        <div className='flex flex-col w-full  '>
            <div className='flex flex-col w-full gap-y-2 mb-2'>
            <p className='font-semibold text-md'>Total Bill Amount : &#8377; {totalAmount.toFixed(2)}</p>
            <p className='font-semibold text-md'>Remaining Amount : &#8377; {paymentDetails.remaningAmount}</p>
            <div className='grid grid-cols-2 items-center gap-x-2 w-full justify-center'>
                    <p className='text-gray-600 font-semibold'>Payment Type</p>
                    <div className='grid grid-cols-2 gap-y-2 items-center gap-x-2'>
                        <div className='block'>
                            <input type='radio' name='paymentType' onChange={handleChange} value="FP" id='checkbox-1' style={{display:"none"}} checked={paymentDetails.paymentType==="FP"} className='peer'></input>
                            <label for='checkbox-1' className='rounded-md px-2 py-1 border border-gray-300 w-full font-semibold text-center cursor-pointer peer-checked:bg-green-300 peer-checked:text-green-800 block'>Full Payment</label>
                        </div>
                        <div className='block'>
                            <input type='radio' name='paymentType' onChange={handleChange} value="PP" id='checkbox-2' style={{display:"none"}} checked={paymentDetails.paymentType==="PP"} className='peer'></input>
                            <label for='checkbox-2' className='rounded-md px-2 py-1 border border-gray-300 w-full font-semibold text-center cursor-pointer peer-checked:bg-yellow-300 peer-checked:text-yellow-800 block'>Part Payment</label>
                        </div>
                    </div>                
            </div>
            <div className='grid grid-cols-2 items-center gap-x-2 w-full justify-center'>
                <p className='text-gray-600 font-semibold'>Amount</p>
                <InputComponent inputType="number" inputName="amountPaid" inputValue={paymentDetails.amountPaid} jsonDetails={paymentDetails} setJsonDetails={setPaymentDetails} disabledFlag={amountDisable} />
            </div>
            <div className='grid grid-cols-2 items-center gap-x-2 w-full justify-center'>
                    <p className='text-gray-600 font-semibold'>Payment Date</p>
                    <InputComponent inputType="date" inputName="paymentDate" inputValue={paymentDetails.paymentDate} jsonDetails={paymentDetails} setJsonDetails={setPaymentDetails} maxValue={maxDate}/>
            </div>
                <div className='grid grid-cols-2 gap-x-2 items-center '>
                    <p className='text-gray-600 font-semibold'>Payment Mode</p>
                    <select className={`border border-gray-300 py-2 px-2 text-md rounded-md focus:outline-none focus:border-blue-500 text-sm text-gray-800  cursor-pointer`} name='paymentMode' value={paymentDetails.paymentMode} onChange={(e)=>setPaymentDetails({...paymentDetails,[e.target.name]:e.target.value})} >
                        <option value="" disabled>Select Payment Mode</option>
                        <option value="UPI (Gpay/PhonePe)">UPI (Gpay/PhonePe)</option>     
                        <option value="Account Transfer">Account Transfer</option>  
                        <option value="Cash">Cash</option>   
                        <option value="Cheque">Cheque</option>                             
                    </select>
                </div>
        </div>
        {loading && <Loader/>}
        {
            toastMsg.length>=1&&
            <Toaster toastMsg={toastMsg} setToastMsg={setToastMsg} isSuccess={toastStatus}/>
        }
        
        <p className='text-white bg-blue-500 rounded-md p-1 cursor-pointer px-6 capitalize w-full text-center font-semibol ml-auto mr-2 select-none' onClick={()=>handleUpdatePayment()}>Pay</p>
        
    </div>
    )
}

export default InvoiceDetails