import { parseTimeStringInS } from "@/utils";
import { CallResponseType } from "./types";
import { format } from "date-fns";

const CallLogsTable: React.FC<{
  callResponseData: CallResponseType[];
  type: string | null;
  nameFilter: string;
  statusFilter: string;
  minDurationFilter: number;
  startDate: Date | undefined;
  endDate: Date | undefined;
}> = ({
  callResponseData,
  nameFilter,
  statusFilter,
  type,
  minDurationFilter,
  startDate,
  endDate,
}) => {
  const callLogs: CallResponseType[] = callResponseData;

  const filteredCallLogs = callLogs.filter((call) => {
    let parsedDuration =
      type === "INCOMING"
        ? parseTimeStringInS(String(call.call_duration))
        : call.call_duration!;

    return (
      (nameFilter === "all" || call.agent_name === nameFilter) &&
      (statusFilter === "all" || call.status?.toLowerCase() === statusFilter) &&
      (minDurationFilter === 0 || +parsedDuration >= minDurationFilter) &&
      (startDate === undefined ||
        endDate === undefined ||
        (format(new Date(call.received_at || call.created_at), "yyyy-MM-dd") >=
          format(startDate!, "yyyy-MM-dd") &&
          format(new Date(call.received_at || call.created_at), "yyyy-MM-dd") <=
            format(endDate!, "yyyy-MM-dd")))
    );
  });

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
            {filteredCallLogs.map((log: CallResponseType, index) => (
              <tr className="pt-4" key={`log-${index}`}>
                {tableColumns.map((column: string, index) => {
                  if (
                    column === "recording_url" ||
                    column === "call_recording_url"
                  ) {
                    return (
                      <td
                        className="text-center"
                        key={`log-${column}-${index}`}
                      >
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

export default CallLogsTable;
