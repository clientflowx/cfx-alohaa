import React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import TransactionList from "./transaction-list";

const Transactions = () => {
  return (
    <div className="bg-[#f2f7fa] h-screen px-28 pt-2">
      <span className="block font-medium text-[30px]">Transactions</span>
      <span className="font-normal text-[16px] text-[#667085]">
        Track customer payments at a single place
      </span>
      <TransactionList />
    </div>
  );
};

export default Transactions;
