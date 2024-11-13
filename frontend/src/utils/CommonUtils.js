import * as Yup from 'yup';

export const isValidEmail = (email) => {
    const regex =  /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/;
    return email.match(regex);
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
  firmName:Yup.string().required("Firm Name is Required")
})


export const newPartySchemaValidation = Yup.object().shape({
  partyName:Yup.string().min(5,"party name must be atleast 5 characters").required("party name is required"),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  mobileNumber: Yup.string().matches("^\\d{10}$","Mobile number must be 10 digits").required('Mobile Number is required'),
  altMobileNumber: Yup.string().matches("^\\d{10}$","Mobile number must be 10 digits"),
  bank: Yup.object().shape({
    bankName:Yup.string().required("Bank Name is required"),
    accountNumber:Yup.string().required("Account Number is required"),
    branch:Yup.string().required("Branch Name is required"),
    branch:Yup.string().required("IFSC Code is required"),
  }),
  address: Yup.object().shape({
    address:Yup.string().required("address is required"),
    city:Yup.string().required("city is required"),
    state:Yup.string().required("State is required"),
    pincode:Yup.string().required("Pincode is required"),
  })

})