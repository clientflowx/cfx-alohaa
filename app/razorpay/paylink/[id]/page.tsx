"use client";
import { useRouter } from "next/router";
import React from "react";

const Paylink: React.FC<{ params: any }> = ({ params }) => {
  const paymentId = params?.id;
  const paymentLink = `https://razorpay.com/payment-link/${paymentId}`;

  return (
    <div className="w-screen h-screen">
      <iframe src={paymentLink} className="w-full h-full" />
    </div>
  );
};

export default Paylink;
