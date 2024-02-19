"use client";

import { useEffect, useRef, useState } from "react";
import { apiUrl } from "@/config";
import axios from "axios";
import Alert from "@/components/Alert";
import { Phone } from "@/svg/phone";
import { User } from "@/svg/user";

interface locationDataIF {
  didNumbers: string | null;
  callerNumbers: string | null;
  users:
    | [
        {
          email: string;
          didNumber: string | null;
          callerNumber: string | null;
        }
      ]
    | [];
}

const ManageAccount: React.FC = () => {
  const allohaApiKeyRef = useRef("");
  const emailRef = useRef("");
  const [locationData, setLocationData] = useState<locationDataIF>({
    didNumbers: null,
    callerNumbers: null,
    users: [],
  });

  const [showError, setShowError] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [currentLocationId, setCurrentLocationId] = useState<string | null>(
    null
  );
  const alertMsg = useRef("");
  // const didNumberRefMakeCall = useRef('918069738302'); // Create a ref for Make a Call DID number
  // const callerNumberRefMakeCall = useRef(null); // Create a ref for Make a Call Caller number
  // const receiverNumberRefMakeCall = useRef(null) // Receiver Number Ref
  const didNumberRefAddNumbers = useRef<HTMLInputElement | null>(null); // Create a ref for Add Numbers DID number
  const callerNumberRefAddNumbers = useRef<HTMLInputElement | null>(null); // Create a ref for Add Numbers Caller number
  const addUserEmailRef = useRef<HTMLInputElement | null>(null); // add new user email
  const addUserDidMobileNumberRef = useRef<HTMLInputElement | null>(null); //add new user did mobile number
  const addUserCallerMobileNumberRef = useRef<HTMLInputElement | null>(null); // add new user caller mobile number

  const handleAddNumbers = async () => {
    try {
      // Access the values using ref.current.value
      const didNumber = didNumberRefAddNumbers?.current?.value;
      const callerNumber = callerNumberRefAddNumbers?.current?.value;
      if (!didNumber && !callerNumber) return;
      await axios.post(`${apiUrl}/api/crmalloha/update`, {
        didNumber: didNumber,
        callerNumber: callerNumber,
        locationId: currentLocationId,
      });
      alertMsg.current = "Details Update Success";
      setShowSuccess(true);
      console.log("current", currentLocationId);
      fetchUserInfo(currentLocationId); // to fetch updated data
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.log(err);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      alertMsg.current = err?.response?.data?.error || "Some Error Occured";
    }
  };

  const handleAddUser = async () => {
    try {
      const userEmail = addUserEmailRef?.current?.value;
      const userDidMobile = addUserDidMobileNumberRef?.current?.value;
      const userCallerMobile = addUserCallerMobileNumberRef?.current?.value;
      const locationId = currentLocationId;

      if (
        !currentLocationId ||
        !userEmail ||
        !userDidMobile ||
        !userCallerMobile
      ) {
        alertMsg.current = "Missing Payload";
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
        return;
      }

      await axios.post(`${apiUrl}/api/crmalloha/add-alloha-user`, {
        didNumber: userDidMobile,
        locationId: locationId,
        callerNumber: userCallerMobile,
        userEmail: userEmail,
      });
      alertMsg.current = "User Added Successfully";
      setShowSuccess(true);
      fetchUserInfo(currentLocationId);
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } catch (err: any) {
      console.log(err);
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      alertMsg.current = err?.response?.data?.error || "Some Error Occured";
    }
  };

  const fetchUserInfo = async (locationId: string | null) => {
    console.log(locationId);
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/crmalloha/fetchlocationinfo/${locationId}`
      );
      if (data?.data?.success) {
        if (data?.data?.data?.apiKey) {
          allohaApiKeyRef.current = data?.data?.data?.apiKey;
          emailRef.current = data?.data?.data?.email;
          setLocationData(data?.data?.data);
        } else {
          alertMsg.current = "Please Add Your Api Key";
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
    console.log("Hello");
    const locationId = new URL(window.location.href).searchParams.get(
      "locationId"
    );
    setCurrentLocationId(locationId);
    fetchUserInfo(locationId);
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
      <h2 className="text-center text-2xl mt-4">
        Enhance Your Alohaa Integration with ClientFlowX
      </h2>
      <div className="flex p-4 mt-6">
        <div className="w-1/5 mr-8">
          <div className="w-100 rounded overflow-hidden shadow-lg">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-2">
                <div className=" text-lg"> Add Numbers</div>
                <Phone />
              </div>
              <div>
                <input
                  type="text"
                  id="first_name"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Enter DID Number"
                  ref={didNumberRefAddNumbers}
                  required
                />
                <input
                  type="text"
                  id="first_name"
                  className="border border-gray-300 text-gray-900 mt-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Enter Caller Number"
                  ref={callerNumberRefAddNumbers}
                  required
                />
                <button
                  type="submit"
                  onClick={handleAddNumbers}
                  className="text-blue-800 mt-4 bg-white border-2 border-blue-800 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
                >
                  Add Now
                </button>
              </div>
            </div>
          </div>

          <div className="mt-10 w-100 rounded overflow-hidden shadow-lg">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-2">
                <div className=" text-lg"> Add Users</div>
                <User />
              </div>
              <div>
                <input
                  type="text"
                  id="first_name"
                  className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Enter Email"
                  ref={addUserEmailRef}
                  required
                />
                <input
                  type="text"
                  id="first_name"
                  className="border border-gray-300 text-gray-900 mt-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Enter DID Number"
                  ref={addUserDidMobileNumberRef}
                  required
                />
                <input
                  type="text"
                  id="first_name"
                  className="border border-gray-300 text-gray-900 mt-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                  placeholder="Enter Caller Number"
                  ref={addUserCallerMobileNumberRef}
                  required
                />
                <button
                  type="submit"
                  onClick={handleAddUser}
                  className="text-blue-800 mt-4 bg-white border-2 border-blue-800 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
                >
                  Add Now
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="w-4/5 relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 ">
            <thead className="text-xs text-gray-700 uppercase ">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  DID No.
                </th>
                <th scope="col" className="px-6 py-3">
                  Caller No.
                </th>
              </tr>
            </thead>
            <tbody>
              {locationData?.users?.map((item, idx) => {
                return (
                  <tr
                    className="bg-white border-b odd:bg-gray-100"
                    key={`item-${idx}`}
                  >
                    <td className="px-6 py-4">{item?.email}</td>
                    <td className="px-6 py-4">{item?.didNumber}</td>
                    <td className="px-6 py-4">{item?.callerNumber}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
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

export default ManageAccount;
