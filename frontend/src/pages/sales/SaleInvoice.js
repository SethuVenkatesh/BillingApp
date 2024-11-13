import React,{ useState,useEffect,useContext }  from 'react'
import Loader from '../../components/common/Loader'
import {AuthorizedApi} from '../../axios'
import { UserDetailsContext } from '../../context/userContext'
import InputComponent from '../../components/common/InputComponent'
import InvoiceCard from './InvoiceCard'

const SaleInvoice = () => {   
    const [loading,setLoading] = useState(false);
    const { firmDetails } = useContext(UserDetailsContext);
    const [allInvoice,setAllInvoice] = useState([])
    useEffect(()=>{
      setLoading(true);
      AuthorizedApi.get("sales/all_invoice?firm_id="+firmDetails._id).then((res)=>{
        setAllInvoice(res.data)
        setLoading(false);
      }).catch((err)=>{
        console.log(err);
        setLoading(false);
      })
    },[])
    
  return (
    <>
          {
            loading ? 
            <Loader/> : 
            (
                <div className='p-4 m-2 border'>
                    <p className='text-slate-500 mb-4 text-center capitalize font-bold text-lg'>All Invoices</p>
                    <div className='grid gap-2'>                         
                        {
                          allInvoice.map((invoice)=>{
                            return(
                              <InvoiceCard invoiceDetails={invoice}/>
                            )
                          })
                        }
                    </div>
                </div>
            )
        }
    </>
  )
}

export default SaleInvoice