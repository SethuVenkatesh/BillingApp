import Icons from "./components/common/Icons"

export const navBarTabs = ["home","company","employee","billing","report"]

export const stateNames =[
    {key:"AN",value:"Andaman and Nicobar Islands"},
    {key:"AR",value:"Arunachal Pradesh"},
    {key:"AS",value:"Assam"},
    {key:"BR",value:"Bihar"},
    {key:"CH",value:"Chandigarh"},
    {key:"CT",value:"Chhattisgarh"},
    {key:"DN",value:"Dadra and Nagar Haveli"},
    {key:"DD",value:"Daman and Diu"},
    {key:"DL",value:"Delhi"},
    {key:"GA",value:"Goa"},
    {key:"GJ",value:"Gujarat"},
    {key:"HR",value:"Haryana"},
    {key:"HP",value:"Himachal Pradesh"},
    {key:"JK",value:"Jammu and Kashmir"},
    {key:"JH",value:"Jharkhand"},
    {key:"KA",value:"Karnataka"},
    {key:"KL",value:"Kerala"},
    {key:"LA",value:"Ladakh"},
    {key:"LD",value:"Lakshadweep"},
    {key:"MP",value:"Madhya Pradesh"},
    {key:"MH",value:"Maharashtra"},
    {key:"MN",value:"Manipur"},
    {key:"ML",value:"Meghalaya"},
    {key:"MZ",value:"Mizoram"},
    {key:"NL",value:"Nagaland"},
    {key:"OR",value:"Odisha"},
    {key:"PY",value:"Puducherry"},
    {key:"PB",value:"Punjab"},
    {key:"RJ",value:"Rajasthan"},
    {key:"SK",value:"Sikkim"},
    {key:"TN",value:"Tamil Nadu"},
    {key:"TG",value:"Telangana"},
    {key:"TR",value:"Tripura"},
    {key:"UP",value:"Uttar Pradesh"},
    {key:"UT",value:"Uttarakhand"},
    {key:"WB",value:"West Bengal"}
]

export const genderNames = [
    {key:"male",value:"male"},
    {key:"female",value:"female"},
    {key:"transgender",value:"transgender"},
]

export const companyDetailsParams=[
    {inputType:"text",labelName:"company name",inputName:'company_name'},
    {inputType:"text",labelName:"address",inputName:'address'},
    {inputType:"text",labelName:"city",inputName:'city'},
    {inputType:"text",labelName:"state",inputName:'state'},
    {inputType:"number",labelName:"pincode",inputName:'pincode'},
    {inputType:"number",labelName:"mobile number",inputName:'mobile_number'},
    {inputType:"number",labelName:"alternate mobile number",inputName:'alt_mobile_number'},
    {inputType:"text",labelName:"GST number",inputName:'GST_number'},
]

export const employeeDetailsParams=[
    {inputType:"text",labelName:"employee name",inputName:'employee_name'},
    {inputType:"text",labelName:"address",inputName:'address'},
    {inputType:"text",labelName:"city",inputName:'city'},
    {inputType:"text",labelName:"state",inputName:'state'},
    {inputType:"number",labelName:"pincode",inputName:'pincode'},
    {inputType:"number",labelName:"mobile number",inputName:'mobile_number'},
    {inputType:"date",labelName:"date of birth",inputName:'date_of_birth'},
    {inputType:"number",labelName:"alternate mobile number",inputName:'alt_mobile_number'},
]
 

export const bankDetailsParams=[
    {inputType:"text",labelName:"bank name",inputName:'bank_name'},
    {inputType:"text",labelName:"bank branch",inputName:'bank_branch'},
    {inputType:"text",labelName:"account number",inputName:'account_number'},
    {inputType:"text",labelName:"IFSC code",inputName:'IFSC_code'}
]


export const sideBarTabs = [
    {icon:Icons['home-icon'],tabName:"home",isTabExpand:false,subTabs:[]},
    {icon:Icons['party-icon'],tabName:"parties",isTabExpand:false,subTabs:[]},
    {icon:Icons['employee-icon'],tabName:"employees",isTabExpand:false,subTabs:[]},
    {icon:Icons['items-icon'],tabName:"items",isTabExpand:false,subTabs:[]},
    {icon:Icons['sales-icon'],tabName:"sales",isTabExpand:true,subTabs:[
        {tabName:'all invoice',routeName:'all_invoice'},
        {tabName:'payment in',routeName:'payment_in'},
        {tabName:'delivery challan',routeName:'delivery_challan'}
    ]
    },
    {icon:Icons['purchase-icon'],tabName:"purchase",isTabExpand:true,subTabs:[
        {tabName:'purchase bill',routeName:'purchase_bill'},
        {tabName:'purchase out',routeName:'payment_out'}
         ]},
    {icon:Icons['report-icon'],tabName:"reports",isTabExpand:false,subTabs:[]}
]

export const sideBarAccountTabs = [
    {icon:Icons['settings-icon'],tabName:"Settings"},
    {icon:Icons['logout-icon'],tabName:"Logout"}
]


export const itemsSortData = [
    {title:"Item Name (Asc)",sortType:"asc",key:"itemName"},
    {title:"Item Name (Desc)",sortType:"desc",key:"itemName"},
    {title:"Item Price (Asc)",sortType:"asc",key:"price"},
    {title:"Item Price (Desc)",sortType:"desc",key:"price"},
    {title:"Created Time (Asc)",sortType:"asc",key:"createdAt"},
    {title:"Created Time (Desc)",sortType:"desc",key:"createdAt"},
]

export const itemsFilterData = [
    {labelName:"Item Name",inputType:"text",inputName:"itemName"},
    {labelName:"Item Price",inputType:"range",minInputName:"minPrice",maxInputName:"maxPrice",minValue:0,maxValue:1000000},
    {labelName:"Party Name",inputType:"text",inputName:"partyName"},

]