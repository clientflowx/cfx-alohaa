import { CallResponseType } from "./types";

const CallLogsTable: React.FC<{
  callResponseData: CallResponseType[];
  nameFilter: string;
}> = ({ callResponseData, nameFilter }) => {
  const callLogs: CallResponseType[] = callResponseData;

  const filteredCallLogs =
    nameFilter !== "all"
      ? callResponseData.filter((log) => log.agent_name === nameFilter)
      : callResponseData;

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
              <tr className="pt-4" key={index}>
                {tableColumns.map((column: string) => {
                  if (
                    column === "recording_url" ||
                    column === "call_recording_url"
                  ) {
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

export default CallLogsTable;
