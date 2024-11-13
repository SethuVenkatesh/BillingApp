import React, { useEffect, useState,useMemo } from 'react'
import Icons from '../../components/common/Icons'
import { useNavigate,useLocation } from 'react-router-dom';


const InvoiceCard = ({invoiceDetails}) => {
  const navigate = useNavigate();

  const [itemDetails,setItemDetails] = useState({
    totalQuantity : 0,
  })

  const getInvoiceCalc = () =>{
    let allItems = invoiceDetails.payment_details.items;
    let totalQuantity = 0;
    for(let itemIndex = 0 ; itemIndex < allItems.length ;itemIndex++){
      console.log(allItems[itemIndex])
      totalQuantity = totalQuantity + allItems[itemIndex].quantity;
    }
    return totalQuantity;
  }

  const getInvoiceSummary = useMemo(()=>getInvoiceCalc(invoiceDetails),[invoiceDetails]);

  const handleInvoice = () =>{
    navigate('/dashboard/sales/invoice_details',{state:{invoiceData:invoiceDetails}})
  }
  
  return (
    <div className='border border-gray-300 rounded-sm px-2 py-2 cursor-pointer' onClick={()=>{handleInvoice()}}>
        <div className='flex justify-between'>
            <div className='flex gap-x-2'>
              <p className='text-blue-800'>{Icons['receipt-icon']}</p>
              <p className='text-slate-500 font-semibold'><span className='font-bold'>Invoice No: </span>{invoiceDetails.invoice_no}</p>
              {
                invoiceDetails.payment_details.includeGST &&
                  <p className='ml-4 text-sky-800 font-semibold rounded-md px-1 py-0 h-fit bg-sky-200 text-sm'>GST Bill</p>
              }
            </div>
            <p className='text-slate-500 font-semibold text-sm'><span className='font-bold'>Invoice Date: </span>{invoiceDetails.payment_details.invoiceDate}</p>
        </div>
        <div className='flex justify-between'>
          <p className='text-slate-500 capitalize font-semibold text-md'>{invoiceDetails.party.party_name}</p>
          <div className='flex items-center gap-x-2'>
            <span className='text-green-600'>{Icons['phone-icon']}</span>
            <span>{invoiceDetails.party.mobile_number}</span>
          </div>
        </div>
        <div className=''>
          <p className='text-red-500 text-md font-semibold'><span className='font-semibold'>Bill Amount : </span>&#8377; {invoiceDetails.payment_details.totalPrice}</p>
        </div>
        <div className='flex justify-between'>
          <div className='flex gap-x-2'>
            <p className='text-slate-500  text-sm'><span className='font-normal'>Total Items: </span>{invoiceDetails.payment_details.items.length}</p>
            <p className='text-slate-500  text-sm'><span className='font-normal'>Total Quantity: </span>{getInvoiceSummary}</p>
          </div>
          <p className='text-sm text-white'>{invoiceDetails.payment_details.is_paid ? <span className='bg-green-300 text-green-600 rounded-sm font-semibold p-1'>Paid</span>:<span className='bg-yellow-300 text-yellow-600 rounded-sm font-semibold p-1'>Not Paid</span>}</p>
        </div>
    </div>
  )
}

export default InvoiceCard