import Loader from "@/components/Loader";
import CallByStatus from "./call-by-status";
import CallLogsTable from "./call-logs";
import TopAgents from "./top-agents";
import { CallDurationType, CallResponseType } from "./types";

const CallMetrics: React.FC<{
  callDuration: CallDurationType[];
  callResponseData: CallResponseType[];
  type: string | null;
  loading: boolean;
}> = ({ callDuration, callResponseData, type, loading }) => {
  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="mt-6 px-6 py-4 bg-[#f9fafb]">
        {callResponseData.length === 0 ? (
          <h2>No data available</h2>
        ) : (
          <>
            <CallByStatus type={type} callDuration={callDuration} />
            <TopAgents callDuration={callDuration} />
            <CallLogsTable callResponseData={callResponseData} />
          </>
        )}
      </div>
    </>
  );
};
export default CallMetrics;
