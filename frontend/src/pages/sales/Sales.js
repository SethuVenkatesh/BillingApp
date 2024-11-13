import React from 'react'
import { Route,Routes,Router } from 'react-router-dom'
import SaleInvoice from './SaleInvoice'
import PaymentIn from './PaymentIn'
import DeliveryChallan from './DeliveryChallan'
import InvoiceDetails from './InvoiceDetails'
import EditInvoice from './EditInvoice';

const Sales = () => {
  return (
    <Routes>
        <Route path='all_invoice' element={<SaleInvoice/>}/>
        <Route path='payment_in' element={<PaymentIn/>}/>
        <Route path='delivery_challan' element={<DeliveryChallan/>}/>
        <Route path='invoice_details' element={<InvoiceDetails/>}/>
        <Route path='edit_invoice_details' element={<EditInvoice/>}/>
    </Routes>
  )
}

export default Sales