"use client";
import Loader from "@/components/Loader";
import { apiUrl } from "@/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CallByStatus from "./call-by-status";
import TopAgents from "./top-agents";

interface CallResponseType {
  [key: string]: string | undefined;
  // Call duration is number type :- to fix
}
interface CallLogsTableProps {
  callResponseData: CallResponseType[];
}
const CallLogsTable: React.FC<CallLogsTableProps> = ({ callResponseData }) => {
  const callLogs: CallResponseType[] = callResponseData;

  if (!callLogs) {
    <p>Fetching Data....</p>;
  }
  if (callLogs?.length === 0) {
    return <p>No call logs available.</p>;
  }

  const tableColumns = Object.keys(callLogs[0]);
  tableColumns.splice(0, 1); // remove organisation id
  tableColumns.splice(6, 1); // remove updated at timestamp

  return (
    <div className=" w-full rounded overflow-hidden shadow-lg mt-4 p-4">
      <div className="text-xl mb-2"> Call Details</div>
      <div className="w-full border-t-2 border-bg-gray mb-4" />
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right border-spacing-4 text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase ">
            <tr>
              {tableColumns.map((column, idx) => (
                <th scope="col" key={`column-${idx}`} className="px-6 py-3">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {callLogs.map((log: CallResponseType, index) => (
              <tr className="pt-4" key={index}>
                {tableColumns.map((column: string) => {
                  if (column === "recording_url") {
                    return (
                      <td className="text-center" key={column}>
                        <audio className="mt-4" controls>
                          <source src={log[column]} type="audio/mp3" />
                          {/* Include a track element if captions are required */}
                          <track kind="captions" srcLang="en" label="English" />
                        </audio>
                      </td>
                    );
                  } else {
                    return (
                      <td className="text-center" key={column}>
                        {log[column]}
                      </td>
                    );
                  }
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const CallInfo = () => {
  const currentLocationId = useState<string | null>(null);
  const [callResponseData, setCallResponseData] = useState([]);
  const [loader, setLoader] = useState(true);
  const [callDuration, setCallDuration] = useState([]);
  // fetch call info of location
  const fetchCallsInfo = async (locationId: string | null) => {
    try {
      setLoader(true);
      const { data } = await axios.get(
        `${apiUrl}/api/customer/alloha-call-details/${currentLocationId}`
      );
      console.log("data123", data?.data?.response);
      const callLogsData = data?.data?.response?.callLogs;
      const callDurationData = callLogsData.map((callLog: any) => {
        return {
          duration: callLog.call_duration,
          status: callLog.status,
          agent: callLog.agent_name,
        };
      });
      setLoader(false);
      setCallResponseData(callLogsData);
      setCallDuration(callDurationData);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const locationId = new URL(global.window.location.href)?.searchParams.get(
      "locationId"
    );
    console.log("rendering");
    fetchCallsInfo(locationId);
  }, []);

  return loader ? (
    <Loader />
  ) : (
    <div className="mt-6 px-6 py-4 bg-[#f9fafb]">
      <CallByStatus callDuration={callDuration} />
      <TopAgents callDuration={callDuration} />
      <CallLogsTable callResponseData={callResponseData} />
    </div>
  );
};
export default CallInfo;
