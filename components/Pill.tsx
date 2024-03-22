"use client";
interface PillProps {
  type: "success" | "fail" | "info" | "warning";
  text: string;
}
// TODO sync pill type
const Pill: React.FC<PillProps> = ({ type, text }) => {
  const colorMap = {
    success: {
      textClass: "text-[#12b76a]",
      borderClass: "border-[#12b76a]",
      bgClass: "bg-[#e6ffed]",
    },
    fail: {
      textClass: "text-[#ff6483]",
      borderClass: "border-[#ff6483]",
      bgClass: "bg-[#fce8e8]",
    },
    info: {
      textClass: "text-[#007ace]",
      borderClass: "border-[#007ace]",
      bgClass: "bg-[#e6f7ff]",
    },
    warning: {
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
