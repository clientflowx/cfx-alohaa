"use client";

import { FormEventHandler, useEffect, useRef, useState } from "react";
import { apiUrl } from "@/config";
import axios from "axios";
import Alert from "@/components/Alert";
import { Phone } from "@/svg/phone";
import { User } from "@/svg/user";
import DeleteIcon from "@/svg/delete";
import Svg from "@/components/Svg";

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
  const addUserEmailRef = useRef<HTMLInputElement | null>(null); // add new user email
  const addUserDidMobileNumberRef = useRef<HTMLInputElement | null>(null); //add new user did mobile number
  const addUserCallerMobileNumberRef = useRef<HTMLInputElement | null>(null); // add new user caller mobile number

  const handleAddUser: FormEventHandler<HTMLFormElement> | undefined = async (
    e
  ) => {
    e.preventDefault();
    try {
      const userEmail = addUserEmailRef?.current?.value;
      const userDidMobile = addUserDidMobileNumberRef?.current?.value;
      const userCallerMobile = addUserCallerMobileNumberRef?.current?.value;
      const locationId = currentLocationId;
      if (userCallerMobile?.startsWith("+91")) {
        alertMsg.current = "Caller number should not start with country code.";
        setShowError(true);
        return;
      }
      if (userCallerMobile?.length != 10) {
        alertMsg.current = "Incorrect caller mobile number";
        setShowError(true);
        return;
      }
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

  const handleDeleteUser = async (item: {
    email: string;
    didNumber: string | null;
    callerNumber: string | null;
  }) => {
    const { email } = item;
    try {
      if (!currentLocationId || !email) {
        alertMsg.current = "Missing Payload";
        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
        return;
      }

      await axios.post(`${apiUrl}/api/crmalloha/remove-alloha-user`, {
        locationId: currentLocationId,
        userEmail: email,
      });
      alertMsg.current = "User removed Successfully";
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
    try {
      const { data } = await axios.get(
        `${apiUrl}/api/crmalloha/fetchlocationinfo/${locationId}`
      );

      if (data?.success) {
        if (data?.data?.data?.data?.apiKey) {
          allohaApiKeyRef.current = data?.data?.data?.data?.apiKey;
          emailRef.current = data?.data?.data?.data?.email;
          setLocationData(data?.data?.data?.data);
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
      <div className="flex lg:flex-row md:flex-col sm:flex-col p-4 mt-6">
        <div className="lg:w-[340px] flex md:w-full md:flex-row lg:justify-start sm:w-full sm:w-full sm:flex-row sm:justify-center lg:flex-col lg:mr-8 md:mr-0">
          <div className="lg:mt-10 md:mt-0 lg:w-100 md:w-[340px] sm:w-[340px] rounded overflow-hidden shadow-lg">
            <div className="px-6 py-4">
              <div className="flex justify-between items-center mb-2">
                <div className=" text-lg"> Add Users</div>
                <User />
              </div>
              <div className="flex flex-col">
                <form onSubmit={handleAddUser}>
                  <input
                    type="email"
                    id="first_name"
                    className="border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Enter Email"
                    ref={addUserEmailRef}
                    required
                  />
                  <input
                    type="tel"
                    id="first_name"
                    className="border border-gray-300 text-gray-900 mt-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Enter DID Number"
                    pattern="^91[6789]{1}[0-9]{9}"
                    ref={addUserDidMobileNumberRef}
                    required
                  />
                  <span className="text-xs text-red-600 mt-2">
                    * Please Enter DID number starting with 91.
                  </span>
                  <input
                    type="tel"
                    id="first_name"
                    className="border border-gray-300 text-gray-900 mt-2 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 "
                    placeholder="Enter Caller Number"
                    maxLength={10}
                    pattern="[6789]{1}[0-9]{9}"
                    ref={addUserCallerMobileNumberRef}
                    required
                  />
                  <span className="text-xs text-red-600 mt-2">
                    * Please Enter Caller number without country code.
                  </span>

                  <button
                    type="submit"
                    className="text-blue-800 mt-4 bg-white border-2 border-blue-800 hover:bg-blue-800 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center "
                  >
                    Add Now
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="lg:w-4/5 md:w-full sm:mt-8 relative overflow-x-auto">
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
                    className="bg-white border-b odd:bg-gray-100 "
                    key={`item-${idx}`}
                  >
                    <td className="px-6 py-4">{item?.email}</td>
                    <td className="px-6 py-4">{item?.didNumber}</td>
                    <td className="px-6 py-4">{item?.callerNumber}</td>
                    <td className="px-6 py-4">
                      <Svg
                        onClick={() => handleDeleteUser(item)}
                        icon={DeleteIcon}
                        width={30}
                        height={30}
                        className="hover:fill-[#ee4c45] hover:stroke-[#ee4c45] cursor-pointer"
                        viewBox="0 0 64 64"
                      />
                    </td>
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
