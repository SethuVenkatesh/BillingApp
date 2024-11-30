import React from 'react'
import Icons from '../common/Icons'

const PaymentAccordianItem = ({index,data}) => {

  return (
    data &&
    <div className='grid grid-cols-4 border-b-2 p-2'>
        <div className='col-span-3'>
            <p className='font-semibold text-sky-500 text-md '>{data.paymentMode}</p>
            <p className='text-sm font-semibold text-gray-500'>{data.paymentDate}</p>
        </div>
        <div className='flex justify-start items-center col-span-1'>
            <p className='text-green-500'>
            {
                Icons['arrow-outward-icons']
            }
            </p>
            <p className='font-semibold text-[#212934] '>{data.amountPaid.toFixed(2)}</p>

        </div>
    </div>
  )
}

export default PaymentAccordianItem