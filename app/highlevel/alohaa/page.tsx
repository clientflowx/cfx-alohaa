"use client";

import Alert from "@/components/Alert";
import { apiUrl } from "@/config";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { LocationDataType } from "./call-info/types";

const Alloha = () => {
  let apiKey = "Your api key";
  //   const alohaaImg =
  //     "https://business.alohaa.ai/static/media/alohaaLogoAndWhiteText.92d0e338.svg";

  const alertMsg = useRef("");
  const [locationData, setLocationData] = useState<LocationDataType | null>(
    null
  );
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(
    null
  );
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const allohaApiKeyRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const didNumberRefAddNumbers = useRef<HTMLInputElement | null>(null); // Create a ref for Add Numbers DID number
  const callerNumberRefAddNumbers = useRef<HTMLInputElement | null>(null); // Create a ref for Add Numbers Caller number

  const handleAccessNowBtn = () => {
    window.open(
      `https://integration-cfx.netlify.app/highlevel/alohaa/manage-account?locationId=${currentLocationId}`,
      "_blank"
    );
  };

  // handle update api key request
  const handleSubmit = async () => {
    try {
      const allohaApiKey = allohaApiKeyRef?.current?.value;
      const email = emailRef?.current?.value;
      const didNumber = didNumberRefAddNumbers?.current?.value;
      const callerNumber = callerNumberRefAddNumbers?.current?.value;
      if (!email || !allohaApiKey) {
        alertMsg.current = "Payload Missing";
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
        return;
      }
      await axios.post(`${apiUrl}/api/crmalloha/update`, {
        apiKey: allohaApiKey,
        locationId: currentLocationId,
        email: email,
        callersNumber: callerNumber,
        didNumber: didNumber,
      });

      alertMsg.current = "Details Update Success";
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      console.log(err);

      alertMsg.current = err?.response?.data?.error || "Some Error Occured";
    }
  };

  // fetch user alloha info
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
    // Set the initial value of allohaApiKeyRef when apiKey prop changes
    if (
      locationData?.apiKey &&
      locationData?.email &&
      locationData?.didNumbers &&
      locationData?.callerNumbers
    )
      setIsConnected(true);
    if (locationData?.apiKey && locationData?.email) {
      allohaApiKeyRef.current!.value = locationData?.apiKey;
      emailRef.current!.value = locationData?.email;
      didNumberRefAddNumbers.current!.value = locationData?.didNumbers;
      callerNumberRefAddNumbers.current!.value = locationData?.callerNumbers;
    }
  }, [locationData]);

  useEffect(() => {
    const locationId = new URL(window.location.href).searchParams.get(
      "locationId"
    );
    console.log("from the beginning: ", locationId);

    setCurrentLocationId(locationId);
    fetchUserInfo(locationId);
  }, []);

  return (
    <div className="w-[400px] overflow-hidden p-5 md:mb-4 sm:mb-4 lg:mb-0">
      {(showError || showSuccess) && (
        <Alert
          type={showError ? "error" : "success"}
          message={alertMsg?.current}
        />
      )}

      {/* <div className=" text-lg mb-2"> Alohaa</div> */}
      <img src="/alohaa-icon.svg" className="mb-4" />

      <input
        type="text"
        id="first_name"
        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
        placeholder="Your email here"
        ref={emailRef}
        required
      />
      <input
        type="text"
        id="first_name"
        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
        placeholder="Your API key here"
        ref={allohaApiKeyRef}
        required
      />
      <input
        type="text"
        id="first_name"
        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
        placeholder="Enter DID Number"
        ref={didNumberRefAddNumbers}
        required
      />
      <input
        type="text"
        id="first_name"
        className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
        placeholder="Enter Caller Number"
        ref={callerNumberRefAddNumbers}
        required
      />
      <button
        type="submit"
        className={`mt-4 cursor-default select-none border border-transparent focus:outline-none font-medium 
        rounded-lg text-sm w-full px-4 py-2 text-center mr-2 ${
          isConnected
            ? "bg-[#37ca411a] text-[#37ca37] "
            : "bg-[#38A0DB] text-white"
        }`}
      >
        {isConnected ? "Connected" : "Connect"}
      </button>
      <div className="flex">
        <button
          type="submit"
          onClick={handleSubmit}
          className="text-[#38A0DB] mr-2 mt-4 border border-[#38A0DB] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-4 py-2 text-center "
        >
          Update
        </button>
        <button
          type="submit"
          onClick={handleAccessNowBtn}
          className="text-[#38A0DB] mt-4 border border-[#38A0DB] focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full px-4 py-2 text-center "
        >
          Manage
        </button>
      </div>
    </div>
  );
};

export default Alloha;
