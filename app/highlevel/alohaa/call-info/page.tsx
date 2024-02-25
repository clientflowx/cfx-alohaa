"use client";
import Loader from "@/components/Loader";
import { apiUrl } from "@/config";
import axios from "axios";
import React, { useEffect, useState } from "react";
import CallMetrics from "./call-metrics";
import { CallDurationType, CallResponseType } from "./types";

type TabKey = "INCOMING" | "OUTGOING";
interface Tabs {
  [key: string]: Tab;
}
interface Tab {
  key: TabKey;
  text: string;
}

const tabs: Tabs = {
  INCOMING: {
    key: "INCOMING",
    text: "Incoming",
  },
  OUTGOING: {
    key: "OUTGOING",
    text: "Outgoing",
  },
};

const CallInfo = () => {
  const currentLocationId = useState<string | null>(null);
  const [callResponseData, setCallResponseData] = useState<CallResponseType[]>(
    []
  );
  const [loader, setLoader] = useState(true);
  const [callDuration, setCallDuration] = useState<CallDurationType[]>([]);
  const [activeTab, setActiveTab] = useState<string | null>("INCOMING");
  // fetch call info of location
  const fetchCallsInfo = async (locationId: string | null) => {
    try {
      setLoader(true);
      const { data } = await axios.get(
        `${apiUrl}/api/customer/alloha-call-details/${locationId}`
      );

      const callLogsData = data?.data?.response?.callLogs;

      const callDurationData = callLogsData.map((callLog: CallResponseType) => {
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

  const fetchIncomingCallsInfo = async (locationId: string | null) => {
    try {
      setLoader(true);
      const { data } = await axios.get(
        `${apiUrl}/api/crmalloha/fetchlocationinfo/${locationId}`
      );

      const callLogsData = data?.data?.data?.callDetails || [];

      const callDurationData = callLogsData?.map(
        (callLog: CallResponseType) => {
          return {
            duration: callLog.call_duration,
            status: callLog.call_status,
            agent: callLog.agent_name,
          };
        }
      );

      setLoader(false);
      setCallResponseData(callLogsData);
      setCallDuration(callDurationData);
    } catch (err) {
      console.log(err);
    }
  };

  const handleTabSwitch = (e: React.MouseEvent<HTMLSpanElement>) => {
    const currentTab = (e.target as HTMLSpanElement).getAttribute("data-value");
    setActiveTab(currentTab);
  };

  useEffect(() => {
    const locationId = new URL(global.window.location.href)?.searchParams.get(
      "locationId"
    );

    activeTab !== "INCOMING"
      ? fetchCallsInfo(locationId)
      : fetchIncomingCallsInfo(locationId);
  }, [activeTab]);

  return (
    <>
      <div className="mt-6 px-6 py-4 flex text-sm font-medium text-center text-gray-500 ">
        {Object.keys(tabs)?.map((tab) => (
          <span
            onClick={handleTabSwitch}
            className={`inline-block p-4 border-b-2 rounded-t-lg ${
              tab === activeTab ? "border-[#006CEB]" : "border-transparent"
            }`}
            data-value={tabs[tab].key}
          >
            {tabs[tab].text}
          </span>
        ))}
      </div>
      <CallMetrics
        callDuration={callDuration}
        type={activeTab}
        loading={loader}
        callResponseData={callResponseData}
      />
    </>
  );
};
export default CallInfo;
