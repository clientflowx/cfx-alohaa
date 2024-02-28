"use client";

import { CalenderIcon } from "@/svg/calender";
import { ChangeEventHandler, useState } from "react";
import { DateRangePicker, RangeKeyDict } from "react-date-range";

const Filters: React.FC<{
  handleSelect: (date: RangeKeyDict) => void;
  handleNameFilterUpdate: ChangeEventHandler<HTMLSelectElement>;
  handleStatusFilterUpdate: ChangeEventHandler<HTMLSelectElement>;
  handleMinDurationFilterUpdate: ChangeEventHandler<HTMLInputElement>;
  statusArr: {
    text: string;
    key: string;
  }[];
  selectionRange: {
    startDate: Date | undefined;
    endDate: Date | undefined;
    key: string;
  };
  agentList: Set<string>;
}> = ({
  handleMinDurationFilterUpdate,
  handleNameFilterUpdate,
  handleSelect,
  handleStatusFilterUpdate,
  statusArr,
  selectionRange,
  agentList,
}) => {
  const [showDateSelector, setShowDateSelector] = useState<boolean>(false);

  const handleDateSelector = () => {
    setShowDateSelector(!showDateSelector);
  };
  return (
    <div className="flex items-center mb-4">
      <select
        onChange={handleNameFilterUpdate}
        id="countries"
        className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
      >
        <option value="all" selected>
          Select name
        </option>
        {Array.from(agentList)?.map((data, idx) => (
          <option key={`${data}-${idx}`} value={data}>
            {data}
          </option>
        ))}
      </select>

      <select
        onChange={handleStatusFilterUpdate}
        id="countries"
        className="mr-2 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
      >
        <option value="all" selected>
          Select call status
        </option>
        {statusArr?.map((data, idx) => (
          <option key={`${data.key}-${idx}`} value={data.key}>
            {data.text}
          </option>
        ))}
      </select>

      <input
        type="number"
        className="bg-white border-2 rounded-md p-2 text-sm mr-2 w-[220px]"
        placeholder="Minimum call duration(in s)"
        onChange={handleMinDurationFilterUpdate}
      />
      <div className="relative">
        <span className="cursor-pointer" onClick={handleDateSelector}>
          <CalenderIcon />
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
  );
};

export default Filters;
