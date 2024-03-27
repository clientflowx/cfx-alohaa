"use client";
interface PillProps {
  type:
    | "draft"
    | "issued"
    | "partially_paid"
    | "paid"
    | "cancelled"
    | "expired"
    | "deleted"
    | "overdue"
    | "succeeded"
    | "failed"
    | "captured";
  text: string;
}

const Pill: React.FC<PillProps> = ({ type, text }) => {
  const colorMap = {
    paid: {
      textClass: "text-green-500",
      borderClass: "border-green-500",
      bgClass: "bg-green-100",
    },
    succeeded: {
      textClass: "text-green-500",
      borderClass: "border-green-500",
      bgClass: "bg-green-100",
    },
    sent: {
      textClass: "text-green-500",
      borderClass: "border-green-500",
      bgClass: "bg-green-100",
    },
    partially_paid: {
      textClass: "text-lime-500",
      borderClass: "border-lime-500",
      bgClass: "bg-lime-100",
    },
    overdue: {
      textClass: "text-[#ff6483]",
      borderClass: "border-[#ff6483]",
      bgClass: "bg-[#fce8e8]",
    },
    failed: {
      textClass: "text-[#ff6483]",
      borderClass: "border-[#ff6483]",
      bgClass: "bg-[#fce8e8]",
    },
    cancelled: {
      textClass: "text-[#ff6483]",
      borderClass: "border-[#ff6483]",
      bgClass: "bg-[#fce8e8]",
    },
    expired: {
      textClass: "text-[#ff6483]",
      borderClass: "border-[#ff6483]",
      bgClass: "bg-[#fce8e8]",
    },
    deleted: {
      textClass: "text-[#ff6483]",
      borderClass: "border-[#ff6483]",
      bgClass: "bg-[#fce8e8]",
    },
    draft: {
      textClass: "text-gray-500",
      borderClass: "border-gray-500",
      bgClass: "bg-gray-200",
    },
    issued: {
      textClass: "text-[#fca103]",
      borderClass: "border-[#fca103]",
      bgClass: "bg-[#fff7e6]",
    },
    captured: {
      textClass: "text-[#fca103]",
      borderClass: "border-[#fca103]",
      bgClass: "bg-[#fff7e6]",
    },
  };
  return (
    <span
      className={`block px-1 w-[100px] border rounded-full ${colorMap[type].textClass} ${colorMap[type].borderClass} ${colorMap[type].bgClass}`}
    >
      {text}
    </span>
  );
};

export default Pill;
