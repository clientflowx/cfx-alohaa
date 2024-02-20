"use client";

import Alert from "@/components/Alert";
import { apiUrl } from "@/config";
import { Phone } from "@/svg/phone";
import axios from "axios";
import { useEffect, useRef, useState } from "react";

const Alloha = () => {
  let apiKey = "Your api key";
  //   const alohaaImg =
  //     "https://business.alohaa.ai/static/media/alohaaLogoAndWhiteText.92d0e338.svg";
  const [open, setOpen] = useState<boolean>(false);
  const alertMsg = useRef("");
  const [locationData, setLocationData] = useState<any>(null);
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(
    null
  );
  const allohaApiKeyRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const didNumberRefAddNumbers = useRef<HTMLInputElement | null>(null); // Create a ref for Add Numbers DID number
  const callerNumberRefAddNumbers = useRef<HTMLInputElement | null>(null); // Create a ref for Add Numbers Caller number

  const handleAccessNowBtn = () => {
    window.open(
      `https://integration-cfx.netlify.app/highlevel/alohaa/manage-account?locationId=${currentLocationId}`,
      "_blank"
    );

    // setOpen(true);
  };

  const handleVisitWebsiteClick = () => {
    window.open("https://business.alohaa.ai", "_blank");
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
      alertMsg.current = err?.response?.data?.error || "Some Error Occured";
    }
  };

  // fetch user alloha info
  const fetchUserInfo = async (locationId: string | null) => {
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/crmalloha/fetchlocationinfo/${locationId}`
      );
      console.log("datafromallohaiframe", data);
      if (data?.data?.success) {
        if (data?.data?.data?.apiKey) {
          setLocationData(data?.data?.data);
        } else {
          console.log("here2");
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
    if (locationData?.apiKey && locationData?.email) {
      allohaApiKeyRef.current!.value = locationData?.apiKey;
      emailRef.current!.value = locationData?.email;
    }
    console.log(locationData);
  }, [locationData]);

  useEffect(() => {
    const locationId = new URL(window.location.href).searchParams.get(
      "locationId"
    );
    setCurrentLocationId(locationId);
    fetchUserInfo(locationId);
  }, []);

  return (
    <div className="w-[400px] rounded overflow-hidden shadow-lg p-5 md:mb-4 sm:mb-4 lg:mb-0">
      {(showError || showSuccess) && (
        <Alert
          type={showError ? "error" : "success"}
          message={alertMsg?.current}
        />
      )}

      <div className=" text-lg"> Alohaa</div>

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
        onClick={handleAccessNowBtn}
        className="text-blue-800 mt-4 bg-white border-2 border-blue-800 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-2.5 text-center mr-2"
      >
        Access Now
      </button>
      <button
        type="submit"
        onClick={handleVisitWebsiteClick}
        className="text-blue-800 mt-4 bg-white border-2 border-blue-800 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-2.5 text-center mr-2"
      >
        Visit Website
      </button>
      <button
        type="submit"
        onClick={handleSubmit}
        className="text-blue-800 mt-4 bg-white border-2 border-blue-800 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-2 py-2.5 text-center "
      >
        Update API Key
      </button>

      {/* {open && (
        <AccessModal
          locationData={locationData}
          open={open}
          setOpen={setOpen}
          apiKey={apiKey}
          img={img}
          currentLocationId={currentLocationId}
          fetchUserInfo={fetchUserInfo}
        />
      )} */}
    </div>
  );
};

export default Alloha;
