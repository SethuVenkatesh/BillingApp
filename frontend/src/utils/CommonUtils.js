import * as Yup from 'yup';

export const isValidEmail = (email) => {
    const regex =  /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    return email.match(regex);
}


export const getDateInReadableFmt = (timeStamp) =>{


  const date = new Date(timeStamp);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  const month = monthNames[date.getMonth()];
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
  
  const formattedDateTime = `${month} ${day}, ${year}, ${hours}:${minutes}:${seconds} ${ampm}`;
  return formattedDateTime
}


export const getStateDifference = (state1,state2)=>{
  const differences = {};
  Object.keys({...state1,state2}).forEach(key=>{
      if(typeof state1[key] === 'object' && typeof state2[key] === 'object' && state1[key] && state2[key]){
          const nestedDiff = getStateDifference(state1[key],state2[key]);
          if(Object.keys(nestedDiff).length > 0){
            differences[key] = nestedDiff;
          }
      }else if(state1[key] !== state2[key]){
        differences[key] = state2[key];
      }
  })
  return differences;

}

export const registerUserSchemaValidation = Yup.object().shape({
  userName:Yup.string().min(5,"username must be atleast 5 characters").required("Username is required"),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], "Passwords don't match!").required('Confirm Password is Required'),
  mobileNumber: Yup.string().matches("^\\d{10}$","Mobile number must be 10 digits").required('Mobile Number is required'),
})

export const firmSchemaValidation = Yup.object().shape({
  firmName:Yup.string().required("Firm Name is Required"),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  mobileNumber: Yup.string().matches("^\\d{10}$","Mobile number must be 10 digits").required('Mobile Number is required')
})


export const newPartySchemaValidation = Yup.object().shape({
  partyName:Yup.string().min(5,"party name must be atleast 5 characters").required("party name is required"),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  mobileNumber: Yup.string().matches("^\\d{10}$","Mobile number must be 10 digits").required('Mobile Number is required'),
  altMobileNumber: Yup.string().matches("^\\d{10}$","Alternate Mobile number must be 10 digits"),
  bank: Yup.object().shape({
    bankName:Yup.string().required("Bank Name is required"),
    accountNumber:Yup.string().required("Account Number is required"),
    branch:Yup.string().required("Branch Name is required"),
    ifscCode:Yup.string().required("IFSC Code is required"),
  }),
  address: Yup.object().shape({
    address:Yup.string().required("address is required"),
    city:Yup.string().required("city is required"),
    state:Yup.string().required("State is required"),
    pincode:Yup.string().matches("^\\d{6}$","Pincode is invalid").required("Pincode is required"),
  })

})


export const newItemValidation = Yup.object().shape({
  itemName:Yup.string().min(5,"Item name must be atleast 5 characters").required("Item name is required"),
  price: Yup.string().matches(/^(?:[1-9]\d{0,5})(?:\.\d{2})?$/,
      "Price must be between 1.00 and 999999.99 with two decimal places").required("Item Price is required")
})


export const billingItemValidation = Yup.array().of(Yup.object().shape({
  itemName:Yup.string().min(5,"Item name must be atleast 5 characters").required("Item name is required"),
  price: Yup.string().matches(/^(?:[1-9]\d{0,5})(?:\.\d{2})?$/,
    "Price must be between 1.00 and 999999.99 with two decimal places").required("Item Price is required"),
  quantity: Yup.number().integer("Quantity must be number (eg: 1,10,100)").typeError("Quantity cannot be Empty").min(1,"Quantity must be greater than 1").max(1000000,"Quantity must be less than 1000").required("Quantity is required")
}))

export const invoiceValidation = Yup.object().shape({
  invoiceParty:Yup.object().shape({
    partyName:Yup.string().min(5,"party name must be atleast 5 characters").required("party name is required"),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    mobileNumber: Yup.string().matches("^\\d{10}$","Mobile number must be 10 digits").required('Mobile Number is required'),
    altMobileNumber: Yup.string().matches("^\\d{10}$","Mobile number must be 10 digits"),
    address: Yup.object().shape({
      address:Yup.string().required("address is required"),
      city:Yup.string().required("city is required"),
      state:Yup.string().required("State is required"),
      pincode:Yup.string().matches("^\\d{6}$","Pincode is invalid").required("Pincode is required"),
    })
  }),
  invoiceItems:Yup.array().of(Yup.object().shape({
    itemName:Yup.string().min(5,"Item name must be atleast 5 characters").required("Item name is required"),
    price: Yup.string().matches(/^(?:[1-9]\d{0,5})(?:\.\d{2})?$/,
      "Price must be between 1.00 and 999999.99 with two decimal places").required("Item Price is required"),
    quantity: Yup.number().integer("Quantity must be number (eg: 1,10,100)").typeError("Quantity cannot be Empty").min(1,"Quantity must be greater than 1").max(1000000,"Quantity must be less than 1000").required("Quantity is required")
  })).required("Alteast one invoice item is required"),
  subtotalPrice:Yup.string().matches(/^(?:[1-9]\d{0,7})(?:\.\d{2})?$/,
    "sub-total price must be between 1.00 and 99999999.99 with two decimal places").required("Subtotal Price is required"),
  totalPrice:Yup.string().matches(/^(?:[1-9]\d{0,7})(?:\.\d{2})?$/,
    "total price must be between 1.00 and 99999999.99 with two decimal places").required("total Price is required"),
  cgstPrice: Yup.string().matches(/^(?:[0-9]\d{0,7})(?:\.\d{2})?$/,
    "CGST price must be between 1.00 and 99999999.99 with two decimal places").required("CGST Price is required"),
  sgstPrice: Yup.string().matches(/^(?:[0-9]\d{0,7})(?:\.\d{2})?$/,
    "SGST price must be between 1.00 and 99999999.99 with two decimal places").required("SGST Price is required"),
  cgstPer: Yup.string().matches(/^(?:[1-3]\d{0,1})(?:\.\d{2})?$/,
    "CGST Percentage must be between 1.00 and 30.00 with two decimal places").required("CGST Percentage is required"),
  sgstPer: Yup.string().matches(/^(?:[1-3]\d{0,1})(?:\.\d{2})?$/,
    "SGST Percentage must be between 1.00 and 30.00 with two decimal places").required("SGST Percentage is required"),
  includeGst: Yup.string().required("GST status Required"),
  invoiceDate: Yup.string().required("Invoice Date is required")

})


export const paymentValidation = Yup.object().shape({
  amountPaid:Yup.string().matches(/^(?:[1-9]\d{0,7})(?:\.\d{2})?$/,
    "Amount must be between 1.00 and 99999999.99 with two decimal places").required("Amount is required"),
  paymentMode:Yup.string().required("Payment Mode is required"),
  paymentDate:Yup.string().required("Payment Date is required")
})