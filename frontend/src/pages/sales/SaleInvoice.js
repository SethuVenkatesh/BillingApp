import React,{ useState,useEffect,useContext }  from 'react'
import Loader from '../../components/common/Loader'
import {AuthorizedApi} from '../../axios'
import { UserDetailsContext } from '../../context/userContext'
import InputComponent from '../../components/common/InputComponent'
import FilterPopUpComponent from '../../components/common/FilterPopUpComponent'
import SortPopUpComponent from '../../components/common/SortPopUpComponent'
import { invoiceSortData,invoiceFilterData } from '../../constants'
import InvoiceCard from './InvoiceCard'
import { StarRate } from '@mui/icons-material'

const SaleInvoice = () => {   
    const [loading,setLoading] = useState(false);
    const { firmDetails } = useContext(UserDetailsContext);


//   Search Query for Pagination
const [currentPage,setCurrentPage] = useState(1);
const [itemsPerPage,setItemsPerPage] = useState(20);
const [totalPages,setTotalPages] = useState(1);
const [totalCount,setTotalCount] = useState(1);


// Filters and Sort
const [selectedFilter,setSelectedFilter] = useState({
  invoiceNumber:"",
  partyName:"",
  invoiceStartDate:"",
  invoiceEndDate:"",
  paymentStatus:""

});
const [selectedSort,setSelectedSort] = useState({
  sortType:"desc",
  sortKey:"invoiceDate"
})


const changeSortFn = (sortType,sortKey) =>{
  setSelectedSort({
    sortType:sortType,
    sortKey:sortKey
  })
}

const changeFilterValues = (filterKey,filterValue) =>{
  console.log("changeFilterValues",filterKey,filterValue);
  setSelectedFilter({...selectedFilter,[filterKey]:filterValue})
}

const resetFilter = () =>{
  setSelectedFilter({
  invoiceNumber:"",
  partyName:"",
  invoiceStartDate:"",
  invoiceEndDate:"",
  paymentStatus:""
  })
}

    const getAllInvoice = (pageNum ,pageSize) =>{
      setLoading(true);

       // Create a query object
        AuthorizedApi.get("/invoice/all",{
        params:{
          ...selectedSort,
          // ...selectedFilter,
          invoiceNumber:selectedFilter.invoiceNumber,
          partyName:selectedFilter.partyName,
          paymentStatus:selectedFilter.paymentStatus,
          invoiceStartDate:selectedFilter.invoiceStartDate,
          invoiceEndDate:selectedFilter.invoiceEndDate,
          pageNum:currentPage,
          pageSize:itemsPerPage
        }
      }).then((res)=>{
        setAllInvoice(res.data.data)
        setLoading(false);
      }).catch((err)=>{
        console.log(err.response.data.message);
        setLoading(false);
      })
    }
    const [allInvoice,setAllInvoice] = useState([])
    useEffect(()=>{
      getAllInvoice(1,20)
    },[selectedSort])
    
  return (
    <>
          {
            loading ? 
            <Loader/> : 
            (
                <div className='m-2 rounded-sm min-h-[calc(100vh-50px)] relative'>
                    <div className='border border-gray-200 p-4 shadow-md flex items-center justify-between fixed w-[calc(100vw-275px)] bg-white '>
                      <p className='text-slate-700 text-center capitalize font-semibold text-md'>All Invoices</p>
                      <div className='flex item-center justify-end gap-x-2'>
                        <SortPopUpComponent data={invoiceSortData} selectedItem={selectedSort} changeSortFn={(sortType,sortKey)=>changeSortFn(sortType,sortKey)}/>
                        <FilterPopUpComponent data={invoiceFilterData} selectedFilter={selectedFilter} filterChanges = {(filterKey,filterValue)=>changeFilterValues(filterKey,filterValue)} resetFilter= {()=>resetFilter()} applyFilter={()=>getAllInvoice(1,20)} setSelectedFilter={setSelectedFilter}/>
                      </div>
                    </div>
                    <div className='grid gap-2 '>  
                      <p className='mt-[65px]'></p>
                        {
                          allInvoice.length == 0 &&
                          <p className='text-gray-500 text-center mt-4'>No Invoice Found </p>
                        }                       
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