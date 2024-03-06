import { AlohaaAccType } from "@/app/highlevel/alohaa/call-info/types";
import React, { useEffect, useState } from "react";

interface AutoCompleteDDProps {
  dataList: AlohaaAccType[];
  setCurrentOption: React.Dispatch<React.SetStateAction<AlohaaAccType | null>>;
  inputValue: string;
  setInputValue: React.Dispatch<React.SetStateAction<string>>;
}

const AutoCompleteDD: React.FC<AutoCompleteDDProps> = ({
  dataList: data,
  setCurrentOption,
  inputValue,
  setInputValue,
}) => {
  const [filteredData, setFilteredData] = useState<AlohaaAccType[]>([]);

  const handleInputClick:
    | React.MouseEventHandler<HTMLInputElement>
    | undefined = (e) => {
    if (inputValue != "") {
      filterData(inputValue);
      return;
    }
    setFilteredData(data);
  };

  const handleKeyDown:
    | React.KeyboardEventHandler<HTMLInputElement>
    | undefined = (e) => {
    if (e.key === "Escape") setFilteredData([]);
  };

  const handleChange: React.ChangeEventHandler<HTMLInputElement> | undefined = (
    e
  ) => {
    const currentValue = e.target.value;
    setInputValue(currentValue);
    if (currentValue.trim().length == 0) {
      setFilteredData([]);
      return;
    }
    filterData(currentValue);
  };

  const filterData = (inputVal: string) => {
    const filteredData = data.filter((el: AlohaaAccType) =>
      el.name.toLowerCase().includes(inputVal.toLowerCase())
    );
    setFilteredData(filteredData);
  };

  const handleOptionClick:
    | React.MouseEventHandler<HTMLSpanElement>
    | undefined = (e) => {
    const optionValue = e.currentTarget.getAttribute("data-value") || "";
    const optionId = e.currentTarget.getAttribute("data-id") || "";
    const optionKey = e.currentTarget.getAttribute("data-key") || "";

    setCurrentOption({ id: optionId, name: optionValue, key: optionKey });
    setInputValue(optionValue);
    setFilteredData([]);
  };
  const closeList = (e: Event) => {
    if ((e.target as HTMLDivElement).id !== "autocomplete") setFilteredData([]);
  };
  useEffect(() => {
    document.addEventListener("click", closeList);
    return () => {
      document.removeEventListener("click", closeList);
    };
  }, []);

  return (
    <div className="relative w-full">
      <input
        type="text"
        onChange={handleChange}
        onClick={handleInputClick}
        onKeyDown={handleKeyDown}
        value={inputValue}
        placeholder="Select Sub Account"
        className="border border-gray-300 text-gray-900 text-sm  focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        id="autocomplete"
      />
      <div
        className={`bg-white h-fit absolute w-full ${
          filteredData.length > 0
            ? "border border-t-0  max-h-[200px] overflow-y-scroll "
            : ""
        }`}
      >
        {filteredData.map((option, idx) => (
          <span
            key={`${option?.name}-${idx}`}
            data-value={option?.name}
            data-key={option?.key}
            data-id={option?.id}
            onClick={handleOptionClick}
            className="block px-3 py-1 cursor-pointer hover:bg-gray-100"
          >
            {option?.name}
          </span>
        ))}
      </div>
    </div>
  );
};

export default AutoCompleteDD;
