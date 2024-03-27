"use client";
import Alert from "@/components/Alert";
import Svg from "@/components/Svg";
import { apiUrl } from "@/config";
import CrossIcon from "@/svg/cross";
import eye from "@/svg/eye";
import PlusIcon from "@/svg/plus";
import axios from "axios";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";

interface InputField {
  [key: string]: string | number;
}

const PaymentModal = () => {
  const [inputFields, setInputFields] = useState<InputField[]>([
    {
      itemName: "",
      itemPrice: 0,
    },
  ]);
  const [totalAmount, setTotalAmount] = useState<number>(parseFloat("0"));
  const [showError, setShowError] = useState<boolean>(false);
  const [showSuccess, setShowSuccess] = useState<boolean>(false);
  const [invoiceDate, setInvoiceDate] = useState<string>(
    new Date(Date.now() + 3600 * 1000 * 24).toISOString().substring(0, 10)
  );
  const [payLink, setPaylink] = useState<string>("");
  const alertMsg = useRef("");

  const generatePaymentLink:
    | React.FormEventHandler<HTMLFormElement>
    | undefined = async (e) => {
    try {
      e.preventDefault();
      const invoiceItems = inputFields.map((field) => {
        return { name: field.itemName, amount: field.itemPrice };
      });
      const locationId = new URL(global.window.location.href)?.searchParams.get(
        "locationId"
      );
      const paymentData = await axios.post(
        `${apiUrl}/api/razorpay/razorpay-invoice-link-generate`,
        {
          locationId,
          amount: totalAmount,
          currency: "INR",
          line_items: invoiceItems,
          customer: {
            name: "Gaurav Kumar",
            email: "gaurav.kumar@example.com",
            contact: "+919000090000",
          },
          sms_notify: 1,
          email_notify: 1,
          expire_by: new Date(invoiceDate).getTime(),
        }
      );

      if (paymentData?.data?.data?.success) {
        const {
          data: {
            data: { invoiceId },
          },
        } = paymentData;

        const paymentLink = `http://staging.integrations.clientflowx.com/razorpay/paylink/${invoiceId}`;
        setPaylink(paymentLink);
        navigator.clipboard.writeText(paymentLink);

        alertMsg.current = "Payment link copied";

        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
        }, 3000);
      } else {
        alertMsg.current = paymentData?.data?.message;

        setShowError(true);
        setTimeout(() => {
          setShowError(false);
        }, 3000);
      }
    } catch (error) {
      setShowError(true);
      setTimeout(() => {
        setShowError(false);
      }, 3000);
      alertMsg.current = "Some Error Occured";
    }
  };
  const addMoreFields:
    | React.MouseEventHandler<HTMLDivElement>
    | undefined = () => {
    setInputFields([...inputFields, { itemName: "", itemPrice: 0 }]);
  };

  const handleInputChanges = (
    event: ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { name, value } = event.currentTarget;
    const updatedInput = [...inputFields];

    (updatedInput[index] as InputField)[name] = value;
    const totalPrice = updatedInput.reduce((acc, curr) => {
      const parsedPrice =
        String(curr.itemPrice).length > 0 ? String(curr.itemPrice) : "0";
      return acc + parseFloat(parsedPrice);
    }, 0);

    !isNaN(totalPrice) && setTotalAmount(Number(totalPrice.toFixed(2)));
    setInputFields(updatedInput);
  };

  const removeInputField = (index: number) => {
    const newArray = [...inputFields];
    if (newArray.length > 1) {
      newArray.splice(index, 1);
      setInputFields(newArray);
    }
  };

  const handleInvoiceDate:
    | React.ChangeEventHandler<HTMLInputElement>
    | undefined = (e) => {
    setInvoiceDate(e.target.value);
  };

  const handlePreview:
    | React.MouseEventHandler<HTMLButtonElement>
    | undefined = () => {
    window.open(payLink, "_blank");
  };

  const handleCloseModal = () => {
    // Reset data on cancel button press
    setInputFields([{ itemName: "", itemPrice: 0 }]);
    setTotalAmount(0);
    setInvoiceDate(
      new Date(Date.now() + 3600 * 1000 * 24).toISOString().substring(0, 10)
    );
    //  For avoiding same origin error for iframe.
    window.parent.postMessage("message", "*");
  };

  useEffect(() => {
    window.addEventListener("message", ({ data }) => {
      console.log(data);
    });
  }, []);

  return (
    <div className="bg-zinc-400 bg-opacity-50 min-h-screen pt-6">
      {(showError || showSuccess) && (
        <Alert
          type={showError ? "error" : "success"}
          message={alertMsg?.current}
        />
      )}
      <div className="bg-white max-w-[680px] mx-auto mt-6 rounded-lg py-4 px-6">
        <div className="border-b-2 border-[#f2f7fa] pb-4 flex flex-col">
          <span className="mb-2 font-semibold text-[20px]">
            Request Payment
          </span>
          <span className="text-[#607179] text-[16px]">
            The details that you add below will be added to an invoice link that
            you can send to Prashant Prakash Dubey. Invoices are created within
            our system and you can track the status of payments here
          </span>
        </div>

        <form action="" onSubmit={generatePaymentLink}>
          <div className="mt-6 text-[#607179] ">
            {inputFields.map((item, ind) => {
              return (
                <div className="mb-6" key={`item-name-${ind}`}>
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-7">Item name</div>
                    <div className="col-span-4 pl-2">Item price</div>
                  </div>
                  <div className="grid grid-cols-12 items-center">
                    <div className="col-span-7 pr-2 mt-1">
                      <input
                        className="w-full hl-text-input shadow-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 
                block w-full sm:text-sm border border-gray-300 rounded text-gray-800 mt-1 px-3 py-2 mr-2"
                        type="text"
                        name="itemName"
                        value={item?.itemName}
                        placeholder="Name"
                        onChange={(event) => handleInputChanges(event, ind)}
                        required
                      />
                    </div>
                    <div className="col-span-4 pl-2 mt-1">
                      <input
                        className="hl-text-input shadow-sm focus:ring-curious-blue-500 focus:border-curious-blue-500 
                block w-full sm:text-sm border border-gray-300 rounded disabled:opacity-50 text-gray-800 mt-1 px-3 py-2"
                        type="text"
                        name="itemPrice"
                        value={item?.itemPrice}
                        pattern="[0-9]{0,}[.]?[0-9]{0,}"
                        placeholder="Price"
                        title="Enter valid price"
                        onChange={(event) => handleInputChanges(event, ind)}
                        required
                      />
                    </div>
                    <div
                      className="col-span-1 flex justify-center cursor-pointer"
                      onClick={() => removeInputField(ind)}
                    >
                      <Svg
                        icon={CrossIcon}
                        width={25}
                        height={25}
                        viewBox="0 0 48 48"
                      />
                    </div>
                  </div>
                </div>
              );
            })}
            <div
              className="w-full flex justify-center items-center rounded-lg p-2 border-2 border-dashed cursor-pointer"
              onClick={addMoreFields}
            >
              <Svg
                icon={PlusIcon}
                className="mr-2 fill-[#607179]"
                width={20}
                height={20}
                viewBox="0 0 24 24"
              />
              <span>Add an item</span>
            </div>

            <div className="grid grid-cols-12 mt-6">
              <div className="col-span-8"></div>
              <div className="col-span-4 border-t-2">
                <span className="block mt-2 text-[14px]">Total Amount</span>
                <span className="block font-bold text-lg">₹{totalAmount}</span>
              </div>
            </div>

            <div className="grid grid-cols-12 mt-6">
              <div className="col-span-7">
                <span className="block mt-2 text-[14px]">
                  Invoice Due Date:
                </span>
                <input
                  className=" border border-gray-300 px-3 py-1 mt-1 rounded"
                  type="date"
                  value={invoiceDate}
                  onChange={handleInvoiceDate}
                  name=""
                  id=""
                />
              </div>
            </div>
          </div>
          <div className="mt-8 border-t-2 border-[#f2f7fa] flex items-center justify-between pt-4">
            <button
              disabled={!(payLink.length > 0)}
              onClick={handlePreview}
              className="hl-btn inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded 
            text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-curious-blue-500  disabled:opacity-50"
            >
              <Svg
                icon={eye}
                className="mr-1"
                width={24}
                height={16}
                viewBox="0 4 24 16"
              />
              <span>Preview</span>
            </button>
            <div className="flex items-center">
              <button
                type="button"
                id="rzp-cancel-btn"
                onClick={handleCloseModal}
                className="hl-btn inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium mr-2
            rounded text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-curious-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="hl-btn  inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium 
            rounded shadow-sm text-white bg-green-600 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 "
              >
                Copy link and mark as sent
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentModal;
