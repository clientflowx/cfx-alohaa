import React from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import TransactionList from "./invoices-list";

const Transactions = () => {
  return (
    <div className="bg-[#f2f7fa] min-h-screen max-h-fit px-28 pt-2">
      <span className="block font-medium text-[30px]">Invoices</span>
      <span className="font-normal text-[16px] text-[#667085]">
        Create and manage all invoices generated for your business
      </span>
      <TransactionList />
    </div>
  );
};

export default Transactions;
