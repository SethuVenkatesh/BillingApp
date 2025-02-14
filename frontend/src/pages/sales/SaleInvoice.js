import React,{ useState,useEffect,useContext,useRef,useLayoutEffect }  from 'react'
import Loader from '../../components/common/Loader'
import {AuthorizedApi} from '../../axios'
import { UserDetailsContext } from '../../context/userContext'
import FilterPopUpComponent from '../../components/common/FilterPopUpComponent'
import SortPopUpComponent from '../../components/common/SortPopUpComponent'
import { invoiceSortData,invoiceFilterData } from '../../constants'
import InvoiceCard from './InvoiceCard'
const SaleInvoice = () => {   
    const [loading,setLoading] = useState(false);
    const { firmDetails } = useContext(UserDetailsContext);


    const [scrollHeight,setScrollHeight] = useState(0);


//   Search Query for Pagination
const [currentPage,setCurrentPage] = useState(1);
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
  const scrollContainerRef = useRef(null);

    const [allInvoice,setAllInvoice] = useState([])

    const getAllInvoice = (pageNum ,pageSize) =>{
      setLoading(true);
       // Create a query object
        AuthorizedApi.get("/invoice/all",{
        params:{
          ...selectedSort,
          invoiceNumber:selectedFilter.invoiceNumber,
          partyName:selectedFilter.partyName,
          paymentStatus:selectedFilter.paymentStatus,
          invoiceStartDate:selectedFilter.invoiceStartDate,
          invoiceEndDate:selectedFilter.invoiceEndDate,
          pageNum:pageNum,
          pageSize:pageSize
        }
      }).then((res)=>{
        let invoices = res.data.data;
        setTotalCount(res.data.totalCount);
        setTotalPages(res.data.totalPages);
        setCurrentPage(res.data.pageNum);
        if(pageNum === 1){
          setAllInvoice(invoices);
        }else{
          setAllInvoice([...allInvoice,...invoices]);
        }        
        setLoading(false);
        
      }).catch((err)=>{
        console.log(err.response.data.message);
        setLoading(false);
      })
    }

    const handleScroll = () => {
      let container = scrollContainerRef.current;
      if (parseInt(container.scrollHeight - container.scrollTop)  === container.clientHeight) {
        setScrollHeight(container.scrollTop);
        if(totalPages > currentPage){
          getAllInvoice(currentPage + 1 ,20);
        }  
     
      }
  
    };

    useEffect(()=>{
      getAllInvoice(1,20)
    },[selectedSort])

    useLayoutEffect(() => {
      let container = scrollContainerRef.current;
  
      // Adjust scroll position to maintain the same place
      if (container && scrollHeight != 0) {
        container.scrollTop = scrollHeight;
      }
    }, [allInvoice]);


    
  return (
    <>
          {
            loading ? 
            <Loader/> : 
            (
                <div className='m-2 rounded-sm relative' >
                    <div className='border border-gray-200 p-4 shadow-md flex items-center justify-between fixed w-[calc(100vw-275px)] bg-white '>
                      <p className='text-slate-700 text-center capitalize font-semibold text-md'>All Invoices</p>
                      <div className='flex item-center justify-end gap-x-2'>
                        <SortPopUpComponent data={invoiceSortData} selectedItem={selectedSort} changeSortFn={(sortType,sortKey)=>changeSortFn(sortType,sortKey)}/>
                        <FilterPopUpComponent data={invoiceFilterData} selectedFilter={selectedFilter} filterChanges = {(filterKey,filterValue)=>changeFilterValues(filterKey,filterValue)} resetFilter= {()=>resetFilter()} applyFilter={()=>getAllInvoice(1,20)} setSelectedFilter={setSelectedFilter}/>
                      </div>
                    </div>
                    <div className='grid gap-2' >  
                        <p className='mt-[65px]' ></p>
 
                        {
                          allInvoice.length == 0 &&
                          <p className='text-gray-500 text-center mt-4'>No Invoice Found </p>
                        }  
                        <div className='flex flex-col gap-2 h-[calc(100vh-120px)] p-2 overflow-y-auto items-start' onScroll={(e)=>handleScroll(e)} ref={scrollContainerRef}  >
                          {
                            allInvoice.map((invoice)=>{
                              return(
                                <InvoiceCard invoiceDetails={invoice}/>
                              )
                            })
                          }
                        </div>                     
                    </div>
                </div>
            )
        }
    </>
  )
}

export default SaleInvoice