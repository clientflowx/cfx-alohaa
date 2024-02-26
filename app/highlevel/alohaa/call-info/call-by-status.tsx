"use client";

import { convertStoMs } from "@/utils";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import { CallDurationType } from "./types";

ChartJS.register(ArcElement, Tooltip, Legend);
const CallByStatus: React.FC<{
  callDuration: CallDurationType[];
  type: string | null;
}> = ({ callDuration, type }) => {
  const callLabels = ["Answered", "Unanswered"];
  const callBg = ["rgba(255, 99, 132)", "rgba(54, 162, 235)"];
  const answeredCalls = callDuration?.filter(
    (call: CallDurationType) => call.status.toLowerCase() === "answered"
  );
  console.log(answeredCalls);
  const numAnsweredCalls = answeredCalls.length;
  const numUnAnsweredCalls = callDuration.length - answeredCalls.length;
  let totalCallDuration = 0;

  answeredCalls?.forEach((call: CallDurationType) => {
    if (type === "INCOMING" && typeof call.duration === "string") {
      const callDurationArr = call.duration.split(":");
      let seconds = callDurationArr[2];
      let minutes = callDurationArr[1];
      let hours = callDurationArr[0];
      totalCallDuration += +hours * 3600 + +minutes * 60 + +seconds;
      console.log(totalCallDuration);
    } else totalCallDuration += +call.duration;

    return totalCallDuration;
  });

  const avgCallDuration = convertStoMs(
    totalCallDuration / answeredCalls.length
  );
  let totalCallDurationObj = convertStoMs(totalCallDuration);
  const callData = [numAnsweredCalls, numUnAnsweredCalls];
  const data = {
    labels: callLabels,
    datasets: [
      {
        label: " # of Votes",
        data: callData,
        backgroundColor: callBg,
        borderWidth: 5,
        hoverOffset: 10,
      },
    ],
  };

  const options = {
    responsive: true,
    borderRadius: 2,
    hoverBorderWidth: 0,
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  return (
    <div className="w-full p-4 flex flex-col rounded overflow-hidden shadow-lg">
      <div className="text-xl mb-2"> Call by Status</div>
      <div className="w-full border-t-2 border-bg-gray" />
      <div className="px-6 py-4 flex flex-col justify-center items-center">
        <div className="w-full text-center">
          <div className="lg:w-1/5 md:w-2/5 sm:w-[250px] mx-auto">
            <Doughnut data={data} options={options} />
          </div>
          <div className="lg:w-[540px] md:w-[518px] sm:text-xs md:text-sm lg:text-lg mx-auto mt-2 bg-gray-100 p-4 rounded-md">
            Avg. Call Duration: {avgCallDuration.minutes}m:&nbsp;
            {avgCallDuration.seconds}s | Total Call Duration :
            {totalCallDurationObj.minutes}m:&nbsp;
            {totalCallDurationObj.seconds}s
          </div>
        </div>
      </div>
    </div>
  );
};

export default CallByStatus;
