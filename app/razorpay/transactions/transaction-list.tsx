"use client";
import React, { ChangeEventHandler, useState } from "react";
import TransactionFilters from "./transaction-filters";
import { format } from "date-fns";
import Pill from "@/components/Pill";
import { RangeKeyDict } from "react-date-range";

const TransactionList = () => {
  const [nameFilter, setNameFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentMode, setPaymentMode] = useState<string>("all");
  const [sourceType, setSourceType] = useState<string>("all");

  const columns = [
    { key: "customer", text: "Customer" },
    { key: "provider", text: "Provider" },
    { key: "source", text: "Source" },
    { key: "date", text: "Transaction Date" },
    { key: "amount", text: "Amount" },
    { key: "status", text: "Status" },
  ];
  const transactionList = [
    {
      customer: "Aman",
      provider: "Razorpay",
      source: "Cosmo Suite Pvt Ltd.",
      date: new Date().toISOString().substring(0, 10),
      amount: "₹119,940.00",
      status: "Succeeded",
    },
    {
      customer: "Chanakya",
      provider: "Razorpay",
      source: "Cosmo Suite Pvt Ltd.",
      date: new Date().toISOString().substring(0, 10),
      amount: "₹119,940.00",
      status: "Succeeded",
    },
    {
      customer: "Anubhav",
      provider: "Instamojo",
      source: "CFX",
      date: new Date().toISOString().substring(0, 10),
      amount: "₹119,940.00",
      status: "Refunded",
    },
    {
      customer: "Naman",
      provider: "Stripe",
      source: "Company",
      date: new Date().toISOString().substring(0, 10),
      amount: "₹119,940.00",
      status: "Failed",
    },
  ];

  const filteredTransactionList = transactionList.filter((transaction) => {
    return (
      (nameFilter === "" ||
        transaction.customer.toLowerCase().includes(nameFilter)) &&
      (paymentMode === "all" ||
        transaction.provider.toLowerCase() === paymentMode) &&
      (statusFilter === "all" ||
        transaction.status.toLowerCase() === statusFilter) &&
      (startDate === undefined ||
        endDate === undefined ||
        (format(new Date(transaction.date), "yyyy-MM-dd") >=
          format(startDate!, "yyyy-MM-dd") &&
          format(new Date(transaction.date), "yyyy-MM-dd") <=
            format(endDate!, "yyyy-MM-dd")))
    );
  });

  const statusArr = [
    "Succeeded",
    "Processing",
    "Refunded",
    "Failed",
    "Pending",
  ];

  const selectionRange = {
    startDate,
    endDate,
    key: "selection",
  };

  const handleSelect = (date: RangeKeyDict) => {
    setStartDate(date.selection.startDate);
    setEndDate(date.selection.endDate);
  };

  const handleStatusFilterUpdate: ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    setStatusFilter(e.target.value.toLowerCase());
  };

  const handlePaymentModeUpdate: ChangeEventHandler<HTMLSelectElement> = (
    e
  ) => {
    setPaymentMode(e.target.value.toLowerCase());
  };

  const handleSourceTypeUpdate: ChangeEventHandler<HTMLSelectElement> = (e) => {
    setSourceType(e.target.value.toLowerCase());
  };

  const handleNameFilterUpdate: ChangeEventHandler<HTMLInputElement> = (e) => {
    setNameFilter(e.target.value.toLowerCase());
  };

  const renderTableCell = (
    key: string,
    log: { [key: string]: string },
    ind: number
  ) => {
    if (key === "date")
      return (
        <td key={`transaction-${ind}`} className="py-4 text-center">
          {format(new Date(log[key]), "dd MMM yy")}
        </td>
      );
    else if (key === "status")
      return (
        <td
          key={`transaction-${ind}`}
          className="py-4 text-center flex justify-center"
        >
          <Pill type="success" text={log[key]} />
        </td>
      );
    else
      return (
        <td
          key={`transaction-${ind}`}
          className={`py-4 text-center ${
            key === "amount" && "font-semibold text-black"
          } ${key === "provider" && "text-black"}`}
        >
          {log[key]}
        </td>
      );
  };

  return (
    <div className="mt-6 rounded shadow-lg border border-white bg-white">
      <TransactionFilters
        selectionRange={selectionRange}
        handleSelect={handleSelect}
        handleStatusFilterUpdate={handleStatusFilterUpdate}
        statusArr={statusArr}
        handleNameFilterUpdate={handleNameFilterUpdate}
        handleSourceTypeUpdate={handleSourceTypeUpdate}
        handlePaymentModeUpdate={handlePaymentModeUpdate}
      />
      <div>
        <table className="w-full text-sm text-left rtl:text-right border-spacing-4 text-gray-500 ">
          <thead className="text-xs text-gray-700 uppercase ">
            <tr>
              {columns.map((column, idx) => (
                <th
                  scope="col"
                  key={`column-${idx}`}
                  className="px-6 py-3 text-center bg-gray-100"
                >
                  {column?.text}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTransactionList.map((log, index) => {
              return (
                <tr
                  key={`agent-${index}`}
                  className="border-t border-bg-gray-200 hover:bg-gray-100"
                >
                  {columns.map((col, ind) =>
                    renderTableCell(col?.key, log, ind)
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionList;
