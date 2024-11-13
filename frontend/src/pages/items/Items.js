import React from 'react'
import { useContext,useEffect,useState } from 'react';
import { AuthorizedApi } from '../../axios';
import { UserDetailsContext } from '../../context/userContext';
import Icons from '../../components/common/Icons';
import PopupComponent from '../../components/common/PopupComponent';
import InputComponent from '../../components/common/InputComponent';
import Loader from '../../components/common/Loader';
import Toaster from '../../components/common/Toaster';
import SellIcon from '@mui/icons-material/Sell';
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
  const [isNewParty,setIsNewParty] = useState(true);


  const onCloseFn=()=>{
    setToastStatus(true);
    setShowPopUp(false);
  }

  const getAllPartyItems = (toastMessage) =>{
    console.log(toastMessage);
    setLoading(true);
    let firmData = {
      firmId : firmDetails._id
    }
    AuthorizedApi.post("/item/all-party-items",firmData).then((res)=>{
      setAllPartyItems(res.data);
      setToastMsg(toastMessage);
      setToastStatus(true);
      setLoading(false);
    }).catch(err=>{
      console.log(err);
      setLoading(false);
    })

  }

  const createNewItems = (itemData) =>{
    setIsNewParty(true);
    setPopUpTitle("Add Item")
    setShowPopUp(true);
  }


  const handleEdit = (itemData) =>{
    setIsNewParty(false)
    setIsPopUpEdit(true);
    setPopUpTitle("Edit Item")
    setShowPopUp(true);
    setItemDetails(itemData)
  }

  const handleDelete = (itemData) =>{
    setLoading(true);
    AuthorizedApi.delete("/item/delete/"+itemData._id).then((res)=>{
        setLoading(false);
        setToastMsg("Item Deleted successfully");
        setToastStatus(true);
        getAllPartyItems("Item Deleted successfully");

    }).catch(err=>{
        setLoading(false);
        setToastMsg("Error in Deleting Item");
        setToastStatus(false);
    })
  }



  useEffect(()=>{
    getAllPartyItems("");
  },[])

  return (
    <>
      {
        loading ? <Loader/> :
        <div className='rounded-sm border border-gray-300 shadow-md w-full min-h-[calc(100vh-50px)]'>
          <PopupComponent isOpen={showPopUp} onCloseFn={()=>onCloseFn()} popUpTitle={popUpTitle} isBtnVisible={false} >
              <ItemsPopUp isNewParty={isNewParty} itemDetails={itemDetails} getAllPartyItems={getAllPartyItems} onCloseFn={onCloseFn}/>
            </PopupComponent>
          <div className='p-4 border-b border-gray-200 flex items-center'>
              <p className='font-semibold text-lg text-slate-600'>Item List</p>
              <p className='px-2 py-2 shadow-md text-white font-semibold w-fit select-none cursor-pointer rounded-md ml-auto bg-[#212934]' onClick={()=>createNewItems()}>{Icons['add-icon']} Add Items</p>
          </div>
          <div className='p-4 grid md:grid-cols-2 gap-x-2 gap-y-1 sm:grid-cols-1'>
            {
                allPartyItems.map((partyItem)=>{
                    return (
                        <ItemCard itemDetails={partyItem} handleEdit={handleEdit} handleDelete={handleDelete}/>
                    )
                })
            }
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

const ItemsPopUp = ({isNewParty,itemDetails,getAllPartyItems,onCloseFn}) =>{

  const { firmDetails } = useContext(UserDetailsContext);
  const [itemData,setItemData] = useState({
    item_name:"",
    price:"",
    firm:firmDetails._id,
    party:"",
  });
  const [loading,setLoading]=useState(false);
  const [toastMsg,setToastMsg] =useState("");
  const [toastStatus,setToastStatus] = useState(false);
  const [allParties,setAllParties] = useState([])


  const handleValidate = () =>{
    if(itemData.item_name.trim()==""){
        setToastMsg("Item Name cannot be empty");
        setToastStatus(false);
        return false;
    }
    if(itemData.price.toString().trim()=="" ){
        setToastMsg("Item Price cannot be empty");
        setToastStatus(false);
        return false;
    }
    if(itemData.price <= 0 ){
      setToastMsg("Item Price must be greater than zero");
      setToastStatus(false);
      return false;
    }
    if(isNewParty){
      if(itemData.party.trim() == ""){
        setToastMsg("Party must be selected")
        setToastStatus(false);
        return false;
      }
    }
    return true
}   

  const handleSaveItem = () =>{
    setLoading(true)
    let isSuccess = handleValidate();
    if(!isSuccess){
        setLoading(false)
        return;
    }
    AuthorizedApi.post('/item/new',{itemData}).then((res)=>{
        console.log(res)
        setLoading(false);
        setToastMsg("Item Created successfully");
        setToastStatus(true);
        onCloseFn();
        getAllPartyItems("Item Created successfully");
    }).catch((err)=>{
        setLoading(false)
        setToastMsg("Error in Creating Item");
        setToastStatus(false);
        console.log(err)
    }) 
  }

  const handleUpdateItem = () =>{
    setLoading(true)
    let isSuccess = handleValidate();
    if(!isSuccess){
        setLoading(false)
        return;
    }
    AuthorizedApi.put('/item/update/'+itemData._id,{itemData}).then((res)=>{
        console.log(res)
        setLoading(false);
        setToastMsg("Item Updated successfully");
        setToastStatus(true);
        onCloseFn();
        getAllPartyItems("Item Updated successfully");
    }).catch((err)=>{
        setLoading(false)
        setToastMsg("Error in Updating Item");
        setToastStatus(false);
        console.log(err)
    }) 
  }

  const handleInputChange = (e) =>{
    setItemData({...itemData,[e.target.name]:e.target.value})
}

  const getAllParties = () =>{
    setLoading(true);
    AuthorizedApi.get("/party/all/"+firmDetails._id).then((res)=>{
            setAllParties(res.data)
            setLoading(false)
          }).catch(err=>{
              setLoading(false)
          })
  }


  useEffect(()=>{
    if(!isNewParty){
      setItemData(itemDetails);
    }
    else{
      setItemData(itemData)
    }
    getAllParties();
  },[])

  return (
    <div className='flex flex-col w-full'>
        <div className='flex flex-col w-full gap-y-4'>
            <InputComponent inputType="text" labelName="Item Name" inputName="item_name" inputValue={itemData.item_name} jsonDetails={itemData} setJsonDetails={setItemData}/>
            <InputComponent inputType="number" labelName="price" inputName="price" inputValue={itemData.price} jsonDetails={itemData} setJsonDetails={setItemData}/>
            <select className='w-full border border-gray-300 py-2 px-2 text-md rounded-md focus:outline-none focus:border-blue-500 text-sm text-gray-500 mb-4' value={isNewParty ? itemData.party :itemData.party._id} name='party' onChange={(e)=>handleInputChange(e)}>
                <option value="" disabled>Select Party</option>
                {
                  allParties.map((party)=>{
                    return (
                      <option value={party._id}>{party.party_name}</option>
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
        isNewParty ? 
        <p className='text-white bg-blue-500 rounded-md p-1 cursor-pointer px-6 capitalize w-fit ml-auto mr-2 select-none' onClick={()=>handleSaveItem()}>save</p>
        :
        <p className='text-white bg-blue-500 rounded-md p-1 cursor-pointer px-6 capitalize w-fit ml-auto mr-2 select-none' onClick={()=>handleUpdateItem()}>update</p>
    }
  </div>
  )
}

const ItemCard = ({itemDetails,handleEdit,handleDelete}) =>{
    
  return(
      <div className='p-2 border border-gray-300 w-full'>
          <div className='flex gap-x-4 items-center relative'>

                <div className='text-slate-900 grid '>

                    <p className='font-bold'>
                      <span className='text-blue-500 mr-2'>{Icons['item-icon']}</span>
                      {itemDetails.item_name} - &#x20b9;{itemDetails.price}</p>
                    <div className='text-sm'>
                      <p className='flex'><p className='font-semibold'>Party name :&nbsp;</p> {itemDetails.party.party_name}</p>
                    </div>
                </div>
              <div className=' relative ml-auto cursor-pointer group'>
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