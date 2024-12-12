import React, { useEffect, useRef,useState } from 'react'
import Icons from './Icons';

const FilterPopUpComponent = ({data,filterChanges,selectedFilter,resetFilter,applyFilter,setSelectedFilter}) => {

    const filterRef = useRef(null);
    const [filterPopUp,setFilterPopUp] = useState(false);
    const [dateIndex,setDateIndex] = useState("");
    const [customDate,setCustomDate] = useState(false);

    let currentDate = new Date();
    let maxInputDate = currentDate.getFullYear() + '-' + ('0' + (currentDate.getMonth() + 1)).slice(-2) + '-' + ('0' + currentDate.getDate()).slice(-2);


    
    const showFilterPopUp = () =>{
        setFilterPopUp(!filterPopUp);
  
      }
  
      const onClose = () =>{
        setFilterPopUp(false);
      }
  
      const handleChange = (e) =>{
          const key = e.target.name;
          const value = e.target.value;
        filterChanges(key,value);
      }

      const handleApply = () =>{
        applyFilter();
        onClose();
      }

      const handleReset = () =>{
        setDateIndex("");
        setCustomDate(false);
        resetFilter();
      }

      const handleOptionSelect = (key,value) =>{
        filterChanges(key,value);
      }

      const handleDateSelect = (startKey,endKey,value) =>{
        setDateIndex(value);
        if(value === "-1"){
          setCustomDate(true);
        }else{
          setCustomDate(false);
          let today = new Date();
          const newDate = new Date();
          newDate.setDate(today.getDate() - parseInt(value));
          console.log("today ",today,newDate)
          let maxDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
          let minDate = newDate.getFullYear() + '-' + ('0' + (newDate.getMonth() + 1)).slice(-2) + '-' + ('0' + newDate.getDate()).slice(-2);
          setSelectedFilter({
            ...selectedFilter,
            [startKey]:minDate,
            [endKey]:maxDate
          })

        }
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


    useEffect(()=>{
      const days = [7,14,30];
      let today = new Date();
      let inList = false;
      let maxDate = today.getFullYear() + '-' + ('0' + (today.getMonth() + 1)).slice(-2) + '-' + ('0' + today.getDate()).slice(-2);
      console.log("useFeect")
      for(let dayIndex = 0 ; dayIndex < days.length ; dayIndex++){
        const newDate = new Date();
        newDate.setDate(today.getDate() - parseInt(days[dayIndex]));
        console.log("today ",today,newDate)
        let minDate = newDate.getFullYear() + '-' + ('0' + (newDate.getMonth() + 1)).slice(-2) + '-' + ('0' + newDate.getDate()).slice(-2);
        console.log(selectedFilter.invoiceStartDate,selectedFilter.invoiceEndDate,minDate,maxDate);
        if(selectedFilter.invoiceStartDate === minDate && selectedFilter.invoiceEndDate === maxDate){
          setDateIndex(days[dayIndex]);
          inList = true;
        }
      }
      if(!inList && selectedFilter.invoiceStartDate != ""){
        setCustomDate(true);
        setDateIndex(-1);
      }
    },[filterPopUp])

  return (
    <div className='relative' ref={filterRef}>
    <p className='px-2 py-1 text-[#212934] border border-[#212934] rounded-md shadow-md w-fit cursor-pointer font-semibold'onClick={()=>showFilterPopUp()}>{Icons['filter-icon']} Filter</p>
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

                    switch(filterData.inputType){
                      case "range":
                        return (
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
                          </div>
                        );
                      case "date":
                        return (
                          <div className=''>
                          <p className='text-slate-700 mb-2'>{filterData.labelName} :</p>
                          <div className='flex items-center justify-start gap-2 flex-wrap'>
                          {
                            filterData.options.map((option)=>{
                              return(
                                <p className={`rounded-md w-fit-content text-slate-700 px-2 py-1 border border-slate-700 cursor-pointer ${option.labelValue == dateIndex ? 'text-white bg-[#212934]':'' }`} onClick={()=>handleDateSelect(filterData.startDate,filterData.endDate,option.labelValue)}>{option.labelName}</p>
                              )
                            })
                          }
                          </div>
                          {
                            customDate &&
                            <div className='flex flex-col items-between gap-y-2 mt-2 w-1/2'>
                              <input type='date' name={filterData.startDate} value={selectedFilter[filterData.startDate]} max={maxInputDate} className='border rounded px-2 py-1 w-fit-content focus:outline-none focus:ring focus:border-blue-500 ' onChange={(e)=>handleChange(e)}/>
                              <p className='m-auto rounded-full bg-gray-400 w-[30px] h-[30px] text-center text-white'>
                                {Icons['double-arrow-icon']}
                              </p>
                              <input type='date' name={filterData.endDate} value={selectedFilter[filterData.endDate]} max={maxInputDate} className='border rounded px-2 py-1 w-fit-content focus:outline-none focus:ring focus:border-blue-500 ' onChange={(e)=>handleChange(e)}/>
                            </div>
                          }
                      </div>
                        )
                      case "checkbox":
                        return(
                          <div className=''>
                              <p className='text-slate-700 mb-2'>{filterData.labelName} :</p>
                              <div className='flex items-center justify-start gap-x-2'>
                              {
                                filterData.options.map((option)=>{
                                  return(
                                    <p className={`rounded-md text-slate-700 px-2 py-1 border border-slate-700 cursor-pointer ${ selectedFilter[filterData.inputName] === option.labelValue ? 'text-white bg-[#212934]':''}`} onClick={()=>handleOptionSelect(filterData.inputName,option.labelValue)}>{option.labelName}</p>
                                  )
                                })
                              }
                              </div>
                          </div>
                        )
                      default :
                        return (
                          <div className='flex flex-col '>
                              <p className='text-slate-700 mb-2'>{filterData.labelName} :</p>
                              <input className='px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-500' type={filterData.inputType} placeholder={filterData.labelName} name={filterData.inputName} value={selectedFilter[filterData.inputName]} onChange={(e)=>handleChange(e)}/>
                          </div>
                        )
                        
                    }
                    // return(
                    //     filterData.inputType !== 'range' ?
                    //     <div className='flex flex-col '>
                    //         <p className='text-slate-700 mb-2'>{filterData.labelName} :</p>
                    //         <input className='px-2 py-1 border border-gray-200 rounded-md focus:outline-none focus:ring focus:border-blue-500' type={filterData.inputType} placeholder={filterData.labelName} name={filterData.inputName} value={selectedFilter[filterData.inputName]} onChange={(e)=>handleChange(e)}/>
                    //     </div>
                    //     :
                    //     <div className='flex flex-col '>
                    //         <p className='text-slate-700 mb-2'>{filterData.labelName} :</p>
                    //         <div className = 'relative w-full mb-4'>
                    //             <div className="absolute top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-300"></div>
                    //         <div
                    //             className="absolute top-1/2 transform -translate-y-1/2 h-1 bg-[#212934]"
                    //             style={{
                    //             left: `${(selectedFilter[filterData.minInputName] / filterData.maxValue) * 100}%`,
                    //             width: `${((selectedFilter[filterData.maxInputName] - selectedFilter[filterData.minInputName]) / filterData.maxValue) * 100}%`,
                    //             }}
                    //         ></div>
                    //         <input
                    //             type="range"
                    //             min={filterData.minValue}
                    //             max={filterData.maxValue}
                    //             name={filterData.minInputName}
                    //             value={selectedFilter[filterData.minInputName]}
                    //             onChange={(e)=>handleChange(e)}
                    //             className="absolute w-full appearance-none bg-transparent pointer-events-auto range-thumb z-20 slider-thumb"

                    //         />
                    //         {/* Max Slider */}
                    //         <input
                    //             type="range"
                    //             min={filterData.minValue}
                    //             max={filterData.maxValue}
                    //             name={filterData.maxInputName}
                    //             value={selectedFilter[filterData.maxInputName]}
                    //             onChange={(e)=>handleChange(e)}
                    //             className="absolute w-full appearance-none bg-transparent pointer-events-auto range-thumb z-20 slider-thumb"
                    //         />
                    //         </div>
                    //         <div className="flex justify-between items-center mb-2">
                    //         <div className="flex flex-col gap-y-2">
                    //         <label className="text-sm text-slate-700">Min Price</label>
                    //         <input
                    //             min={filterData.minValue}
                    //             max={filterData.maxValue}
                    //             name={filterData.minInputName}
                    //             value={selectedFilter[filterData.minInputName]}
                    //             onChange={(e)=>handleChange(e)}
                    //             className="border rounded p-2 w-24 focus:outline-none focus:ring focus:border-blue-500"
                    //         />
                    //         </div>
                    //         <div className="flex flex-col gap-y-2">
                    //         <label className="text-sm text-slate-700 ">Max Price</label>
                    //         <input
                    //             type="number"
                    //             min={filterData.minValue}
                    //             max={filterData.maxValue}
                    //             name={filterData.maxInputName}
                    //             value={selectedFilter[filterData.maxInputName]}
                    //             onChange={(e)=>handleChange(e)}
                    //             className="border rounded p-2 w-24 focus:outline-none focus:ring focus:border-blue-500"
                    //         />
                    //         </div>
                    //     </div>
                    //     </div>
                        

                    // )
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