"use client";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import TransactionFilters from "./transaction-filters";
import { format } from "date-fns";
import Pill from "@/components/Pill";
import { RangeKeyDict } from "react-date-range";
import axios from "axios";
import { apiUrl } from "@/config";
import Loader from "@/components/Loader";

interface TransactionListType {
  [key: string]: any; //to modifiy
}

const TransactionList = () => {
  const [transactionList, setTransactionList] = useState<TransactionListType[]>(
    []
  );
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

  const fetchTransactionsData = async () => {
    const transactionsData = await axios.post(
      `${apiUrl}/api/razorpay/check-payment-link-status/all`,
      {
        key_id: "rzp_live_9oKCM6CsUXuHRp",
        key_secret: "l2h7EP1sYtIT5dt8D15fiI3d",
      }
    );

    const {
      data: {
        data: {
          status: { payment_links: transactionDetails },
        },
      },
    } = transactionsData;
    const newTransactionList: TransactionListType[] = [];
    transactionDetails.forEach(
      (transaction: TransactionListType, ind: number) => {
        const obj = {
          amount: `₹${transaction.amount}`,
          status: ind % 2 === 0 ? "succeeded" : transaction.reminders.status,
          customer: transaction.customer.name,
          date: format(transaction.updated_at * 1000, "dd MMM yy"),
          source: "Invoice",
          provider: ind % 2 === 0 ? "Razorpay" : "Instamojo",
        };
        newTransactionList.push(obj);
      }
    );
    setTransactionList(newTransactionList);
  };

  useEffect(() => {
    fetchTransactionsData();
  }, []);

  const filteredTransactionList = transactionList?.filter((transaction) => {
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
          <Pill
            type={
              log["status"] === "succeeded"
                ? "success"
                : log["status"] === "failed"
                ? "fail"
                : log["status"] === "info"
                ? "info"
                : "warning"
            }
            text={log[key]}
          />
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
    <>
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
          {transactionList.length > 0 ? (
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
          ) : (
            <Loader />
          )}
        </div>
      </div>
    </>
  );
};

export default TransactionList;
