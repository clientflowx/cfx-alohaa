"use client";

import Alert from "@/components/Alert";
import { apiUrl } from "@/config";
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { LocationDataType } from "./types";
import RazorpayLogo from "@/svg/RazorpayLogo";

const Alloha = () => {
    const alertMsg = useRef("");
    const [showError, setShowError] = useState<boolean>(false);
    const [showSuccess, setShowSuccess] = useState<boolean>(false);

    const [locationData, setLocationData] = useState<LocationDataType | null>(null);
    const [currentLocationId, setCurrentLocationId] = useState<string | null>(null);

    const [isConnected, setIsConnected] = useState<boolean>(false);
    const keyIDRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement | null>(null);
    const keySecretRef = useRef<HTMLInputElement | null>(null); // Create a ref for Add Numbers DID number
    // const callerNumberRefAddNumbers = useRef<HTMLInputElement | null>(null); // Create a ref for Add Numbers Caller number
    console.log("key id: ", keyIDRef?.current?.value);
    console.log("email: ", emailRef?.current?.value);
    console.log("key secret: ", keySecretRef?.current?.value);
    console.log(currentLocationId);



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

            if (!email || !keyID) {
                alertMsg.current = "Payload Missing";
                setShowError(true);
                setTimeout(() => {
                    setShowError(false);
                }, 3000);
                return;
            }
            await axios.post(`${apiUrl}/api/razorpay/razorpay-profile/update`, {
                key_id: keyID,
                locationId: currentLocationId,
                email: email,
                key_secret: keySecret,
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
        if (
            locationData?.keyID &&
            locationData?.email &&
            locationData?.KeySecret
        )
            setIsConnected(true);
        if (locationData?.keyID && locationData?.email) {
            keyIDRef.current!.value = locationData?.keyID;
            emailRef.current!.value = locationData?.email;
            keySecretRef.current!.value = locationData?.KeySecret;
        }
    }, [locationData]);

    useEffect(() => {
        const locationId = new URL(window.location.href).searchParams.get("locationId");
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
            <RazorpayLogo />
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
                placeholder="Your key id here"
                ref={keyIDRef}
                required
            />
            <input
                type="text"
                id="first_name"
                className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 mb-2"
                placeholder="Your key secret here"
                ref={keySecretRef}
                required
            />
            <button
                type="submit"
                className={`mt-4 cursor-default select-none border border-transparent focus:outline-none font-medium 
        rounded-lg text-sm w-full px-4 py-2 text-center mr-2 ${isConnected
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
