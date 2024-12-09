import React, { useEffect, useRef,useState } from 'react'
import Icons from './Icons';

const FilterPopUpComponent = ({data,filterChanges,selectedFilter,resetFilter,applyFilter}) => {

    const filterRef = useRef(null);
    const [filterPopUp,setFilterPopUp] = useState(false);

    
    const showFilterPopUp = () =>{
        setFilterPopUp(!filterPopUp);
  
      }
  
      const onClose = () =>{
        setFilterPopUp(false);
      }
  
      const handleChange = (e) =>{
          const key = e.target.name;
          const value = e.target.value;
          console.log("first",key,value)
        filterChanges(key,value);
      }

      const handleApply = () =>{
        applyFilter();
        onClose();
      }

      const handleReset = () =>{
        resetFilter();
      }

    useEffect(()=>{
      const checkIfClickedOutside = e => {
        if (filterRef.current && !filterRef.current.contains(e.target)) {
          onClose() 
        }
      }
      document.addEventListener("click", checkIfClickedOutside)
      return () => {
        document.removeEventListener("click", checkIfClickedOutside)
      }
    },[]);

  return (
    <div className='relative' ref={filterRef}>
    <p className='px-2 py-1 text-[#212934] border border-[#212934] rounded-md shadow-full w-fit cursor-pointer font-semibold'onClick={()=>showFilterPopUp()}>{Icons['filter-icon']} Filter</p>
    {
      filterPopUp &&
      <div className='absolute  right-0 top-140 z-10 ' >
        <div className='w-fit-content bg-white-500 shadow-md relative w-[300px] rounded-md mt-2 bg-white'>
          <p className='absolute w-0 h-0 border-l-[15px] border-l-transparent border-b-[30px] border-b-gray-200 border-r-[15px] border-r-transparent right-2 -top-5'></p>
            <div className='flex items-center justify-between bg-gray-200 px-2 py-1 rounded-t-md '>
                <p className='text=gray-500 font-semibold'>Filter</p>
                <p className='cursor-pointer' onClick={()=>onClose()}>{Icons['close-icon']}</p>
            </div>
            <div className='flex flex-col bg-white p-2 gap-y-4 mb-2'>  
                {
                  data.map(filterData=>{
                    return(
                        filterData.inputType !== 'range' ?
                        <div className='flex flex-col '>
                            <p className='text-slate-700 mb-2'>{filterData.labelName} :</p>
                            <input className='px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-500' type={filterData.inputType} placeholder={filterData.labelName} name={filterData.inputName} value={selectedFilter[filterData.inputName]} onChange={(e)=>handleChange(e)}/>
                        </div>
                        :
                        <div className='flex flex-col '>
                            <p className='text-slate-700 mb-2'>{filterData.labelName} :</p>
                            <div className = 'relative w-full mb-4'>
                                <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-300"></div>
                            <div
                                className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-[#212934]"
                                style={{
                                left: `${(selectedFilter[filterData.minInputName] / filterData.maxValue) * 100}%`,
                                width: `${((selectedFilter[filterData.maxInputName] - selectedFilter[filterData.minInputName]) / filterData.maxValue) * 100}%`,
                                }}
                            ></div>
                            <input
                                type="range"
                                min={filterData.minValue}
                                max={filterData.maxValue}
                                name={filterData.minInputName}
                                value={selectedFilter[filterData.minInputName]}
                                onChange={(e)=>handleChange(e)}
                                className="absolute w-full appearance-none bg-transparent pointer-events-auto range-thumb z-20 slider-thumb"

                            />
                            {/* Max Slider */}
                            <input
                                type="range"
                                min={filterData.minValue}
                                max={filterData.maxValue}
                                name={filterData.maxInputName}
                                value={selectedFilter[filterData.maxInputName]}
                                onChange={(e)=>handleChange(e)}
                                className="absolute w-full appearance-none bg-transparent pointer-events-auto range-thumb z-20 slider-thumb"
                            />
                            </div>
                            <div className="flex justify-between items-center mb-2">
                            <div className="flex flex-col gap-y-2">
                            <label className="text-sm text-slate-700">Min Price</label>
                            <input
                                min={filterData.minValue}
                                max={filterData.maxValue}
                                name={filterData.minInputName}
                                value={selectedFilter[filterData.minInputName]}
                                onChange={(e)=>handleChange(e)}
                                className="border rounded p-2 w-24 focus:outline-none focus:ring focus:border-blue-500"
                            />
                            </div>
                            <div className="flex flex-col gap-y-2">
                            <label className="text-sm text-slate-700 ">Max Price</label>
                            <input
                                type="number"
                                min={filterData.minValue}
                                max={filterData.maxValue}
                                name={filterData.maxInputName}
                                value={selectedFilter[filterData.maxInputName]}
                                onChange={(e)=>handleChange(e)}
                                className="border rounded p-2 w-24 focus:outline-none focus:ring focus:border-blue-500"
                            />
                            </div>
                        </div>

                                                    {/* <input className='px-2 py-1 border border-gray-200 rounded-md focus:outline-none accent-blue-500' 
                                min={filterData.minValue}
                                max={filterData.maxValue}
                                type={filterData.inputType} 
                                placeholder={filterData.labelName} 
                                name={filterData.inputName}
                                value={selectedFilter[filterData.inputName]}
                                onChange={(e)=>handleChange(e)}
                            /> */}
                        </div>
                        

                    )
                  })
                }
            </div>
            <div className='flex items-center justify-around p-2 mb-2'>
                <p className='border border-[#212934] text-[#212934] px-2 py-1 rounded-md cursor-pointer' onClick={()=>handleReset()}>Reset</p>
                <p className='border border-blue-500  text-white bg-blue-500 px-2 py-1 rounded-md cursor-pointer' onClick={()=>handleApply()}>Apply</p>
            </div>
        </div>
      </div>
    }
  </div>
  )
}

export default FilterPopUpComponent