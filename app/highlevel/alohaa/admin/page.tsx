"use client";

import React, { useEffect, useState } from "react";

import axios from "axios";
import Alert from "@/components/Alert";
import { apiUrl } from "@/config";
import AutoCompleteDD from "@/components/AutoCompleteDD";
import Loader from "@/components/Loader";
import { AlohaaAccType } from "../call-info/types";

// Alloha Admin Page

const AllohaAdmin = () => {
  const [subAccounts, setSubAccounts] = useState<AlohaaAccType[]>([]);
  const alertMsg = React.useRef<string>("");
  const [allohaAccounts, setAllohaAccounts] = useState<
    {
      [key: string]: string;
    }[]
  >([]);
  const [showError, setShowError] = React.useState<boolean>(false);
  const [showSuccess, setShowSuccess] = React.useState<boolean>(false);

  const [value, setValue] = useState<AlohaaAccType | null>(null);

  const createAllohaUser = async () => {
    if (!value) {
      alertMsg.current = "Please Select A Subaccount";
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
    try {
      const { data } = await axios.post(`${apiUrl}/api/crmalloha/create-user`, {
        locationId: value?.id,
        name: value?.name,
      });

      if (data?.data?.success) {
        alertMsg.current = "Request Success";
        fetchAllohaAccounts();
        setShowSuccess(true);
        setValue(null);
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        alertMsg.current = "Request Fails, Try Again";
        setShowError(true);
      }
    } catch (err) {
      alertMsg.current = "Request Fails, Try Again";
      setShowError(true);
      console.log(err);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const removeAllohaUser = async () => {
    if (!value) {
      alertMsg.current = "Please Select A Subaccount";
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      return;
    }
    try {
      const { data } = await axios.post(`${apiUrl}/api/crmalloha/remove-user`, {
        locationId: value?.id,
      });

      if (data?.data?.success) {
        alertMsg.current = "Request Success";
        fetchAllohaAccounts();
        setShowSuccess(true);
        setValue(null);
        setTimeout(() => {
          setShowSuccess(false);
        }, 5000);
      } else {
        alertMsg.current = "Request Fails, Try Again";
        setShowError(true);
      }
    } catch (err) {
      alertMsg.current = "Request Fails, Try Again";
      setShowError(true);
      console.log(err);
      setTimeout(() => {
        setShowError(false);
      }, 5000);
    }
  };

  const fetchLocationsList = async () => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/crmalloha/get-all-subaccounts`
      );
      const res: AlohaaAccType[] = [];
      if (data?.length > 0) {
        data.forEach((item: { [key: string]: string }) => {
          const tempObj = {
            key: item?.id,
            id: item?.id,
            name: item?.name,
          };
          res.push(tempObj);
        });
        setSubAccounts(res);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchAllohaAccounts = async () => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/crmalloha/get-alloha-subaccounts`
      );
      if (data?.data?.success) {
        setAllohaAccounts(data?.data?.data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchLocationsList();
    fetchAllohaAccounts();
  }, []);

  return (
    <>
      <div
        className="flex  p-2"
        style={{
          background: "dodgerblue",
        }}
      >
        <img
          src="https://msgsndr-private.storage.googleapis.com/companyPhotos/83ddb2ac-fcce-4455-aff1-b635357a4719.png"
          alt="clientflowx_logo_img"
          style={{ width: "160px" }}
        />
        &nbsp;&nbsp;&nbsp;
        <img
          src="https://business.alohaa.ai/static/media/alohaaLogoAndWhiteText.92d0e338.svg"
          style={{ width: "120px" }}
          alt="alloha_logo_img"
        />
      </div>
      <h2 className="text-center text-2xl mt-4">CRM X Alohaa Admin Section</h2>
      <div className="flex lg:flex-row md:flex-col sm:flex-col p-4 mt-6 justify-between">
        <div
          className="lg:w-[340px] flex md:w-full md:flex-row lg:justify-start sm:w-full sm:w-full sm:flex-row sm:justify-center 
        lg:flex-col lg:mr-8 md:mr-0 rounded overflow-hidden px-6 py-4"
        >
          <div className=" text-lg"> Manage Alohaa Access</div>
          <div className="text-xs mb-2 text-slate-400">
            {value?.name && <p>Current Location: {value.name}</p>}
          </div>
          <AutoCompleteDD setCurrentOption={setValue} dataList={subAccounts} />
          <button
            type="submit"
            onClick={createAllohaUser}
            className="text-[#38A0DB] mt-4 border border-[#38A0DB] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg 
            text-sm w-full px-4 py-2 text-center "
          >
            Give Access
          </button>
          <button
            type="submit"
            onClick={removeAllohaUser}
            className="text-[#38A0DB] mt-4 border border-[#38A0DB] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg
             text-sm w-full px-4 py-2 text-center "
          >
            Remove Access
          </button>
        </div>
        <div className="lg:w-4/5 md:w-full sm:mt-8 relative overflow-x-auto">
          {allohaAccounts.length > 0 ? (
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
              <thead className="text-xs text-gray-700 uppercase ">
                <tr>
                  <th scope="col" className="px-6 py-3">
                    Name
                  </th>
                  <th scope="col" className="px-6 py-3">
                    Location Id
                  </th>
                </tr>
              </thead>
              <tbody>
                {allohaAccounts?.map((item: { [key: string]: string }, idx) => {
                  return (
                    item?.name && (
                      <tr
                        className="bg-white border-b odd:bg-gray-100"
                        key={`item-${item?.name}-${idx}`}
                      >
                        <td className="px-6 py-4">{item?.name}</td>
                        <td className="px-6 py-4">{item?.locationId}</td>
                      </tr>
                    )
                  );
                })}
              </tbody>
            </table>
          ) : (
            <Loader />
          )}
        </div>
      </div>
      {(showError || showSuccess) && (
        <Alert
          type={showError ? "error" : "success"}
          message={alertMsg?.current}
        />
      )}
    </>
  );
};

export default AllohaAdmin;
