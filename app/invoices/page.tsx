"use client";
import React, { useState } from "react";
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css"; // theme css file
import TransactionList from "./invoices-list";
import Svg from "@/components/Svg";
import SettingsIcon from "@/svg/settings";
import plus from "@/svg/plus";
import calender from "@/svg/calender";

const Transactions = () => {
  const openSettingsPage = () => {
    const locationId =
      new URL(window.location.href).searchParams.get("locationId") || "1";
    window.open(
      `https://app.clientflowx.com/v2/location/${locationId}/payments/invoice/settings`,
      "_blank"
    );
  };
  return (
    <div className="bg-[#f2f7fa] min-h-screen max-h-fit px-28 pt-2">
      <div className="flex justify-between items-center">
        <div>
          <span className="block font-medium text-[30px]">Invoices</span>
          <span className="font-normal text-[16px] text-[#667085]">
            Create and manage all invoices generated for your business
          </span>
        </div>
        <div className="flex items-center ">
          <div
            className="border border-gray-300 cursor-pointer rounded bg-white py-2 px-4 text-center mr-2"
            onClick={openSettingsPage}
          >
            <Svg
              icon={SettingsIcon}
              width={20}
              height={20}
              viewBox="0 0 48 48"
            />
          </div>
          <DropDownButton />
        </div>
      </div>
      <TransactionList />
    </div>
  );
};

const DropDownButton = () => {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const handleDropdownClick = () => {
    setIsDropdownVisible(!isDropdownVisible);
  };

  const handleNewInvoice = () => {
    const locationId =
      new URL(window.location.href).searchParams.get("locationId") || "1";
    window.open(
      `https://app.clientflowx.com/v2/location/${locationId}/payments/invoices/new`,
      "_blank"
    );
  };

  const handleNewRecurringTemplate = () => {
    const locationId =
      new URL(window.location.href).searchParams.get("locationId") || "1";
    window.open(
      `https://app.clientflowx.com/v2/location/${locationId}/payments/recurring-template/new`,
      "_blank"
    );
  };

  return (
    <div
      className="inline-flex items-center justify-center cursor-pointer rounded transition ease-in-out duration-150
   border border-transparent font-medium text-white bg-blue-500 hover:bg-blue-400 focus:outline-none 
   focus:border-blue-700 focus:shadow-outline-blue px-4 py-2 leading-5 text-sm w-40 relative"
      onClick={handleDropdownClick}
    >
      <Svg
        icon={plus}
        className="mr-2 fill-[#fff]"
        width={20}
        height={20}
        viewBox="0 0 24 24"
      />
      New
      {isDropdownVisible && (
        <div className="absolute w-[300px]  bg-white text-black top-[38px] overflow-hidden rounded-lg shadow-lg flex flex-col">
          <div
            className="mt-3 p-2 flex items-center justify-between hover:bg-gray-100"
            onClick={handleNewInvoice}
          >
            <Svg
              icon={calender}
              className="mr-4"
              width={40}
              height={40}
              viewBox="0 0 64 64"
            />
            <div className="w-[250px]">
              <span className="block text-sm font-medium">New Invoice</span>
              <span className="block text-sm text-gray-400">
                Send a one-time invoice to the customer right away.
              </span>
            </div>
          </div>
          <div
            className=" mt-2 p-2 flex items-center justify-between hover:bg-gray-100"
            onClick={handleNewRecurringTemplate}
          >
            <Svg
              icon={calender}
              className="mr-4"
              width={40}
              height={40}
              viewBox="0 0 64 64"
            />
            <div className="w-[250px]">
              <span className="block text-sm font-medium">
                New Recurring Template
              </span>
              <span className="block text-sm text-gray-400">
                Send a recurring invoice to the customer at scheduled intervals.
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default Transactions;
