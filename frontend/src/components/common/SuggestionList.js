import React from 'react'

const SuggestionList = ({
    suggestions,
    highlight,
    dataKey,
    onSuggestionClick
}) => {
  return (
    <>
        {
            suggestions.map((suggestion,index)=>{
                return(
                    <li key={index} onClick={()=>onSuggestionClick(suggestion)} className='p-2 text-gray-700 cursor-pointer hover:bg-blue-400 hover:text-white'>
                        {suggestion[dataKey]}
                    </li>
                )
            })
        }
    </>
  )
}

export default SuggestionList