import Loader from "@/components/Loader";
import CallByStatus from "./call-by-status";
import CallLogsTable from "./call-logs";
import TopAgents from "./top-agents";
import { CallDurationType, CallResponseType } from "./types";
import { ChangeEventHandler } from "react";
import { RangeKeyDict } from "react-date-range";
import Filters from "./filters";

const CallMetrics: React.FC<{
  callDuration: CallDurationType[];
  callResponseData: CallResponseType[];
  type: string | null;
  loading: boolean;
  nameFilter: string;
  statusFilter: string;
  minDurationFilter: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
  setNameFilter: React.Dispatch<React.SetStateAction<string>>;
  setStatusFilter: React.Dispatch<React.SetStateAction<string>>;
  setMinDurationFilter: React.Dispatch<React.SetStateAction<number>>;
  setStartDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
  setEndDate: React.Dispatch<React.SetStateAction<Date | undefined>>;
}> = ({
  callDuration,
  callResponseData,
  type,
  loading,
  nameFilter,
  statusFilter,
  minDurationFilter,
  startDate,
  endDate,
  setNameFilter,
  setStatusFilter,
  setMinDurationFilter,
  setStartDate,
  setEndDate,
}) => {
  const agentList = new Set(callDuration?.map((data) => data?.agent));

  const selectionRange = {
    startDate,
    endDate,
    key: "selection",
  };

  const statusArr = [
    { text: "Answered", key: "answered" },
    { text: "Not answered", key: "not_answered" },
  ];

  const handleSelect = (date: RangeKeyDict) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
  };

  const handleNameFilterUpdate: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setNameFilter(e.target.value);
  };

  const handleStatusFilterUpdate: ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    setStatusFilter(e.target.value.toLowerCase());
  };

  const handleMinDurationFilterUpdate: ChangeEventHandler<HTMLInputElement> = (
    e
  ) => {
    setMinDurationFilter(+e.target.value);
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="mt-6 px-6 py-4 bg-[#f9fafb]">
        <Filters
          handleNameFilterUpdate={handleNameFilterUpdate}
          agentList={agentList}
          handleStatusFilterUpdate={handleStatusFilterUpdate}
          statusArr={statusArr}
          handleMinDurationFilterUpdate={handleMinDurationFilterUpdate}
          selectionRange={selectionRange}
          handleSelect={handleSelect}
        />
        {callResponseData.length === 0 ? (
          <h2>No data available</h2>
        ) : (
          <>
            <CallByStatus
              nameFilter={nameFilter}
              statusFilter={statusFilter}
              minDurationFilter={minDurationFilter}
              type={type}
              callDuration={callDuration}
            />
            <TopAgents
              type={type}
              nameFilter={nameFilter}
              minDurationFilter={minDurationFilter}
              callDuration={callDuration}
            />
            <CallLogsTable
              nameFilter={nameFilter}
              statusFilter={statusFilter}
              minDurationFilter={minDurationFilter}
              startDate={startDate}
              endDate={endDate}
              type={type}
              callResponseData={callResponseData}
            />
          </>
        )}
      </div>
    </>
  );
};
export default CallMetrics;
