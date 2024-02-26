import CallByStatus from "./call-by-status";
import CallLogsTable from "./call-logs";
import TopAgents from "./top-agents";
import { CallDurationType, CallResponseType } from "./types";

const Outgoing: React.FC<{
  callDuration: CallDurationType[];
  callResponseData: CallResponseType[];
}> = ({ callDuration, callResponseData }) => {
  return (
    <div className="mt-6 px-6 py-4 bg-[#f9fafb]">
      <CallByStatus callDuration={callDuration} />
      <TopAgents callDuration={callDuration} />
      <CallLogsTable callResponseData={callResponseData} />
    </div>
  );
};
export default Outgoing;
