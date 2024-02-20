"use client";

import { convertStoMs } from "@/utils";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { useEffect } from "react";
import { Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);
const TopAgents: React.FC<{ callDuration: any }> = ({ callDuration }) => {
  const agentMap: any = {};

  callDuration.forEach((call: any) => {
    let agentName = call?.agent;
    if (agentMap[agentName]) {
      let currAgentObj = agentMap[agentName];
      agentMap[agentName].totalCall = currAgentObj.totalCall + 1;
      agentMap[agentName].duration = currAgentObj.duration + call.duration;
    } else {
      const agentObj = {
        totalCall: 1,
        duration: call.duration,
      };
      agentMap[agentName] = agentObj;
    }
  });

  const agentEntries = Object.entries(agentMap);
  agentEntries.sort((a: any, b: any) => {
    return b[1].totalCall - a[1].totalCall;
  });

  const sortedAgentMap = [];
  for (let entry = 0; entry < 2; entry++) {
    let agentName = agentEntries?.[entry]?.[0];
    let agentData: any = agentEntries?.[entry]?.[1];
    console.log(agentData);
    const agentObj = { ...agentData, agentName };
    sortedAgentMap.push(agentObj);
  }

  const callLabels = [
    sortedAgentMap[0]?.agentName,
    sortedAgentMap[1]?.agentName,
  ];

  const callData = [sortedAgentMap[0]?.totalCall, sortedAgentMap[1]?.totalCall];
  const callBg = ["rgba(255, 99, 132)", "rgba(54, 162, 235)"];

  const columns = ["Agents", "Total Calls", "Average Duration"];
  const data = {
    labels: callLabels,
    datasets: [
      {
        label: "No. of Calls",
        data: callData,
        backgroundColor: callBg,
        borderWidth: 0.2,
        barThickness: 30,
        hoverOffset: 8,
      },
    ],
  };

  const options = {
    responsive: true,
    borderRadius: 2,
    hoverBorderWidth: 0,
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div className="w-full p-4 flex flex-col rounded overflow-hidden shadow-lg mt-4">
      <div className="text-xl mb-2"> Top Agents</div>
      <div className="w-full border-t-2 border-bg-gray" />
      <div className="px-6 py-4 flex flex-col justify-center items-center">
        <div className="w-full flex lg:flex-row md:flex-col sm:flex-col sm:justify-center sm:items-center md:justify-center md:items-center lg:items-start lg:justify-between text-center">
          <div className="lg:w-2/5 md:w-3/5 sm:w-4/5 flex pr-4 lg:border-r lg:border-bg-gray-100 md:border-none">
            <Bar data={data} options={options} />
          </div>
          <div className="lg:w-3/5 md:w-full sm:w-full md:pl-0 md:mt-6 sm:mt-6 lg:pl-4 text-center relative overflow-x-auto">
            <table className="w-full text-sm text-left rtl:text-right border-spacing-4 text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase ">
                <tr>
                  {columns.map((column, idx) => (
                    <th
                      scope="col"
                      key={`column-${idx}`}
                      className="px-6 py-3 text-center bg-gray-100"
                    >
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedAgentMap.map((log, index) => (
                  <tr
                    key={index}
                    className="border-t border-bg-gray-200 hover:bg-gray-100"
                  >
                    <td className="py-4 text-center">{log?.agentName}</td>
                    <td className="pt-4 text-center">{log?.totalCall}</td>
                    <td className="pt-4 text-center">{log?.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopAgents;
