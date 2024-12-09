import React from 'react'
import { useContext,useEffect,useState } from 'react';
import { AuthorizedApi } from '../../axios';
import { UserDetailsContext } from '../../context/userContext';
import Icons from '../../components/common/Icons';
import PopupComponent from '../../components/common/PopupComponent';
import InputComponent from '../../components/common/InputComponent';
import Loader from '../../components/common/Loader';
import Toaster from '../../components/common/Toaster';
import SelectComponent from '../../components/common/SelectComponent'
import { getDateInReadableFmt, newItemValidation } from '../../utils/CommonUtils';
import { getStateDifference } from '../../utils/CommonUtils';
import Pagination from '../../components/common/Pagination';
import SortPopUpComponent from '../../components/common/SortPopUpComponent'
import { itemsFilterData, itemsSortData } from '../../constants';
import FilterPopUpComponent from '../../components/common/FilterPopUpComponent';

const Items = () => {
  const [loading,setLoading]=useState(false);
  const [toastMsg,setToastMsg] =useState("");
  const [toastStatus,setToastStatus] = useState(false);
  const [allPartyItems,setAllPartyItems] = useState([])
  const [showPopUp,setShowPopUp]=useState(false);
  const [popUpTitle,setPopUpTitle] = useState("Create New Item");
  const [isPopUpEdit,setIsPopUpEdit] = useState(false);
  const [itemDetails,setItemDetails] = useState({})
  const { firmDetails } = useContext(UserDetailsContext);
  const [isNewItem,setIsNewItem] = useState(true);

  //   Search Query for Pagination
const [currentPage,setCurrentPage] = useState(1);
const [itemsPerPage,setItemsPerPage] = useState(20);
const [totalPages,setTotalPages] = useState(1);
const [totalCount,setTotalCount] = useState(1);


// Filters and Sort
const [selectedFilter,setSelectedFilter] = useState({
  itemName:"",
  partyName:"",
  minPrice:"0",
  maxPrice:"1000000"
});
const [selectedSort,setSelectedSort] = useState({
  sortType:"desc",
  sortKey:"createdAt"
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
    itemName:"",
    partyName:"",
    minPrice:"0",
    maxPrice:"1000000"
  })
}


  const onCloseFn=()=>{
    setToastStatus(true);
    setShowPopUp(false);
  }

  const getAllPartyItems = (pageNum,pageSize) =>{
    setLoading(true);
    AuthorizedApi.get("/items/all",{
      params:{
        pageNum:pageNum,
        pageSize:pageSize,
        ...selectedSort,
        ...selectedFilter,
      }
    }).then((res)=>{
      setAllPartyItems(res.data.data);
      // setToastMsg(res.data.message);
      setTotalCount(res.data.totalCount);
      setTotalPages(res.data.totalPages);
      setCurrentPage(res.data.pageNum);
      setItemsPerPage(res.data.pageSize);
      setToastStatus(true);
      setLoading(false);
    }).catch(err=>{
      console.log(err);
      setLoading(false);
      setToastStatus(false);
      setToastMsg(err.response.data.message);
    })

  }

  const createNewItems = (itemData) =>{
    setIsNewItem(true);
    setPopUpTitle("Add Item")
    setShowPopUp(true);
  }




  const handleEdit = (itemData) =>{
    setIsNewItem(false)
    setIsPopUpEdit(true);
    setPopUpTitle("Edit Item")
    setShowPopUp(true);
    setItemDetails(itemData)
  }

  const handleDelete = (itemData) =>{
    setLoading(true);
    AuthorizedApi.delete('/items/delete?partyName='+itemDetails.party.partyName+'&itemName='+itemData.itemName).then((res)=>{
        setLoading(false);
        setToastMsg("Item Deleted successfully");
        setToastStatus(true);
        getAllPartyItems(1,20);

    }).catch(err=>{
        setLoading(false);
        setToastMsg(err.response.data.message);
        setToastStatus(false);
    })
  }



  useEffect(()=>{
    getAllPartyItems(1,20);
  },[selectedSort])

  return (
    <>
      {
        loading ? <Loader/> :
        <div className='flex items-center justify-center gap-2 flex-col '>
          <PopupComponent isOpen={showPopUp} onCloseFn={()=>onCloseFn()} popUpTitle={popUpTitle} isBtnVisible={false} >
              <ItemsPopUp isNewItem={isNewItem} itemDetails={itemDetails} getAllPartyItems={getAllPartyItems} onCloseFn={onCloseFn}/>
          </PopupComponent>
          <div className='rounded-sm border border-gray-300 shadow-md w-full relative '>

          <div className='p-4 border-b border-gray-200 flex items-center justify-between'>
              <p className='font-semibold text-lg text-slate-600'>Item List</p>
              <div className='flex item-center justify-end gap-x-2'>
                <SortPopUpComponent data={itemsSortData} selectedItem={selectedSort} changeSortFn={(sortType,sortKey)=>changeSortFn(sortType,sortKey)}/>
                <FilterPopUpComponent data={itemsFilterData} selectedFilter={selectedFilter} filterChanges = {(filterKey,filterValue)=>changeFilterValues(filterKey,filterValue)} resetFilter= {()=>resetFilter()} applyFilter={()=>getAllPartyItems(1,20)}/>
                <p className='px-2 py-1 shadow-md text-white w-fit select-none cursor-pointer rounded-md bg-[#212934]' onClick={()=>createNewItems()}>{Icons['add-icon']} Add Items</p>
              </div>
          </div>
          <div className='h-[calc(100vh-160px)] overflow-y-auto'>

          <div className='p-4 grid md:grid-cols-1 gap-x-2 gap-y-1 sm:grid-cols-1 lg:grid-cols-2'>
            {
               allPartyItems.map((partyItem)=>{
                    return (
                        <ItemCard itemDetails={partyItem} handleEdit={handleEdit} handleDelete={handleDelete}/>
                    )
                })
            }
          </div>
          </div>
          <Pagination onPageChange={(page,pageSize)=>getAllPartyItems(page,pageSize)} totalCount={totalCount} siblingCount={1} currentPage={currentPage} pageSize={itemsPerPage} totalPages={totalPages}/>
        </div>

          {
              toastMsg.length>=1&&
              <Toaster toastMsg={toastMsg} setToastMsg={setToastMsg} isSuccess={toastStatus}/>
          }
        </div>
      }
    </>
  )
}

