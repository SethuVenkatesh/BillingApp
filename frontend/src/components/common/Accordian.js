import React, { useEffect, useState } from 'react'
import Icons from './Icons';
import SkeletonLoader from './SkeletalLoader';

const Accordian = ({expand,setExpand,title,callBackfn,children}) => {

 const [skeletalLoading,setSkeletalLoading] = useState(true);
 const [accordianList,setAccodianList] = useState(null);

 const handleExpand = () =>{
    setExpand(!expand);
    // if(accordianList==null || accordianList==undefined){
        getAccordianList();
    // }
 }


 const getAccordianList =async ()=>{
    setSkeletalLoading(true);
    try{
        let result;
        result =await callBackfn();
        setAccodianList(result.data);
    }catch{
        setAccodianList(null);
    }finally{
        setSkeletalLoading(false);
    }
 }

 useEffect(()=>{
    
 },[])
 
  return (
    <div className='border border-gray-300 rounded-sm '>
        <div className='p-2 border-b-2 text-slate-600 font-semibold flex items-center justify-between'>
            <p className=''>{title}</p>
            <p className='border-l-2 pl-2 cursor-pointer' onClick={()=>{handleExpand()}}>
            {
                expand ? Icons['arrow-up-icon'] : Icons['arrow-down-icon']
            }
            </p>
        </div>

        {
            expand &&
            <div className=''>
                {
                    accordianList ?
                    <>
                    {
                        accordianList.length == 0 &&
                        <p className='text-slate-500 font-semibold text-center p-2'>
                            No Records Found
                        </p>
                    }
                    {
                        accordianList.map((accordianListItem,index)=>{
                            return (
                                React.cloneElement(children, {index, data:accordianListItem })
                            )
                        })
                    }
                    </>
                    :
                    <>  
                        {
                            Array(3)
                                .fill(null)
                                .map((_, index) => (
                                    <SkeletonLoader/>
                                ))
                        }
                    </>

                }
            </div>
        }

    </div>
  )
}

export default Accordian