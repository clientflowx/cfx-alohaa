import { parseTimeStringInS } from "@/utils";
import { CallResponseType } from "./types";
import { format } from "date-fns";
import { tabelColumnsIncoming, tableColumnsOutgoing } from "@/utils/constants";

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
  const callLogs: CallResponseType[] =
    type === "INCOMING"
      ? callResponseData.sort(
          (a, b) =>
            new Date(b.received_at).getTime() -
            new Date(a.received_at).getTime()
        )
      : callResponseData.sort((a, b) => {
          return (
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        });

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

  return (
    <div className=" w-full rounded overflow-hidden shadow-lg mt-4 p-4">
      <div className="text-xl mb-2"> Call Details</div>
      <div className="w-full border-t-2 border-bg-gray mb-4" />
      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-left rtl:text-right border-spacing-4 text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase ">
            <tr>
              {type === "INCOMING"
                ? tabelColumnsIncoming.map((column, idx) => (
                    <th
                      scope="col"
                      key={`column-${idx}`}
                      className="text-center px-6 py-3"
                    >
                      {column?.text}
                    </th>
                  ))
                : tableColumnsOutgoing.map((column, idx) => (
                    <th
                      scope="col"
                      key={`column-${idx}`}
                      className="text-center px-6 py-3"
                    >
                      {column?.text}
                    </th>
                  ))}
            </tr>
          </thead>
          <tbody>
            {filteredCallLogs.map((log: CallResponseType, index) => (
              <tr className="pt-4" key={`log-${index}`}>
                {type === "INCOMING"
                  ? tabelColumnsIncoming.map(
                      (column: { key: string; text: string }, index) => {
                        if (
                          column?.key === "recording_url" ||
                          column?.key === "call_recording_url"
                        ) {
                          return (
                            <td
                              className="text-center"
                              key={`log-${column}-${index}`}
                            >
                              <audio className="mt-4" controls>
                                <source
                                  src={log[column?.key]}
                                  type="audio/mp3"
                                />
                              </audio>
                            </td>
                          );
                        } else if (
                          (column?.key === "ended_at" ||
                            column?.key === "received_at" ||
                            column?.key === "updated_at") &&
                          log[column?.key]?.length > 0
                        ) {
                          return (
                            <td className="text-center" key={column?.key}>
                              {format(
                                new Date(log[column?.key]),
                                "dd MMM yy pp"
                              )}
                            </td>
                          );
                        } else {
                          return (
                            <td className="text-center" key={column?.key}>
                              {log[column?.key]}
                            </td>
                          );
                        }
                      }
                    )
                  : tableColumnsOutgoing.map(
                      (column: { key: string; text: string }, index) => {
                        if (
                          column?.key === "recording_url" ||
                          column?.key === "call_recording_url"
                        ) {
                          return (
                            <td
                              className="text-center"
                              key={`log-${column}-${index}`}
                            >
                              <audio className="mt-4" controls>
                                <source
                                  src={log[column?.key]}
                                  type="audio/mp3"
                                />
                              </audio>
                            </td>
                          );
                        } else if (
                          (column?.key === "ended_at" ||
                            column?.key === "received_at" ||
                            column?.key === "updatedAt") &&
                          log[column?.key]?.length > 0
                        ) {
                          return (
                            <td className="text-center" key={column?.key}>
                              {format(
                                new Date(log[column?.key]),
                                "dd MMM yy pp"
                              )}
                            </td>
                          );
                        } else {
                          return (
                            <td className="text-center" key={column?.key}>
                              {column?.key === "status"
                                ? log[column?.key] === "not_answered"
                                  ? "Not Answered"
                                  : "Answered"
                                : log[column?.key]}
                            </td>
                          );
                        }
                      }
                    )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CallLogsTable;
