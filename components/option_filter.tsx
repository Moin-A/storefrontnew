import React from 'react'
import {SelectedOptions} from "../app/product/[id]/page"

interface OptionValue {
    id: number;
    name: string;
    presentation: string;
    option_type_id: number;
}

interface OptionType {
    name: string;
    presentation: string;
    option_values: OptionValue[];
}

interface Props {
    option_types: OptionType[];
    handleSelect: (optionTypeId: number, optionValueId: number, name: string) => void;
    selectedOptions: SelectedOptions;
}

function Option_filter({option_types, handleSelect, selectedOptions}: Props) {
    
    const renderFilter = (index: number, option_type: OptionType) => {
        switch (option_type?.name) {
          case "clothing-color":
            const selectedClothingColorOption = selectedOptions && selectedOptions["clothing-color"]
            return color_filter(option_type, index, handleSelect, selectedClothingColorOption)
          case "clothing-size":  
            const selectedClothingSizeOption = selectedOptions && selectedOptions["clothing-size"]
            return size_filter(option_type, index, handleSelect, selectedClothingSizeOption)
          default:
            return null
        }
      }

    return (
        <div>
        {option_types?.map((item,index)=> renderFilter(index,item))}
        </div>
 )
}

export default Option_filter



const color_filter = (
    option: OptionType, 
    index: number, 
    handleSelect: (optionTypeId: number, optionValueId: number, name: string) => void, 
    selectedOptions: {optionTypeId: number; optionValueId: number} | undefined
) => (
    <div key={index}>
        
        <h3 className="font-semibold text-lg text-gray-900 mb-2 mt-4">{`Available ${option.presentation}`}</h3>
        <div className="flex gap-4">
            {option?.option_values.map((item: OptionValue) => (
                <div key={item.presentation} className="text-center">
                    <button
                        className={`w-12 h-12 rounded-full border-3 cursor-pointer  hover:border-blue-500 transition-colors shadow-md hover:shadow-lg ${selectedOptions?.optionValueId == item.id && "border-blue-500"}` }
                        style={{ backgroundColor: item?.presentation }}
                        title={item?.name}
                        onClick = {() => handleSelect(item.option_type_id, item.id, option.name)}
                    />
                    <span className="text-xs text-gray-600 mt-2 block">{item.name}</span>
                </div>
            ))}
        </div>
    </div>
)



const size_filter = (
    option: OptionType, 
    index: number, 
    handleSelect: (optionTypeId: number, optionValueId: number, name: string) => void, 
    selectedOptions: {optionTypeId: number; optionValueId: number} | undefined
) => (
    <div key={index}>   
      <h3 className="font-semibold text-lg text-gray-900 mb-2 mt-4">
        {`Available ${option.presentation}`}
      </h3>
      <div className="flex gap-2">
        {option.option_values.map((item: OptionValue) => (
          <button
            key={item.presentation}
            className={`px-4 py-2 border-2 cursor-pointer rounded-lg text-sm font-medium hover:border-blue-500 hover:text-blue-600 transition-colors shadow-sm ${selectedOptions?.optionValueId == item.id && "border-blue-500"}`}
            title={item.name}
            onClick = {() => handleSelect(item.option_type_id, item.id, option.name)}
          >
            {item.presentation}
          </button>
        ))}
      </div>
    </div>
  )
  