const ItemsPopUp = ({isNewItem,itemDetails,getAllPartyItems,onCloseFn}) =>{

  const { firmDetails } = useContext(UserDetailsContext);
  const [selectedParty,setSelectedParty] = useState("");

  const [itemData,setItemData] = useState(null);
  const [loading,setLoading]=useState(false);
  const [toastMsg,setToastMsg] =useState("");
  const [toastStatus,setToastStatus] = useState(false);
  const [allParties,setAllParties] = useState([])
  const [itemDifference,setItemDifference] = useState({});



  const handleValidate = () =>{
    setLoading(true);
    newItemValidation.validate(itemData,{abortEarly:false}).then((valid)=>{
      console.log(itemData);
      if(isNewItem){
        handleSaveItem();
      }else{
        handleUpdateItem();
      }
    }).catch(error=>{
      setLoading(false);
      setToastMsg(error.inner[0]?.message);
      setToastStatus(false);  
  })
    
}   


  

  const handleSaveItem = () =>{

    AuthorizedApi.post('/items/new?partyName='+selectedParty,{...itemData}).then((res)=>{
        setLoading(false);
        setToastMsg(res.data.data.message);
        setToastStatus(true);
        onCloseFn();
        getAllPartyItems(1,20);
    }).catch((err)=>{
        setLoading(false)
        setToastMsg(err.response.data.message);
        setToastStatus(false);
        console.log(err)
    }) 
  }

  const handleUpdateItem = () =>{
    if(Object.keys(itemDifference).length === 0){
      setLoading(false);
      return;
    }
    AuthorizedApi.patch('/items/update?partyName='+selectedParty+'&itemName='+itemDetails.itemName,{...itemDifference}).then((res)=>{
        setLoading(false);
        setToastMsg(res.data.message);
        setToastStatus(true);
        onCloseFn();
        getAllPartyItems(1,20);
    }).catch((err)=>{
        setLoading(false)
        setToastMsg(err.response.data.message);
        setToastStatus(false);
    }) 
  }

  const getAllParties = () =>{
    setLoading(true);
    AuthorizedApi.get("/parties/all",{
      params:{
        pageNum:1,
        pageSize:100,
      }
    }).then((res)=>{
            setAllParties(res.data.data);
            setLoading(false)
          }).catch(err=>{
              setLoading(false);
              setToastMsg(err.response.data.message);
              setToastStatus(false);
          })
  }


  useEffect(()=>{
    if(!isNewItem){
      setItemData({
        itemName:itemDetails.itemName,
        price:itemDetails.price.toFixed(2)
      });
      setSelectedParty(itemDetails.party.partyName);
    }else{
      setItemData({
        itemName:"Item Name",
        price:10
      })
    }
    getAllParties();
  },[])


  useEffect(()=>{
    if(itemData){
        let itemInitialDetails = {
          itemName:itemDetails.itemName,
          price:itemDetails.price
        }
        const differences = getStateDifference(itemInitialDetails,itemData);
        if(Object.keys(differences).length >= 1){
         setItemDifference(differences);
        }
        console.log(Object.keys(differences).length)
        console.log(differences);
    }
 },[itemData])

  return (
    itemData &&
    <div className='flex flex-col w-full'>
        <div className='flex flex-col w-full gap-y-4'>
            <InputComponent inputType="text" labelName="Item Name" inputName="itemName" inputValue={itemData.itemName} jsonDetails={itemData} setJsonDetails={setItemData}/>
            <InputComponent inputType="number" labelName="price" inputName="price" inputValue={itemData.price} jsonDetails={itemData} setJsonDetails={setItemData}/>
            <select className='w-full border border-gray-300 py-2 px-2 text-md rounded-md focus:outline-none focus:border-blue-500 text-sm text-gray-500 mb-4' value={selectedParty} name='party' onChange={(e)=>setSelectedParty(e.target.value)}>
                <option value="" disabled>Select Party</option>
                {
                  allParties.map((party)=>{
                    return (
                      <option value={party.partyName}>{party.partyName}</option>
                    )
                  })
                }
            </select>
        </div>
    {loading && <Loader/>}
    {
        toastMsg.length>=1&&
        <Toaster toastMsg={toastMsg} setToastMsg={setToastMsg} isSuccess={toastStatus}/>
    }
    {
        isNewItem ? 
        <p className='text-white bg-blue-500 rounded-md p-1 cursor-pointer px-6 capitalize w-fit ml-auto mr-2 select-none' onClick={()=>handleValidate()}>save</p>
        :
        <p className={`text-white bg-blue-500 rounded-md p-1 px-6 capitalize w-fit ml-auto mr-2 select-none ${Object.keys(itemDifference).length === 0 ? 'cursor-not-allowed bg-gray-500':'cursor-pointer bg-blue-500'}` } onClick={()=>handleValidate()}>update</p>
    }
  </div>
  )
}

