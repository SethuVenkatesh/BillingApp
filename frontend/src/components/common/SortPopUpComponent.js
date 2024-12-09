import React, { useEffect, useRef,useState } from 'react'
import Icons from './Icons';

const SortPopUpComponent = ({data,selectedItem,changeSortFn}) => {

    const sortRef = useRef(null);
    const [sortPopUp,setSortPopUp] = useState(false);

    useEffect(()=>{
      const checkIfClickedOutside = e => {
        if (sortRef.current && !sortRef.current.contains(e.target)) {
          onClose() 
        }
      }
      document.addEventListener("click", checkIfClickedOutside)
      return () => {
        document.removeEventListener("click", checkIfClickedOutside)
      }
    },[]);

    const showSortPopUp = () =>{
      setSortPopUp(!sortPopUp);

    }

    const onClose = () =>{
      setSortPopUp(false);
    }

    const handleChange = (sortType,sortKey) =>{
      changeSortFn(sortType,sortKey);
      onClose()
    }
    
  return (
    <div className='relative' ref={sortRef}>
      <p className='px-2 py-1 text-[#212934] border border-[#212934] rounded-md shadow-full w-fit cursor-pointer font-semibold'onClick={()=>showSortPopUp()}>{Icons['sort-icon']} Sort</p>
      {
        sortPopUp &&
        <div className='absolute  right-0 top-140 z-10 ' >
          <div className='w-fit-content bg-white-500 shadow-md relative w-[200px] rounded-md mt-2 '>
            <p className='absolute w-0 h-0 border-l-[15px] border-l-transparent border-b-[30px] border-b-gray-200 border-r-[15px] border-r-transparent right-2 -top-5'></p>
              <div className='flex items-center justify-between bg-gray-200 px-2 py-1 rounded-t-md '>
                  <p className='text=gray-500 font-semibold'>Sort</p>
                  <p className='cursor-pointer' onClick={()=>onClose()}>{Icons['close-icon']}</p>
              </div>
              <div className='flex flex-col bg-white w-fit-content rounded-md'>  
                  {
                    data.map(sortData=>{
                      return(
                        <p className={`px-2 py-1 w-autp cursor-pointer text-[#212934] hover:bg-[#212934] hover:text-white rounded-md ${sortData.sortType === selectedItem.sortType && sortData.key === selectedItem.sortKey ? 'text-white bg-[#212934]':''}`} onClick={()=>{handleChange(sortData.sortType,sortData.key)}}>{sortData.title}</p>
                      )
                    })
                  }
              </div>
          </div>
        </div>
      }
    </div>
  )
}

export default SortPopUpComponent