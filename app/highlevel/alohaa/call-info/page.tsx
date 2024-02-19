"use client";
import Loader from "@/components/Loader";
import { apiUrl } from "@/config";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface CallResponseType {
  caller_number: string;
  receiver_number: string;
  did_number: string;
  recording_url: string;
  call_duration: number;
  created_at: string;
  agent_name: string;
}
interface CallLogsTableProps {
  callResponseData: CallResponseType[];
}
const CallLogsTable: React.FC<CallLogsTableProps> = ({ callResponseData }) => {
  const callLogs = callResponseData;

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
          {callLogs.map((log, index) => (
            <tr className="pt-4" key={index}>
              {tableColumns.map((column) => {
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
  );
};

const CallInfo = () => {
  const currentLocationId = useState<string | null>(null);
  const [callResponseData, setCallResponseData] = useState([]);
  const [loader, setLoader] = useState(false);
  // fetch call info of location
  const fetchCallsInfo = async (locationId: string | null) => {
    try {
      setLoader(true);
      const { data } = await axios.get(
        `${apiUrl}/api/customer/alloha-call-details/${currentLocationId}`
      );
      console.log("data123", data?.data?.response);
      setLoader(false);
      setCallResponseData(data?.data?.response?.callLogs);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const locationId = new URL(global.window.location.href)?.searchParams.get(
      "locationId"
    );
    fetchCallsInfo(locationId);
  }, []);

  return loader ? (
    <Loader />
  ) : (
    <div className="m-5 w-full rounded overflow-hidden shadow-lg">
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2"> Call Details</div>
        <CallLogsTable callResponseData={callResponseData} />
      </div>
    </div>
    // <Card
    //   sx={{ minWidth: 330 }}
    //   style={{ marginLeft: "40px", marginTop: "40px" }}
    // >
    //   <Typography variant="h3" component="h2" style={{ margin: "10px" }}>
    //     Call Details
    //   </Typography>

    //   <div style={{ margin: "10px" }}>
    //     <CallLogsTable callResponseData={callResponseData} />
    //   </div>
    //   <CardActions style={{ display: "none" }}>
    //     <Button size="small" color="primary">
    //       Fetch More
    //     </Button>
    //   </CardActions>
    // </Card>
  );
};
export default CallInfo;