const ItemCard = ({itemDetails,handleEdit,handleDelete}) =>{
    
  return(
      <div className='p-2 border border-gray-300 w-full min-w-[250px]'>
          <div className='flex gap-x-4 items-center relative'>

                <div className='text-slate-900 grid '>

                    <p className='font-bold'>
                      <span className='text-blue-500 mr-2'>{Icons['item-icon']}</span>
                      {itemDetails.itemName} - &#x20b9;{itemDetails.price.toFixed(2)}</p>
                    <div className='text-sm mb-1'>
                      <p className='flex'><p className='font-semibold'>Party name :&nbsp;</p> {itemDetails.party.partyName}</p>
                    </div>
                    <p className='text-xs text-gray-600'>{getDateInReadableFmt(itemDetails.createdAt)}</p>
                </div>
              <div className=' relative ml-auto cursor-pointer group '>
                  <div className='p-4'>
                      {
                          Icons['more-icon']
                      }
                  </div>
                  <div className='absolute hidden group-hover:block right-4 top-10 cursor-pointer z-10 bg-white border border-gray-300 rounded-md shadow-md min-w-[150px] '>
                      <p className='flex px-4 py-2 items-center gap-x-2 hover:text-blue-600 font-semibold' onClick={()=>handleEdit(itemDetails)}>
                          {
                              Icons['edit-icon']
                          }
                          <span>Edit</span>
                      </p>
                      <p className='flex px-4 py-2 items-center gap-x-2 hover:text-red-600 font-semibold' onClick={()=>handleDelete(itemDetails)}>
                          {
                              Icons['delete-icon']
                          }
                          <span>Delete</span>
                      </p>
                  </div>
              </div>
          </div>
      </div>
  )
}


export default Items