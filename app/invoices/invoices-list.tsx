"use client";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import TransactionFilters from "./invoices-filters";
import { format } from "date-fns";
import Pill from "@/components/Pill";
import { RangeKeyDict } from "react-date-range";
import axios from "axios";
import { apiUrl } from "@/config";
import Loader from "@/components/Loader";

interface InvoicesListType {
  [key: string]: any; //to modifiy
}

const TransactionList = () => {
  const [currentLocationId, setCurrentLocationId] = useState<string>("1");
  const [invoiceList, setInvoiceList] = useState<InvoicesListType[]>([]);
  const [nameFilter, setNameFilter] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [paymentMode, setPaymentMode] = useState<string>("all");
  const [sourceType, setSourceType] = useState<string>("all");

  const columns = [
    { key: "invoiceName", text: "Invoice Name" },
    { key: "invoiceNum", text: "Invoice Number" },
    { key: "customer", text: "Customer" },
    { key: "date", text: "Issue Date" },
    { key: "amount", text: "Amount" },
    { key: "status", text: "Status" },
  ];
  const currencyMap: { [key: string]: string } = {
    USD: "$",
    INR: "₹",
  };

  const fetchInvoicesData = async (locationId: string) => {
    const rzpInvoicesData = await axios.get(
      `${apiUrl}/api/razorpay/razorpay-invoices-fetch/all/${locationId}`
    );
    const crmInvoicesData = await axios.get(
      `${apiUrl}/api/internal/location-invoices-list/L5KNiAsUDWR56VLxY299` //${locationId}
    );

    const {
      data: {
        data: { invoices: crmInvoicesDetails = [] },
      },
    } = crmInvoicesData;

    const newCrmInvoicesList: InvoicesListType[] = [];
    crmInvoicesDetails.forEach((invoice: InvoicesListType, ind: number) => {
      const symbol = currencyMap[invoice.currency.toUpperCase()];
      const obj = {
        amount: `${symbol}${invoice.total}`,
        status: invoice.status,
        customer: invoice.contactDetails.name,
        date: invoice.updatedAt,
        invoiceNum: invoice.invoiceNumber,
        invoiceName: invoice.name,
      };
      newCrmInvoicesList.push(obj);
    });

    const {
      data: {
        data: {
          invoices: { items: rzpInvoicesDetails = [] },
        },
      },
    } = rzpInvoicesData;

    const newInvoicesList: InvoicesListType[] = [];
    rzpInvoicesDetails.forEach((invoice: InvoicesListType, ind: number) => {
      const symbol = currencyMap[invoice.currency.toUpperCase()];
      const obj = {
        amount: `${symbol}${invoice.amount}`,
        status: invoice.status,
        customer: invoice.customer_details.customer_name,
        date: invoice.created_at * 1000,
        invoiceNum: invoice.invoice_number,
        invoiceName: invoice.description,
      };
      newInvoicesList.push(obj);
    });

    const allInvoices = [...newInvoicesList, ...newCrmInvoicesList];
    allInvoices.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setInvoiceList(allInvoices);
  };

  useEffect(() => {
    const locationId =
      new URL(window.location.href).searchParams.get("locationId") || "1";
    setCurrentLocationId(locationId);
    fetchInvoicesData(locationId);
  }, []);

  const filteredTransactionList = invoiceList?.filter((invoice) => {
    return (
      (nameFilter === "" ||
        invoice.customer.toLowerCase().includes(nameFilter)) &&
      (statusFilter === "all" ||
        invoice.status.toLowerCase() === statusFilter) &&
      (startDate === undefined ||
        endDate === undefined ||
        (format(new Date(invoice.date), "yyyy-MM-dd") >=
          format(startDate!, "yyyy-MM-dd") &&
          format(new Date(invoice.date), "yyyy-MM-dd") <=
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
        <td key={`invoice-${ind}`} className="py-4 text-center">
          {format(new Date(log[key]), "dd MMM yy")}
        </td>
      );
    else if (key === "status")
      return (
        <td
          key={`invoice-${ind}`}
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
          key={`invoice-${ind}`}
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
          {invoiceList.length > 0 ? (
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
