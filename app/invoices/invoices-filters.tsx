"use client";

import Svg from "@/components/Svg";
import CalenderIcon from "@/svg/calender";
import SearchIcon from "@/svg/search";
import { ChangeEventHandler, useState } from "react";
import { DateRangePicker, RangeKeyDict } from "react-date-range";

const TransactionFilters: React.FC<{
  selectionRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    key: string;
  };
  handleSelect: (date: RangeKeyDict) => void;
  handleStatusFilterUpdate: ChangeEventHandler<HTMLSelectElement>;
  statusArr: string[];
  handleNameFilterUpdate: ChangeEventHandler<HTMLInputElement>;
  handleSourceTypeUpdate: ChangeEventHandler<HTMLSelectElement>;
  handlePaymentModeUpdate: ChangeEventHandler<HTMLSelectElement>;
}> = ({
  selectionRange,
  handleSelect,
  handleStatusFilterUpdate,
  statusArr,
  handleNameFilterUpdate,
  handlePaymentModeUpdate,
  handleSourceTypeUpdate,
}) => {
  const [showDateSelector, setShowDateSelector] = useState<boolean>(false);

  const handleDateSelector = () => {
    setShowDateSelector(!showDateSelector);
  };

  return (
    <div className="flex items-center px-3 py-4 justify-between">
      <div className="flex items-center">
        <div className="flex items-center bg-white border-2 rounded-md p-2 text-sm mr-2 w-[300px]">
          <Svg
            icon={SearchIcon}
            className="mr-1"
            width={15}
            height={15}
            viewBox="0 0 50 50"
          />
          <input
            type="text"
            className="border-none focus:outline-none w-full"
            placeholder="Search"
            onChange={handleNameFilterUpdate}
          />
        </div>

        <div className="relative mr-4">
          <span className="cursor-pointer" onClick={handleDateSelector}>
            <Svg
              icon={CalenderIcon}
              width={30}
              height={30}
              viewBox="0 0 64 64"
            />
          </span>
          {showDateSelector && (
            <DateRangePicker
              className="absolute"
              ranges={[selectionRange]}
              onChange={handleSelect}
            />
          )}
        </div>
      </div>

      <div className="flex items-center">
        <select
          onChange={handleStatusFilterUpdate}
          id="countries"
          className="mr-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
        >
          <option value="all">Select status</option>
          {statusArr?.map((data, idx) => (
            <option key={`${data}-${idx}`} value={data}>
              {data}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default TransactionFilters;
