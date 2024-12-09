import React from 'react'
import { usePagination } from '../../hooks/usePagination';
import Icons from './Icons';
const Pagination = ({
    onPageChange,
    totalCount,
    siblingCount = 1,
    currentPage,
    pageSize,
    totalPages,
}) => {
    const paginationRange = usePagination({
        currentPage,
        totalCount,
        siblingCount,
        pageSize,
        totalPages
    });

    const handlePageChange= (pageNumber) =>{
        onPageChange(pageNumber,pageSize);
    }

    const onItemsPerPageChange = (pageSize) =>{
        onPageChange(currentPage,pageSize)
    }

    if (currentPage === 0 || paginationRange.length < 2) {
        return (
            <div className='flex border-t border-gray-300 p-2 items-center justify-center'>
                <div className='flex gap-x-2 items-center '>
                    <p className='text-gray-600  text-sm'>Items Per Page :</p>
                    <select className={`border border-gray-300 py-1 px-1 text-md rounded-md focus:outline-none focus:border-blue-500 text-sm text-gray-800  cursor-pointer w-fit-content`} name='itemsPerPage' value={pageSize} onChange={(e)=>onItemsPerPageChange(e.target.value)} >
                        <option value="10">10</option>     
                        <option value="20">20</option>  
                        <option value="50">50</option>   
                    </select>
                </div>
            </div>
        );
    }

    const onNext = () => {
        if(currentPage !== totalPages){
            onPageChange(currentPage + 1,pageSize);
        }
    };
    
      const onPrevious = () => {
        if(currentPage !==1 ){
            onPageChange(currentPage - 1,pageSize);
        }
    };

  

    let lastPage = paginationRange[paginationRange.length - 1];



  return (
    <div className='flex item-center gap-x-4 justify-center border-t border-gray-300 p-2 w-full'>

        <div className='flex items-center justify-center  bg-white z-5'>
        <ul className='flex items-center cursor-pointer gap-x-2'>
            <li className ='p-2 rounded-md border border-gray-300' onClick={()=>onPrevious()}>
                {Icons['arrow-left-icon']}
            </li>
            {
                paginationRange.map(pageNum=>{
                    if(pageNum === -1){
                        return <li className="">&#8230;</li>
                    }

                    return(
                        <li className={`p-2 rounded-md border border-gray-300  ${currentPage === pageNum? 'bg-gray-400 text-white':'text-gray-500'}`} onClick={()=>handlePageChange(pageNum)}>
                            <p className='w-[24px] h-[24px] text-center'>{pageNum}</p>
                        </li>
                    )
                })
            }
            <li className ='p-2 rounded-md border border-gray-300' onClick={()=>onNext()}>
                {Icons['arrow-right-icon']}
            </li>
        </ul>
        </div>
        <div className='flex gap-x-2 items-center '>
            <p className='text-gray-600 text-sm'>Items Per Page :</p>
            <select className={`border border-gray-300 py-1 px-1 text-md rounded-md focus:outline-none focus:border-blue-500 text-sm text-gray-800  cursor-pointer w-fit-content`} name='itemsPerPage' value={pageSize} onChange={(e)=>onItemsPerPageChange(e.target.value)} >
                <option value="10">10</option>     
                <option value="20">20</option>  
                <option value="50">50</option>   
            </select>
        </div>
    </div>

  )
}

export default Pagination