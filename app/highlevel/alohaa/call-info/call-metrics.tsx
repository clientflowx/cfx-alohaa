import Loader from "@/components/Loader";
import CallByStatus from "./call-by-status";
import CallLogsTable from "./call-logs";
import TopAgents from "./top-agents";
import { CallDurationType, CallResponseType } from "./types";
import { ChangeEventHandler, useState } from "react";

const CallMetrics: React.FC<{
  callDuration: CallDurationType[];
  callResponseData: CallResponseType[];
  type: string | null;
  loading: boolean;
}> = ({ callDuration, callResponseData, type, loading }) => {
  const agentList = new Set(callDuration?.map((data) => data?.agent));
  const [nameFilter, setNameFilter] = useState<string>("all"); //set default filter to all names

  const handleFilterUpdate: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setNameFilter(e.target.value);
  };

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="mt-6 px-6 py-4 bg-[#f9fafb]">
        <select
          onChange={handleFilterUpdate}
          id="countries"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 mb-4"
        >
          <option value="all" selected>
            Choose a name
          </option>
          {Array.from(agentList)?.map((data) => (
            <option value={data}>{data}</option>
          ))}
        </select>
        {callResponseData.length === 0 ? (
          <h2>No data available</h2>
        ) : (
          <>
            <CallByStatus
              nameFilter={nameFilter}
              type={type}
              callDuration={callDuration}
            />
            <TopAgents nameFilter={nameFilter} callDuration={callDuration} />
            <CallLogsTable
              nameFilter={nameFilter}
              callResponseData={callResponseData}
            />
          </>
        )}
      </div>
    </>
  );
};
export default CallMetrics;
