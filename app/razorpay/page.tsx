"use client";
import Alert from "@/components/Alert";
import { apiUrl } from "@/config";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { LocationDataType } from "./types";
import RazorpayLogo from "@/svg/RazorpayLogo";

const Razorpay = () => {
  const alertMsg = useRef("");
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);

  const [locationData, setLocationData] = useState<LocationDataType | null>(
    null
  );
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(
    null
  );

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const keyIDRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const keySecretRef = useRef<HTMLInputElement | null>(null);

  const handleAccessNowBtn = () => {
    window.open(
      `https://integration-cfx.netlify.app/highlevel/alohaa/manage-account?locationId=${currentLocationId}`,
      "_blank"
    );
  };

  // handle update api key request
  const handleSubmit = async () => {
    try {
      const keyID = keyIDRef?.current?.value;
      const email = emailRef?.current?.value;
      const keySecret = keySecretRef?.current?.value;

      if (!email || !keyID || !keySecret) {
        alertMsg.current = "Payload Missing";
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
        return;
      }
      const response = await axios.post(
        `${apiUrl}/api/razorpay/razorpay-profile/update`,
        {
          key_id: keyID,
          locationId: currentLocationId,
          email: email,
          key_secret: keySecret,
          name: "ClientFlowX CRM",
        }
      );
      console.log(response);

      console.log(response?.data?.data?.success);
      if (response?.data?.data?.success) {
        setIsConnected(true);
        alertMsg.current = "Details Update Success";
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      }
    } catch (err: any) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      console.log(err);
      console.log(err?.response?.data);
      alertMsg.current = err?.response?.data?.error || "Some Error Occured";
    }
  };

  // fetch user alloha location info
  const fetchUserInfo = async (locationId: string | null) => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/crmalloha/fetchlocationinfo/${locationId}`
      );

      if (data?.success) {
        if (data?.data?.data?.data?.apiKey) {
          setLocationData(data?.data?.data?.data);
        } else {
          alertMsg.current = "Please Add Your API Key";
          setShowError(true);
          setTimeout(() => {
            setShowError(false);
          }, 10000);
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Set the initial value of keyIDRef when apiKey prop changes
    if (locationData?.keyID && locationData?.email && locationData?.KeySecret)
      setIsConnected(true);
    if (locationData?.keyID && locationData?.email) {
      keyIDRef.current!.value = locationData?.keyID;
      emailRef.current!.value = locationData?.email;
      keySecretRef.current!.value = locationData?.KeySecret;
    }
  }, [locationData]);

  useEffect(() => {
    const locationId = new URL(window.location.href).searchParams.get(
      "locationId"
    );
    setCurrentLocationId(locationId);
    fetchUserInfo(locationId);
  }, []);

  return (
    <div className="w-[400px] overflow-hidden flex flex-col items-center p-5 md:mb-4 sm:mb-4 lg:mb-0 border shadow-sm mt-10 ml-10 rounded-md">
      {(showError || showSuccess) && (
        <Alert
          type={showError ? "error" : "success"}
          message={alertMsg?.current}
        />
      )}
      <div>
        <RazorpayLogo />
      </div>
      <div className="flex flex-col items-start justify-between gap-1 w-full">
        <label htmlFor="" className="text-xs font-semibold text-gray-500">
          Live Client Id
        </label>
        <input
          type="text"
          id="first_name"
          className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
          placeholder="Live client Id"
          ref={keyIDRef}
          required
        />
      </div>
      <div className="flex flex-col items-start justify-between gap-1 w-full">
        <label htmlFor="" className="text-xs font-semibold text-gray-500">
          Live Secret Id
        </label>
        <input
          type="text"
          id="first_name"
          className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
          placeholder="Live secret Id"
          ref={keySecretRef}
          required
        />
      </div>
      <div className="flex flex-col items-start justify-between gap-1 w-full">
        <label htmlFor="" className="text-xs font-semibold text-gray-500">
          Email
        </label>
        <input
          type="email"
          id="email"
          className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
          placeholder="Email"
          ref={emailRef}
          required
        />
      </div>

      <button
        type="submit"
        className={`mt-4 cursor-default select-none border border-transparent focus:outline-none font-medium 
        rounded-lg text-sm w-full px-4 py-2 text-center mr-2 ${
          isConnected
            ? "bg-[#37ca411a] text-[#37ca37] "
            : "bg-green-500 text-white"
        }`}
      >
        {isConnected ? "Connected" : "Connect"}
      </button>
      <div className="flex w-full">
        <button
          type="submit"
          onClick={handleSubmit}
          className="text-[#38A0DB] mr-2 mt-4 border border-[#38A0DB] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-4 py-2 text-center "
        >
          Update
        </button>
        {/* <button
                    type="submit"
                    onClick={handleAccessNowBtn}
                    className="text-[#38A0DB] mt-4 border border-[#38A0DB] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-4 py-2 text-center "
                >
                    Manage
                </button> */}
      </div>
    </div>
  );
};

export default Razorpay;
